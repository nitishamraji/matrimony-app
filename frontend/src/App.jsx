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

const defaultRegisterForm = {
  fullName: '',
  email: '',
  password: '',
  age: '',
  gender: 'Woman',
  city: ''
};

const defaultLoginForm = {
  email: '',
  password: ''
};

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(defaultProfile);
  const [authStatus, setAuthStatus] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const [authError, setAuthError] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        ...defaultProfile,
        ...Object.fromEntries(
          Object.entries(profile).filter(([key]) => key in defaultProfile)
        )
      });
    }
  }, [profile]);

  const navigate = (path) => {
    if (path === route) return;
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const registerUser = async () => {
    setAuthError('');
    setAuthStatus('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerForm.fullName,
          email: registerForm.email,
          password: registerForm.password,
          age: registerForm.age ? Number(registerForm.age) : undefined,
          gender: registerForm.gender,
          city: registerForm.city
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCurrentUser(data.user);
      setProfile(data.profile);
      setAuthStatus('Profile created! You are now signed in.');
      navigate('/profile');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const loginUser = async () => {
    setAuthError('');
    setAuthStatus('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCurrentUser(data.user);
      setProfile(data.profile);
      setAuthStatus('Logged in successfully.');
      navigate('/profile');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    setProfileError('');
    setProfileStatus('');

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
      setProfileStatus('Profile saved successfully.');
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const profileBadges = useMemo(() => {
    if (!profile) return [];
    return [profile.height && `${profile.height} Height`, profile.religion, profile.occupation].filter(Boolean);
  }, [profile]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar
        currentUser={currentUser}
        onNavigateHome={() => navigate('/')}
        onNavigateProfile={() => navigate('/profile')}
      />

      {route === '/profile' ? (
        <ProfilePage
          currentUser={currentUser}
          profile={profile}
          profileForm={profileForm}
          onProfileChange={handleProfileChange}
          onSaveProfile={saveProfile}
          profileBadges={profileBadges}
          status={profileStatus}
          error={profileError}
          onNavigateHome={() => navigate('/')}
        />
      ) : (
        <LandingPage
          registerForm={registerForm}
          loginForm={loginForm}
          onRegisterChange={handleRegisterChange}
          onLoginChange={handleLoginChange}
          onRegister={registerUser}
          onLogin={loginUser}
          status={authStatus}
          error={authError}
          currentUser={currentUser}
          onNavigateProfile={() => navigate('/profile')}
        />
      )}
    </div>
  );
}

function Navbar({ currentUser, onNavigateHome, onNavigateProfile }) {
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          className="flex items-center gap-2 text-gray-900 font-semibold text-lg"
          onClick={onNavigateHome}
        >
          <i className="fa-solid fa-heart text-rose-500 text-xl"></i>
          BetterMatch
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Home
          </button>
          <button
            onClick={onNavigateProfile}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Profile
          </button>
          {currentUser && (
            <span className="hidden sm:inline-flex text-xs text-gray-500">
              Signed in as <span className="ml-1 font-semibold text-gray-800">{currentUser.fullName}</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

function LandingPage({
  registerForm,
  loginForm,
  onRegisterChange,
  onLoginChange,
  onRegister,
  onLogin,
  status,
  error,
  currentUser,
  onNavigateProfile
}) {
  return (
    <>
      <header className="bg-gradient-to-br from-white to-rose-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
              <i className="fa-solid fa-crown"></i>
              India's modern matrimony experience
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Find your person with privacy-first, trusted matchmaking.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create a beautiful profile in minutes, explore verified members, and chat securely. Designed to feel warm, simple, and focused on what matters.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onRegister}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-rose-200 font-semibold"
              >
                Start free
              </button>
              {currentUser ? (
                <button
                  onClick={onNavigateProfile}
                  className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold hover:border-gray-300"
                >
                  Go to your profile
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold hover:border-gray-300"
                >
                  Quick login
                </button>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
                <i className="fa-solid fa-shield-heart"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Better profiles, better matches</p>
                <p className="text-sm text-gray-500">Private by design, verified by humans.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <FeatureChip icon="fa-solid fa-badge-check" label="Profile verification" />
              <FeatureChip icon="fa-solid fa-user-shield" label="Privacy controls" />
              <FeatureChip icon="fa-solid fa-comments" label="Secure chat" />
              <FeatureChip icon="fa-solid fa-heart" label="Curated matches" />
            </div>
            <div className="rounded-xl border border-gray-100 bg-rose-50 text-rose-700 text-sm p-4">
              "The cleanest experience we've tried—easy signup, quick responses, and respectful members."
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          <AuthCard
            title="Create your profile"
            description="Share a few details to get personalized matches."
            actionLabel="Create & join"
            onSubmit={onRegister}
            status={status}
            error={error}
          >
            <RegisterForm form={registerForm} onChange={onRegisterChange} />
          </AuthCard>

          <AuthCard
            title="Welcome back"
            description="Log in securely to continue conversations and manage matches."
            actionLabel="Login"
            onSubmit={onLogin}
            status={status}
            error={error}
          >
            <LoginForm form={loginForm} onChange={onLoginChange} />
          </AuthCard>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <HighlightCard icon="fa-solid fa-lock" title="Safety-first" body="We never show your number or email. Share only when you are ready." />
          <HighlightCard icon="fa-solid fa-star" title="Quality community" body="Every profile is screened to keep the platform respectful and genuine." />
          <HighlightCard icon="fa-solid fa-seedling" title="Grows with you" body="Update your story anytime. Your dashboard keeps everything organised." />
        </div>
      </main>
    </>
  );
}

function ProfilePage({
  currentUser,
  profile,
  profileForm,
  onProfileChange,
  onSaveProfile,
  profileBadges,
  status,
  error,
  onNavigateHome
}) {
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sign in to see your profile</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Create or log in from the landing page to build your profile. Once signed in, you'll return here automatically.
        </p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600"
        >
          Go to landing page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-gray-500">Signed in as</p>
          <h2 className="text-2xl font-bold text-gray-900">{currentUser.fullName}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          >
            Back to landing
          </button>
          <button
            onClick={onSaveProfile}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600"
          >
            Save profile
          </button>
        </div>
      </div>

      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-6">
        <ProfilePreview
          currentUser={currentUser}
          profile={profile}
          profileBadges={profileBadges}
        />

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tell your story</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="About you"
                name="about"
                as="textarea"
                rows={3}
                placeholder="Share a few lines about yourself"
                value={profileForm.about}
                onChange={onProfileChange}
              />
              <FormField
                label="Education"
                name="education"
                placeholder="Masters in Computer Science"
                value={profileForm.education}
                onChange={onProfileChange}
              />
              <FormField
                label="Occupation"
                name="occupation"
                placeholder="Product Designer"
                value={profileForm.occupation}
                onChange={onProfileChange}
              />
              <FormField
                label="Income range"
                name="incomeRange"
                placeholder="25L - 35L"
                value={profileForm.incomeRange}
                onChange={onProfileChange}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Age"
                type="number"
                name="age"
                placeholder="26"
                value={profileForm.age}
                onChange={onProfileChange}
              />
              <FormField
                label="City"
                name="city"
                placeholder="Bangalore, India"
                value={profileForm.city}
                onChange={onProfileChange}
              />
              <FormField
                label="Height"
                name="height"
                placeholder={"5' 6\""}
                value={profileForm.height}
                onChange={onProfileChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Gender"
                name="gender"
                as="select"
                options={["Woman", "Man", "Non-binary"]}
                value={profileForm.gender}
                onChange={onProfileChange}
              />
              <FormField
                label="Marital status"
                name="maritalStatus"
                placeholder="Never Married"
                value={profileForm.maritalStatus}
                onChange={onProfileChange}
              />
              <FormField
                label="Religion / Caste"
                name="religion"
                placeholder="Hindu / Brahmin"
                value={profileForm.religion}
                onChange={onProfileChange}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Lifestyle & family</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Mother tongue"
                name="motherTongue"
                placeholder="Hindi"
                value={profileForm.motherTongue}
                onChange={onProfileChange}
              />
              <FormField
                label="Eating habits"
                name="eatingHabits"
                placeholder="Vegetarian"
                value={profileForm.eatingHabits}
                onChange={onProfileChange}
              />
              <FormField
                label="Drinking / Smoking"
                name="drinkingSmoking"
                placeholder="No / No"
                value={profileForm.drinkingSmoking}
                onChange={onProfileChange}
              />
            </div>
            <FormField
              label="Family details"
              name="familyDetails"
              as="textarea"
              rows={3}
              placeholder="Share a bit about your family"
              value={profileForm.familyDetails}
              onChange={onProfileChange}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Profile photo</h3>
            <FormField
              label="Photo URL"
              name="imageUrl"
              placeholder="https://..."
              value={profileForm.imageUrl}
              onChange={onProfileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthCard({ title, description, children, actionLabel, onSubmit, status, error }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
      <button
        onClick={onSubmit}
        className="w-full inline-flex justify-center items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl font-semibold"
      >
        {actionLabel}
      </button>
      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error && <p className="text-rose-600 text-sm">{error}</p>}
    </div>
  );
}

function RegisterForm({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <FormField
        label="Full name"
        name="fullName"
        placeholder="Ananya S"
        value={form.fullName}
        onChange={onChange}
      />
      <FormField
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={onChange}
      />
      <FormField
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={onChange}
      />
      <FormField
        label="City"
        name="city"
        placeholder="Bangalore, India"
        value={form.city}
        onChange={onChange}
      />
      <FormField
        label="Age"
        type="number"
        name="age"
        placeholder="26"
        value={form.age}
        onChange={onChange}
      />
      <FormField
        label="Gender"
        name="gender"
        as="select"
        options={["Woman", "Man", "Non-binary"]}
        value={form.gender}
        onChange={onChange}
      />
    </div>
  );
}

function LoginForm({ form, onChange }) {
  return (
    <div className="space-y-3">
      <FormField
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={onChange}
      />
      <FormField
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={onChange}
      />
    </div>
  );
}

function ProfilePreview({ currentUser, profile, profileBadges }) {
  const name = profile?.user?.fullName || currentUser.fullName;
  const age = profile?.age ?? '';
  const city = profile?.city || 'Add your city';
  const image =
    profile?.imageUrl ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative">
        <img src={image} alt="Profile" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-sm text-gray-200">{city}{age ? ` · ${age}` : ''}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {profileBadges.length === 0 && (
            <span className="text-xs text-gray-500">Add details to showcase highlights</span>
          )}
          {profileBadges.map((badge) => (
            <span key={badge} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {badge}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <InfoPill icon="fa-solid fa-location-dot" label={city} />
          <InfoPill icon="fa-solid fa-venus-mars" label={profile?.gender || '—'} />
          <InfoPill icon="fa-solid fa-graduation-cap" label={profile?.education || '—'} />
          <InfoPill icon="fa-solid fa-briefcase" label={profile?.occupation || '—'} />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, type = 'text', placeholder, value, onChange, as = 'input', options = [], rows }) {
  return (
    <label className="text-sm text-gray-700 flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      {as === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          rows={rows || 3}
          onChange={onChange}
          className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      ) : as === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      )}
    </label>
  );
}

function HighlightCard({ icon, title, body }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
        <i className={icon}></i>
      </div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}

function FeatureChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-700 text-sm shadow-sm">
      <i className={icon}></i>
      {label}
    </span>
  );
}

function InfoPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700">
      <i className={icon}></i>
      {label}
    </span>
  );
}

export default App;
