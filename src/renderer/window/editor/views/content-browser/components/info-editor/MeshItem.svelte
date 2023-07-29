<script>

    import GPU from "../../../../../../engine/core/GPU"
    import PrimitiveProcessor from "../../../../../../engine/core/lib/math/PrimitiveProcessor"
    import FileSystemUtil from "../../../../../shared/FileSystemUtil"
    import GPUAPI from "../../../../../../engine/core/lib/rendering/GPUAPI"
    import ToastNotificationSystem from "../../../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import EditorFSUtil from "../../../../util/EditorFSUtil"

    export let item
    let wasUpdated = false

    const updateAsset = async () => {
    	wasUpdated = true

    	const data = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + item.id, "json")
    	if (!data) return
    	data.normals = PrimitiveProcessor.computeNormals(data.indices, data.vertices, true)
    	data.tangents = PrimitiveProcessor.computeTangents(data.indices, data.vertices, data.uvs, data.normals, true)


    	await EditorFSUtil.updateAsset(item.registryID, JSON.stringify(data))
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

