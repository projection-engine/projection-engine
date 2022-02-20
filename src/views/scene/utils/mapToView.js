import getElementIcon from "./getElementIcon";
import getElementType from "./getElementType";
import React from "react";
import {ENTITY_ACTIONS} from "../../../services/engine/utils/entityReducer";
import cloneClass from "../../../services/utils/misc/cloneClass";

export default function mapToView(current, entities, setSelected, engine) {
    const children = entities.filter(f => f.linkedTo === current.id)
    return {
        id: current.id,
        label: current.name,
        onClick: (e) => {
            setSelected(current.id, e)
        },
        children: children.map(f => mapToView(f, entities, setSelected, engine)),
        icon: getElementIcon(current.components),
        type: getElementType(current.components),
        controlOption: {
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1rem'}}>{current.active ? 'visibility' : 'visibility_off'}</span>,
            onClick: () => {
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
            }
        }
    }
}