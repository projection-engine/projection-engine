import PropTypes from "prop-types";
import MeshView from "../views/mesh/MeshView";
import MaterialView from "../views/blueprints/material/MaterialView";
import ImageView from "../views/image/ImageView";
import BlueprintView from "../views/blueprints/scripts/BlueprintView";
import MinimalBlueprintView from "../views/blueprints/scripts/MinimalBlueprintView";

export default function TabSelector(props) {
    const {
        file,
        index,
        setAlert,
        setFilesLoaded,
        currentTab,
        setCurrentTab,

        engine,
        id,
        quickAccess,
        filesLoaded
    } = props
    const getTab = (file, index) => {
        if (!file.isLevelBlueprint)
            switch (file.type) {
                case 'mesh':
                    return <MeshView file={file} setAlert={setAlert} index={index}/>
                case 'material':
                    return (
                        <MaterialView
                            index={index}
                            setAlert={setAlert}
                            submitPackage={(previewImage, pack, close) => {
                                quickAccess.fileSystem
                                    .updateAsset(file.registryID, pack, previewImage)
                                    .then(() => {
                                        setAlert({
                                            type: 'success',
                                            message: 'Saved'
                                        })
                                        if (close) {
                                            if ((currentTab) === index)
                                                setCurrentTab(filesLoaded.length - 1)
                                            setFilesLoaded(prev => {
                                                const newD = [...prev]
                                                newD.splice(index, 1)
                                                return newD
                                            })
                                        }
                                    })

                            }}
                            file={file}
                        />
                    )
                case 'image':
                    return <ImageView file={file}/>
                case 'flow':
                    return <BlueprintView
                        index={index}
                        file={file}
                        submitPackage={(pack, close) => {
                            quickAccess.fileSystem
                                .updateAsset(file.registryID, pack)
                                .then(() => {
                                    setAlert({
                                        type: 'success',
                                        message: 'Saved'
                                    })
                                    if (close) {
                                        if ((currentTab) === index)
                                            setCurrentTab(filesLoaded.length - 1)
                                        setFilesLoaded(prev => {
                                            const newD = [...prev]
                                            newD.splice(index, 1)
                                            return newD
                                        })
                                    }
                                })

                        }}
                        setAlert={setAlert}/>
                default:
                    return null
            }
        else
            return (
                <MinimalBlueprintView
                    index={index}
                    name={'Level Blueprint'}
                    id={id}
                    engine={engine}
                    submitPackage={(pack, close) => {

                        quickAccess.fileSystem
                            .createFile('levelBlueprint.flow', pack)
                            .then(() => {
                                setAlert({
                                    type: 'success',
                                    message: 'Saved'
                                })
                                if (close) {
                                    if ((currentTab) === index)
                                        setCurrentTab(filesLoaded.length - 1)
                                    setFilesLoaded(prev => {
                                        const newD = [...prev]
                                        newD.splice(index, 1)
                                        return newD
                                    })
                                }
                            })
                    }}
                    setAlert={setAlert}
                />
            )
    }
    return getTab(file, index)
}

TabSelector.propTypes = {
    file: PropTypes.object,
    index: PropTypes.number,
    setAlert: PropTypes.func,
    setFilesLoaded: PropTypes.func,
    currentTab: PropTypes.number,
    setCurrentTab: PropTypes.func,

    engine: PropTypes.object,
    id: PropTypes.string,
    quickAccess: PropTypes.object,
    filesLoaded: PropTypes.array
}