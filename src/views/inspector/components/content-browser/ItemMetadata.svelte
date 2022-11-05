<script>
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import NodeFS from "shared-resources/frontend/libs/NodeFS"
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import getTypeName from "../../../content-browser/utils/get-type-name";
    import GlobalContentBrowserController from "../../../content-browser/libs/GlobalContentBrowserController";

    export let item
    let data


    $: {
        NodeFS.stat(NodeFS.ASSETS_PATH + NodeFS.sep + item.id)
            .then(res => {
                if (!res)
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

<Accordion title={Localization.MORE_INFO} type="">
   <div class="wrapper">
       {#if !item.isFolder && data}
           <div class="section">
               <ToolTip content="{data.size.toFixed(4)} MB"/>
               <b>{Localization.FILE_SIZE}: </b><small data-overflow="-">{data.size.toFixed(4)} MB</small>
           </div>

           <div class="section">
               <ToolTip content={item.type}/>
               <b>{Localization.FILE_EXTENSION}: </b><small data-overflow="-">{getTypeName(item.type)}</small>
           </div>
           <div class="section">
               <ToolTip content={item.registryID}/>
               <b>{Localization.REGISTRY_ID}: </b><small data-overflow="-">{item.registryID}</small>
           </div>
       {:else}
           <div class="section">
               <ToolTip content={item.children}/>
               <b>{Localization.CHILDREN}: </b><small data-overflow="-">{item.children}</small>
           </div>
       {/if}
       <div class="section">
           <ToolTip content={item.creationDate}/>
           <b>{Localization.CREATION_DATE}: </b><small data-overflow="-">{item.creationDate}</small>
       </div>
       <div class="section">
           <ToolTip content={item.id}/>
           <b>{Localization.ASSETS_PATH}: </b>
           <small
                   data-overflow="-"
                   class="link"
                   on:click={showInFolder}
           >
               {item.id}
               <ToolTip content={Localization.SHOW_ON_CB}/>
           </small>
       </div>
   </div>

</Accordion>

<style>
    .wrapper{
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
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