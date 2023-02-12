<script lang="ts">
    import {onDestroy} from "svelte";
    import EntityTreeBranch from "./EntityTreeBranch.svelte";
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import HierarchyController from "../../../lib/controllers/HierarchyController";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
    import HierarchyToRenderElement from "../template/ToRenderElement";
    import Scrollable from "../../../../shared/components/scrollable/Scrollable.svelte";

    export let ID: string
    export let isOnSearch: boolean
    export let openTree: { [key: string]: boolean }
    export let updateOpen: Function
    export let toRender: HierarchyToRenderElement[]
    const internalID = crypto.randomUUID()

    let selected: Map<string, boolean>
    let lockedEntity

    const unsubscribeSettings = SettingsStore.getStore(v => {
        ContextMenuController.mount(
            viewportContext(v),
            ID
        )
    })

    const unsubscribeSelection = SelectionStore.getStore(() => {
        selected = SelectionStore.TARGET === SelectionStore.TYPES.ENGINE ? SelectionStore.map : SelectionStore.EMPTY_MAP
        lockedEntity = SelectionStore.lockedEntity
    })


    onDestroy(() => {
        HierarchyController.removeListener(internalID)
        unsubscribeSettings()
        unsubscribeSelection()
        ContextMenuController.destroy(ID)
    })
</script>


{#if toRender.length > 0}
    <Scrollable {toRender} rowHeight={23} let:element>
        {#if element.component}
            <ComponentTreeBranch
                    component={element.component}
                    depth={element.depth + 1}
                    setLockedEntity={v => SelectionStore.lockedEntity = v}
            />
        {:else}
            <EntityTreeBranch
                    {isOnSearch}
                    entity={element.node}
                    depth={element.depth}

                    {selected }
                    {lockedEntity}
                    setLockedEntity={v => SelectionStore.lockedEntity = v}
                    open={openTree}
                    {updateOpen}
            />
        {/if}
    </Scrollable>
{:else}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {LOCALIZATION_EN.HIERARCHY}
    </div>
{/if}
