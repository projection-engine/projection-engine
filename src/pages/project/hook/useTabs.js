import {useEffect, useMemo, useState} from "react";
import MaterialView from "../../../views/material/MaterialView";
import MeshView from "../../../views/mesh/MeshView";
import ImageView from "../../../views/image/ImageView";


export default function useTabs(    setAlert, quickAccess) {
    const fileSystem = quickAccess.fileSystem
    const [filesLoaded, setFilesLoaded] = useState([])
    const [currentTab, setCurrentTab] = useState(0)
    useEffect(() => {
        if (filesLoaded.length > 0)
            setCurrentTab(filesLoaded.length)
    }, [filesLoaded])

    const mapFile = (file, index, children, i) => {

        return {
            canClose: true,
            icon: <span style={{fontSize: '1.2rem'}}
                        className={`material-icons-round`}>{i}</span>,
            handleClose: () => {
                if (index === (currentTab + 1))
                    setCurrentTab(filesLoaded.length)
                setFilesLoaded(prev => {
                    const newD = [...prev]
                    newD.splice(index, 1)
                    return newD
                })
            },
            open: file !== undefined,
            label: file?.name,

            children: children
        }
    }
    const materials = useMemo(() => {
        return filesLoaded.filter(f => f.type === 'material').map((file, index) => mapFile(file, index, (
            <MaterialView
                setAlert={setAlert}
                submitPackage={(previewImage, pack, close) => {
                    fileSystem.readRegistryFile(file.registryID)
                        .then(res => {
                            if(res){
                                fileSystem
                                    .updateAsset(res.path, JSON.stringify(pack), previewImage)
                                    .then(() => {
                                        setAlert({
                                            type: 'success',
                                            message: 'Saved'
                                        })
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
                            }
                        })

                }}
                registryID={file.registryID}/>
        ), 'texture'))
    }, [filesLoaded])

    const meshes = useMemo(() => {
        return filesLoaded.filter(f => f.type === 'mesh').map((file, index) => mapFile(
            file,
            index,
            (
            <MeshView file={file} setAlert={setAlert}/>
        ), 'view_in_ar'))
    }, [filesLoaded])

    const images = useMemo(() => {
        return filesLoaded.filter(f => f.type === 'pimg').map((file, index) => mapFile(file, index, (
            <ImageView file={file}/>
        ), 'image'))
    }, [filesLoaded])

    return {
        meshes,
        materials,
        images,

        currentTab, setCurrentTab,
         setFilesLoaded
    }

}