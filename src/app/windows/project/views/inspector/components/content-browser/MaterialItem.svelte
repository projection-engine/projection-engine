<script>
    import DATA_TYPES from "../../../../libs/engine/production/data/DATA_TYPES";
    import Range from "../../../../../../components/range/Range.svelte";

    import AssetAPI from "../../../../../../libs/files/AssetAPI";
    import GPU from "../../../../libs/engine/production/GPU";
    import Localization from "../../../../../../libs/Localization";
    import Selector from "../../../../../../components/selector/Selector.svelte";

    import ContentBrowserAPI from "../../../../../../libs/files/ContentBrowserAPI";
    import FilesStore from "../../../../stores/FilesStore";


    export let data
    export let item

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    let temp
    $: temp = {...data}
    $: exists = GPU.materials.get(item.registryID) != null
    const updateAsset = async (index, value) => {

        temp = {
            ...temp,
            response: {
                ...temp.response,
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
        }

        alert.pushAlert(translate("UPDATING_ASSET"), "alert")
        await AssetAPI.updateAsset(item.registryID, JSON.stringify(temp))
        ContentBrowserAPI
        if (exists) {
            const instance = GPU.materials.get(item.registryID)
            await instance.updateUniformData(temp.response.uniformData)
            alert.pushAlert(translate("MATERIAL_UPDATED"), "success")
            GPU.cleanUpTextures()
            const fileTypes = await ContentBrowserAPI.refresh()
            FilesStore.updateStore({...FilesStore.data, ...fileTypes})
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