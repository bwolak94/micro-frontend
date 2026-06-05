import { eq } from 'drizzle-orm';

import { users } from '../schema';

import type { UserRepo } from '../../services/auth/auth.service.types';
import type { Database } from '../db';
import type { NewDbUser } from '../schema';

export function createUsersRepository(db: Database): UserRepo {
  return {
    async findByEmail(email: string) {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] ?? null;
    },

    async findById(id: string) {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] ?? null;
    },

    async insert(data: NewDbUser) {
      const result = await db.insert(users).values(data).returning();
      const created = result[0];
      if (created === undefined) throw new Error('Failed to insert user');
      return created;
    },
  };
}
