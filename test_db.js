const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.adminUser.findMany();
  console.log("Users in DB:", users);
  
  if (users.length > 0) {
      const match = await bcrypt.compare('shema@123?', users[0].password_hash);
      console.log("Password match for first user:", match);
  }

  const products = await prisma.product.findMany();
  console.log('Products count:', products.length);
}
main().finally(() => prisma.$disconnect());
