import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const femaleFirstNames = [
  'Ananya',
  'Ishita',
  'Aditi',
  'Ritika',
  'Priya',
  'Meera',
  'Divya',
  'Nisha',
  'Sneha',
  'Aparna',
  'Keerthi',
  'Tanvi',
  'Madhuri',
  'Rhea',
  'Sanya',
  'Suhani',
  'Simran',
  'Tara',
  'Mansi',
  'Aisha'
];

const maleFirstNames = [
  'Arjun',
  'Rohit',
  'Karthik',
  'Abhay',
  'Neeraj',
  'Siddharth',
  'Varun',
  'Nikhil',
  'Aditya',
  'Rohan',
  'Vikram',
  'Vishal',
  'Rahul',
  'Amit',
  'Pranav',
  'Tejas',
  'Yash',
  'Kabir',
  'Arman',
  'Ankit'
];

const lastNames = [
  'Sharma',
  'Rao',
  'Verma',
  'Nair',
  'Iyer',
  'Mehta',
  'Kapoor',
  'Shah',
  'Menon',
  'Reddy',
  'Bose',
  'Mukherjee',
  'Chopra',
  'Pillai',
  'Singh',
  'Jain',
  'Das',
  'Kulkarni',
  'Joshi',
  'Patel'
];

const cities = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi NCR', 'Pune', 'Kolkata', 'Ahmedabad'];
const religions = ['Hindu', 'Christian', 'Muslim', 'Jain', 'Sikh'];
const occupations = [
  'Software Engineer',
  'Product Manager',
  'Data Analyst',
  'Consultant',
  'Architect',
  'Marketing Lead',
  'Physician',
  'Professor',
  'Entrepreneur',
  'Designer'
];
const educations = [
  'B.Tech - IIT',
  'MBA - IIM',
  'MS - USC',
  'BE - BITS Pilani',
  'M.Tech - NIT',
  'B.Arch - CEPT',
  'BA - DU',
  'CA',
  'BDS',
  'PhD - IISc'
];
const aboutSnippets = [
  'Curious traveler who loves local food trails and photography.',
  'Family-oriented and enjoys weekend treks with friends.',
  'Avid reader, yoga enthusiast, and values meaningful conversations.',
  'Tech professional who enjoys building communities and mentoring.',
  'Believes in balance between career ambitions and personal growth.',
  'Music lover, amateur guitarist, and podcast listener.',
  'Enjoys experimenting in the kitchen and hosting cozy dinners.',
  'Finds joy in volunteering and giving back to the community.'
];
const motherTongues = ['Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Gujarati', 'Punjabi', 'Bengali'];
const eatingHabits = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'];
const maritalStatuses = ['Never Married'];
const incomeRanges = ['10L - 15L', '15L - 25L', '25L - 35L', '35L - 45L', '45L - 60L'];
const familyDetails = [
  'Close-knit family, parents in academia, one sibling studying abroad.',
  'Father is a retired army officer, mother is a teacher, younger brother in college.',
  'Entrepreneurial family with strong roots in community service.',
  'Parents based in hometown, elder sister married and settled in the US.',
  'Modern yet traditional family values; enjoy celebrating festivals together.'
];

const femalePhotos = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80'
];

const malePhotos = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=-20&blend-mode=screen',
  'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529333166433-4f3f8ae9e327?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80'
];

function pick(list, index) {
  return list[index % list.length];
}

function buildProfiles(count) {
  const profiles = [];

  for (let i = 0; i < count; i++) {
    const gender = i % 2 === 0 ? 'Woman' : 'Man';
    const firstName = gender === 'Woman' ? pick(femaleFirstNames, i) : pick(maleFirstNames, i);
    const lastName = pick(lastNames, i + 3);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@thadasthu.test`;
    const age = 24 + (i % 11);
    const city = pick(cities, i + 5);
    const religion = pick(religions, i + 7);
    const motherTongue = pick(motherTongues, i + 2);
    const occupation = pick(occupations, i + 1);
    const education = pick(educations, i + 4);
    const incomeRange = pick(incomeRanges, i + 6);
    const height = `${5 + (i % 2)}'${2 + (i % 7)}"`;
    const about = pick(aboutSnippets, i + 2);
    const family = pick(familyDetails, i + 1);
    const eatingHabit = pick(eatingHabits, i + 2);
    const photo = gender === 'Woman' ? pick(femalePhotos, i) : pick(malePhotos, i);

    profiles.push({
      email,
      fullName,
      gender,
      profile: {
        age,
        gender,
        city,
        about,
        religion,
        height,
        maritalStatus: pick(maritalStatuses, i),
        motherTongue,
        eatingHabits: eatingHabit,
        drinkingSmoking: i % 3 === 0 ? 'No / No' : 'Social / No',
        education,
        occupation,
        incomeRange,
        familyDetails: family,
        imageUrl: photo,
        lastActive: new Date(Date.now() - (i % 14) * 6 * 60 * 60 * 1000)
      }
    });
  }

  return profiles;
}

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bettermatch.com' },
    update: { fullName: 'Ananya S', password: hashPassword('password123') },
    create: {
      email: 'demo@bettermatch.com',
      password: hashPassword('password123'),
      fullName: 'Ananya S'
    }
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {
      age: 26,
      gender: 'Woman',
      city: 'Bengaluru',
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
    },
    create: {
      userId: demoUser.id,
      age: 26,
      gender: 'Woman',
      city: 'Bengaluru',
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

  const generatedProfiles = buildProfiles(100);
  const seedPassword = hashPassword('password123');

  for (const person of generatedProfiles) {
    const user = await prisma.user.upsert({
      where: { email: person.email },
      update: { fullName: person.fullName, password: seedPassword },
      create: {
        email: person.email,
        password: seedPassword,
        fullName: person.fullName
      }
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: person.profile,
      create: { ...person.profile, userId: user.id }
    });
  }

  const totalUsers = await prisma.user.count();
  console.log(`Seeded ${totalUsers} users with profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
