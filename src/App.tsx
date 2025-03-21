import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { JobListings } from './pages/JobListings';
import { Profile } from './pages/Profile';
import { Applications } from './pages/Applications';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { JobDetails } from './pages/jobs/JobDetails';
import { PostJob } from './pages/jobs/PostJob';
import { NotFound } from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;