import PropTypes from "prop-types"
import styles from "./styles/Viewport.module.css"
import React, {useContext, useEffect, useRef} from "react"
import GPUContextProvider from "./hooks/GPUContextProvider"
import useContextTarget from "../../../components/context/hooks/useContextTarget"
import RENDER_TARGET from "../../../static/misc/RENDER_TARGET"
import ViewportOptions from "./ViewportOptions"
import SideBar from "./components/SideBar"

const TRIGGERS = ["data-viewport"]
export default function Viewport(props) {
    const ref = useRef()
    const {bindGPU} = useContext(GPUContextProvider)
    // const [visible, setVisible] = useState(false)

    useEffect(() => {
        // if (visible)
        bindGPU(ref.current)
    }, [])
    // visible])
    // useEffect(() => {
    //     const obs = new IntersectionObserver((e) => setVisible(e[0]?.isIntersecting))
    //     obs.observe(ref.current.parentNode)
    //     return () => obs.disconnect()
    // }, [])
    useContextTarget({id: "viewport-wrapper", label: "Viewport", icon: "window"}, props.options, TRIGGERS)
    return (
        <div className={styles.wrapper}>
            <ViewportOptions
                engine={props.engine}
                executingAnimation={props.executingAnimation}
                id={props.id}
            />
            <div
                onDragOver={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.add(styles.hovered)
                    }
                }}
                onDragLeave={e => {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                }}
                onDrop={e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.remove(styles.hovered)
                        props.handleDrop(e)
                    }
                }}
   
                data-viewport={RENDER_TARGET}
                id={"viewport-wrapper"}
                className={styles.viewport}
            >
                <span style={{display: "none"}} ref={ref}/>
                <SideBar engine={props.engine}/>
            </div>
        </div>
    )
}

Viewport.propTypes = {
    options: PropTypes.array,
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    executingAnimation: PropTypes.bool,
    engine: PropTypes.object,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}