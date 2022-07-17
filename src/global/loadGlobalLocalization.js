import EN from "./EN"

export default function loadGlobalLocalization(localization) {
    window.localization = {
        localization,
        translate(window, component, strToTranslate) {
            return EN[window][component][strToTranslate]
        }
    }
}