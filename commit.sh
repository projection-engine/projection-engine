# SEM SUDO DESGRETA

MESSAGE="$1"

cd views/files
git add --all
git commit -m "$MESSAGE"
git push origin v0.x

cd ../material
git add --all
git commit -m "$MESSAGE"
git push origin v0.x

cd ../../components
git add --all
git commit -m "$MESSAGE"
git push origin v0.x

cd ../services/engine
git add --all
git commit -m "$MESSAGE"
git push origin v0.x

cd ../../
git add --all
git commit -m "$MESSAGE"
git push origin v0.x



