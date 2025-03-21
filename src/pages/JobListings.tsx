import { useState, useEffect } from 'react';
import { JobListing } from '../types/database.types';
import { MapPinIcon, BriefcaseIcon, BuildingIcon } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

export function JobListings() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/api/jobs');
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Positions</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs available</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <BuildingIcon className="h-4 w-4 mr-1" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </div>

              <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="text-sm">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-gray-600">{job.salaryRange}</span>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}