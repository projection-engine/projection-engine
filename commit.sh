# SEM SUDO DESGRETA

TYPE="$1"
M="$2"

case $TYPE in
        0)
          TYPE="[FIX] - "
          ;;
        1)
          TYPE="[HOT-FIX] - "
          ;;
        2)
          TYPE="[FEATURE] - "
          ;;
        3)
          TYPE="[OPTIMIZATION] - "
          ;;
        *)
          TYPE="[MIX] - "
          ;;
esac
MESSAGE=$TYPE
MESSAGE+="["$M"]"



cd src/components
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha

cd ../project/engine
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha


cd ../views/blueprints
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha


cd ../file
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha

cd ../../builders/web
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha

cd ../../../../
git add --all
git commit -m "$MESSAGE"
git push origin v0.1.x-alpha

sleep 10s