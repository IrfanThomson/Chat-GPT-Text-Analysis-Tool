#script to manually restart processes
#kill existing processes
sudo pm2 kill processtext
sudo pm2 kill processtext-api
#frontend
cd ./frontend
sudo pm2 start npm --name processtext -- run host
cd ..
#backend
cd ./backend
sudo pm2 start npm --name processtext-api -- start
cd ..