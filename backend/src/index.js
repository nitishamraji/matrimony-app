import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function deriveBadge(profile) {
  const hoursSinceActive = (Date.now() - new Date(profile.lastActive).getTime()) / (1000 * 60 * 60);

  if (hoursSinceActive < 2) return 'Active now';
  if (hoursSinceActive < 24) return 'Recently active';
  if (profile.education) return 'Verified career';
  return 'Recently joined';
}

function computeCompatibility(viewerProfile, candidateProfile) {
  if (!viewerProfile) {
    return 70 + Math.floor(Math.random() * 15);
  }

  let score = 60;

  if (viewerProfile.city && candidateProfile.city && viewerProfile.city === candidateProfile.city) score += 10;
  if (viewerProfile.religion && candidateProfile.religion && viewerProfile.religion === candidateProfile.religion) score += 10;
  if (viewerProfile.motherTongue && candidateProfile.motherTongue && viewerProfile.motherTongue === candidateProfile.motherTongue)
    score += 5;
  if (viewerProfile.occupation && candidateProfile.occupation && candidateProfile.occupation.includes(viewerProfile.occupation))
    score += 4;

  if (viewerProfile.age && candidateProfile.age) {
    const ageDiff = Math.abs(viewerProfile.age - candidateProfile.age);
    if (ageDiff <= 2) score += 6;
    else if (ageDiff <= 5) score += 3;
    else score -= 2;
  }

  score += Math.floor(Math.random() * 6);
  return Math.max(55, Math.min(score, 96));
}

function mapProfileForResponse(profile, viewerProfile) {
  const compatibilityScore = computeCompatibility(viewerProfile, profile);
  return {
    id: profile.userId,
    name: profile.user.fullName,
    age: profile.age,
    city: profile.city || '—',
    religion: profile.religion || '—',
    occupation: profile.occupation || '—',
    height: profile.height || undefined,
    image: profile.imageUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    compatibility: `${compatibilityScore}% match`,
    compatibilityScore,
    badge: deriveBadge(profile)
  };
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName, age, gender, city } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email and password are required' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        fullName
      }
    });

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        age: age ?? null,
        gender: gender ?? null,
        city: city ?? null,
        about: null,
        religion: null,
        height: null,
        maritalStatus: null,
        motherTongue: null,
        eatingHabits: null,
        drinkingSmoking: null,
        education: null,
        occupation: null,
        incomeRange: null,
        familyDetails: null,
        imageUrl: null
      }
    });

    res.status(201).json({ user: { id: user.id, email: user.email, fullName: user.fullName }, profile });
  } catch (error) {
    console.error('Failed to register user', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    res.json({ user: { id: user.id, email: user.email, fullName: user.fullName }, profile });
  } catch (error) {
    console.error('Failed to log in', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/api/profile/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ error: 'User id is required' });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId }, include: { user: true } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Failed to fetch profile', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  const {
    age,
    gender,
    city,
    about,
    religion,
    height,
    maritalStatus,
    motherTongue,
    eatingHabits,
    drinkingSmoking,
    education,
    occupation,
    incomeRange,
    familyDetails,
    imageUrl
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User id is required' });
  }

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        age: age ?? null,
        gender: gender ?? null,
        city: city ?? null,
        about: about ?? null,
        religion: religion ?? null,
        height: height ?? null,
        maritalStatus: maritalStatus ?? null,
        motherTongue: motherTongue ?? null,
        eatingHabits: eatingHabits ?? null,
        drinkingSmoking: drinkingSmoking ?? null,
        education: education ?? null,
        occupation: occupation ?? null,
        incomeRange: incomeRange ?? null,
        familyDetails: familyDetails ?? null,
        imageUrl: imageUrl ?? null,
        lastActive: new Date()
      }
    });

    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Failed to update profile', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/profiles', async (req, res) => {
  const { ageRange, city, religion, occupation, compatibility, userId } = req.query;

  try {
    const viewerId = userId ? Number(userId) : null;
    const viewerProfile = viewerId
      ? await prisma.profile.findUnique({ where: { userId: viewerId }, include: { user: true } })
      : null;

    let profiles = await prisma.profile.findMany({ include: { user: true } });

    if (viewerId) {
      profiles = profiles.filter((profile) => profile.userId !== viewerId);
    }

    if (ageRange && ageRange !== 'Any') {
      const [minAge, maxAge] = ageRange.split('-').map((value) => Number(value));
      profiles = profiles.filter((profile) => profile.age && profile.age >= minAge && profile.age <= maxAge);
    }

    if (city && city !== 'Any') {
      profiles = profiles.filter((profile) => profile.city === city);
    }

    if (religion && religion !== 'Any') {
      profiles = profiles.filter((profile) => profile.religion === religion);
    }

    if (occupation && occupation !== 'Any') {
      profiles = profiles.filter(
        (profile) => profile.occupation && profile.occupation.toLowerCase().includes(occupation.toLowerCase())
      );
    }

    const results = profiles
      .map((profile) => mapProfileForResponse(profile, viewerProfile))
      .filter((profile) => {
        if (!compatibility || compatibility === 'Any') return true;
        const threshold = Number(String(compatibility).replace('+', ''));
        return profile.compatibilityScore >= threshold;
      });

    res.json({ profiles: results });
  } catch (error) {
    console.error('Failed to fetch profiles', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

app.get('/api/matches/recommended', async (req, res) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: 'User id is required' });
  }

  try {
    const viewerProfile = await prisma.profile.findUnique({ where: { userId }, include: { user: true } });

    if (!viewerProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profiles = await prisma.profile.findMany({ include: { user: true } });
    const candidates = profiles
      .filter((profile) => profile.userId !== userId && profile.gender !== viewerProfile.gender)
      .map((profile) => mapProfileForResponse(profile, viewerProfile))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 6);

    res.json({ matches: candidates });
  } catch (error) {
    console.error('Failed to fetch recommended matches', error);
    res.status(500).json({ error: 'Failed to fetch recommended matches' });
  }
});

app.get('/api/messages', async (_req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

const clientPath = path.join(__dirname, '../public');

if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'API is running. Build the frontend to serve static assets.' });
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
