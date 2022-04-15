# SEM SUDO DESGRETA

MESSAGE="$1"

cd src/components
git add --all
git commit -m "$MESSAGE"
git push origin electron

cd ../services/engine
git add --all
git commit -m "$MESSAGE"
git push origin v2.0


cd ../../views/material
git add --all
git commit -m "$MESSAGE"
git push origin electron


cd ../files
git add --all
git commit -m "$MESSAGE"
git push origin electron

cd ../../../
git add --all
git commit -m "$MESSAGE"
git push origin v0.x




