import Range from "../../../../components/range/Range"
import useDirectState from "../../../../components/hooks/useDirectState"
import COMPONENTS from "../../../engine/data/COMPONENTS"
import React, {useEffect} from "react"
import styles from "../../component/styles/Forms.module.css"

export default function ViewportTab(){
    const [state] = useDirectState({})
    useEffect(() => {
        const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
        state.x= t[0]
        state.y= t[1]
        state.z= t[2]
    }, [])

    return (
        <>
            <label className={styles.label}>3D cursor position</label>
            <Range
                metric={"m"}
                accentColor={"red"}
                variant={"embedded"}
                label={"X"}
                value={state.x}
                precision={3}
                onFinish={e => state.x = e}
                incrementPercentage={.01}
                handleChange={e => {
                    const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [e, t.translation[1], t.translation[2]] 
                }}
            />
            <Range
                metric={"m"}
                accentColor={"#00ff00"}
                label={"Y"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.y}
                onFinish={e => state.y = e}
                handleChange={e => {
                    const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [t.translation[0], e, t.translation[2]]
                }}
            />
            <Range
                metric={"m"}
                accentColor={"blue"}
                label={"Z"}
                variant={"embedded"}
                precision={3}
                incrementPercentage={.01}
                value={state.z}
                onFinish={e => state.z = e}
                handleChange={e => {
                    const t = window.renderer.cursor.components[COMPONENTS.TRANSFORM]
                    t.translation = [ t.translation[0], t.translation[1], e]
                }}
            />
        </>
    )
}