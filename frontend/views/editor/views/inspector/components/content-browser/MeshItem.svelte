<script>
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import AssetAPI from "../../../../lib/fs/AssetAPI";
    import GPU from "../../../../../../../engine-core/GPU";
    import PrimitiveProcessor from "../../../../../../../engine-core/lib/math/PrimitiveProcessor";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import GPUAPI from "../../../../../../../engine-core/lib/rendering/GPUAPI";
    import FS from "../../../../../../lib/FS/FS";
    import AlertController from "../../../../../../components/alert/AlertController";

    export let item
    let wasUpdated = false

    const updateAsset = async () => {
        wasUpdated  = true

        const data = await FilesAPI.readFile(FS.ASSETS_PATH  + item.id, "json")
        if (!data) return
        data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
        data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)


        await AssetAPI.updateAsset(item.registryID, JSON.stringify(data))
        if (GPU.meshes.get(item.registryID) != null) {
            GPUAPI.destroyMesh(item.registryID)
            GPUAPI.allocateMesh(item.registryID, data)
        }
        AlertController.log(LOCALIZATION_EN.UPDATING_ASSET)
    }
</script>

<button on:click={() => updateAsset()} disabled={wasUpdated}>
    {LOCALIZATION_EN.REGENERATE_NORMALS_AND_TANGENTS}
</button>

