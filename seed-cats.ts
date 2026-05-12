import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear old demo data
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  console.log('Cleared old products, brands, categories, and orders.');

  // 2. Seed Categories
  const categoriesData = [
    { name: 'Laptops', slug: 'laptops', description: 'High-performance laptops for gaming and productivity.' },
    { name: 'PC Components', slug: 'pc-components', description: 'Processors, graphics cards, motherboards, and more.' },
    { name: 'Peripherals', slug: 'peripherals', description: 'Mice, keyboards, monitors, and accessories.' },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.create({ data: c });
    categories[cat.slug] = cat.id;
  }

  // 3. Seed Brands
  const brandsData = [
    { name: 'Apple', slug: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Asus', slug: 'asus', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' },
    { name: 'Dell', slug: 'dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'NVIDIA', slug: 'nvidia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
    { name: 'Logitech', slug: 'logitech', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg' },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brands[brand.slug] = brand.id;
  }

  // 4. Seed Products
  const productsData = [
    // Laptops
    {
      name: 'MacBook Pro 16" M3 Max',
      slug: 'macbook-pro-16-m3-max',
      description: 'Mind-blowing. Head-turning. The new MacBook Pro features the most advanced chips ever built for a personal computer.',
      price: 3499.00,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['apple'],
    },
    {
      name: 'MacBook Air 15" M3',
      slug: 'macbook-air-15-m3',
      description: 'Supercharged by M3, the MacBook Air is super thin, incredibly light, and ready for anything.',
      price: 1299.00,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['apple'],
    },
    {
      name: 'Asus ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      description: 'The world’s most powerful 14-inch gaming laptop. Features an AniMe Matrix™ LED display and AMD Ryzen™ 9.',
      price: 1599.00,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['asus'],
    },
    {
      name: 'Asus Zenbook 14 OLED',
      slug: 'asus-zenbook-14-oled',
      description: 'Powerful and compact premium laptop with an amazing OLED HDR NanoEdge display.',
      price: 999.00,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1620247604473-19eb7662c5b3?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['asus'],
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Stunning 15.6-inch laptop with InfinityEdge display. Featuring 13th Gen Intel® Core™ processors.',
      price: 1899.00,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['dell'],
    },
    {
      name: 'Alienware m18 Gaming Laptop',
      slug: 'alienware-m18',
      description: '18-inch high-performance gaming laptop with the latest NVIDIA® GeForce RTX™ graphics.',
      price: 2499.00,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['laptops'],
      brandId: brands['dell'],
    },

    // PC Components
    {
      name: 'NVIDIA GeForce RTX 4090',
      slug: 'nvidia-geforce-rtx-4090',
      description: 'The ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics.',
      price: 1599.00,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1600000000000-000000000000?q=80&w=1000&auto=format&fit=crop'], // Placeholder for GPU
      categoryId: categories['pc-components'],
      brandId: brands['nvidia'],
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Ti',
      slug: 'nvidia-geforce-rtx-4070-ti',
      description: 'Brilliant performance and capabilities for gamers and creators. Powered by the ultra-efficient Ada Lovelace architecture.',
      price: 799.00,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop'], // Placeholder
      categoryId: categories['pc-components'],
      brandId: brands['nvidia'],
    },
    {
      name: 'Asus ROG Crosshair X670E Hero',
      slug: 'asus-rog-crosshair-x670e-hero',
      description: 'ATX motherboard ready for AMD Ryzen 7000 Series desktop processors. Features robust power delivery.',
      price: 699.00,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['pc-components'],
      brandId: brands['asus'],
    },

    // Peripherals
    {
      name: 'Logitech G Pro X Superlight 2',
      slug: 'logitech-g-pro-x-superlight-2',
      description: 'The next evolution of our championship-winning mouse. Now featuring LIGHTFORCE hybrid switches.',
      price: 159.00,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1527814050087-379381547969?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['logitech'],
    },
    {
      name: 'Logitech MX Master 3S',
      slug: 'logitech-mx-master-3s',
      description: 'Iconic mouse remastered for ultimate tactility, performance, and flow. With Quiet Clicks.',
      price: 99.00,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['logitech'],
    },
    {
      name: 'Logitech G915 TKL Tenkeyless',
      slug: 'logitech-g915-tkl',
      description: 'A breakthrough in design and engineering. Features LIGHTSPEED pro-grade wireless and low-profile mechanical switches.',
      price: 229.00,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['logitech'],
    },
    {
      name: 'Apple Magic Keyboard with Touch ID',
      slug: 'apple-magic-keyboard-touch-id',
      description: 'Magic Keyboard is now available with Touch ID, providing fast, easy, and secure authentication.',
      price: 149.00,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['apple'],
    },
    {
      name: 'Dell UltraSharp 32" 4K USB-C Monitor',
      slug: 'dell-ultrasharp-32-4k',
      description: 'Experience brilliant color and sharp details on this 31.5" 4K monitor with IPS Black technology.',
      price: 899.00,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['dell'],
    },
    {
      name: 'Asus ROG Swift OLED PG27AQDM',
      slug: 'asus-rog-swift-oled-pg27aqdm',
      description: '27-inch 1440p OLED gaming monitor with a 240Hz refresh rate and 0.03ms response time.',
      price: 999.00,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1550009158-9effb64fda70?q=80&w=1000&auto=format&fit=crop'],
      categoryId: categories['peripherals'],
      brandId: brands['asus'],
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  console.log('Successfully seeded 15 products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
