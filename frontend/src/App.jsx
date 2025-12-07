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

const defaultBrowseFilters = {
  ageRange: '25-30',
  city: 'Bengaluru',
  religion: 'Hindu',
  occupation: 'Any',
  compatibility: '80+'
};

const browseProfiles = [
  {
    name: 'Nisha Mehta',
    age: 27,
    city: 'Bengaluru',
    religion: 'Hindu',
    occupation: 'Product Designer',
    compatibility: 92,
    badge: 'Active now',
    tags: ['Vegetarian', 'Loves design'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Shruti Rao',
    age: 29,
    city: 'Hyderabad',
    religion: 'Hindu',
    occupation: 'Software Engineer',
    compatibility: 85,
    badge: 'Premium',
    tags: ['Open to relocate', 'Classical music'],
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Tanvi Shah',
    age: 26,
    city: 'Mumbai',
    religion: 'Jain',
    occupation: 'Consultant',
    compatibility: 78,
    badge: 'Recently joined',
    tags: ['Family oriented', 'Vegetarian'],
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Aparna Iyer',
    age: 30,
    city: 'Bengaluru',
    religion: 'Hindu',
    occupation: 'Product Manager',
    compatibility: 88,
    badge: 'Verified',
    tags: ['Reads nonfiction', 'Pet friendly'],
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Keerthi Menon',
    age: 28,
    city: 'Chennai',
    religion: 'Christian',
    occupation: 'Architect',
    compatibility: 83,
    badge: 'Recommended',
    tags: ['Beach lover', 'Minimalist'],
    image: 'https://images.unsplash.com/photo-1494797705448-171c1656553c?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Divya Singh',
    age: 25,
    city: 'Delhi NCR',
    religion: 'Hindu',
    occupation: 'Data Analyst',
    compatibility: 81,
    badge: 'Active now',
    tags: ['Early riser', 'Gym enthusiast'],
    image: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=400&q=80'
  }
];

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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [browseFilters, setBrowseFilters] = useState(defaultBrowseFilters);

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

  const navigate = (path, { replace = false } = {}) => {
    if (path === route) return;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setRoute(path);
  };

  useEffect(() => {
    if (currentUser && route === '/') {
      navigate('/home', { replace: true });
    }

    if (!currentUser && (route === '/home' || route === '/browse')) {
      navigate('/', { replace: true });
    }

    if (route === '/browse') {
      setBrowseFilters(defaultBrowseFilters);
    }
  }, [currentUser, route]);

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
      navigate('/home');
      setShowRegisterModal(false);
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
      navigate('/home');
      setShowLoginModal(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setProfile(null);
    setProfileForm(defaultProfile);
    setAuthStatus('');
    setProfileStatus('');
    setAuthError('');
    setProfileError('');
    setRegisterForm(defaultRegisterForm);
    setLoginForm(defaultLoginForm);
    navigate('/', { replace: true });
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
          onNavigateHome={() => navigate(currentUser ? '/home' : '/')}
          onNavigateProfile={() => navigate('/profile')}
          onNavigateBrowse={() => navigate('/browse')}
          onOpenRegister={() => setShowRegisterModal(true)}
          onOpenLogin={() => setShowLoginModal(true)}
          onLogout={logoutUser}
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
            onNavigateHome={() => navigate(currentUser ? '/home' : '/')}
          />
        ) : route === '/home' ? (
          <HomePage
            currentUser={currentUser}
            profile={profile}
            profileBadges={profileBadges}
            onNavigateProfile={() => navigate('/profile')}
          />
        ) : route === '/browse' ? (
          <BrowsePage
            filters={browseFilters}
            onFilterChange={setBrowseFilters}
            onResetFilters={() => setBrowseFilters(defaultBrowseFilters)}
            onNavigateProfile={() => navigate('/profile')}
          />
        ) : (
          <LandingPage
            status={authStatus}
            error={authError}
            currentUser={currentUser}
            onNavigateProfile={() => navigate('/profile')}
            onOpenRegister={() => setShowRegisterModal(true)}
            onOpenLogin={() => setShowLoginModal(true)}
          />
        )}

      {showRegisterModal && (
        <Modal
          title="Create your profile"
          description="Sign up free to build your story and meet like-minded members."
          onClose={() => setShowRegisterModal(false)}
          onSubmit={registerUser}
          actionLabel="Create account"
        >
          <RegisterForm form={registerForm} onChange={handleRegisterChange} />
        </Modal>
      )}

      {showLoginModal && (
        <Modal
          title="Welcome back"
          description="Quickly log in to continue conversations and manage matches."
          onClose={() => setShowLoginModal(false)}
          onSubmit={loginUser}
          actionLabel="Login"
        >
          <LoginForm form={loginForm} onChange={handleLoginChange} />
        </Modal>
      )}
    </div>
  );
}

function Navbar({ currentUser, onNavigateHome, onNavigateProfile, onNavigateBrowse, onOpenRegister, onOpenLogin, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleMenu = () => setShowProfileMenu((prev) => !prev);
  const closeMenu = () => setShowProfileMenu(false);

  const scrollToSection = (id) => {
    onNavigateHome();
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-3 text-gray-900 font-semibold text-lg"
            onClick={onNavigateHome}
          >
            <img
              src="/public/brand/thadasthu-logo.png"
              alt="Thadasthu logo"
              className="h-8 w-auto sm:h-10 lg:h-12 max-h-12 object-contain flex-shrink-0"
            />
            <span className="text-base sm:text-lg">Thadasthu</span>
          </button>

            {currentUser && (
              <div className="hidden md:flex items-center gap-3 text-sm font-semibold text-gray-700">
                <button
                  onClick={onNavigateBrowse}
                  className="px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Browse matches
                </button>
                <button
                onClick={() => scrollToSection('shortlisted-matches')}
                className="px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Shortlisted
              </button>
              <button
                onClick={() => scrollToSection('messages-hint')}
                className="px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Messages
              </button>
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 font-semibold hover:border-rose-200">
              <i className="fa-solid fa-crown text-sm"></i>
              Upgrade
            </button>
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 font-bold">
                  {currentUser.fullName?.charAt(0) || 'P'}
                </div>
                <span className="hidden sm:inline">You</span>
                <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.fullName}</p>
                  </div>
                  <button
                    onClick={() => {
                      closeMenu();
                      onNavigateProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => {
                      closeMenu();
                      onNavigateProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Partner preferences
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Account settings
                  </button>
                  <button
                    onClick={() => {
                      closeMenu();
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Quick login
            </button>
            <button
              onClick={onOpenRegister}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600"
            >
              Sign up free
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function LandingPage({ status, error, currentUser, onNavigateProfile, onOpenRegister, onOpenLogin }) {
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
              Create a beautiful profile in minutes, explore verified members, and chat securely. Everything flexes gracefully across desktop, tablet, and mobile so the brand always feels familiar.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenRegister}
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
                  onClick={onOpenLogin}
                  className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold hover:border-gray-300"
                >
                  Quick login
                </button>
              )}
            </div>
            {(status || error) && (
              <p className={`text-sm ${status ? 'text-green-700' : 'text-rose-600'}`}>
                {status || error}
              </p>
            )}
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
        <section className="grid lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <i className="fa-solid fa-display"></i>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Responsive by nature</p>
                <p className="text-sm text-gray-600">Branding and layout stay polished on every device.</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Crafted to look sharp on every screen.</h2>
            <p className="text-gray-600 leading-relaxed">
              From widescreen monitors to compact phones, the Thadasthu brand mark, typography, and cards resize smoothly so the experience always feels premium and familiar.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <ActionCard
                icon="fa-solid fa-maximize"
                title="Adaptive brand mark"
                body="The logo scales with flexible heights and object-fit styling to stay crisp without crowding navigation controls."
              />
              <ActionCard
                icon="fa-solid fa-mobile-screen"
                title="Comfortable touch targets"
                body="Buttons and chips maintain breathing room, making it easy to join or sign in from any device."
              />
              <ActionCard
                icon="fa-solid fa-wand-magic-sparkles"
                title="Consistent polish"
                body="Gradients, shadows, and spacing align across breakpoints for a steady premium feel."
              />
              <ActionCard
                icon="fa-solid fa-face-smile"
                title="Delightful onboarding"
                body="Start free or jump back in without clutter—modals keep the experience focused and friendly."
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <FeatureChip icon="fa-solid fa-badge-check" label="Verified profiles" />
              <FeatureChip icon="fa-solid fa-user-shield" label="Privacy-first" />
              <FeatureChip icon="fa-solid fa-heart" label="Warm conversations" />
              <FeatureChip icon="fa-solid fa-laptop-mobile" label="Built for every device" />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenRegister}
                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl shadow-sm font-semibold"
              >
                Start for free
              </button>
              {currentUser ? (
                <button
                  onClick={onNavigateProfile}
                  className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold hover:border-gray-300"
                >
                  Continue to your profile
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold hover:border-gray-300"
                >
                  Quick login
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-wave-square"></i>
              </span>
              <div>
                <p className="text-sm font-semibold">Always balanced</p>
                <p className="text-sm text-gray-300">Navigation and branding breathe with the viewport.</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-200">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-rose-200 mt-0.5"></i>
                <span>Logo and typography scale smoothly from mobile to ultra-wide layouts.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-rose-200 mt-0.5"></i>
                <span>Cards and chips stay legible with balanced padding and object-fit images.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-rose-200 mt-0.5"></i>
                <span>CTA buttons remain easy to reach whether you're tapping or clicking.</span>
              </li>
            </ul>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
              "Everything feels calm and consistent—no matter which device we open it on."
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-4">
          <HighlightCard icon="fa-solid fa-lock" title="Safety-first" body="We never show your number or email. Share only when you are ready." />
          <HighlightCard icon="fa-solid fa-star" title="Quality community" body="Every profile is screened to keep the platform respectful and genuine." />
          <HighlightCard icon="fa-solid fa-laptop" title="Responsive by default" body="Navigation, cards, and brand moments flex beautifully across breakpoints." />
        </div>
      </main>
    </>
  );
}

function BrowsePage({ filters, onFilterChange, onResetFilters, onNavigateProfile }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = useMemo(() => {
    const [minAge, maxAge] =
      filters.ageRange !== 'Any' ? filters.ageRange.split('-').map((value) => Number(value)) : [null, null];
    const minCompatibility = filters.compatibility !== 'Any' ? Number(filters.compatibility.replace('+', '')) : null;

    return browseProfiles.filter((profile) => {
      if (filters.city !== 'Any' && profile.city !== filters.city) return false;
      if (filters.religion !== 'Any' && profile.religion !== filters.religion) return false;
      if (filters.occupation !== 'Any' && !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase()))
        return false;
      if (minAge && maxAge && (profile.age < minAge || profile.age > maxAge)) return false;
      if (minCompatibility && profile.compatibility < minCompatibility) return false;
      if (searchTerm && !profile.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    onFilterChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-gray-500">Search</p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse matches</h1>
              <p className="text-gray-600 max-w-2xl">
                Filters on the left auto-apply when you open this page so you immediately see focused, relevant matches.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onResetFilters}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              >
                Reset to defaults
              </button>
              <button
                onClick={onNavigateProfile}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600"
              >
                Update profile
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700">Default filters applied</span>
          <span className="px-3 py-1 rounded-full bg-gray-100">Age: {filters.ageRange}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100">City: {filters.city}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100">Religion: {filters.religion}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100">Compatibility: {filters.compatibility}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <span className="text-xs font-semibold text-rose-600">Auto-applied</span>
            </div>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</span>
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </label>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</span>
              <select
                value={filters.ageRange}
                onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Any</option>
                <option>23-26</option>
                <option>25-30</option>
                <option>28-32</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</span>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Any</option>
                <option>Bengaluru</option>
                <option>Hyderabad</option>
                <option>Mumbai</option>
                <option>Chennai</option>
                <option>Delhi NCR</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Religion</span>
              <select
                value={filters.religion}
                onChange={(e) => handleFilterChange('religion', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Any</option>
                <option>Hindu</option>
                <option>Christian</option>
                <option>Jain</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Occupation</span>
              <select
                value={filters.occupation}
                onChange={(e) => handleFilterChange('occupation', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Any</option>
                <option>Product</option>
                <option>Engineering</option>
                <option>Consulting</option>
                <option>Architecture</option>
                <option>Analytics</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-gray-700 block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Compatibility</span>
              <select
                value={filters.compatibility}
                onChange={(e) => handleFilterChange('compatibility', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Any</option>
                <option>75+</option>
                <option>80+</option>
                <option>85+</option>
                <option>90+</option>
              </select>
            </label>
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Results</p>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredProfiles.length} match{filteredProfiles.length === 1 ? '' : 'es'} found
              </h2>
              <p className="text-sm text-gray-600">Showing cards based on your selected filters.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
              <span className="px-3 py-1 rounded-full bg-gray-100">{filters.ageRange} yrs</span>
              <span className="px-3 py-1 rounded-full bg-gray-100">{filters.city}</span>
              <span className="px-3 py-1 rounded-full bg-gray-100">{filters.religion}</span>
              <span className="px-3 py-1 rounded-full bg-gray-100">{filters.compatibility} compatibility</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <MatchCard
                key={profile.name}
                profile={{ ...profile, compatibility: `${profile.compatibility}% match` }}
                ctaLabel="View profile"
              />
            ))}
            {filteredProfiles.length === 0 && (
              <div className="col-span-full rounded-xl border border-amber-100 bg-amber-50 text-amber-900 p-5">
                <h3 className="font-semibold">No matches found</h3>
                <p className="text-sm mt-1">Try broadening your filters or resetting to the defaults.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function HomePage({ currentUser, profile, profileBadges, onNavigateProfile }) {
  const recommendedMatches = [
    {
      name: 'Aisha Verma',
      age: 27,
      city: 'Bengaluru',
      occupation: 'Product Designer',
      height: "5'4\"",
      compatibility: '92% match',
      badge: 'Recommended',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ritika Sharma',
      age: 26,
      city: 'Pune',
      occupation: 'Data Analyst',
      height: "5'3\"",
      compatibility: '88% match',
      badge: 'Active now',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
    },
    {
      name: 'Sneha Rao',
      age: 28,
      city: 'Hyderabad',
      occupation: 'Marketing Lead',
      height: "5'5\"",
      compatibility: '86% match',
      badge: 'Recently joined',
      image: 'https://images.unsplash.com/photo-1494797705448-171c1656553c?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const shortlisted = [
    {
      name: 'Ananya Pillai',
      age: 27,
      city: 'Chennai',
      occupation: 'Architect',
      compatibility: 'Shortlisted',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Divya Singh',
      age: 25,
      city: 'Delhi NCR',
      occupation: 'Consultant',
      compatibility: 'Good vibe',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const recentlyViewed = [
    {
      name: 'Aparna Iyer',
      age: 29,
      city: 'Mumbai',
      occupation: 'Entrepreneur',
      compatibility: 'Revisit',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Meera Kapoor',
      age: 30,
      city: 'Kochi',
      occupation: 'Doctor',
      compatibility: 'Similar interests',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
    }
  ];

  const profileReminders = [
    { label: 'Add a short bio', done: Boolean(profile?.about) },
    { label: 'Share your city', done: Boolean(profile?.city) },
    { label: 'Update career details', done: Boolean(profile?.occupation) }
  ];

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-right-to-bracket"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Sign in from the main experience to access your personalised home. We’ll route you here automatically once you’re in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Matches hub</p>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.fullName}</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Your feed opens right on recommended matches. Jump into shortlisted or revisit recent profiles without losing your spot.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onNavigateProfile}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600"
          >
            View profile
          </button>
          <button
            onClick={onNavigateProfile}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          >
            Edit details
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <section id="recommended-matches" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Recommended</p>
                <h2 className="text-xl font-semibold text-gray-900">Matches curated for you</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">New</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedMatches.map((item) => (
                <MatchCard key={item.name} profile={item} />
              ))}
            </div>
          </section>

          <section id="shortlisted-matches" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Shortlisted</h2>
              <button className="text-sm font-semibold text-rose-600 hover:text-rose-700">View all</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {shortlisted.map((item) => (
                <MatchCard key={item.name} profile={item} ctaLabel="Send interest" />
              ))}
            </div>
          </section>

          <section id="recently-viewed" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recently viewed</h2>
              <span className="text-sm text-gray-500">Pick up where you left</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {recentlyViewed.map((item) => (
                <MatchCard key={item.name} profile={item} ctaLabel="Reopen" />
              ))}
            </div>
          </section>

          <section
            id="messages-hint"
            className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">Messages</p>
              <h3 className="text-lg font-semibold text-gray-900">Keep conversations moving</h3>
              <p className="text-sm text-gray-600">
                Replies stay visible here. Respond quickly to keep recommended matches warmed up.
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600">Open inbox</button>
          </section>
        </div>

        <div className="space-y-4">
          <ProfilePreview currentUser={currentUser} profile={profile} profileBadges={profileBadges} />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Profile readiness</h3>
              <button
                onClick={onNavigateProfile}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Edit profile
              </button>
            </div>
            <div className="grid gap-3">
              {profileReminders.map((hint) => (
                <div
                  key={hint.label}
                  className={`rounded-xl border p-3 text-sm flex items-start gap-3 ${
                    hint.done ? 'border-green-100 bg-green-50 text-green-700' : 'border-gray-100 bg-gray-50 text-gray-700'
                  }`}
                >
                  <i className={`fa-solid ${hint.done ? 'fa-circle-check' : 'fa-circle'} mt-1`}></i>
                  <span>{hint.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Next best steps</h3>
              <button
                onClick={onNavigateProfile}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Update details
              </button>
            </div>
            <p className="text-gray-600 text-sm">Actions that help you appear in better recommendations.</p>
            <div className="grid gap-3">
              <ActionCard
                icon="fa-solid fa-pen"
                title="Refresh your introduction"
                body="Keep your 'About you' crisp and warm. Members respond better to thoughtful stories."
              />
              <ActionCard
                icon="fa-solid fa-people-group"
                title="Highlight family values"
                body="Share what matters to your family. It builds trust before conversations start."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
          Sign in from the home experience to build your profile. Once signed in, you'll return here automatically.
        </p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600"
        >
          Go to home
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
            Back to home
          </button>
          <button
            onClick={onSaveProfile}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600"
          >
          Save profile
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 text-amber-900 px-4 py-3 text-sm flex items-start gap-3">
        <i className="fa-solid fa-pen-to-square mt-0.5"></i>
        <p>
          Keep your profile crisp for better matches. Use the form below to edit details, then return to the matches tab from the navbar when you are done.
        </p>
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

function Modal({ title, description, children, onClose, onSubmit, actionLabel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="px-6 pb-2">
          <div className="space-y-4">{children}</div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold shadow-sm hover:bg-rose-600"
          >
            {actionLabel}
          </button>
        </div>
      </div>
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

function MatchCard({ profile, ctaLabel = 'View profile' }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-32 w-full bg-gradient-to-br from-rose-100 to-rose-50">
        <img src={profile.image} alt={profile.name} className="h-full w-full object-cover" />
        {profile.badge && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full bg-white/90 text-rose-700">
            {profile.badge}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">{profile.name}</p>
          {profile.compatibility && <span className="text-xs font-semibold text-rose-600">{profile.compatibility}</span>}
        </div>
        <p className="text-sm text-gray-600">
          {profile.age} yrs · {profile.city}
        </p>
        <p className="text-sm text-gray-700 font-medium">{profile.occupation}</p>
        {profile.height && <p className="text-xs text-gray-500">Height: {profile.height}</p>}
      </div>
      <div className="px-4 pb-4">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-semibold px-3 py-2 hover:bg-gray-800">
          <i className="fa-solid fa-eye"></i>
          {ctaLabel}
        </button>
      </div>
    </div>
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

function ActionCard({ icon, title, body }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
          <i className={icon}></i>
        </span>
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      </div>
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
