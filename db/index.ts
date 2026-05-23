import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Verify the environment variable is loaded
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });