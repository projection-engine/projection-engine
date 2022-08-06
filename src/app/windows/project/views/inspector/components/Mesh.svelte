<script>
    import FileSystem from "../../../libs/FileSystem"
    import handleDrop from "../../../libs/importer/import"
    import Selector from "../../../../../components/selector/Selector.svelte";
    import FALLBACK_MATERIAL from "../../../libs/engine/data/FALLBACK_MATERIAL";
    import MaterialInstance from "../../../libs/engine/libs/instances/MaterialInstance";
    import DataStoreController from "../../../stores/DataStoreController";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";


    export let selected
    export let submit
    export let translate
    const loadFile = async (src, type = "json") => {
        const rs = await window.fileSystem.readRegistryFile(src.registryID)
        if (rs) {
            const file = await window.fileSystem.readFile(window.fileSystem.path + FileSystem.sep + "assets" + FileSystem.sep + rs.path, type)
            if (file)
                return file
            else {
                alert.pushAlert(
                    translate("ERROR_LOADING_FILE"),
                    "error"
                )
                return null
            }
        }
    }
</script>
<Accordion title={translate("MESH")}>

    <Selector
            selected={selected.meshID}
            type={"mesh"}
            handleChange={(src) => {
            let data = window.renderer.meshes.get(src.registryID)
            if (!data)
                handleDrop(src.registryID,  "meshID")
                    .then(() => {
                        submit(src.registryID,  "meshID")
                    })
            else
                submit(src.registryID,  "meshID")
        }}
    />
    <Selector
            selected={selected.materialID}
            type={"material"}
            handleChange={async src => {
            if (src) {
                const file = await loadFile(src)
                if (file && file.response){
                    const exists = DataStoreController.engine.materials.find(m => m.id === src.registryID)
                    if (!exists) {
                        let newMat
                        await new Promise(resolve => {
                            newMat = new MaterialInstance({
                                id: src.registryID,
                                onCompiled:() => resolve(),
                                settings: file.response.settings,
                                vertex: file.response.vertexShader,
                                fragment: file.response.shader,
                                uniformData: file.response.uniformData
                            })
                        })
                        const newMaterials = [...DataStoreController.engine.materials, newMat]
                        DataStoreController.updateEngine({...DataStoreController.engine, materials: newMaterials})
                        alert.pushAlert(translate("MATERIAL_LOADED"), "success")
                        window.renderer.materials = newMaterials
                    }
                    submit(src.registryID, "materialID")
                }
            } else
              submit(FALLBACK_MATERIAL, "materialID")


        }}
    />

</Accordion>