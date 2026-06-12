import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const initialPool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
});

// Main db pool instance export karne ke liye
export let db: Pool;

export async function initializeDatabase() {
    try {
        const dbName = process.env.DB_NAME || 'online_exam_db';

        const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = $1;`;
        const res = await initialPool.query(dbCheckQuery, [dbName]);

        if (res.rowCount === 0) {
            console.log(`⏳ Database "${dbName}" nahi mila. Naya bana rahe hain...`);
            await initialPool.query(`CREATE DATABASE ${dbName};`);
            console.log(`✨ Database "${dbName}" successfully ban gaya!`);
        } else {
            console.log(`✅ Database "${dbName}" pehle se maujood hai.`);
        }

        await initialPool.end();

        // Main pool ko initialize kar rahe hain
        db = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: dbName,
            max: 10,
        });

        console.log('⏳ Tables aur Types check/create kar rahe hain...');
        
        await db.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                    CREATE TYPE user_role AS ENUM ('admin', 'student');
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
                    CREATE TYPE user_status AS ENUM ('active', 'inactive');
                END IF;
            END $$;

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(15) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role user_role DEFAULT 'student',
                status user_status DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE OR REPLACE FUNCTION update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            DROP TRIGGER IF EXISTS update_users_modtime ON users;
            CREATE TRIGGER update_users_modtime
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE PROCEDURE update_modified_column();
        `);

        console.log('🚀 Database aur saari Tables ekdum perfectly ready hain! Pool Connected.');

    } catch (error) {
        console.error('❌ Database initialization mein error aaya:', error);
        process.exit(1);
    }
}