import React, {useMemo, useState} from "react";
import styles from '../styles/NodeEditor.module.css'
import PropTypes from "prop-types";

import {
    Accordion,
    AccordionSummary,
    Button,
    Checkbox,
    DataRow,
    Dropdown,
    DropdownOption,
    DropdownOptions,
    List,
    Sort,
    TextField,
    useListData,
} from "@f-ui/core";
import Range from "../../../components/range/Range";
import {TYPES} from "../../../components/flow/TYPES";
import randomID from "../../../services/utils/misc/randomID";
import Getter from "../nodes/Getter";
import {startKey} from "../nodes/Setter";
import TreeView from "../../../components/tree/TreeView";
import deleteNode from "../../../components/flow/utils/deleteNode";

export default function Structure(props) {
    const {
        selectedVariable, setSelectedVariable
    } = props
    const getName = (prev) => {
        let n = 'New Variable'
        let it = 0

        while (prev.filter(e => e.name === n).length > 0) {
            it++
            n = 'New Variable' + `(${it})`
        }

        return n
    }


    const getType = (t) => {
        switch (t) {
            case TYPES.VEC2:
                return 'Vector 2D'
            case TYPES.VEC3:
                return 'Vector 3D'
            case TYPES.VEC4:
                return 'Vector 4D'
            case TYPES.NUMBER:
                return 'Number'
            case TYPES.BOOL:
                return 'Boolean'
            default:
                break
        }
    }
    const mappedVariables = useMemo(() => {
        return props.hook.variables.map(v => {
            return {
                ...v,
                type: getType(v.type),
                label: v.name,
                onClick: () => {
                    setSelectedVariable(v.id)

                    props.hook.setSelected(props.hook.nodes.filter(nn => nn.id.includes(v.id)).map(nn => nn.id))
                },
                attributes: {'data-var': v.id}
            }
        })
    }, [props.hook.variables])


    return (
        <div className={styles.wrapper} style={{width: '275px'}}>

            <div className={styles.header}>
                Variables
                <Button className={styles.addButton} variant={'outlined'} onClick={() => {
                    props.hook.setVariables(prev => {
                        return [...prev, {
                            id: randomID(),
                            name: getName(prev),
                            type: TYPES.NUMBER
                        }]
                    })
                }}>
                    <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>add</span>
                </Button>
            </div>

            <TreeView
                options={[{
                    requiredTrigger: 'data-var',
                    onClick: (n) => {

                        setSelectedVariable(undefined)
                        const allN = props.hook.nodes.filter(nn => nn.id.includes(n.getAttribute('data-var')))
                        allN.forEach(nn => {
                            deleteNode(nn.id, props.hook, ()=>null)
                        })
                        props.hook.setVariables(p => {
                            return p.filter(pp => pp.id !== n.getAttribute('data-var'))
                        })
                    },
                    label: 'Delete variable',
                    icon: <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>delete_forever</span>
                }]}
                contextTriggers={[
                    'data-var'
                ]}
                nodes={mappedVariables}
                selected={[selectedVariable]}

                handleRename={() => null}
            />
        </div>
    )
}

Structure.propTypes = {
    selectedVariable: PropTypes.string,
    setSelectedVariable: PropTypes.func,
    selected: PropTypes.string,
    hook: PropTypes.object
}