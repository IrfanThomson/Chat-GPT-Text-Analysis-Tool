#script to manually restart processes
#delete existing processes
sudo pm2 delete textprocess
sudo pm2 delete textprocess-api
#frontend
cd ./frontend
sudo pm2 start npm --name textprocess -- run host
cd ..
#backend
cd ./backend
sudo pm2 start npm --name textprocess-api -- start
cd ..