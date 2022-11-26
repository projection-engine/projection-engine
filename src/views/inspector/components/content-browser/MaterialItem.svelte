<script>
    import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import AssetAPI from "../../../../lib/fs/AssetAPI";
    import GPU from "../../../../../public/engine/GPU";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Selector from "../../../../components/selector/Selector.svelte";
    import MaterialAPI from "../../../../../public/engine/lib/rendering/MaterialAPI";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import RegistryAPI from "../../../../lib/fs/RegistryAPI";
    import compareObjects from "../../utils/compare-objects";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPUAPI from "../../../../../public/engine/lib/rendering/GPUAPI";
    import MaterialUniforms from "../MaterialUniforms.svelte";

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

        if (!reg)
            alert.pushAlert("Instance no longer valid", "error")
        else {
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
    }

    $: uniforms = temp?.response?.uniformsData

    const updateAsset = (index, value, t) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            const update = uniforms.map((u, i) => {
                if (i === index)
                    return {...u, data: value}
                return u
            })
            temp = {
                ...temp,
                response: {
                    ...temp.response,
                    uniformsData: update
                }
            }
            await AssetAPI.updateAsset(item.registryID, JSON.stringify({
                ...temp,
                response: {
                    ...temp.response,
                    uniformsData: update
                }
            }))

            if (GPU.materials.get(item.registryID) != null) {
                const instance = GPU.materials.get(item.registryID)
                await MaterialAPI.updateMaterialUniforms(temp.response.uniformsData, instance)
                alert.pushAlert(Localization.MATERIAL_UPDATED, "success")
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
    small {
        font-size: .7rem;

    }

    .empty-wrapper {
        position: relative;
        height: 100%;
    }

</style>