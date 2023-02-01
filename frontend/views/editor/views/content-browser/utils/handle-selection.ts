import SelectionStore from "../../../stores/SelectionStore";
import MutableObject from "../../../../../../engine-core/MutableObject";

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