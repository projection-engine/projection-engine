import {useEffect, useState} from "react";

export default function useGlobalOptions() {
    const [dark, setDark] = useState(true)
    const [accentColor, setAccentColor] = useState('#0095ff')

    useEffect(() => {
        const local =  localStorage.getItem('dark')
        setDark(local === '0'  || !local ? 'dark' : 'light')
        const c = localStorage.getItem('color')
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
