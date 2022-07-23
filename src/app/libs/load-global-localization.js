import EN from "../static/EnglishLocalization"

export default function loadGlobalLocalization(localization) {
    window.localization = {
        localization,
        translate(window, component, strToTranslate) {
            return EN[window][component][strToTranslate]
        }
    }
}