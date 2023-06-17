<script>

    import FSAssetService from "../../../../services/fs/FSAssetService"
    import GPU from "../../../../../../engine-core/GPU"
    import PrimitiveProcessor from "../../../../../../engine-core/lib/math/PrimitiveProcessor"
    import FSFilesService from "../../../../services/fs/FSFilesService"
    import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI"
    import FS from "../../../../../shared/lib/FS/FS"
    import AlertController from "../../../../../shared/components/alert/AlertController"
    import LocalizationEN from "../../../../../../contants/LocalizationEN"

    export let item
    let wasUpdated = false

    const updateAsset = async () => {
    	wasUpdated = true

    	const data = await FSFilesService.readFile(FS.ASSETS_PATH + item.id, "json")
    	if (!data) return
    	data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
    	data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)


    	await FSAssetService.updateAsset(item.registryID, JSON.stringify(data))
    	if (GPU.meshes.get(item.registryID) != null) {
    		GPUAPI.destroyMesh(item.registryID)
    		GPUAPI.allocateMesh(item.registryID, data)
    	}
    	AlertController.log(LocalizationEN.UPDATING_ASSET)
    }
</script>

<button data-sveltebuttondefault="-" on:click={() => updateAsset()} disabled={wasUpdated}>
    {LocalizationEN.REGENERATE_NORMALS_AND_TANGENTS}
</button>

