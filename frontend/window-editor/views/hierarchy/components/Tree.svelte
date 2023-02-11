<script lang="ts">
    import {onDestroy} from "svelte";
    import EntityTreeBranch from "./EntityTreeBranch.svelte";
    import ComponentTreeBranch from "./ComponentTreeBranch.svelte";
    import SelectionStore from "../../../../shared/stores/SelectionStore";
    import HierarchyController from "../../../lib/controllers/HierarchyController";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import viewportContext from "../../../templates/viewport-context";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import SettingsStore from "../../../../shared/stores/SettingsStore";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ContextMenuController from "../../../../shared/lib/context-menu/ContextMenuController";
    import Entity from "../../../../../engine-core/instances/Entity";


    export let ID: string
    export let isOnSearch: boolean
    export let openTree: { [key: string]: boolean }
    export let updateOpen: Function
    export let rootNode: Entity

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


{#if rootNode }
    <EntityTreeBranch
            {isOnSearch}
            entity={rootNode}
            depth={0}
            {selected}
            {lockedEntity}
            setLockedEntity={v => SelectionStore.lockedEntity = v}
            {openTree}
            {updateOpen}
    />
{:else}
    <div data-svelteempty="-">
        <Icon styles="font-size: 75px">account_tree</Icon>
        {LOCALIZATION_EN.HIERARCHY}
    </div>
{/if}
