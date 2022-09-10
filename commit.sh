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



cd public/engine
git add --all
git commit -m "$MESSAGE"
git push origin v4.2.x-alpha

cd ../../
git add --all
git commit -m "$MESSAGE"
git push origin v4.2.x-alpha

sleep 5s