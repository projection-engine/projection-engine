import {useEffect, useState} from "react";

export default function useGlobalOptions() {
    const [dark, setDark] = useState(true)
    const [accentColor, setAccentColor] = useState('#0095ff')

    useEffect(() => {

        setDark( localStorage.getItem('dark') === '0')
        const c = localStorage.getItem('color')
        console.log(c)
        if (c)
            setAccentColor(c)


    }, [])

    return {
        dark, setDark: (d) => {
            localStorage.setItem('dark', `${d ? 0 : 1}`)
            setDark(d)

        },
        accentColor, setAccentColor: (d) => {
            localStorage.setItem('color', d)
            setAccentColor(d)
        }
    }
}
