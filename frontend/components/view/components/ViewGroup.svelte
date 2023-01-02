<script lang="ts">
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import Tabs from "../../tabs/Tabs.svelte";
    import getViewIcon from "../utils/get-view-icon";
    import VIEWS from "../static/VIEWS";
    import TabsStore from "../../../editor/stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import SettingsStore from "../../../editor/stores/SettingsStore";
    import ViewTabItem from "../../../static/ViewTabItem";
    import Dialog from "../../dialog/Dialog.svelte";

    export let groupIndex
    export let views: ViewTabItem[]
    export let addNewTab
    export let removeTab
    export let removeMultipleTabs
    export let switchView
    export let id

    let previous = 0
    let currentTab = 0
    let ref: HTMLElement
    let focused = false
    let targetDialogElement
    let view

    function update(views){
        currentTab = TabsStore.getValue(id, groupIndex)
        view = views[currentTab]?.type
        console.trace(view, currentTab)
    }
    $: update(views)
    const unsubscribe = SettingsStore.getStore(v => {
        if (v.currentView === previous)
            return

        previous = v.currentView
        update(views)
    })

    const unsubscribeTabs = TabsStore.getStore(_ => {
        update(views)
        focused = TabsStore.focused === ref
    })
    $: tabs = views.map(v => {
        v.name = LOCALIZATION_EN[v.type]
        v.icon = getViewIcon(v.type)
        v.id = v.type
        return v
    })
    $: viewTemplates = Object.values(VIEWS).map(value => ({
        name: LOCALIZATION_EN[value],
        id: value
    }))

    function closeTarget(i) {
        removeTab(i, n => TabsStore.update(id, groupIndex, n), TabsStore.getValue(id, groupIndex))
    }

    function removeView(i: number) {
        const tab = tabs[i]
        if (targetDialogElement)
            targetDialogElement = undefined

        if (tab.type === VIEWS.BLUEPRINT || tab.type === VIEWS.UI)
            targetDialogElement = ref.querySelector(`[data-closebuttontab="${i}"]`)
        else
            closeTarget(i)
    }

    onDestroy(() => {
        unsubscribeTabs()
        unsubscribe()
    })

</script>

<div class="wrapper" bind:this={ref} on:mousedown={_ => TabsStore.focused = ref}>
    <div></div>
    <div class="tabs">
        <Tabs
                removeMultipleTabs={removeMultipleTabs}
                focused={focused}
                updateView={switchView}
                templates={viewTemplates}
                allowDeletion={true}
                addNewTab={addNewTab}
                removeTab={removeView}
                tabs={tabs}
                currentTab={currentTab}
                setCurrentView={v => TabsStore.update(id, groupIndex, v)}
        />
        <Dialog
                targetBinding={targetDialogElement}
                handleClose={() => null}
                isOpen={targetDialogElement !== undefined}
                styles="padding: 4px"
        >
            <strong style="font-size: .8rem">{LOCALIZATION_EN.YOU_MAY_LOSE_DATA}</strong>
            <div data-inline="-">
                <button
                        on:click={() => {
                            closeTarget(parseInt(targetDialogElement.getAttribute("data-closebuttontab")))
                            targetDialogElement = undefined
                        }}
                        class="option"
                >
                    {LOCALIZATION_EN.OK}
                </button>
                <button class="option" on:click={() => targetDialogElement = undefined}>
                    {LOCALIZATION_EN.CANCEL}
                </button>
            </div>
        </Dialog>
    </div>
    <slot view={view} index={currentTab}/>
</div>

<style>
    .option {
        width: 100%;
        height: 20px;
        border: none;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;

    }

    .tabs {
        height: 30px;
        width: 100%;
    }
</style>