import Node from "../../../../components/flow/Node";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";
import {KEYS} from "../../../../services/hooks/useHotKeys";


export default class KeyPress extends Node {

    constructor() {
        super(
            [
                {
                    label: 'Key',
                    key: 'key',
                    type: TYPES.OPTIONS,
                    bundled: true,
                    options: Object.keys(KEYS).map(k => {
                        return {
                            value: KEYS[k],
                            label: KEYS[k] + ' - Key',
                        }
                    })
                },
            ],
            [
                {label: 'Pressed', key: 'pressed', type: TYPES.EXECUTION, showTitle: true},
                {label: 'Released', key: 'Released', type: TYPES.EXECUTION, showTitle: true}
            ]);
        this.name = 'KeyPress'
    }

    get type() {
        return NODE_TYPES.START_POINT
    }

    static compile(_, obj, nodeID, executors, keys, state = {}, setState) {
        const isClicked = keys[executors[nodeID].key]

        if (isClicked) {
            setState(true, 'wasClicked')
            return obj.branch0
        } else if (state.wasClicked) {
            setState(false, 'wasClicked')
            return obj.branch1
        }
        return []
    }
}