<script>
    import GPU from "../../../../../../engine/core/GPU"

    import FileSystemUtil from "../../../../../shared/FileSystemUtil"
    import EditorFSUtil from "../../../../util/EditorFSUtil"
    import GPUAPI from "../../../../../../engine/core/lib/rendering/GPUAPI"
    import MaterialUniforms from "../../../../components/MaterialUniformsForm.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import ToastNotificationSystem from "../../../../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../../util/InspectorUtil"

    export let data
    export let item


    let temp
    $: temp = data ? {...data} : undefined
    let originalMat
    let timeout
    let wasUpdated = false

    async function load(ID) {
    	if (wasUpdated)
    		return
    	wasUpdated = true
    	const reg = EditorFSUtil.getRegistryEntry(ID)
    	originalMat = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + reg.path, "json")
    	if (!InspectorUtil.compareObjects(temp.uniforms, originalMat.response.uniforms)) {
    		temp = {
    			...temp,
    			uniforms: originalMat.response.uniforms,
    			uniformValues: originalMat.response.uniformValues
    		}
    		await EditorFSUtil.updateAsset(item.registryID, JSON.stringify(temp))
    	}
    }

    $: uniforms = temp?.response?.uniformValues

    const updateAsset = (index, value, t) => {
    	clearTimeout(timeout)
    	timeout = setTimeout(async () => {
    		const update = temp.response.uniformValues.map((u, i) => {
    			if (i === index)
    				return {...u, data: value}
    			return u
    		})
    		temp = {
    			...temp,
    			response: {
    				...temp.response,
    				uniformValues: update
    			}
    		}
    		await EditorFSUtil.updateAsset(item.registryID, JSON.stringify(temp))
    		const instance = GPU.materials.get(item.registryID)
    		if (instance) {
    			await instance.updateUniformGroup(temp.response.uniformValues)
    			ToastNotificationSystem.getInstance().success(LocalizationEN.MATERIAL_UPDATED)

    			GPUAPI.cleanUpTextures()
    		}
    	}, 150)
    }
</script>


{#if uniforms != null && uniforms.length > 0}
    <MaterialUniforms uniforms={uniforms} update={updateAsset}/>
{:else}
    <div class="empty-wrapper">
        <div data-svelteempty="-" style="position: relative">
            <Icon styles="font-size: 75px">texture</Icon>
            {LocalizationEN.NO_UNIFORMS}
        </div>
    </div>
{/if}

<style>

    .empty-wrapper {
        position: relative;
        height: 100%;
    }

</style>
