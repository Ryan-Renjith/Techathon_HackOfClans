import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, BriefcaseIcon, UserIcon } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Find Your Dream Job Today
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Connect with top employers and discover opportunities that match your skills
          </p>
          
          <div className="mt-10">
            <Link
              to="/jobs"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Browse Jobs
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BriefcaseIcon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">For Job Seekers</h3>
            <p className="mt-2 text-gray-600">
              Create your profile, upload your resume, and apply to jobs with just a few clicks
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <UserIcon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">For Employers</h3>
            <p className="mt-2 text-gray-600">
              Post job listings, manage applications, and find the perfect candidates
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <SearchIcon className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Smart Matching</h3>
            <p className="mt-2 text-gray-600">
              Our platform helps match the right candidates with the right opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}