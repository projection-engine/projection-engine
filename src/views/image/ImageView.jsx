import PropTypes from "prop-types";
import {useContext, useEffect, useRef, useState} from "react";
import DatabaseProvider from "../../components/db/DatabaseProvider";
import LoadProvider from "../editor/hook/LoadProvider";
import QuickAccessProvider from "../../components/db/QuickAccessProvider";
import styles from './styles/ImageView.module.css'
import ResizableBar from "../../components/resizable/ResizableBar";
import ControlProvider from "../../components/tabs/components/ControlProvider";
import handleBoardScroll from "../material/utils/handleBoardScroll";
import ControlBar from "./components/ControlBar";

export default function ImageView(props) {
    const database = useContext(DatabaseProvider)
    const load = useContext(LoadProvider)
    const quickAccess = useContext(QuickAccessProvider)
    const ref = useRef()
    const [scale, setScale] = useState(1)
    const toolBarContext = useContext(ControlProvider)
    useEffect(() => {
        toolBarContext.setOptions([
            {
                label: 'Save',

                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save</span>,
                onClick: () => {

                }
            },
            {
                label: 'Save & close',
                icon: <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>save_alt</span>,
                onClick: () => {

                }
            }
        ])
    }, [scale])


    const handleWheel = (event) => {
        event.preventDefault()
        let v
        if (event.wheelDelta) {
            v = event.wheelDelta > 0;
        } else
            v = event.deltaY < 0


        if ((scale > .2 && v)) {
            setScale(scale - .1)
        } else if (scale < 5 && !v) {
            setScale(scale + .1)
        }

    }
    useEffect(() => {
        ref.current?.addEventListener('wheel', handleWheel)
        return () => {
            ref.current?.removeEventListener('wheel', handleWheel)
        }
    }, [scale])

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.imageWrapper}
                ref={ref} onMouseDown={e => {
                handleBoardScroll(e.currentTarget, e)
            }}>
                <img draggable={false} style={{transform: 'scale(' + scale + ')'}} className={styles.image}
                     src={props.file.blob} alt={'Image'}/> :
            </div>
            <ResizableBar type={'width'}/>
            <ControlBar />
        </div>
    )
}

ImageView.propTypes = {
    file: PropTypes.object,

}