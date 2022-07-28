import PropTypes from "prop-types"
import styles from "../styles/Forms.module.css"
import {Checkbox, Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React, {useEffect} from "react"
import AccordionTemplate from "../../../../views/accordion/AccordionTemplate"
import Range from "../../../../views/range/Range"
import useDirectState from "../../../../views/hooks/useDirectState"


export default function Probe(props) {
    const getNewState = () => {
        return {
            resolution: props.selected.resolution, 
            mipmaps: props.selected.mipmaps,
            radius: props.selected.radius,

            xR: props.selected.multiplier[0],
            yR: props.selected.multiplier[1],
            zR: props.selected.multiplier[2],
            specularProbe: props.selected.specularProbe
        }
    }
    const [state,,dispatchBlock] = useDirectState(getNewState())
    useEffect(() => {
        dispatchBlock(getNewState())
    }, [props.selected])
    const checkIcon = <Icon styles={{fontSize: "1.2rem"}}>check</Icon>
    return (
        <>
            <Checkbox
                noMargin={true} 
                checked={state.specularProbe}
                label={"Specular probe"}
                height={"35px"}
                width={"100%"}
                handleCheck={() => {
                    const v = !state.specularProbe
                    state.specularProbe = v
                    props.selected.specularProbe = v
                }}/>
            <AccordionTemplate title={"Resolution"}>
                <Dropdown className={styles.dropdown} disabled={!state.specularProbe} styles={{background: "var(--pj-border-primary)"}}>
                    {state.resolution}p
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: "128p",
                            icon: state.resolution === 128 ?
                                checkIcon : undefined,
                            onClick: () => {
                                state.resolution = 128
                                props.selected.resolution = 128
                            }
                        }}/>
                        <DropdownOption option={{
                            label: "512p",
                            icon: state.resolution === 512 ?
                                checkIcon : undefined,
                            onClick: () => {
                                state.resolution = 512
                                props.selected.resolution = 512
                            }
                        }}/>
                        <DropdownOption option={{
                            label: "1024p",
                            icon: state.resolution === 1024 ?
                                checkIcon : undefined,
                            onClick: () => {
                                state.resolution = 1024
                                props.selected.resolution = 1024
                            }
                        }}/>
                        <DropdownOption option={{
                            label: "2048p",
                            icon: state.resolution === 2048 ?
                                checkIcon : undefined,
                            onClick: () => {
                                state.resolution = 2048
                                props.selected.resolution = 2048
                            }
                        }}/>
                    </DropdownOptions>
                </Dropdown>
            </AccordionTemplate>
            
            <Range
                label={"LOD"}
                integer={true}
                disabled={!state.specularProbe}
                incrementPercentage={1}
                minValue={1}
                maxValue={10}
                onFinish={(v) => {
                    props.submit(v, "mipmaps")
                    state.mipmaps = v
                }}
                value={state.mipmaps}
            />
    
            <AccordionTemplate title={"Multiplier"}>
                <Range
                    label={"R"}
                    variant={"embedded"}
                    minValue={0}
                    onFinish={(v) => {
                        props.selected.multiplier[0] = v
                        state.xR = v
                    }}
                    handleChange={v => props.selected.multiplier[0] = v}
                    value={state.xR}
                />
                <Range
                    label={"G"}
                    variant={"embedded"}
                    minValue={0}
                    onFinish={(v) => {
                        props.selected.multiplier[1] = v
                        state.yR = v
                    }}
                    handleChange={v => props.selected.multiplier[1] = v}
                    value={state.yR}
                />
                <Range
                    label={"B"}
                    variant={"embedded"}
                    minValue={0}
                    onFinish={(v) => {
                        props.selected.multiplier[2] = v
                        state.zR = v
                    }}
                    handleChange={v => props.selected.multiplier[2] = v}
                    value={state.zR}
                />
            </AccordionTemplate>

        </>
    )
}
Probe.propTypes = {
    selected: PropTypes.object,
    submit: PropTypes.func
}
