import {allNodes} from "../templates/AllNodes";
import styles from "../../../components/flow/styles/Board.module.css";
import Getter from "../nodes/utils/Getter";
import randomID from "../../../services/utils/misc/randomID";
import Setter from "../nodes/utils/Setter";
import React from "react";

export default function getAvailableNodes(hook){
    return [...allNodes, ...hook.variables.map(v => {
        return [
            {
                label: <label className={styles.label}>Getter - {v.name}</label>,
                dataTransfer: JSON.stringify({
                    key: v.id,
                    type: 'getter'
                }),
                getNewInstance: () => new Getter(v.id + '/getter/' + randomID(), v.name + ' - Getter', v.type)
            },
            {
                label: <label className={styles.label}>Setter - {v.name}</label>,
                dataTransfer: JSON.stringify({
                    key: v.id,
                    type: 'setter'
                }),
                getNewInstance: () => new Setter(v.id + '/setter/' + randomID(), v.name + ' - Setter', v.type)
            }
        ]
    }).flat()]
}