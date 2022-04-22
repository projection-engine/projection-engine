import {useEffect, useRef} from "react";

export default function usePreview(path){
    const ref = useRef()

    useEffect(() => {
        try {
            if(ref.current)
                fetch(path)
                    .then(async res => {
                        ref.current.src = await res.text()
                    }).catch()
        } catch (e) {
            console.log(e)
        }
    }, [path])

    return ref
}