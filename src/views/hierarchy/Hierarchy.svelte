<script>
    import Localization from "../../templates/LOCALIZATION_EN";
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import {v4} from "uuid"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import EngineHierarchyView from "./components/View.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../lib/utils/HotKeysController";
    import getNativeComponents from "../inspector/utils/get-native-components";
    import dragDrop from "../../components/drag-drop/drag-drop";
    import HierarchyController from "../../lib/controllers/HierarchyController";
    import SettingsStore from "../../stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import VIEWS from "../../components/view/static/VIEWS";
    import Engine from "../../../public/engine/Engine";
    import handleDrop from "./utils/handle-drop";

    export let switchView = undefined
    export let orientation = undefined
    let search = ""
    const ID = v4()

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
                Localization.VIEWPORT
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
                const node = event.path.find(n => n?.getAttribute?.("data-node") != null)?.getAttribute?.("data-node")
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


<Header
        currentView={VIEWS.HIERARCHY}
        orientation={orientation}
        switchView={switchView}
        title={Localization.HIERARCHY}
        icon={"account_tree"}
>
    <button
            on:click={() => {
                openTree = {...openTree, ...HierarchyController.openTree()}
            }}
            class="button">
        <ToolTip content={Localization.SHOW_MAIN_ENTITY}/>
        <Icon styles="font-size: .9rem">center_focus_strong</Icon>
    </button>
    <Input
            hasBorder={true}
            width="50%"
            height="22px"
            placeholder={Localization.SEARCH}
            searchString={search}
            setSearchString={v => search = v}
    />

    <Dropdown buttonStyles="margin-left: auto">
        <button slot="button" data-highlight={filteredComponent != null ? "-" : undefined} class="dropdown">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={Localization.COMPONENT_FILTER}/>
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

</Header>

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
            searchString={search}
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