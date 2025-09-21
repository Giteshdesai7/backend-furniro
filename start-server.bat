@echo off
cd /d "C:\Users\gites\OneDrive\Desktop\Furniro\backend"
npx pm2 start server.js --name "furniro-backend"
echo Furniro Backend Server started with PM2
pause
