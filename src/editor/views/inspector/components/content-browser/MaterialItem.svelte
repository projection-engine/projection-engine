<script>
    import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES";
    import Range from "../../../../../shared/components/range/Range.svelte";

    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import Localization from "../../../../../shared/libs/Localization";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import FILE_TYPES from "../../../../../static/CHANNELS";


    export let data
    export let item
    export let fileType

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    let temp
    $: temp = {...data}

    $: isInstance = fileType === FILE_TYPES.MATERIAL

    const updateAsset = async (index, value) => {
        const uniforms = {
            uniforms: temp.response.uniforms.map((u, i) => {
                if (i === index)
                    return {...u, value}
                return u
            }),
            uniformData: temp.response.uniformData.map((u, i) => {
                if (i === index)
                    return {...u, data: value}
                return u
            })
        }
        if (isInstance)
            temp = {
                ...temp,
                response: {
                    ...temp.response,
                    ...uniforms
                }
            }
        else {
            temp = uniforms
            temp.original = data.original
        }

        alert.pushAlert(translate("UPDATING_ASSET"), "alert")
        await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))

        if (GPU.materials.get(item.registryID) != null) {
            // TODO - OTHER STRUCTURE FOR INSTANCE
            const instance = GPU.materials.get(isInstance ? data.original : item.registryID)
            await instance.updateUniformData(isInstance ? temp.uniformData : temp.response.uniformData)
            alert.pushAlert(translate("MATERIAL_UPDATED"), "success")
            GPU.cleanUpTextures()

            // const fileTypes = await ContentBrowserAPI.refresh()
            // FilesStore.updateStore({...FilesStore.data, ...fileTypes})
        }
    }
</script>


{#each temp.response.uniforms as uniform, i}
    {#if uniform.type === DATA_TYPES.TEXTURE}
        <div class="section">
            <small>{uniform.label}</small>
            <Selector
                    type="image"
                    selected={uniform.value}
                    handleChange={v => {
                  updateAsset(i, v.registryID)
                }}
            />
        </div>
    {/if}
    {#if uniform.type === DATA_TYPES.FLOAT}
        <Range
                value={uniform.value}
                onFinish={v => {
                updateAsset(i, v)
            }}
        />
    {/if}
{/each}

<style>
    .section {
        display: grid;
        gap: 2px;
        width: 100%;
    }
</style>