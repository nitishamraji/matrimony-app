import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const existingUsers = await prisma.user.count();

  if (existingUsers === 0) {
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@bettermatch.com',
        password: hashPassword('password123'),
        fullName: 'Ananya S'
      }
    });

    await prisma.profile.create({
      data: {
        userId: demoUser.id,
        age: 26,
        gender: 'Woman',
        city: 'Bangalore, India',
        about:
          'I am a software engineer who loves traveling, reading, and exploring new cuisines. Looking for someone who is understanding and ambitious.',
        religion: 'Hindu',
        height: "5' 6\"",
        maritalStatus: 'Never Married',
        motherTongue: 'Hindi',
        eatingHabits: 'Vegetarian',
        drinkingSmoking: 'No / No',
        education: 'Masters in Computer Science - IIT Bombay',
        occupation: 'Senior Software Developer at Microsoft',
        incomeRange: '25L - 35L',
        familyDetails: 'Father: Retired Government Officer, Mother: Homemaker, 1 Brother (Married)',
        imageUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
