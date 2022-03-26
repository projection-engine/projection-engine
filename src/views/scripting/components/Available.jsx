import {useRef, useState} from "react";
import styles from '../styles/Available.module.css'
import {Button, ToolTip} from "@f-ui/core";

import {allNodes} from "../templates/AllNodes";


export default function Available() {
    const [hidden, setHidden] = useState(true)
    const ref = useRef()
    return (
        <div ref={ref} className={styles.wrapper} style={{width: hidden ? '35px' : undefined}}>
            <Button
                variant={'minimal-horizontal'}
                onClick={() => {
                    ref.current.previousSibling.style.width = '100%'
                    setHidden(!hidden)
                }}
                className={styles.button}
                styles={{
                    flexDirection: hidden ? 'column' : undefined,
                    justifyContent: hidden ? 'center' : 'flex-start',

                }}>
                <div className={'material-icons-round'}
                     style={{transform: hidden ? 'rotate(180deg)' : undefined}}>chevron_right
                </div>
                <div style={{
                    textOrientation: hidden ? 'mixed' : undefined,
                    writingMode: hidden ? 'vertical-rl' : undefined,
                    transform: hidden ? 'rotate(180deg)' : undefined
                }}>
                    Available nodes
                </div>
            </Button>

            <div className={styles.content}>
                {hidden ? null : allNodes.map(d =>(
                    <div
                        className={styles.option}
                        draggable={true}
                        onDragStart={e => e.dataTransfer.setData('text', d.dataTransfer)}>
                        <div className={styles.icon}>
                            {d.icon}
                        </div>
                        {d.label}
                        <ToolTip content={d.tooltip} align={'middle'} justify={'start'}/>
                    </div>
                ))}

            </div>
        </div>
    )
}
