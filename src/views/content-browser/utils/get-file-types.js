import FILE_TYPES from "shared-resources/FILE_TYPES";
import Localization from "../../../libs/Localization";

export default function getFileTypes() {
    const c = {...FILE_TYPES}
    return Object.keys(c).map(m => [m, Localization.PROJECT.FILES[m]]).filter(e => e[1] != null)

}