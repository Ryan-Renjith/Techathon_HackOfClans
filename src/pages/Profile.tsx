import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Profile as ProfileType } from '../types/database.types';
import { UserIcon, PhoneIcon, MapPinIcon, LinkedinIcon } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: [] as string[],
    experience: '',
    education: '',
    contactInfo: {
      phone: '',
      address: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/api/profiles/${user?._id}`);
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          skills: data.skills || [],
          experience: data.experience || '',
          education: data.education || '',
          contactInfo: {
            phone: data.contactInfo?.phone || '',
            address: data.contactInfo?.address || '',
            linkedin: data.contactInfo?.linkedin || ''
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/api/profiles', formData);
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile && !isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Profile</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your profile.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillChange}
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <textarea
                  id="experience"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.experience}
                  onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  Education
                </label>
                <textarea
                  id="education"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.education}
                  onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.contactInfo.phone}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.contactInfo.address}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedin"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.contactInfo.linkedin}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, linkedin: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Bio</h4>
              <p className="mt-1 text-sm text-gray-900">{profile.bio}</p>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Skills</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Experience</h4>
              <p className="mt-1 text-sm text-gray-900">{profile.experience}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Education</h4>
              <p className="mt-1 text-sm text-gray-900">{profile.education}</p>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-900 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.contactInfo.phone}
                </p>
                <p className="text-sm text-gray-900 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.contactInfo.address}
                </p>
                {profile.contactInfo.linkedin && (
                  <p className="text-sm text-gray-900 flex items-center">
                    <LinkedinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={profile.contactInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      LinkedIn Profile
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}