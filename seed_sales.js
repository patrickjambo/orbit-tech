const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://neondb_owner:npg_tnvZfQpO6V3o@ep-hidden-boat-a85sm5i8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require' }
  }
});

async function main() {
  const products = await prisma.product.findMany();
  if (!products.length) return;

  for (let i = 0; i < 20; i++) {
    const p = products[Math.floor(Math.random() * products.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10)); // last 10 days
    await prisma.saleEvent.create({
      data: {
        productId: p.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price_rwf: p.price_rwf,
        created_at: date
      }
    });
    // keep product sol_quantity somewhat synced
    await prisma.product.update({
      where: { id: p.id },
      data: { sold_quantity: { increment: 1 } }
    });
  }
  console.log("Seeded mock sales");
}
main().finally(() => prisma.$disconnect());
