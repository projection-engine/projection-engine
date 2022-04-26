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
        *)
          TYPE="[MIX] - "
          ;;
esac
MESSAGE=$TYPE
MESSAGE+="["$M"]"



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

sleep 10s