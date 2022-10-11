<script>
    import Localization from "../../../libs/Localization";
    import Tabs from "../../Tabs.svelte";

    export let groupIndex
    export let views
    export let addNewTab
    export let removeTab
    export let hidden

    let currentTab = 0
    $: if (groupIndex != null) currentTab = 0
    $: view = views[currentTab]

    const translate = key => Localization.COMPONENTS.VIEWS[key]

    $: tabs = views.map(v => ({name: translate(v)}))
    $: console.log(view, views)
</script>

<div class="wrapper">
    <div class="tabs" style={hidden ? "transform: rotate(90deg)" : undefined}>
        <Tabs
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
    }

    .tabs {
        height: 23px;
        width: 100%;
    }
</style>