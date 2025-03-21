import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { JobApplication } from '../types/database.types';
import { FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

export function Applications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/api/applications');
        setApplications(Array.isArray(data) ? data : data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by applying to some jobs.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Application #{application._id.slice(-8)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(application.status)}
                      <p className="ml-2 text-sm text-gray-500">
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Resume: {application.resumeUrl.split('/').pop()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Applied on{' '}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}