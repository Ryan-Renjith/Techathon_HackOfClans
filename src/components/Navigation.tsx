import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BriefcaseIcon, HomeIcon, UserIcon, FileTextIcon } from 'lucide-react';

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">JobHub</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                Jobs
              </Link>
              {user && (
                <>
                  <Link
                    to="/applications"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
                  >
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    Applications
                  </Link>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
                  >
                    <UserIcon className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.fullName}</span>
                <button
                  onClick={signOut}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}