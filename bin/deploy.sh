#! /usr/bin/bash
PWD=/home/ubuntu/apps/nig-backend
PWD_FE=/home/ubuntu/apps/nig-frontend
echo "Pull from Repository "
sudo git checkout main 
sudo git pull origin main || (sudo git stash && sudo git pull origin main)
echo "Deploying..."
echo "Check Node.JS"
node --version || "echo \"Error: Node JS Not Found\" && exit"
echo "Check Yarn && Install if it doesnt exist"
yarn --version || npm i -g yarn
echo "Installing depedencies"
yarn
echo "Build"
yarn build
echo "trying to create public folder if doesnt exist"
mkdir $PWD/public || echo "public folder already exist"
rm $PWD/public/storage || echo "Failed to remove linked storage folder"
mkdir $PWD/storage || echo "Folder Storage Exist"
mkdir $PWD/storage/assets || echo "Folder Storage/Assets Exist"
cp -R $PWD/assets/* $PWD/storage/assets
ln -s $PWD/storage $PWD/public/storage || echo "Failed to create symlink"
echo "Restart PM2"
pm2 restart all
echo "Wait 10 Sec for live server testing"
sleep 10
curl http://localhost/api/
echo "Finish BE"
echo "Start Redeploy FE"
cd $PWD_FE && (sudo ./bin/deploy.sh || sudo chmod u+x ./bin/deploy.sh && sudo ./bin/deploy.sh)
exit

