import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'leduykhanh286@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Role updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
