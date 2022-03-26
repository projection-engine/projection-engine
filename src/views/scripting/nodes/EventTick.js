import Node from "../../../components/flow/Node";
import {TYPES} from "../templates/TYPES";
import NODE_TYPES from "../templates/NODE_TYPES";

export default class EventTick extends Node {
    tick = 0
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