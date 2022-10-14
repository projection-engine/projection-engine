<script>
    import Localization from "../../../libs/libs/Localization";
    import Tabs from "../../tabs/Tabs.svelte";
    import getViewIcon from "../utils/get-view-icon";
    import VIEWS from "../data/VIEWS";

    export let groupIndex
    export let views
    export let addNewTab
    export let removeTab
    export let hidden
    export let switchView

    let currentTab = 0
    $: if (groupIndex != null) currentTab = 0
    $: view = views[currentTab]

    const translate = key => Localization.COMPONENTS.VIEWS[key]

    $: tabs = views.map(v => ({name: translate(v), icon: getViewIcon(v), id: v}))
    $: viewTemplates = Object.values(VIEWS).map(value => ({
        name: translate(value),
        id: value
    }))


</script>

<div class="wrapper">
    <div class="tabs" style={hidden ? "transform: rotate(90deg)" : undefined}>
        <Tabs
                updateView={switchView}
                templates={viewTemplates}
                allowDeletion={true}
                addNewTab={addNewTab}
                removeTab={i => removeTab(i, n => currentTab = n, currentTab)}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => currentTab = v}
        />
    </div>
    <slot view={view} index={currentTab}/>
</div>

<style>
    .wrapper {
        width: 100%;
        height: 100%;
        background: var(--pj-background-tertiary);
        border-radius: 3px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

    }

    .tabs {
        height: 30px;
        width: 100%;
    }
</style>