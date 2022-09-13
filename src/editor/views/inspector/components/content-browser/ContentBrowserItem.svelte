<script>
    import Localization from "../../../../../shared/libs/Localization";
    import FilesStore from "../../../../stores/FilesStore";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FILE_TYPES from "../../../../../static/FILE_TYPES";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import TextureItem from "./TextureItem.svelte";
    import ComponentItem from "./ComponentItem.svelte";
    import ItemMetadata from "./ItemMetadata.svelte";
    import MaterialItem from "./MaterialItem.svelte";
    import SceneItem from "./SceneItem.svelte";
    import MeshItem from "./MeshItem.svelte";

    const {shell} = window.require("electron")

    export let item
    let data
    let type

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    $: fileType = "." + item.type

    $: {

        if (fileType === FILE_TYPES.TEXTURE || fileType === FILE_TYPES.STYLESHEET || fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.MATERIAL || fileType === FILE_TYPES.SCENE) {
            FilesAPI.readFile(FilesStore.ASSETS_PATH + item.id, fileType !== FILE_TYPES.COMPONENT && fileType !== FILE_TYPES.STYLESHEET ? "json" : undefined).then(res => data = res)
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
    {:else if fileType === FILE_TYPES.COMPONENT || fileType === FILE_TYPES.STYLESHEET}
        <ComponentItem data={data} item={item}/>
    {:else if fileType === FILE_TYPES.MATERIAL && data?.response != null}
        <MaterialItem data={data} item={item}/>
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