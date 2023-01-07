<script>
    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import ViewHeader from "../../../../components/view/components/ViewHeader.svelte";

    import EngineHierarchyView from "./components/Tree.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../lib/utils/HotKeysController";
    import getNativeComponents from "../inspector/utils/get-native-components";
    import dragDrop from "../../../../components/drag-drop/drag-drop";
    import HierarchyController from "./lib/HierarchyController";
    import SettingsStore from "../../stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import Engine from "../../../../../engine-core/Engine";
    import handleDrop from "./utils/handle-drop";
    import getDropdownHeaderStyles from "../../../../components/dropdown/utils/get-dropdown-header-styles";
    import EntityConstructor from "../../lib/controllers/EntityConstructor";
    import Icon from "../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../components/input/Input.svelte";

    let search = ""
    const ID =crypto.randomUUID()

    let filteredComponent = undefined
    let isEmpty = true
    let ref
    let settings
    let openTree = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    $: {
        if (ref != null) {
            HotKeysController.bindAction(
                ref,
                Object.values(viewportHotkeys(settings)),
                "public",
                LOCALIZATION_EN.VIEWPORT
            )
        }
    }
    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeSettings()
    })

    $: nativeComponents = getNativeComponents()

    const draggable = dragDrop()
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (entityDragged, event) => {
                const node = event.composedPath().find(n => n?.getAttribute?.("data-node") != null)?.getAttribute?.("data-node")
                let dropTarget
                if (node)
                    dropTarget = Engine.entitiesMap.get(node)
                handleDrop(event, entityDragged, dropTarget)

            },
            onDragOver: () => `CTRL to parent | SHIFT to clone`
        })
    })

    onDestroy(() => draggable.onDestroy())
</script>


<ViewHeader>
    <button
            on:click={() => {
                openTree = {...openTree, ...HierarchyController.openTree()}
            }}
            data-view-header-button="-"
    >
        <ToolTip content={LOCALIZATION_EN.SHOW_MAIN_ENTITY}/>
        <Icon styles="font-size: .9rem">center_focus_strong</Icon>
    </button>
    <button
            on:click={() => EntityConstructor.createEmpty()}
            data-view-header-button="-"
    >
        <ToolTip content={LOCALIZATION_EN.CREATE_ENTITY}/>
        <Icon styles="font-size: .9rem">add</Icon>
    </button>
    <Input
            hasBorder={true}
            width="50%"
            height="22px"
            placeholder={LOCALIZATION_EN.SEARCH}
            inputValue={search}
            onChange={v => search = v}
    />

    <Dropdown buttonStyles={getDropdownHeaderStyles(filteredComponent != null ? "-" : undefined) + "margin-left: auto"}>
        <button slot="button" data-view-header-dropdown="-">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={LOCALIZATION_EN.COMPONENT_FILTER}/>
        </button>
        {#each nativeComponents as component}
            <button
                    on:click={e => {
                        if(filteredComponent=== component[0] )
                            filteredComponent = undefined
                        else filteredComponent = component[0]
                    }}
            >
                {#if component[0] === filteredComponent}
                    <Icon>check</Icon>
                {:else}
                    <div style="width: 1.1rem"></div>
                {/if}

                {component[1]}
            </button>
        {/each}
    </Dropdown>

</ViewHeader>

<div
        data-self={"-"}
        class="wrapper"
        style={isEmpty ? "background: transparent" : undefined}
        id={ID}
        bind:this={ref}
>
    <EngineHierarchyView
            openTree={openTree}
            setOpenTree={v => openTree = v}
            setIsEmpty={v => isEmpty = v}
            inputValue={search}
            filteredComponent={filteredComponent}

            ID={ID}
    />
</div>


<style>
    .dropdown {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .button {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;

        height: 100%;
        max-height: 100%;

    }

    .button {
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }
</style>