<script>
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import Localization from "../../../../libs/Localization";
    import NodeFS from "shared-resources/frontend/libs/NodeFS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import getTypeName from "../../../content-browser/utils/get-type-name";
    import GlobalContentBrowserController from "../../../content-browser/libs/GlobalContentBrowserController";

    export let item
    let data
    const translate = key => Localization.PROJECT.INSPECTOR[key]

    $: {
        NodeFS.stat(NodeFS.ASSETS_PATH  + NodeFS.sep + item.id)
            .then(res => {
                if(!res)
                    return
                data = {...res, size: res.size / (1024 * 1024)}
            })
    }
    const showInFolder = () => {
        const id = item.id.split(NodeFS.sep)
        id.pop()
        GlobalContentBrowserController.pushCurrentDirectory(id.join(NodeFS.sep))
    }
</script>

<Accordion title={translate("MORE_INFO")}>
    {#if !item.isFolder && data}
        <div class="section">
            <ToolTip content="{data.size.toFixed(4)} MB"/>
            <b>{translate("FILE_SIZE")}: </b><small data-overflow="-">{data.size.toFixed(4)} MB</small>
        </div>

        <div class="section">
            <ToolTip content={item.type}/>
            <b>{translate("FILE_EXTENSION")}: </b><small data-overflow="-">{getTypeName(item.type)}</small>
        </div>
        <div class="section">
            <ToolTip content={item.registryID}/>
            <b>{translate("REGISTRY_ID")}: </b><small data-overflow="-">{item.registryID}</small>
        </div>
    {:else}
        <div class="section">
            <ToolTip content={item.children}/>
            <b>{translate("CHILDREN")}: </b><small data-overflow="-">{item.children}</small>
        </div>
    {/if}
    <div class="section">
        <ToolTip content={item.creationDate}/>
        <b>{translate("CREATION_DATE")}: </b><small data-overflow="-">{item.creationDate}</small>
    </div>
    <div class="section">
        <ToolTip content={item.id}/>
        <b>{translate("ASSETS_PATH")}: </b>
        <small
                data-overflow="-"
                class="link"
                on:click={showInFolder}
        >
            {item.id}
            <ToolTip content={translate("SHOW_ON_CB")}/>
        </small>
    </div>

</Accordion>

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