import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.book.createMany({
    data: [
      { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
      },
      { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
    ],
  });

  await prisma.member.createMany({
    data: [
      { code: 'M001', name: 'Angga' },
      { code: 'M002', name: 'Ferry' },
    ],
  });
}

main()
  .then(() => console.log('✅ Data seeder selesai'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
