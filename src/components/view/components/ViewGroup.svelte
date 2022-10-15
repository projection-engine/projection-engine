<script>
    import Localization from "../../../libs/libs/Localization";
    import Tabs from "../../tabs/Tabs.svelte";
    import getViewIcon from "../utils/get-view-icon";
    import VIEWS from "../data/VIEWS";
    import TabsStore from "../../../stores/TabsStore";
    import {onDestroy} from "svelte";
    import SettingsStore from "../../../stores/SettingsStore";

    export let groupIndex
    export let views
    export let addNewTab
    export let removeTab
    export let hidden
    export let switchView
    export let id
    export let settings

    let currentView
    let currentTab = 0
    const unsubscribeSettings = SettingsStore.getStore(v => currentView = v.currentView)
    const unsubscribeTabs = TabsStore.getStore(_ => currentTab = TabsStore.getValue(id, groupIndex))
    $: currentTab = TabsStore.getValue(id, groupIndex, currentView)
    $: if (groupIndex != null) currentTab = 0
    $: view = views[currentTab]

    const translate = key => Localization.COMPONENTS.VIEWS[key]

    $: tabs = views.map(v => ({name: translate(v), icon: getViewIcon(v), id: v}))
    $: viewTemplates = Object.values(VIEWS).map(value => ({
        name: translate(value),
        id: value
    }))

    onDestroy(() => {
        unsubscribeTabs()
        unsubscribeSettings()
    })

</script>

<div class="wrapper">
    <div class="tabs" style={hidden ? "transform: rotate(90deg)" : undefined}>
        <Tabs
                updateView={switchView}
                templates={viewTemplates}
                allowDeletion={true}
                addNewTab={addNewTab}
                removeTab={i => removeTab(i, n => TabsStore.update(id, groupIndex, n), currentTab)}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => TabsStore.update(id, groupIndex, v)}
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