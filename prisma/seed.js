import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.message.count();
  if (existing === 0) {
    await prisma.message.createMany({
      data: [
        { text: 'Hello from Prisma + Postgres!' },
        { text: 'Edit this sample data to get started.' }
      ]
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
