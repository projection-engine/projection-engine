M=$(cat COMMIT_NOTES.md)

cd public/engine
git add --all
git commit -m "$M"
git push origin v5.0.x-alpha

cd ../../
git add --all
git commit -m "$M"
git push origin v5.0.x-alpha

sleep 5s