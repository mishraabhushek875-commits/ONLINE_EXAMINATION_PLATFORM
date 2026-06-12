import app from './app';
import { initializeDatabase } from './config/db';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // 1. Pehle database aur tables ready karo
        await initializeDatabase();

        // 2. Express server ko port par listen karwao
        app.listen(PORT, () => {
            console.log(`=================================`);
            console.log(`🚀 Server running on port: ${PORT}`);
            console.log(`=================================`);
        });

        // 3. Keep-Alive Hook: Yeh terminal ko hamesha zinda rakhega, clean exit nahi hone dega
        setInterval(() => {}, 1 << 30); 

    } catch (error) {
        console.error("❌ Server start karne mein dikkat aayi:", error);
        process.exit(1);
    }
}

startServer();