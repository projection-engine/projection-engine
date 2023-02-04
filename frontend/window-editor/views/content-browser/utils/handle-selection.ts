import SelectionStore from "../../../../shared/stores/SelectionStore";
import MutableObject from "../../../../../engine-core/static/MutableObject";

export default function handleSelection(e:MouseEvent, child:MutableObject){
    let toSelect = []
    if (e) {
        if (e.ctrlKey)
            toSelect = [...SelectionStore.contentBrowserSelected, child.id]
        else
            toSelect = [child.id]
    }
    SelectionStore.contentBrowserSelected = toSelect
}