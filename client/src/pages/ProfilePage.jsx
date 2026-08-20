import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaMapMarkerAlt, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateProfile, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    street: '', city: '', state: '', postalCode: '', country: 'India'
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (profileData.password !== profileData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updatePayload = { name: profileData.name, email: profileData.email };
      if (profileData.password) {
        updatePayload.password = profileData.password;
      }
      
      await updateProfile(updatePayload);
      setProfileData({ ...profileData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/address', addressData);
      toast.success('Address added successfully');
      setShowAddressForm(false);
      setAddressData({ street: '', city: '', state: '', postalCode: '', country: 'India' });
      await checkAuth(); // Refresh user data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/users/address/${id}`);
      toast.success('Address removed');
      await checkAuth(); // Refresh user data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove address');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
            <div className="p-6 bg-navy-900 text-white text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3 shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-navy-200 text-sm">{user.email}</p>
            </div>
            <div className="p-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaUser /> Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${activeTab === 'addresses' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaMapMarkerAlt /> Manage Addresses
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    Role: {user.role}
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-2">
                    <FaCalendarAlt /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-5">
                  <h2 className="text-xl font-semibold mb-4 text-navy-900">Update Profile</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password (Leave blank to keep current)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" value={profileData.confirmPassword} onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="mt-6 bg-navy-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-800 transition-colors disabled:opacity-50">
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-navy-900">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition-colors">
                      <FaPlus size={14} /> Add New
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">New Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <input required placeholder="Street Address" value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <input required placeholder="City" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <input required placeholder="State" value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <input required placeholder="Postal Code" value={addressData.postalCode} onChange={e => setAddressData({...addressData, postalCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <input required placeholder="Country" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button type="submit" disabled={loading} className="bg-navy-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-800">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div key={addr._id} className="border border-gray-200 rounded-xl p-5 relative hover:border-orange-300 transition-colors">
                        <button 
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                        <p className="font-medium text-gray-900 mb-1">{addr.street}</p>
                        <p className="text-gray-600 text-sm mb-1">{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-gray-500 text-sm">{addr.country}</p>
                      </div>
                    ))
                  ) : (
                    !showAddressForm && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No saved addresses found.
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
