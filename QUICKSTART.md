# Quick Start Guide

## Prerequisites
- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed

## Installation & Setup

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition from https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in `server/.env`

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Configure environment
# Edit .env file with:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A random string for JWT signing
# - PORT: 5000 (default)
# - CORS_ORIGIN: http://localhost:5173

# Start server
npm run dev
```

Server will start on http://localhost:5000

**Verify it's running:**
```
curl http://localhost:5000/api/health
```

### Step 3: Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Configure environment (already has defaults in .env.local)
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

Client will start on http://localhost:5173

## First Time Usage

1. Open http://localhost:5173 in your browser
2. Click "Register" to create a new account
3. Fill in username, email, and password
4. Click "Register" - you'll be logged in automatically
5. Open another browser tab or window and repeat steps 1-4 with a different email
6. Go back to the first window and search for the second user
7. Click on the user to start chatting
8. Send messages and enjoy real-time chat!

## Common Commands

### Development
```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

### Production Build
```bash
# Build frontend
cd client
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port Already in Use
```bash
# For Windows
netstat -ano | findstr :5000  # Find process on port 5000
taskkill /PID <PID> /F        # Kill process

# For Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Check `CORS_ORIGIN` in server `.env`
- Should match your frontend URL

### WebSocket Connection Failed
- Ensure both servers are running
- Check firewall settings
- Verify Socket.io is properly initialized

## Next Steps

1. **Customize the UI** - Edit components in `client/src/components/`
2. **Add More Features** - Refer to the main README.md for feature ideas
3. **Deploy to Production** - Deploy backend to Heroku/Railway and frontend to Vercel/Netlify
4. **Add Database Backups** - Setup MongoDB backups
5. **Enable HTTPS** - Install SSL certificates for production

## Support

For detailed documentation, see the main README.md file.

For issues, check the troubleshooting section or create an issue on GitHub.

---

Happy coding! 🚀
