<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import TEXTURE_FORMATS from "../../../../../../../public/engine/static/texture/TEXTURE_FORMATS";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../../public/engine/production/GPU";
    import TEXTURE_FILTERING from "../../../../../../../public/engine/static/texture/TEXTURE_FILTERING";
    import TEXTURE_WRAPPING from "../../../../../../../public/engine/static/texture/TEXTURE_WRAPPING";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import PrimitiveProcessor from "../../../../../../backend/libs/gltf/instances/PrimitiveProcessor";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FilesStore from "../../../../stores/FilesStore";
    import FILE_TYPES from "../../../../../../static/FILE_TYPES";

    export let item
    let wasUpdated = false

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    const updateAsset = async () => {
        wasUpdated  = true

        const data = await FilesAPI.readFile(FilesStore.ASSETS_PATH + item.id, "json")
        if (!data) return
console.log(data)
        data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices)
        data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals)

        alert.pushAlert(translate("UPDATING_ASSET"), "alert")
        await AssetAPI.updateAsset(item.registryID, JSON.stringify(data))
        if (GPU.meshes.get(item.registryID) != null) {
            alert.pushAlert(translate("ALLOCATING_MESH"), "alert")
            GPU.destroyMesh(item.registryID)
            GPU.allocateMesh(item.registryID, data)
        }

    }
</script>

<button on:click={() => updateAsset()} disabled={wasUpdated}>
    {translate("REGENERATE_NORMALS_AND_TANGENTS")}
</button>

