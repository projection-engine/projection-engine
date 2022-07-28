import React, {useContext, useMemo} from "react"
import styles from "../styles/Attribute.module.css"
import PropTypes from "prop-types"
import Material from "../templates/nodes/Material"

import {TextField} from "@f-ui/core"

import ColorPicker from "../../../../views/color/ColorPicker"
import getNodeInput from "../utils/getNodeInput"
import UpdateNodeProvider from "../context/UpdateNodeProvider"
import useLocalization from "../../../../global/useLocalization"

export default function AttributeEditor(props) {
    const selected = useMemo(() => {
        const index = props.hook.nodes.findIndex(n => (props.selected ? n.id === props.selected : n instanceof Material))
        return props.hook.nodes[index]
    }, [props.hook.selected, props.selected, props.hook.nodes])

    const {updateNode, submitNodeVariable} = useContext(UpdateNodeProvider)
    const translate = useLocalization("PROJECT", "SHADER_EDITOR")

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.wrapper}>
                <TextField
                    value={selected.name} width={"100%"}
                    height={"30px"}
                    handleChange={ev => updateNode("name", ev, selected)}
                    label={translate("NAME")}
                    placeholder={translate("NAME")}
                />

                {selected.inputs
                    .map((attr, i) => !attr.accept ? (
                        <React.Fragment key={attr.label + "-attribute-" + i}>
                            {getNodeInput(attr, selected, (...attrData) => submitNodeVariable(...attrData, selected))}
                        </React.Fragment>
                    ) : null)}
                {selected.isComment ? (
                    <>
                        <label>Color</label>
                        <ColorPicker
                            submit={(_, arr) => {
                                updateNode("color", [...arr, .5], selected)
                            }}
                            value={selected.color}
                            size={"small"}
                        />
                    </>
                ) : null}
            </div>
        </div>
    )
}

AttributeEditor.propTypes = {
    selected: PropTypes.string,
    hook: PropTypes.object
}