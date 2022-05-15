import PropTypes from "prop-types";
import MeshView from "../mesh/MeshView";
import MaterialView from "../../components/blueprints/material/MaterialView";
import ImageView from "../image/ImageView";
import BlueprintView from "../../components/blueprints/scripts/BlueprintView";
import MinimalBlueprintView from "../../components/blueprints/scripts/MinimalBlueprintView";
import UI from "../ui/UI";
import FILE_TYPES from "../../../../public/glTF/FILE_TYPES";

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
    const submitPackage = (pack, close, previewImage, isLevel) => {
        quickAccess.fileSystem
            .updateAsset(isLevel ? '\\levelBlueprint'+FILE_TYPES.SCRIPT : file.registryID, pack, previewImage)
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
    }
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
                            submitPackage={submitPackage}
                            file={file}
                        />
                    )
                case 'image':
                    return <ImageView file={file}/>
                case 'ui':
                    return <UI setAlert={setAlert} file={file} submitPackage={submitPackage} index={index} />
                case 'flow':
                    return <BlueprintView
                        index={index}
                        file={file}
                        submitPackage={submitPackage}
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
                    submitPackage={(pack, close) => submitPackage(pack, close, undefined, true)}
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