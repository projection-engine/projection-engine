git log --max-count=10 > README.md


yarn package
yarn electron-forge package --platform linux

cd out/projection-engine-win32-x64/resources/app
#rm -r .idea
#rm -r src
#rm -r public/engine
#rm -r public/backend
