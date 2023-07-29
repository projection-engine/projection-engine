<script>

    import GlobalContentBrowserController from "../../libs/GlobalContentBrowserController"
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import ContentBrowserUtil from "../../../../util/ContentBrowserUtil"
    import FileSystemUtil from "../../../../../shared/FileSystemUtil"

    export let item
    let data


    $: {
    	FileSystemUtil.stat(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + item.id)
    		.then(res => {
    			if (!res)
    				return
    			data = {...res, size: res.size / (1024 * 1024)}
    		})
    }
    const showInFolder = () => {
    	const id = item.id.split(FileSystemUtil.sep)
    	id.pop()
    	GlobalContentBrowserController.pushCurrentDirectory(id.join(FileSystemUtil.sep))
    }
</script>


{#if !item.isFolder && data}
    <div class="section">
        <ToolTip content="{data.size.toFixed(4)} MB"/>
        <b>{LocalizationEN.FILE_SIZE}: </b><small data-svelteoverflow="-">{data.size.toFixed(4)} MB</small>
    </div>

    <div class="section">
        <ToolTip content={item.type}/>
        <b>{LocalizationEN.FILE_EXTENSION}: </b><small data-svelteoverflow="-">{ContentBrowserUtil.getTypeName(item.type)}</small>
    </div>
    <div class="section">
        <ToolTip content={item.registryID}/>
        <b>{LocalizationEN.REGISTRY_ID}: </b><small data-svelteoverflow="-">{item.registryID}</small>
    </div>
{:else}
    <div class="section">
        <ToolTip content={item.children}/>
        <b>{LocalizationEN.CHILDREN}: </b><small data-svelteoverflow="-">{item.children}</small>
    </div>
{/if}
<div class="section">
    <ToolTip content={item.creationDate}/>
    <b>{LocalizationEN.CREATION_DATE}: </b><small data-svelteoverflow="-">{item.creationDate}</small>
</div>
<div class="section">
    <ToolTip content={item.id}/>
    <b>{LocalizationEN.ASSETS_PATH}: </b>
    <small
            data-svelteoverflow="-"
            class="link"
            on:click={showInFolder}
    >
        {item.id}
        <ToolTip content={LocalizationEN.SHOW_ON_CB}/>
    </small>
</div>

<style>
    .link {
        cursor: pointer;
    }

    .link:hover {
        text-decoration: underline;
    }

    small {
        font-size: .7rem;
        color: var(--pj-color-quaternary);
    }

    b {
        font-weight: 500;
    }

    .section {

        display: flex;
        align-items: center;
        gap: 2px;

        min-height: 30px;
        height: 30px;
        padding: 0 4px;
        border-radius: 3px;
        width: 100%;
        font-size: .7rem;
        color: var(--pj-color-secondary);
    }
</style>
