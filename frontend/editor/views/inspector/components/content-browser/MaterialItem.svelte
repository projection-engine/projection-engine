<script>
    import AssetAPI from "../../../../lib/fs/AssetAPI";
    import GPU from "../../../../../../engine-core/GPU";
    import LOCALIZATION_EN from "../../../../../static/LOCALIZATION_EN";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import RegistryAPI from "../../../../lib/fs/RegistryAPI";
    import compareObjects from "../../utils/compare-objects";
    import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import NodeFS from "../../../../../lib/FS/NodeFS";
    import AlertController from "../../../../../components/alert/AlertController";

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
        const reg = RegistryAPI.getRegistryEntry(ID)
        originalMat = await FilesAPI.readFile(NodeFS.ASSETS_PATH + reg.path, "json")
        if (!compareObjects(temp.uniforms, originalMat.response.uniforms)) {
            temp = {
                ...temp,
                uniforms: originalMat.response.uniforms,
                uniformValues: originalMat.response.uniformValues
            }
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
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
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
            const instance = GPU.materials.get(item.registryID)
            if (instance) {
                await instance.updateUniformGroup(temp.response.uniformValues)
                AlertController.success(LOCALIZATION_EN.MATERIAL_UPDATED)

                GPUAPI.cleanUpTextures()
            }
        }, t ? t : 0)
    }
</script>


{#if uniforms != null && uniforms.length > 0}
    <MaterialUniforms uniforms={uniforms} update={updateAsset}/>
{:else}
    <div class="empty-wrapper">
        <div data-empty="-" style="position: relative">
            <Icon styles="font-size: 75px">texture</Icon>
            {LOCALIZATION_EN.NO_UNIFORMS}
        </div>
    </div>
{/if}

<style>

    .empty-wrapper {
        position: relative;
        height: 100%;
    }

</style>