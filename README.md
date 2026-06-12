🚀 Online Examination Backend

Backend API for an Online Examination System built using Node.js, Express, TypeScript, and PostgreSQL.
It provides authentication, user management, and scalable API structure for exam-based platforms.

🛠️ Tech Stack

Node.js • Express.js • TypeScript • PostgreSQL • JWT • bcryptjs

⚡ Features
User Registration & Login 🔐
JWT Authentication 🔑
Password Hashing (bcrypt) 🔒
REST API Architecture 📡
PostgreSQL Database Integration 🗄️
Environment Configuration Support ⚙️



📂 Project Setup


Clone Repo
git clone https://github.com/YOUR_USERNAME/online-exam-backend.git
cd online-exam-backend
Install Dependencies
npm install
Create .env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
Run Dev Server
npm run dev
Build Project
npm run build
Start Server
npm start



📡 API Example
POST /api/auth/register → Register user
POST /api/auth/login → Login user
GET /api/users → Get users


🔐 Auth Header
Authorization: Bearer <token>


📜 Scripts
"dev": "nodemon --watch src --ext ts --exec ts-node src/server.ts",
"build": "tsc",
"start": "node dist/server.js"


👨‍💻 Author

Abhishek Mishra
MERN Stack Developer | Backend & API Specialist

⭐

If you like this project, give it a star ⭐