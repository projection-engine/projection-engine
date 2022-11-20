M=$(cat COMMIT_NOTES.md)

cd public/engine
git add --all
git commit -m "$M"
git push origin deferred-materials

cd ../../
git add --all
git commit -m "$M"
git push origin deferred-materials

sleep 5s