import PropTypes from "prop-types";
import styles from './styles/Viewport.module.css'
import {useContext, useEffect, useRef, useState} from "react";
import GPUContextProvider from "./hooks/GPUContextProvider";
import ContextMenu from "./components/ContextMenu";
import {ContextWrapper} from "@f-ui/core";

export default function Viewport(props) {
    const ref = useRef()
    const {bindGPU} = useContext(GPUContextProvider)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (visible)
            bindGPU(ref.current.parentNode)
    }, [visible])
    useEffect(() => {
        const obs = new IntersectionObserver((e) => setVisible(e[0]?.isIntersecting))
        obs.observe(ref.current.parentNode)
        return () => obs.disconnect()
    }, [])
    return (
        <ContextWrapper
            wrapperClassName={styles.context}
            attributes={{
                onDragOver: e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.add(styles.hovered)
                    }
                },
                onDragLeave: e => {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                },
                onDrop: e => {
                    if (props.allowDrop) {
                        e.preventDefault()
                        ref.current?.classList.remove(styles.hovered)
                        props.handleDrop(e)
                    }
                }
            }}
            triggers={['data-self']}
            className={styles.viewport}
            content={() => <ContextMenu options={props.options} engine={props.engine}/>}
        >
            <span style={{display: 'none'}} ref={ref}/>
        </ContextWrapper>
    )
}

Viewport.propTypes = {
    options: PropTypes.array,
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    engine: PropTypes.object,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}