import useDirectState from "../../../../components/hooks/useDirectState"


export default function useHotKeysHelper(){
    const [shortcuts] = useDirectState({all: [], active: {}})
    return shortcuts
}