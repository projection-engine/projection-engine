# SEM SUDO DESGRETA

MESSAGE="$1"

cd src/components
git add --all
git commit -m "$MESSAGE"
git push origin v0.2.x

cd ../engine
git add --all
git commit -m "$MESSAGE"
git push origin v0.2.x


cd ../views/blueprints
git add --all
git commit -m "$MESSAGE"
git push origin v0.2.x


cd ../files
git add --all
git commit -m "$MESSAGE"
git push origin v0.2.x

cd ../../../
git add --all
git commit -m "$MESSAGE"
git push origin v0.2.x




