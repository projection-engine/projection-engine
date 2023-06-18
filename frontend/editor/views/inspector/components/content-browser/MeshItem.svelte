<script>

    import FSAssetUtil from "../../../../services/file-system/FSAssetUtil"
    import GPU from "../../../../../../engine-core/GPU"
    import PrimitiveProcessor from "../../../../../../engine-core/lib/math/PrimitiveProcessor"
    import FSFilesService from "../../../../services/file-system/FSFilesService"
    import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI"
    import FileSystemService from "../../../../../shared/lib/FileSystemService"
    import ToastNotificationSystem from "../../../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../../shared/LocalizationEN"

    export let item
    let wasUpdated = false

    const updateAsset = async () => {
    	wasUpdated = true

    	const data = await FSFilesService.readFile(FileSystemService.getInstance().ASSETS_PATH + item.id, "json")
    	if (!data) return
    	data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
    	data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)


    	await FSAssetUtil.updateAsset(item.registryID, JSON.stringify(data))
    	if (GPU.meshes.get(item.registryID) != null) {
    		GPUAPI.destroyMesh(item.registryID)
    		GPUAPI.allocateMesh(item.registryID, data)
    	}
    	ToastNotificationSystem.getInstance().log(LocalizationEN.UPDATING_ASSET)
    }
</script>

<button data-sveltebuttondefault="-" on:click={() => updateAsset()} disabled={wasUpdated}>
    {LocalizationEN.REGENERATE_NORMALS_AND_TANGENTS}
</button>

