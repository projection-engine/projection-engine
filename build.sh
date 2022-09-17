git log --max-count=4 > README.md

yarn
yarn package
yarn electron-forge package --platform linux

cd out/projection-engine-win32-x64/resources/app
rm -r .idea
rm -r src
rm -r public/engine
rm -r public/backend

cd ../../../projection-engine-linux-x64/resources/app
rm -r .idea
rm -r src
rm -r public/engine
rm -r public/backend

