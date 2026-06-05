import bcrypt from 'bcryptjs';

import { loadConfig } from '../config';

import { createDatabase } from './db';
import { orderItems, orders, products, users } from './schema';

const config = loadConfig();
const db = createDatabase(config.DATABASE_URL);

async function seed(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const [admin] = await db
    .insert(users)
    .values({
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: adminHash,
      role: 'admin',
    })
    .onConflictDoNothing()
    .returning();

  // Create viewer user
  const viewerHash = await bcrypt.hash('Viewer123!', 10);
  const [viewer] = await db
    .insert(users)
    .values({
      email: 'viewer@example.com',
      name: 'Viewer User',
      passwordHash: viewerHash,
      role: 'viewer',
    })
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Created users: ${admin?.email ?? 'skip'}, ${viewer?.email ?? 'skip'}`);

  // Create 20 sample products
  const categories = ['electronics', 'clothing', 'food', 'books', 'other'] as const;
  const productData = Array.from({ length: 20 }, (_, i) => ({
    name: `Product ${String(i + 1)}`,
    description: `Description for product ${String(i + 1)}`,
    price: Math.round((Math.random() * 200 + 5) * 100) / 100,
    category: categories[i % categories.length] ?? 'other',
    stock: Math.floor(Math.random() * 200),
  }));

  const insertedProducts = await db.insert(products).values(productData).returning();
  console.log(`✅ Created ${String(insertedProducts.length)} products`);

  // Create 10 sample orders (need a user to reference)
  const userId = admin?.id ?? viewer?.id;
  if (userId !== undefined) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
    const orderData = Array.from({ length: 10 }, (_, i) => ({
      userId,
      total: Math.round((Math.random() * 500 + 20) * 100) / 100,
      status: statuses[i % statuses.length] ?? 'pending',
    }));

    const insertedOrders = await db.insert(orders).values(orderData).returning();

    // Add order items for each order
    for (const order of insertedOrders) {
      const product = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
      if (product !== undefined) {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          quantity: Math.floor(Math.random() * 5) + 1,
          unitPrice: product.price,
        });
      }
    }
    console.log(`✅ Created ${String(insertedOrders.length)} orders`);
  }

  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
