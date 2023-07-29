<script>

    import FileSystemUtil from "../../../../../shared/FileSystemUtil"
    import TextureItem from "./TextureItem.svelte"
    import CodeItem from "./CodeItem.svelte"
    import ItemMetadata from "./ItemMetadata.svelte"
    import MaterialItem from "./MaterialItem.svelte"
    import MeshItem from "./MeshItem.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import FileTypes from "../../../../../../../shared/enums/FileTypes"
    import ContentBrowserUtil from "../../../../util/ContentBrowserUtil";

    const VALID = [FileTypes.TEXTURE, FileTypes.COLLECTION, FileTypes.MATERIAL]

    export let selectedFileItem

    let currentTab = 0

    let data
    let fileType
    $: {
        if(selectedFileItem) {
            fileType = "." + selectedFileItem.type
            data = undefined
            if (fileType !== FileTypes.PRIMITIVE && fileType !== FileTypes.LEVEL) {
                const fType = VALID.includes(fileType) ? "json" : undefined
                FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + selectedFileItem.id, fType)
                    .then(res => data = res)
            }
            ContentBrowserUtil.setInspectorTabs(fileType, v => currentTab = v)
        }
    }

</script>

{#if selectedFileItem}
    {#if currentTab === 3}
        <ItemMetadata item={selectedFileItem}/>
    {:else}
        {#if fileType === FileTypes.TEXTURE && data != null}
            <TextureItem data={data} item={selectedFileItem}/>
        {:else if fileType === FileTypes.COMPONENT || fileType === FileTypes.UI_LAYOUT}
            <CodeItem data={data} item={selectedFileItem}/>
        {:else if data != null && fileType === FileTypes.MATERIAL}
            <MaterialItem data={data} item={selectedFileItem}/>
        {:else if fileType === FileTypes.PRIMITIVE}
            <MeshItem item={selectedFileItem}/>
        {:else}
            <div class="empty-wrapper">
                <div data-svelteempty="-" style="position: relative">
                    <Icon styles="font-size: 75px">category</Icon>
                    {LocalizationEN.CONTENT_BROWSER}
                </div>
            </div>
        {/if}
    {/if}
{/if}

<style>
    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>
