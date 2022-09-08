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



cd src/app/windows/project/libs/engine
git add --all
git commit -m "$MESSAGE"
git push origin v4.x.x-alpha

cd ../../../../../
git add --all
git commit -m "$MESSAGE"
git push origin v4.x.x-alpha

sleep 5s