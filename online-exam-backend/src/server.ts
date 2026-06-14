import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import prisma from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    const server = app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`🚀 Server running on port: ${PORT}`);
      console.log(`=================================`);
    });

    process.stdin.resume(); // ← server ko zinda rakhega
    process.on("SIGINT", async () => {
      console.log("\n🛑 Server band ho raha hai...");
      await prisma.$disconnect();
      server.close(() => {
        console.log("✅ Server disconnected successfully!");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Server start karne mein dikkat aayi:", error);
    process.exit(1);
  }
}

startServer();
