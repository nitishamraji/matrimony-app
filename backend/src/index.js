import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
