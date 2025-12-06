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
