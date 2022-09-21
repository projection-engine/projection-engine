<script>
    import Localization from "../../../../../shared/libs/Localization";
    import FilesStore from "../../../../stores/FilesStore";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FILE_TYPES from "../../../../../static/FILE_TYPES";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import TextureItem from "./TextureItem.svelte";
    import CodeItem from "./CodeItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";
    import SceneItem from "./SceneItem.svelte";
    import MeshItem from "./MeshItem.svelte";
    import SimpleMaterialItem from "./SimpleMaterialItem.svelte";

    const VALID = [FILE_TYPES.TEXTURE, FILE_TYPES.SCENE, FILE_TYPES.SIMPLE_MATERIAL, FILE_TYPES.MATERIAL, FILE_TYPES.MATERIAL_INSTANCE]

    export let item
    let data
    let type

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: fileType = "." + item.type

    $: {
        data = undefined
        if (fileType !== FILE_TYPES.MESH && fileType !== FILE_TYPES.LEVEL) {
            const fType = VALID.includes(fileType) ? "json" : undefined
            FilesAPI.readFile(FilesStore.ASSETS_PATH + item.id, fType).then(res => data = res)
        } else
            data = undefined
    }

</script>

<div class="wrapper">

    <ItemMetadata item={item}/>
    <div data-divider="-" style="margin-top: 6px; margin-bottom: 6px;"></div>
    {#if fileType === FILE_TYPES.TEXTURE}
        <TextureItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.SCENE}
        <SceneItem data={data}/>
    {:else if fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.UI_LAYOUT}
        <CodeItem data={data} item={item}/>
    {:else if data != null && (fileType === FILE_TYPES.MATERIAL || fileType === FILE_TYPES.MATERIAL_INSTANCE)}
        <MaterialItem data={data} item={item}/>
    {:else if data != null && fileType === FILE_TYPES.SIMPLE_MATERIAL}
        <SimpleMaterialItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.MESH}
        <MeshItem item={item}/>
    {:else}
        <div class="empty-wrapper">
            <div data-empty="-" style="position: relative">
                <Icon styles="font-size: 75px">category</Icon>
                {translate("TITLE")}
            </div>
        </div>
    {/if}
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;

        gap: 2px;
        overflow-y: visible;
        overflow-x: hidden;
        padding: 4px 2px;
        min-height: 100%;
    }

    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>