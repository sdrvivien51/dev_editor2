import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export async function up(db: any) {
  await db.execute(sql`
    ALTER TABLE posts 
    ADD COLUMN IF NOT EXISTS slug text UNIQUE NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS excerpt text;
  `);
  
  // Generate slugs for existing posts
  await db.execute(sql`
    UPDATE posts 
    SET slug = LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          title,
          '[^a-zA-Z0-9\s-]',
          ''
        ),
        '\s+',
        '-'
      )
    )
    WHERE slug = '';
  `);
}

export async function down(db: any) {
  await db.execute(sql`
    ALTER TABLE posts 
    DROP COLUMN IF EXISTS slug,
    DROP COLUMN IF EXISTS excerpt;
  `);
}
