const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'shemaclaude2021@gmail.com';
  const password = 'shema@123?';
  const hash = await bcrypt.hash(password, 10);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  
  if (!existing) {
    await prisma.adminUser.create({
      data: {
        email,
        password_hash: hash,
        name: 'Super Admin',
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Super Admin created!');
  } else {
    await prisma.adminUser.update({
      where: { email },
      data: {
        password_hash: hash,
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Super Admin updated!');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
