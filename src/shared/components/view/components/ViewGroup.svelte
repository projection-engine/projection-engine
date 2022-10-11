<script>
    import Localization from "../../../libs/Localization";
    import Tabs from "../../Tabs.svelte";

    export let groupIndex
    export let views
    export let addNewTab
    export let removeTab
    let currentTab = 0
    $: view = views[currentTab]

    const translate = key => Localization.COMPONENTS.VIEWS[key]
    $: tabs = views.map(v => ({
        name: translate(v)
    }))

</script>

<div class="wrapper">
    <div class="tabs">
        <Tabs
                addNewTab={addNewTab}
                removeTab={removeTab}
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
    }

    .tabs {
        padding: 0 2px;
        height: 23px;
        width: 100%;
    }
</style>