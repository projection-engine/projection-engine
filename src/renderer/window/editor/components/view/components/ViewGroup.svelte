<script lang="ts">

    import Tabs from "../../tabs/Tabs.svelte";
    import VIEWS from "../static/VIEWS";
    import TabsStore from "../../../../shared/stores/TabsStore";
    import {onDestroy, onMount} from "svelte";
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import ViewTabItem from "../../../static/ViewTabItem";
    import Dialog from "../../../../shared/components/dialog/Dialog.svelte";
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";
    import ViewsUtil from "../../../util/ViewsUtil";
    import TabsStoreUtil from "../../../util/TabsStoreUtil";

    const COMPONENT_ID = crypto.randomUUID()

    export let groupIndex
    export let views: ViewTabItem[]
    export let addNewTab
    export let removeTab
    export let removeMultipleTabs
    export let switchView
    export let id

    let currentTab = 0
    let ref: HTMLElement
    let focused = false
    let targetDialogElement

    function update() {
        currentTab = TabsStoreUtil.getCurrentTabByCurrentView(id, groupIndex)
    }

    $: localTabViews = views.map(v => {
        v.name = LocalizationEN[v.type]
        v.icon =  ViewsUtil.getViewIcon(v.type)
        v.id = v.type
        return v
    })
    $: viewTemplates = Object.values(VIEWS).map(value => ({
        name: LocalizationEN[value],
        id: value
    }))

    function closeTarget(i) {
        removeTab(i, n => TabsStoreUtil.updateByAttributes(id, groupIndex, n), TabsStoreUtil.getCurrentTabByCurrentView(id, groupIndex))
    }

    function removeView(i: number) {
        const tab = localTabViews[i]
        if (targetDialogElement)
            targetDialogElement = undefined

        if (tab.type === VIEWS.SHADER_EDITOR)
            targetDialogElement = ref.querySelector(`[data-svelteclosebuttontab="${i}"]`)
        else
            closeTarget(i)
    }

    onMount(() => {
        TabsStore.getInstance().addListener(COMPONENT_ID, data => focused = data.focused === ref, ["focused"])
        SettingsStore.getInstance().addListener(COMPONENT_ID,         update, ["currentView"])
    })
    onDestroy(() => {
        TabsStore.getInstance().removeListener(COMPONENT_ID)
        SettingsStore.getInstance().removeListener(COMPONENT_ID)
    })

</script>

<div class="wrapper" bind:this={ref} on:mousedown={() => TabsStoreUtil.setFocusedTab(ref)}>
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
                tabs={localTabViews}
                currentTab={currentTab}
                setCurrentView={v => TabsStoreUtil.updateByAttributes(id, groupIndex, v)}
        />
        <Dialog
                targetBinding={targetDialogElement}
                handleClose={() => null}
                isOpen={targetDialogElement !== undefined}
                styles="padding: 4px"
        >
            <strong style="font-size: .8rem">{LocalizationEN.YOU_MAY_LOSE_DATA}</strong>
            <div data-svelteinline="-">
                <button data-sveltebuttondefault="-"
                        on:click={() => {
                            closeTarget(parseInt(targetDialogElement.getAttribute("data-svelteclosebuttontab")))
                            targetDialogElement = undefined
                        }}
                        class="option"
                >
                    {LocalizationEN.OK}
                </button>
                <button data-sveltebuttondefault="-" class="option" on:click={() => targetDialogElement = undefined}>
                    {LocalizationEN.CANCEL}
                </button>
            </div>
        </Dialog>
    </div>
    <slot view={views[currentTab]} index={currentTab}/>
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