<script>
    import DATA_TYPES from "../../../../../public/engine/static/DATA_TYPES";
    import Range from "shared-resources/frontend/components/range/Range.svelte";
    import AssetAPI from "../../../../libs/AssetAPI";
    import GPUResources from "../../../../../public/engine/GPUResources";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Selector from "../../../../components/selector/Selector.svelte";

    import MaterialAPI from "../../../../../public/engine/api/rendering/MaterialAPI";
    import ColorPicker from "shared-resources/frontend/components/color-picker/ColorPicker.svelte";
    import FILE_TYPES from "shared-resources/FILE_TYPES";
    import FilesAPI from "../../../../libs/FilesAPI";
    import RegistryAPI from "../../../../libs/RegistryAPI";
    import compareObjects from "../../utils/compare-objects";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";
    import GPUController from "../../../../../public/engine/GPUController";


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
        const reg = await RegistryAPI.readRegistryFile(ID)

        if (!reg)
            alert.pushAlert("Instance no longer valid", "error")
        else {
            originalMat = await FilesAPI.readFile(NodeFS.ASSETS_PATH  + reg.path, "json")
            if (!compareObjects(temp.uniforms, originalMat.response.uniforms)) {
                temp = {...temp, uniforms: originalMat.response.uniforms, uniformData: originalMat.response.uniformData}
                await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
            }
        }
    }

    $: isInstance = item.id.includes(FILE_TYPES.MATERIAL_INSTANCE)
    $: {
        if (isInstance && data?.original != null)
            load(data.original)
    }

    $: uniforms = isInstance ? temp?.uniformData : temp?.response?.uniformData

    const updateAsset = (index, value, t) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            const update = uniforms.map((u, i) => {
                if (i === index)
                    return {...u, data: value}
                return u
            })
            alert.pushAlert(Localization.UPDATING_ASSET, "alert")
            if (!isInstance) {
                temp = {
                    ...temp,
                    response: {
                        ...temp.response,
                        uniformData: update
                    }
                }
                await AssetAPI.updateAsset(item.registryID, JSON.stringify({
                    ...temp,
                    response: {
                        ...temp.response,
                        uniformData: update
                    }
                }))
            } else {
                await AssetAPI.updateAsset(item.registryID, JSON.stringify({...temp, uniformData: update}))
                temp = {...temp, uniformData: update}
            }

            if (GPUResources.materials.get(item.registryID) != null) {
                const instance = GPUResources.materials.get(item.registryID)
                await MaterialAPI.updateMaterialUniforms(isInstance ? temp.uniformData : temp.response.uniformData, instance)
                alert.pushAlert(Localization.MATERIAL_UPDATED, "success")
                GPUController.cleanUpTextures()
            }
        }, t ? t : 0)
    }
</script>


{#if uniforms != null && uniforms.length > 0}
    {#each uniforms as uniform, i}
        <div class="section">
            {#if uniform.type === DATA_TYPES.TEXTURE}
                <small>{uniform.label}</small>
                <Selector
                        type="image"
                        selected={uniform.data}
                        handleChange={v => {
                            updateAsset(i, v.registryID)
                        }}
                />
            {/if}
            {#if uniform.type === DATA_TYPES.FLOAT}
                <Range
                        value={uniform.data}
                        onFinish={v => {
                        updateAsset(i, v)
                    }}
                />
            {/if}
            {#if uniform.type === DATA_TYPES.VEC3 && uniform.isColor }
                <small>{uniform.label}</small>
                <ColorPicker
                        value={uniform.data.map(e => e * 255)}
                        label={uniform.label}
                        submit={({r,g,b}) => updateAsset(i, [r/255,g/255,b/255], 750)}
                />
            {/if}
        </div>
    {/each}
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

    .section {
        padding: 0 4px;
        display: grid;
        gap: 2px;
        width: 100%;
    }
</style>