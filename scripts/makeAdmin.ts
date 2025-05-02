import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin() {
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { email: 'user@example.com' },
      data: { role: 'ADMIN' },
    });
    console.log('User updated:', updatedUser);
  } else {
    console.log('User not found');
  }

  await prisma.$disconnect();
}

makeAdmin();
