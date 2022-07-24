import styles from "./styles/ContentBrowser.module.css"
import React, {useDeferredValue, useMemo, useState} from "react"
import SideBar from "./components/SideBar"
import Files from "./components/Files"
import ControlBar from "./components/ControlBar"
import useContentBrowser from "./hooks/useContentBrowser"
import ResizableBar from "../../../components/resizable/ResizableBar"
import FileSystem from "../../libs/FileSystem"
import PropTypes from "prop-types"
import Header from "../../../components/view/components/Header"
import useLocalization from "../../../global/useLocalization"

export default function ContentBrowser(props) {
    const hook = useContentBrowser()
    const [selected, setSelected] = useState([])
    const [fileType, setFileType] = useState()
    const [searchString, setSearchString] = useState("")
    const [view, setView] = useState({
        sideBar: true,
        navigation: true
    })
    const search = useDeferredValue(searchString)
    const path = useMemo(() => {
        const findParent = (node) => {
            const p = hook.items.find(n => n.id === node.parent)
            return p ? [findParent(p), {name: p.name, path: p.id}] : []
        }
        const response = [{
            path: FileSystem.sep
        }, findParent(hook.currentDirectory)].flat(Number.POSITIVE_INFINITY)
        if (hook.currentDirectory.name)
            response.push({
                name: hook.currentDirectory.name,
                path: hook.currentDirectory.id
            })
        return response
    }, [hook.currentDirectory, hook.items])
    const translate = useLocalization("PROJECT", "FILES")
    return (
        <>
            <Header {...props} title={translate("TITLE")} icon={"folder"}>
                <ControlBar
                    translate={translate}
                    setSelected={setSelected}
                    selected={selected}
                    fileType={fileType}
                    setFileType={setFileType}
                    searchString={searchString}
                    setSearchString={setSearchString}
                    hook={hook}
                    path={path}
                    view={view}
                    setView={setView}
                />
            </Header>
            {props.hidden ?
                null :
                <div className={styles.wrapper}>
                    {view.sideBar ? <SideBar translate={translate} hook={hook}/> : null}
                    <ResizableBar type={"width"}/>
                    <Files
                        translate={translate}
                        setSearchString={setSearchString}
                        fileType={fileType}
                        setFileType={setFileType}
                        hook={hook}
                        searchString={search}
                        setSelected={setSelected}
                        selected={selected}
                    />
                </div>
            }
        </>
    )
}

ContentBrowser.propTypes = {
    hidden: PropTypes.bool,
    switchView: PropTypes.func,
    orientation: PropTypes.string,
}