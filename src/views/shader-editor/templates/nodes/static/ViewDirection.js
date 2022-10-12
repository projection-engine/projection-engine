import Node from "../Node"
import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES"
import NODE_TYPES from "../../../../../../public/engine/editor/libs/material-compiler/templates/NODE_TYPES"


export default class ViewDirection extends Node {

    constructor() {
        super([], [
            {label: "Coordinates", key: "viewDirection", type: DATA_TYPES.VEC3},
            {label: "X", key: "r", type: DATA_TYPES.FLOAT, color: "red"},
            {label: "Y", key: "g", type: DATA_TYPES.FLOAT, color: "green"},
            {label: "Z", key: "b", type: DATA_TYPES.FLOAT, color: "blue"}
        ])

        this.name = "ViewDirection"
        this.size = 1
    }

    get type() {
        return NODE_TYPES.STATIC
    }

    getFunctionCall(_, index, outputs) {
        let response = []

        outputs.forEach(o => {
            if(o === "viewDirection"){
                this.viewDirection = "viewDirection"
            }
            else if (!this[o]) {

                this[o] = o + `${index}`
                response.push(`float ${this[o]} = viewDirection.${o};`)
            }
        })

        return response.join("\n")
    }

}