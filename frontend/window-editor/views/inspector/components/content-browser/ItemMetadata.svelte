<script>
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import LOCALIZATION_EN from "../../../../../shared/static/LOCALIZATION_EN";
    import getTypeName from "../../../content-browser/utils/get-type-name";
    import GlobalContentBrowserController from "../../../content-browser/libs/GlobalContentBrowserController";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import FS from "../../../../../shared/lib/FS/FS";

    export let item
    let data


    $: {
        FS.stat(FS.ASSETS_PATH + FS.sep + item.id)
            .then(res => {
                if (!res)
                    return
                data = {...res, size: res.size / (1024 * 1024)}
            })
    }
    const showInFolder = () => {
        const id = item.id.split(FS.sep)
        id.pop()
        GlobalContentBrowserController.pushCurrentDirectory(id.join(FS.sep))
    }
</script>


{#if !item.isFolder && data}
    <div class="section">
        <ToolTip content="{data.size.toFixed(4)} MB"/>
        <b>{LOCALIZATION_EN.FILE_SIZE}: </b><small data-svelteoverflow="-">{data.size.toFixed(4)} MB</small>
    </div>

    <div class="section">
        <ToolTip content={item.type}/>
        <b>{LOCALIZATION_EN.FILE_EXTENSION}: </b><small data-svelteoverflow="-">{getTypeName(item.type)}</small>
    </div>
    <div class="section">
        <ToolTip content={item.registryID}/>
        <b>{LOCALIZATION_EN.REGISTRY_ID}: </b><small data-svelteoverflow="-">{item.registryID}</small>
    </div>
{:else}
    <div class="section">
        <ToolTip content={item.children}/>
        <b>{LOCALIZATION_EN.CHILDREN}: </b><small data-svelteoverflow="-">{item.children}</small>
    </div>
{/if}
<div class="section">
    <ToolTip content={item.creationDate}/>
    <b>{LOCALIZATION_EN.CREATION_DATE}: </b><small data-svelteoverflow="-">{item.creationDate}</small>
</div>
<div class="section">
    <ToolTip content={item.id}/>
    <b>{LOCALIZATION_EN.ASSETS_PATH}: </b>
    <small
            data-svelteoverflow="-"
            class="link"
            on:click={showInFolder}
    >
        {item.id}
        <ToolTip content={LOCALIZATION_EN.SHOW_ON_CB}/>
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
        background: var(--pj-background-primary);
        border-radius: 3px;
        width: 100%;
        font-size: .7rem;
        color: var(--pj-color-secondary);
    }
</style>