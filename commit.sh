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
git push origin v1.0.x-alpha

cd ../project/engine
git add --all
git commit -m "$MESSAGE"
git push origin v1.0.x-alpha

cd ../components/blueprints
git add --all
git commit -m "$MESSAGE"
git push origin v1.0.x-alpha

cd ../files
git add --all
git commit -m "$MESSAGE"
git push origin v1.0.x-alpha

cd ../../../../
git add --all
git commit -m "$MESSAGE"
git push origin v1.0.x-alpha

sleep 5s