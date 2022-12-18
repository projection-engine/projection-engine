<script>
    import AssetAPI from "../../../../lib/fs/AssetAPI";
    import GPU from "../../../../../../engine-core/GPU";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import LOCALIZATION_EN from "../../../../templates/LOCALIZATION_EN";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import RegistryAPI from "../../../../lib/fs/RegistryAPI";
    import compareObjects from "../../utils/compare-objects";
    import GPUAPI from "../../../../../../engine-core/lib/rendering/GPUAPI";
    import MaterialUniforms from "../MaterialUniforms.svelte";
    import ConsoleAPI from "../../../../../../engine-core/lib/utils/ConsoleAPI";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import NodeFS from "../../../../../shared/libs/NodeFS";

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
                uniformsData: originalMat.response.uniformsData
            }
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
        }
    }

    $: uniforms = temp?.response?.uniformsData

    const updateAsset = (index, value, t) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            const update = temp.response.uniformsData.map((u, i) => {
                if (i === index)
                    return {...u, data: value}
                return u
            })
            temp = {
                ...temp,
                response: {
                    ...temp.response,
                    uniformsData: update
                },
                // nodes: temp.nodes.map(n => {
                //     const target =temp.response.uniformsData[index]
                //     if(n.uniformName === target?.key && target?.internalKey)
                //         n[target.internalKey]  = target.data
                //     return n
                // })
            }
            await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
            const instance = GPU.materials.get(item.registryID)
            if (instance) {
                await instance.updateUniformGroup(temp.response.uniformsData)
                console.log(LOCALIZATION_EN.MATERIAL_UPDATED)

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
            {Localization.NO_UNIFORMS}
        </div>
    </div>
{/if}

<style>

    .empty-wrapper {
        position: relative;
        height: 100%;
    }

</style>