@echo off
npx pm2 stop furniro-backend
npx pm2 delete furniro-backend
echo Furniro Backend Server stopped
pause
