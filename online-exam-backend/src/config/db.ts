import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "";
console.log("Connection String:", connectionString);
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
}).$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
    },
  },
});

export default prisma;