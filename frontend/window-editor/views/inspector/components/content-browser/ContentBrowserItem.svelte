<script>
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import TextureItem from "./TextureItem.svelte";
    import CodeItem from "./CodeItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";
    import MeshItem from "./MeshItem.svelte";
    import TerrainItem from "./TerrainItem.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import FILE_TYPES from "../../../../../../static/objects/FILE_TYPES";
    import FS from "../../../../../shared/lib/FS/FS";
    import {onMount} from "svelte";

    const VALID = [FILE_TYPES.TEXTURE, FILE_TYPES.COLLECTION, FILE_TYPES.MATERIAL, FILE_TYPES.TERRAIN]

    export let item
    export let setTabs
    export let tabIndex
    let data
    let type
    $: fileType = "." + item.type
    $: {
        data = undefined
        if (fileType !== FILE_TYPES.PRIMITIVE && fileType !== FILE_TYPES.LEVEL) {
            const fType = VALID.includes(fileType) ? "json" : undefined
            FilesAPI.readFile(FS.ASSETS_PATH + item.id, fType).then(res => data = res)
        } else
            data = undefined
    }
    $: {
        const VALID_TYPES = [FILE_TYPES.COMPONENT, FILE_TYPES.UI_LAYOUT, FILE_TYPES.MATERIAL, FILE_TYPES.TERRAIN, FILE_TYPES.PRIMITIVE]
        if (VALID_TYPES.includes(fileType)) {
            setTabs([
                {
                    label: LOCALIZATION_EN.METADATA,
                    icon: "info",
                    index: -2
                },
                {
                    label: LOCALIZATION_EN.ASSET_PROPERTIES,
                    icon: "file",
                    index: -1
                }
            ])
        } else
            setTabs([
                {
                    label: LOCALIZATION_EN.METADATA,
                    icon: "info",
                    index: -2
                }
            ])
    }

</script>


{#if tabIndex === -2}
    <ItemMetadata item={item}/>
{:else}
    {#if fileType === FILE_TYPES.TEXTURE && data != null}
        <TextureItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT}
        <CodeItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.MATERIAL}
        <MaterialItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.TERRAIN}
        <TerrainItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.PRIMITIVE}
        <MeshItem item={item}/>
    {:else}
        <div class="empty-wrapper">
            <div data-svelteempty="-" style="position: relative">
                <Icon styles="font-size: 75px">category</Icon>
                {LOCALIZATION_EN.CONTENT_BROWSER}
            </div>
        </div>
    {/if}
{/if}

<style>
    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>