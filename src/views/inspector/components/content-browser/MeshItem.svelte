<script>
    import Localization from "../../../../libs/Localization";
    import AssetAPI from "../../../../libs/AssetAPI";
    import GPU from "../../../../../public/engine/production/GPU";
    import PrimitiveProcessor from "../../../../../public/engine/production/apis/PrimitiveProcessor";
    import FilesAPI from "../../../../libs/FilesAPI";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    export let item
    let wasUpdated = false

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    const updateAsset = async () => {
        wasUpdated  = true

        const data = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + item.id, "json")
        if (!data) return
        data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
        data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)
        console.log(data.normals)
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

