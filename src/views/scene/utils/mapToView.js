import getElementIcon from "./getElementIcon";
import getElementType from "./getElementType";
import React from "react";
import {ENTITY_ACTIONS} from "../../../services/utils/entityReducer";

export default function mapToView(current, entities, setSelected, engine, setAllHidden) {
    const children = entities.filter(f => f.linkedTo === current.id)
    return {
        id: current.id,
        label: current.name,
        onClick: (e) => {
            setSelected(current.id, e)
        },
        children: children.map(f => mapToView(f, entities, setSelected, engine, setAllHidden )),
        icon: getElementIcon(current.components),
        type: getElementType(current.components),

        onHide: () => {
            if (!current.active && setAllHidden)
                setAllHidden(false)
            engine.dispatchEntities({
                type: ENTITY_ACTIONS.UPDATE, payload: {
                    entityID: current.id,
                    data: !current.active,
                    key: 'active'
                }
            })

            children.forEach(c => {
                engine.dispatchEntities({
                    type: ENTITY_ACTIONS.UPDATE, payload: {
                        entityID: c.id,
                        data: !c.active,
                        key: 'active'
                    }
                })
            })
        },
        canBeHidden:setAllHidden !== undefined,
        hidden: !current.active

    }
}