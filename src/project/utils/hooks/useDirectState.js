import {useMemo, useState} from "react"

export default function useDirectState(initialState={}){
    const [state, setState] = useState(initialState)
    return [useMemo(() => {
        return new Proxy(state, {
                get(obj, key) {
                    return obj[key];
                },
                set(obj, key, value) {
                    setState(prev => {
                        return {
                            ...prev,
                            [key]: value
                        }
                    })
                    return true
                }
            }
        )
    }, [state]), () => setState({})]
}