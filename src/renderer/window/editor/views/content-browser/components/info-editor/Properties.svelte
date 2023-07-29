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
    import {onDestroy, onMount} from "svelte";
    import ContentBrowserStore from "../../../../../shared/stores/ContentBrowserStore";

    const VALID = [FileTypes.TEXTURE, FileTypes.COLLECTION, FileTypes.MATERIAL]
    const COMPONENT_ID = crypto.randomUUID()

    let selectedFile
    let currentTab = 0
    let data
    let fileType

    $: {
        if (selectedFile) {
            fileType = "." + selectedFile.type
            data = undefined
            if (fileType !== FileTypes.PRIMITIVE && fileType !== FileTypes.LEVEL) {
                const fType = VALID.includes(fileType) ? "json" : undefined
                FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + selectedFile.id, fType)
                    .then(res => data = res)
            }
            ContentBrowserUtil.setInspectorTabs(fileType, v => currentTab = v)
        }
    }

    onMount(() => {
        ContentBrowserStore.getInstance().addListener(COMPONENT_ID, data => selectedFile = data.selectedItems[0], ["selectedItems"])
    })
    onDestroy(() => ContentBrowserStore.getInstance().removeListener(COMPONENT_ID))
</script>

{#if selectedFile}
    {#if currentTab === 3}
        <ItemMetadata item={selectedFile}/>
    {:else}
        {#if fileType === FileTypes.TEXTURE && data != null}
            <TextureItem data={data} item={selectedFile}/>
        {:else if fileType === FileTypes.COMPONENT || fileType === FileTypes.UI_LAYOUT}
            <CodeItem data={data} item={selectedFile}/>
        {:else if data != null && fileType === FileTypes.MATERIAL}
            <MaterialItem data={data} item={selectedFile}/>
        {:else if fileType === FileTypes.PRIMITIVE}
            <MeshItem item={selectedFile}/>
        {:else}
            <div class="empty-wrapper">
                <div data-svelteempty="-" style="position: relative">
                    <Icon styles="font-size: 75px">category</Icon>
                    {LocalizationEN.CONTENT_BROWSER}
                </div>
            </div>
        {/if}
    {/if}
{:else}
    <div class="empty-wrapper">
        <div data-svelteempty="-" style="position: relative">
            <Icon styles="font-size: 75px">category</Icon>
            {LocalizationEN.CONTENT_BROWSER}
        </div>
    </div>
{/if}

<style>
    .empty-wrapper {
        position: relative;
        height: 100%;
    }
</style>
