import PropTypes from "prop-types"
import styles from "../styles/Forms.module.css"
import {Checkbox} from "@f-ui/core"
import React, {useContext, useEffect, useRef} from "react"
import Selector from "../../../../components/selector/Selector"
import Range from "../../../../components/range/Range"
import useDirectState from "../../../../components/hooks/useDirectState"
import ColorPicker from "../../../../components/color/ColorPicker"
import AccordionTemplate from "../../../../components/accordion/AccordionTemplate"
import {DATA_TYPES} from "../../../engine/data/DATA_TYPES"
import TextureInstance from "../../../engine/instances/TextureInstance"
import FileSystem from "../../../libs/FileSystem"
import QuickAccessProvider from "../../../context/QuickAccessProvider"
import handleDrop from "../../../libs/importer/import"


export default function Mesh(props) {
    const [state, clear] = useDirectState({})
    const lastID = useRef("")
    const quickAccess = useContext(QuickAccessProvider)

    useEffect(() => {
        if (!lastID.current || lastID.current !== props.entityID) {
            clear()
            state.currentMesh = quickAccess.meshes.find(mesh => mesh.registryID === props.selected.meshID)
            lastID.current = props.entityID
            const matSelected = props.engine.materials.find(m => m.id === props.selected.materialID)

            state.overrideMaterial = props.selected.overrideMaterial

            state.uniforms = matSelected && matSelected.uniforms ? matSelected.uniforms.map(u => {
                return {...u, value: props.selected.uniformValues[u.key]}
            }) : []
            state.currentMaterial = quickAccess.materials.find(i => i.registryID === props.selected.materialID)
        }
    }, [props.selected, props.entityID])

    const loadFile = async (src, type = "json") => {
        const rs = await window.fileSystem.readRegistryFile(src.registryID)
        if (rs) {
            const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + rs.path, type)
            if (file)
                return file
            else {
                alert.pushAlert( "error",
                    "Error loading file."
                )
                return null
            }
        }
    }
    const updateUniforms = (key, value, obj, submit, submitUniformList) => {
        const index = state.uniforms.findIndex(u => u.key === key)
        if (index > -1) {
            const copy = [...state.uniforms]
            copy[index] = {...obj, value}

            state.uniforms = copy
            if (submit) {
                const values = {}
                copy.forEach(c => {
                    if (c.type !== DATA_TYPES.TEXTURE)
                        values[c.key] = c.value
                })

                props.submit(values, "uniformValues")
            }

            if (submitUniformList)
                props.submit(copy, "uniforms")
        }
    }
    const getField = (obj) => {
        const {type, key, label, value} = obj
        switch (type) {
        case DATA_TYPES.INT:
        case DATA_TYPES.FLOAT:
            return (
                <Range
                    precision={type === DATA_TYPES.FLOAT ? 3 : 0}
                    maxValue={obj.max}
                    incrementPercentage={type === DATA_TYPES.FLOAT ? .001 : 1}
                    minValue={obj.min}
                    value={value ? value : 0}
                    onFinish={(v) => updateUniforms(key, v, obj, true)}
                    handleChange={v => updateUniforms(key, v, obj, false)}
                    label={label}
                />
            )
        case DATA_TYPES.VEC3:
            if (!obj.normalized)
                return (
                    <div className={styles.formWrapper}>
                        <Range
                            accentColor={"red"}
                            maxValue={obj.max}
                            minValue={obj.min}
                            onFinish={(v) => updateUniforms(key, [parseFloat(v), value[1], value[2]], obj, true)}
                            handleChange={v => updateUniforms(key, [parseFloat(v), value[1], value[2]], obj, false)}
                            value={value ? value[0] : 0}

                            label={"X"}
                        />
                        <Range
                            accentColor={"green"}
                            onFinish={(v) => updateUniforms(key, [value[0], parseFloat(v), value[2]], obj, true)}
                            handleChange={v => updateUniforms(key, [value[0], parseFloat(v), value[2]], obj, false)}
                            value={value ? value[1] : 0}

                            label={"Y"}
                        />
                        <Range
                            accentColor={"blue"}
                            maxValue={obj.max}
                            minValue={obj.min}
                            onFinish={(v) => updateUniforms(key, [value[0], value[1], parseFloat(v)], obj, true)}
                            handleChange={v => updateUniforms(key, [value[0], value[1], parseFloat(v)], obj, false)}
                            value={value ? value[2] : 0}

                            label={"Z"}
                        />
                    </div>
                )
            else
                return (
                    <ColorPicker
                        submit={(_, v) => updateUniforms(key, v.map(vv => vv / 255), obj, true)}
                        value={!value ? "rgb(0,0,0)" : `rgb(${value[0] * 255},${value[1] * 255},${value[2] * 255})`}/>
                )

        case DATA_TYPES.TEXTURE:
            return (
                <Selector
                    type={"image"}
                    findData={true}
                    handleChange={async src => {
                        if (src) {
                            const k = obj.format
                            const file = await loadFile(src, "string")
                            if (file) {
                                let texture
                                await new Promise(resolve => {
                                    texture = new TextureInstance(
                                        file,
                                        k.yFlip,

                                        window.gpu[k.internalFormat],
                                        window.gpu[k.format],
                                        true,
                                        false,
                                        window.gpu.UNSIGNED_BYTE,
                                        undefined,
                                        undefined,
                                        0,
                                        () => {
                                            resolve()
                                        }
                                    )
                                })

                                let index = state.uniforms.findIndex(u => u.key === key)
                                if (index > -1) {
                                    const copy = [...state.uniforms]
                                    copy[index] = {...obj, value: src.registryID}

                                    state.uniforms = copy

                                    const values = {}
                                    copy.forEach(c => {
                                        if (c.type !== DATA_TYPES.TEXTURE)
                                            values[c.key] = c.value
                                        else if (c.key === key)
                                            values[c.key] = texture.texture
                                    })

                                    index = state.uniforms.findIndex(u => u.key === key)
                                    if (index > -1) {
                                        const copy = [...state.uniforms]
                                        copy[index] = {...obj, value: src.registryID, modified: true}

                                        state.uniforms = copy
                                        props.submit(copy, "uniforms")
                                    }

                                    // updateUniforms(key, src.registryID, obj, false, false)
                                    // updateUniforms('modified', true, obj, false, true)


                                    props.submit(values, "uniformValues")
                                }

                            }
                        }
                    }}
                    selected={value}
                />
            )
        default:
            return null
        }
    }

    return (
        <>
            <Selector
                selected={state.currentMesh}
                type={"mesh"}
                handleChange={(src) => {
                    let data = window.renderer.meshes.get(src.registryID)
                    if (!data)
                        handleDrop(src.registryID,   props.engine,  true)
                            .then(() => {
                                props.submit(src.registryID, "meshID")
                            })
                    else {
                        props.submit(src.registryID, "meshID")
                    }
                }}
            />
            <Selector
                selected={state.currentMaterial}
                type={"material"}
                handleChange={async (src, clear, close) => {
                    if (src) {
                        const file = await loadFile(src)
                        if (file && file.response) {
                            props.submit({
                                blob: file.response,
                                id: src.registryID,
                                name: src.name
                            })
                            alert.pushAlert("Mesh loaded", "success")
                            state.uniforms = file.response.uniforms
                            state.currentMaterial = src
                        }
                        else {
                            alert.pushAlert("Error loading material", "error")
                            clear()
                        }
                    } else {
                        props.submit()
                        clear()
                        close()
                    }
                }}
            />
            {state.uniforms?.length > 0 ? 
                (
                    <Checkbox
                        noMargin={true}
                        label={"Override material uniforms"}
                        width={"100%"}
                        height={"25px"}
                        checked={state.overrideMaterial}
                        handleCheck={() => {
                            const s = !state.overrideMaterial
                            state.overrideMaterial = s
                            props.submit(s, "overrideMaterial")
                        }} styles={{background: "var(--pj-border-primary)"}}
                    />
                ) 
                : 
                null}
            {state.overrideMaterial && state.uniforms ? <div className={styles.divider}/> : undefined}
            {state.overrideMaterial && state.uniforms ?
                state.uniforms?.map((u, i) => (
                    <React.Fragment key={i + "-uniforms-mat"}>
                        <AccordionTemplate title={u.label}>
                            {getField(u)}
                        </AccordionTemplate>
                    </React.Fragment>
                ))
                : null}
        </>

    )
}
Mesh.propTypes = {
    engine: PropTypes.object,
    entityID: PropTypes.string,
    selected: PropTypes.object,
    submit: PropTypes.func,
}