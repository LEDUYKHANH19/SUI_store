import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Role updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
