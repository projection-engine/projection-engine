<script>
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import AssetAPI from "../../../../libs/AssetAPI";
    import GPU from "../../../../../public/engine/GPU";
    import PrimitiveProcessor from "../../../../../public/engine/api/PrimitiveProcessor";
    import FilesAPI from "../../../../libs/FilesAPI";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPUAPI from "../../../../../public/engine/api/GPUAPI";

    export let item
    let wasUpdated = false

    const updateAsset = async () => {
        wasUpdated  = true

        const data = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + item.id, "json")
        if (!data) return
        data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
        data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)


        await AssetAPI.updateAsset(item.registryID, JSON.stringify(data))
        if (GPU.meshes.get(item.registryID) != null) {
            GPUAPI.destroyMesh(item.registryID)
            GPUAPI.allocateMesh(item.registryID, data)
        }
        alert.pushAlert(Localization.UPDATING_ASSET, "alert")
    }
</script>

<button on:click={() => updateAsset()} disabled={wasUpdated}>
    {Localization.REGENERATE_NORMALS_AND_TANGENTS}
</button>

