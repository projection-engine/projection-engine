<script>
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import FilesAPI from "../../../../lib/FilesAPI";
    import FILE_TYPES from "shared-resources/FILE_TYPES";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import TextureItem from "./TextureItem.svelte";
    import CodeItem from "./CodeItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";
    import MeshItem from "./MeshItem.svelte";
    import SimpleMaterialItem from "./SimpleMaterialItem.svelte";
    import TerrainItem from "./TerrainItem.svelte";
    import TerrainMaterialWrapper from "./TerrainMaterialWrapper.svelte";
    import NodeFS from "shared-resources/frontend/libs/NodeFS";

    const VALID = [FILE_TYPES.TEXTURE, FILE_TYPES.COLLECTION, FILE_TYPES.TERRAIN_MATERIAL, FILE_TYPES.SIMPLE_MATERIAL, FILE_TYPES.MATERIAL, FILE_TYPES.MATERIAL_INSTANCE, FILE_TYPES.TERRAIN]

    export let item
    let data
    let type

    $: fileType = "." + item.type

    $: {
        data = undefined
        if (fileType !== FILE_TYPES.PRIMITIVE && fileType !== FILE_TYPES.LEVEL) {
            const fType = VALID.includes(fileType) ? "json" : undefined
            FilesAPI.readFile(NodeFS.ASSETS_PATH  + item.id, fType).then(res => data = res)
        } else
            data = undefined
    }

</script>

<div class="wrapper">

    <ItemMetadata item={item}/>
    <div data-divider="-" style="margin:0;"></div>
    {#if fileType === FILE_TYPES.TEXTURE}
        <TextureItem data={data} item={item}/>

    {:else if fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT}
        <CodeItem data={data} item={item}/>
    {:else if data != null && (fileType === FILE_TYPES.MATERIAL || fileType === FILE_TYPES.MATERIAL_INSTANCE)}
        <MaterialItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.SIMPLE_MATERIAL}
        <SimpleMaterialItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.TERRAIN_MATERIAL}
        <TerrainMaterialWrapper data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.TERRAIN}
        <TerrainItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.PRIMITIVE}
        <MeshItem item={item}/>
    {:else}
        <div class="empty-wrapper">
            <div data-empty="-" style="position: relative">
                <Icon styles="font-size: 75px">category</Icon>
                {Localization.CONTENT_BROWSER}
            </div>
        </div>
    {/if}
</div>

<style>
    .wrapper {
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px 2px;
        min-height: 100%;
    }

    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>