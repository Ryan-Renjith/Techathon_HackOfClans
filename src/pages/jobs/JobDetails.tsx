import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { JobListing } from '../../types/database.types';
import { MapPinIcon, BuildingIcon, CalendarIcon, BriefcaseIcon } from 'lucide-react';

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, token]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      formData.append('jobId', id!);

      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        navigate('/applications');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Job not found</h3>
          <p className="mt-1 text-sm text-gray-500">This job listing may have been removed or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-2 flex items-center text-gray-600">
                <BuildingIcon className="h-5 w-5 mr-2" />
                {job.company}
              </div>
              <div className="mt-1 flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                {job.location}
              </div>
              <div className="mt-1 flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {job.status}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="mt-4 text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {user && user.role === 'jobseeker' && job.status === 'open' && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900">Apply for this position</h2>
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={handleApply} className="mt-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cover Letter (Optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Tell us why you're the perfect fit for this role..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {applying ? 'Submitting application...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}