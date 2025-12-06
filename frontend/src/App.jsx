import React, { useEffect, useMemo, useState } from 'react';

const defaultProfile = {
  age: '',
  gender: 'Woman',
  city: '',
  about: '',
  religion: '',
  height: '',
  maritalStatus: '',
  motherTongue: '',
  eatingHabits: '',
  drinkingSmoking: '',
  education: '',
  occupation: '',
  incomeRange: '',
  familyDetails: '',
  imageUrl: ''
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: 'Woman',
    city: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(defaultProfile);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setProfileForm({ ...defaultProfile, ...Object.fromEntries(Object.entries(profile).filter(([key]) => key in defaultProfile)) });
    }
  }, [profile]);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = async (type) => {
    setError('');
    setStatus('');
    const endpoint = type === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = type === 'register'
      ? {
          fullName: authForm.fullName,
          email: authForm.email,
          password: authForm.password,
          age: authForm.age ? Number(authForm.age) : undefined,
          gender: authForm.gender,
          city: authForm.city
        }
      : {
          email: authForm.email,
          password: authForm.password
        };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCurrentUser(data.user);
      setProfile(data.profile);
      setStatus(type === 'register' ? 'Profile created! You are now signed in.' : 'Logged in successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setError('');
    setStatus('');

    try {
      const res = await fetch(`/api/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          age: profileForm.age ? Number(profileForm.age) : null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }
      setProfile(data.profile);
      setStatus('Profile saved successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  const profileBadges = useMemo(() => {
    if (!profile) return [];
    return [
      profile.height && `${profile.height} Height`,
      profile.religion,
      profile.occupation
    ].filter(Boolean);
  }, [profile]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <i className="fa-solid fa-heart text-rose-500 text-2xl"></i>
              <span className="font-bold text-xl text-gray-900">BetterMatch</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#profiles" className="text-gray-600 hover:text-rose-500">Success Stories</a>
              <a href="#builder" className="text-gray-600 hover:text-rose-500">Create Profile</a>
              <a href="#cta" className="text-gray-600 hover:text-rose-500">Plans</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                onClick={() => setAuthMode('register')}
              >
                Free Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative bg-white overflow-hidden" id="cta">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Trusted by millions</span>{' '}
                  <span className="block text-rose-500 xl:inline">to find love forever.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The most user-friendly matchmaking service. Verified profiles, strict privacy controls, and AI-powered matching.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-start sm:items-center">
                  <button
                    onClick={() => setAuthMode('register')}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg shadow-md font-semibold"
                  >
                    Start Free
                  </button>
                  {profile?.city && (
                    <p className="text-gray-600 text-sm">Recently joined: {profile.city}</p>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Happy Couple"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="relative -mt-12 z-20" id="builder">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Create your profile</h3>
                <span className="text-xs text-rose-500 font-semibold">Secure & private</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={authForm.fullName}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Ananya S"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={authForm.city}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Bangalore, India"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={authForm.age}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="26"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={authForm.gender}
                    onChange={handleAuthChange}
                    className="border rounded-md p-2 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option>Woman</option>
                    <option>Man</option>
                    <option>Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => {
                    setAuthMode('register');
                    submitAuth('register');
                  }}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow transition"
                >
                  Create & Save Profile
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    submitAuth('login');
                  }}
                  className="border border-rose-500 text-rose-500 px-4 py-2 rounded-lg hover:bg-rose-50 transition"
                >
                  Login to Existing Profile
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Mode: {authMode === 'register' ? 'Create a new profile' : 'Access existing profile'}</p>
              {status && <p className="text-green-600 text-sm mt-3">{status}</p>}
              {error && <p className="text-rose-600 text-sm mt-1">{error}</p>}
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Why Choose BetterMatch?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center"><i className="fa-solid fa-shield-halved"></i></span>
                  <p>100% verified profiles with privacy-first controls.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"><i className="fa-solid fa-lock"></i></span>
                  <p>AI-powered matching to surface compatible partners.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center"><i className="fa-solid fa-comments"></i></span>
                  <p>Secure chat that keeps your contact details safe.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profiles">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={profile?.imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                  alt="Profile"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-white text-2xl font-bold">
                    {profile?.user?.fullName || currentUser?.fullName || 'Your name here'}, {profile?.age || authForm.age || '--'}
                  </h2>
                  <p className="text-gray-200 text-sm">{profile?.city || authForm.city || 'Add your city'}</p>
                </div>
              </div>

              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-4">Last active: {profile ? 'Just now' : '—'}</p>
                <div className="flex gap-3 justify-center mb-6">
                  <button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold shadow-md transition">
                    <i className="fa-solid fa-check mr-2"></i> Connect
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-rose-500 hover:border-rose-500 transition">
                    <i className="fa-solid fa-star"></i>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 transition">
                    <i className="fa-solid fa-comment-dots"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {profileBadges.length === 0 && <span className="text-gray-400 text-xs">Add details to see highlights</span>}
                  {profileBadges.map((badge) => (
                    <span key={badge} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Profile Details</h3>
                <button
                  onClick={saveProfile}
                  disabled={!currentUser}
                  className="bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Save Details
                </button>
              </div>
              {!currentUser && (
                <p className="text-sm text-rose-500 mb-4">Login or create an account to save your profile.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col text-sm text-gray-600">
                  About Me
                  <textarea
                    name="about"
                    value={profileForm.about}
                    onChange={handleProfileChange}
                    rows={3}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Share a few lines about yourself"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Education
                  <input
                    name="education"
                    value={profileForm.education}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Masters in Computer Science"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Occupation
                  <input
                    name="occupation"
                    value={profileForm.occupation}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Senior Software Developer"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Annual Income
                  <input
                    name="incomeRange"
                    value={profileForm.incomeRange}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="25L - 35L"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Height
                    <input
                      name="height"
                      value={profileForm.height}
                      onChange={handleProfileChange}
                      className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                      placeholder={"5' 6\""}
                    />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Religion / Caste
                  <input
                    name="religion"
                    value={profileForm.religion}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Hindu / Brahmin"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Marital Status
                  <input
                    name="maritalStatus"
                    value={profileForm.maritalStatus}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Never Married"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Mother Tongue
                  <input
                    name="motherTongue"
                    value={profileForm.motherTongue}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Hindi"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Eating Habits
                  <input
                    name="eatingHabits"
                    value={profileForm.eatingHabits}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Vegetarian"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Drinking/Smoking
                  <input
                    name="drinkingSmoking"
                    value={profileForm.drinkingSmoking}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="No / No"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Family Details
                  <textarea
                    name="familyDetails"
                    value={profileForm.familyDetails}
                    onChange={handleProfileChange}
                    rows={3}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Share a bit about your family"
                  />
                </label>
                <label className="flex flex-col text-sm text-gray-600">
                  Profile Photo URL
                  <input
                    name="imageUrl"
                    value={profileForm.imageUrl}
                    onChange={handleProfileChange}
                    className="mt-1 border rounded-lg p-3 bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="https://..."
                  />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-rose-500 pl-3">About Me</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {profile?.about || 'Share a little about yourself to help members understand your personality and aspirations.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <InfoItem label="Age" value={profile?.age || '—'} />
                <InfoItem label="Marital Status" value={profile?.maritalStatus || '—'} />
                <InfoItem label="Religion / Caste" value={profile?.religion || '—'} />
                <InfoItem label="Mother Tongue" value={profile?.motherTongue || '—'} />
                <InfoItem label="Eating Habits" value={profile?.eatingHabits || '—'} />
                <InfoItem label="Drinking/Smoking" value={profile?.drinkingSmoking || '—'} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-green-500 pl-3">Education & Career</h3>
              <div className="space-y-4">
                <DetailItem
                  icon="fa-solid fa-graduation-cap"
                  title={profile?.education || 'Add your education'}
                  subtitle="Education"
                />
                <DetailItem
                  icon="fa-solid fa-briefcase"
                  title={profile?.occupation || 'Add your occupation'}
                  subtitle={`Annual Income: ${profile?.incomeRange || '—'}`}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-yellow-500 pl-3">Family Details</h3>
              <p className="text-gray-700 whitespace-pre-line">{profile?.familyDetails || 'Tell us about your family background and values.'}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function DetailItem({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
        <i className={icon}></i>
      </div>
      <div>
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default App;
