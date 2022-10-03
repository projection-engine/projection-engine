M=$(cat COMMIT_NOTES.md)

cd public/engine
git add --all
git commit -m "$M"
git push origin v6.x.x-alpha

cd ../../
git add --all
git commit -m "$M"
git push origin v6.x.x-alpha

sleep 5s