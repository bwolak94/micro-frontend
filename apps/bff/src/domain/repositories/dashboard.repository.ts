import { and, count, gte, sql, sum } from 'drizzle-orm';

import { orderItems, orders, products, users } from '../schema';

import type {
  DashboardRepo,
  SalesDataPoint,
} from '../../services/dashboard/dashboard.service.types';
import type { Database } from '../db';
import type { Order, OrderItem, OrderStatus } from '@portfolio/shared-types';

export function createDashboardRepository(db: Database): DashboardRepo {
  return {
    async getTotalRevenue() {
      const [result] = await db.select({ total: sum(orders.total) }).from(orders);
      return Number(result?.total ?? 0);
    },

    async getTotalOrders() {
      const [result] = await db.select({ count: count() }).from(orders);
      return Number(result?.count ?? 0);
    },

    async getTotalProducts() {
      const [result] = await db.select({ count: count() }).from(products);
      return Number(result?.count ?? 0);
    },

    async getTotalUsers() {
      const [result] = await db.select({ count: count() }).from(users);
      return Number(result?.count ?? 0);
    },

    async getSalesData(startDate: Date): Promise<SalesDataPoint[]> {
      const rows = await db
        .select({
          date: sql<string>`DATE(${orders.createdAt})::text`,
          revenue: sum(orders.total),
          orders: count(),
        })
        .from(orders)
        .where(gte(orders.createdAt, startDate))
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);

      return rows.map((row) => ({
        date: row.date,
        revenue: Number(row.revenue ?? 0),
        orders: Number(row.orders),
      }));
    },

    async getRecentOrders(limit: number): Promise<Order[]> {
      const orderRows = await db
        .select()
        .from(orders)
        .orderBy(sql`${orders.createdAt} DESC`)
        .limit(limit);

      const enriched = await Promise.all(
        orderRows.map(async (order) => {
          const items = await db
            .select()
            .from(orderItems)
            .where(and(sql`${orderItems.orderId} = ${order.id}`));

          const mappedItems: OrderItem[] = items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }));

          const result: Order = {
            id: order.id,
            userId: order.userId,
            items: mappedItems,
            total: order.total,
            status: order.status as OrderStatus,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
          };
          return result;
        }),
      );

      return enriched;
    },
  };
}
