import {useCallback, useContext, useMemo} from "react"
import LocalizationProvider from "./LocalizationProvider"
import EnglishLocalization from "./EN"


export default function useLocalization(window, component){
    const translation = useContext(LocalizationProvider)
    const translationData = useMemo(() => {
        return EnglishLocalization[window][component]
    }, [translation])
    return useCallback(strToTranslate => {
        return translationData[strToTranslate]
    }, [translationData])
}
