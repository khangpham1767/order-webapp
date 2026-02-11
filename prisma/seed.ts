import { PrismaClient, MenuItemType, OptionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemOption.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.table.deleteMany();

  // Create 10 tables
  const tables = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.table.create({
        data: {
          number: i + 1,
          label: `Bàn ${i + 1}`,
        },
      }),
    ),
  );
  console.log(`Created ${tables.length} tables`);

  // Create main dishes
  const huTieu = await prisma.menuItem.create({
    data: {
      name: 'Hủ tiếu chay',
      sellPrice: 45000,
      costPrice: 20000,
      type: MenuItemType.MAIN,
      options: {
        create: [
          // Noodle types
          { optionType: OptionType.NOODLE_TYPE, label: 'Hủ tiếu', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.NOODLE_TYPE, label: 'Hủ tiếu mì', sortOrder: 2 },
          { optionType: OptionType.NOODLE_TYPE, label: 'Mì', sortOrder: 3 },
          { optionType: OptionType.NOODLE_TYPE, label: 'Bánh canh', sortOrder: 4 },
          // Specials
          { optionType: OptionType.SPECIAL, label: 'Không hành', sortOrder: 1 },
          { optionType: OptionType.SPECIAL, label: 'Không giá', sortOrder: 2 },
          { optionType: OptionType.SPECIAL, label: 'Ít bánh', sortOrder: 3 },
          { optionType: OptionType.SPECIAL, label: 'Không tàu hủ', sortOrder: 4 },
          // Vegetables
          { optionType: OptionType.VEGETABLE, label: 'Rau trụng', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.VEGETABLE, label: 'Rau sống', sortOrder: 2 },
          { optionType: OptionType.VEGETABLE, label: 'Không rau', sortOrder: 3 },
          { optionType: OptionType.VEGETABLE, label: 'Chỉ lấy giá', sortOrder: 4 },
          // Size
          { optionType: OptionType.SIZE, label: 'Tô thường', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.SIZE, label: 'Tô em bé', sortOrder: 2, surcharge: -10000 },
        ],
      },
    },
  });

  const bunBo = await prisma.menuItem.create({
    data: {
      name: 'Bún bò chay',
      sellPrice: 50000,
      costPrice: 22000,
      type: MenuItemType.MAIN,
      options: {
        create: [
          // Noodle types
          { optionType: OptionType.NOODLE_TYPE, label: 'Bún', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.NOODLE_TYPE, label: 'Hủ tiếu', sortOrder: 2 },
          { optionType: OptionType.NOODLE_TYPE, label: 'Mì', sortOrder: 3 },
          // Specials
          { optionType: OptionType.SPECIAL, label: 'Không hành', sortOrder: 1 },
          { optionType: OptionType.SPECIAL, label: 'Không giá', sortOrder: 2 },
          { optionType: OptionType.SPECIAL, label: 'Ít bánh', sortOrder: 3 },
          { optionType: OptionType.SPECIAL, label: 'Không tàu hủ', sortOrder: 4 },
          // Vegetables
          { optionType: OptionType.VEGETABLE, label: 'Rau trụng', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.VEGETABLE, label: 'Rau sống', sortOrder: 2 },
          { optionType: OptionType.VEGETABLE, label: 'Không rau', sortOrder: 3 },
          // Size
          { optionType: OptionType.SIZE, label: 'Tô thường', isDefault: true, sortOrder: 1 },
          { optionType: OptionType.SIZE, label: 'Tô em bé', sortOrder: 2, surcharge: -10000 },
        ],
      },
    },
  });

  console.log(`Created main dishes: ${huTieu.name}, ${bunBo.name}`);

  // Create addon items
  const addons = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Hoành thánh thêm',
        sellPrice: 15000,
        costPrice: 7000,
        type: MenuItemType.ADDON,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tàu hủ ky thêm',
        sellPrice: 10000,
        costPrice: 4000,
        type: MenuItemType.ADDON,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Trà đá',
        sellPrice: 5000,
        costPrice: 1000,
        type: MenuItemType.ADDON,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Nước ngọt',
        sellPrice: 15000,
        costPrice: 8000,
        type: MenuItemType.ADDON,
      },
    }),
  ]);

  console.log(`Created ${addons.length} addon items`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
