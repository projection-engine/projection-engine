<script>

    import FileSystemUtil from "../../../../../shared/FileSystemUtil"
    import TextureItem from "./TextureItem.svelte"
    import CodeItem from "./CodeItem.svelte"
    import ItemMetadata from "./ItemMetadata.svelte"
    import MaterialItem from "./MaterialItem.svelte"
    import MeshItem from "./MeshItem.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import LocalizationEN from "../../../../../../shared/LocalizationEN"
    import FileTypes from "../../../../../../shared/FileTypes"

    const VALID = [FileTypes.TEXTURE, FileTypes.COLLECTION, FileTypes.MATERIAL]

    export let item
    export let setTabs
    export let tabIndex
    let data
    let type
    $: fileType = "." + item.type
    $: {
    	data = undefined
    	if (fileType !== FileTypes.PRIMITIVE && fileType !== FileTypes.LEVEL) {
    		const fType = VALID.includes(fileType) ? "json" : undefined
    		FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + item.id, fType).then(res => data = res)
    	} else
    		data = undefined
    }
    $: {
    	const VALID_TYPES = [FileTypes.COMPONENT, FileTypes.UI_LAYOUT, FileTypes.MATERIAL, FileTypes.PRIMITIVE]
    	if (VALID_TYPES.includes(fileType)) {
    		setTabs([
    			{
    				label: LocalizationEN.METADATA,
    				icon: "info",
    				index: -2,
    				color: "var(--pj-accent-color-secondary)"
    			},
    			{divider: true},
    			{
    				label: LocalizationEN.ASSET_PROPERTIES,
    				icon: "description",
    				index: -1,
    				color: "var(--pj-accent-color-tertiary)"
    			}
    		])
    	} else
    		setTabs([
    			{
    				label: LocalizationEN.METADATA,
    				icon: "info",
    				index: -2,
    				color: "var(--pj-accent-color-secondary)"
    			}
    		])
    }

</script>


{#if tabIndex === -2}
    <ItemMetadata item={item}/>
{:else}
    {#if fileType === FileTypes.TEXTURE && data != null}
        <TextureItem data={data} item={item}/>
    {:else if fileType === FileTypes.COMPONENT || fileType === FileTypes.UI_LAYOUT}
        <CodeItem data={data} item={item}/>
    {:else if data != null && fileType === FileTypes.MATERIAL}
        <MaterialItem data={data} item={item}/>
    {:else if fileType === FileTypes.PRIMITIVE}
        <MeshItem item={item}/>
    {:else}
        <div class="empty-wrapper">
            <div data-svelteempty="-" style="position: relative">
                <Icon styles="font-size: 75px">category</Icon>
                {LocalizationEN.CONTENT_BROWSER}
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