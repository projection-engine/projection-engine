<script>
    import WindowFrame from "../shared/components/window-frame/WindowFrame.svelte";
    import Localization from "../shared/libs/Localization";
    import Alert from "../shared/components/alert/Alert.svelte";
    import Sidebar from "../shared/components/Sidebar.svelte";
    import Projects from "./views/Projects.svelte";
    import ReleasesList from "./views/ReleasesList.svelte";
    import ResizableBar from "../shared/components/resizable/ResizableBar.svelte";
    import ContextMenu from "../shared/components/context-menu/ContextMenu.svelte";


    let tab = 0

    const translate = (key) => Localization.HOME.HOME[key]


</script>


<Alert/>
<WindowFrame
        background="var(--pj-background-quaternary)"
        options={[]}
        label={translate("TITLE")}
        pageInfo={{
        closeEvent: true,
        minimizeEvent: true,
        maximizeEvent: true
    }}
/>
<ContextMenu/>
<div class="wrapper">
    <Sidebar tab={tab} setTab={v => tab = v} options={[
        ["view_in_ar", translate("PROJECTS")],
        ["inventory_2", translate("RELEASES")]
    ]}/>
    <ResizableBar type="width"/>
    <div class="tab">
        {#if tab === 0}
            <Projects/>
        {:else}
            <ReleasesList/>
        {/if}
    </div>
</div>


<style>
    .tab {
        width: 100%;
        position: relative;
        overflow: hidden;
        height: 100%;
        padding: 16px 5% 32px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 4px;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }


</style>