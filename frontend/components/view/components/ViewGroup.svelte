<script lang="ts">
    import Localization from "../../../static/LOCALIZATION_EN";
    import Tabs from "../../tabs/Tabs.svelte";
    import getViewIcon from "../utils/get-view-icon";
    import VIEWS from "../static/VIEWS";
    import TabsStore from "../../../editor/stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import SettingsStore from "../../../editor/stores/SettingsStore";
    import Portal from "../../../lib/Portal";
    import ViewTabItem from "../../../static/ViewTabItem";
    import Dialog from "../../dialog/Dialog.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";

    export let groupIndex
    export let views: ViewTabItem[]
    export let addNewTab
    export let removeTab
    export let switchView
    export let id
    export let settings

    let currentView
    let currentTab = 0
    let ref: HTMLElement
    let focused = false
    let targetDialogElement

    const unsubscribeSettings = SettingsStore.getStore(v => currentView = v.currentView)
    const unsubscribeTabs = TabsStore.getStore(_ => {
        currentTab = TabsStore.getValue(id, groupIndex)
        focused = TabsStore.focused === ref
    })


    $: currentTab = TabsStore.getValue(id, groupIndex, currentView)
    $: if (groupIndex != null) currentTab = 0
    $: view = views[currentTab]?.type
    $: tabs = views.map(v => {
        v.name = Localization[v.type]
        v.icon = getViewIcon(v.type)
        v.id = v.type
        return v
    })
    $: viewTemplates = Object.values(VIEWS).map(value => ({
        name: Localization[value],
        id: value
    }))

    function closeTarget(i) {
        removeTab(i, n => TabsStore.update(id, groupIndex, n), currentTab)
    }

    function removeView(i: number) {
        const tab = tabs[i]
        if(targetDialogElement)
            targetDialogElement = undefined

        if (tab.type === VIEWS.BLUEPRINT || tab.type === VIEWS.UI)
            targetDialogElement = ref.querySelector(`[data-closebuttontab="${i}"]`)
        else
            closeTarget(i)

    }

    onDestroy(() => {
        unsubscribeTabs()
        unsubscribeSettings()
    })

</script>

<div class="wrapper" bind:this={ref} on:mousedown={_ => TabsStore.focused = ref}>
    <div></div>
    <div class="tabs">
        <Tabs
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
    .option{
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