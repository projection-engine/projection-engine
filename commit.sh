M=$(cat COMMIT_NOTES.md)

cd public/engine
git add --all
git commit -m "$M"
git push origin v4.x.x-beta

cd ../../
git add --all
git commit -m "$M"
git push origin v4.x.x-beta

sleep 5s