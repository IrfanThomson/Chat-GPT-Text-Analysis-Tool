#script to manually restart processes
#kill existing processes
sudo pm2 kill textprocess
sudo pm2 kill textprocess-api
#frontend
cd ./frontend
sudo pm2 start npm --name textprocess -- run host
cd ..
#backend
cd ./backend
sudo pm2 start npm --name textprocess-api -- start
cd ..