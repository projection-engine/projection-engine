import Node from "../../../components/flow/Node";
import {TYPES} from "../../../components/flow/TYPES";
import NODE_TYPES from "../../../components/flow/NODE_TYPES";


export default class EventTick extends Node {
    tick = 0
    canBeDeleted = false
    constructor() {
        super([], [{label: 'Tick', key: 'tick', type: TYPES.EXECUTION}]);
        this.name = 'EventTick'
    }

    get type (){
        return NODE_TYPES.TICK
    }

    compile() {
        this.ready = true
    }
}