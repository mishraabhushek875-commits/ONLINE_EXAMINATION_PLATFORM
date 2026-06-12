import {db} from '../config/db';

// TypeScript Interface aapki hand-written image ke mutabik [cite: 35, 64]
export interface User {
    id?: number;
    full_name: string;
    email: string;
    phone: string;
    password?: string;
    role: 'admin' | 'student'; // [cite: 21, 22]
    status?: 'active' | 'inactive'; // [cite: 41]
    created_at?: Date;
    updated_at?: Date;
}

export const UserModel = {
    // Naya user insert karne ke liye function [cite: 31]
    async createUser(user: User): Promise<User> {
        const query = `
            INSERT INTO users (full_name, email, phone, password, role, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, full_name, email, phone, role, status, created_at, updated_at;
        `;
        const values = [
            user.full_name,
            user.email,
            user.phone,
            user.password,
            user.role || 'student',
            user.status || 'active'
        ];

        const { rows } = await db.query(query, values);
        return rows[0];
    },

    // Email se user dhoondne ke liye function (Login ke waqt) [cite: 17]
    async findUserByEmail(email: string): Promise<User | null> {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const { rows } = await db.query(query, [email]);
        
        if (rows.length === 0) return null;
        return rows[0];
    }
};