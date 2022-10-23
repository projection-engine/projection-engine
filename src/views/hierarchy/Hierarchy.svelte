<script>
    import Localization from "../../templates/Localization";
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import {v4} from "uuid"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import EngineHierarchyView from "./components/View.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../libs/HotKeysController";
    import getNativeComponents from "../inspector/utils/get-native-components";
    import dragDrop from "../../components/drag-drop/drag-drop";
    import EngineStore from "../../stores/EngineStore";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities";
    import HierarchyController from "../../libs/HierarchyController";
    import SelectionStore from "../../stores/SelectionStore";
    import SettingsStore from "../../stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import VIEWS from "../../components/view/data/VIEWS";
    import EntityAPI from "../../../public/engine/lib/apis/EntityAPI";


    export let switchView = undefined
    export let orientation = undefined
    let search = ""
    const ID = v4()
    const translate = key => Localization.PROJECT.HIERARCHY[key]

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
                Localization.PROJECT.VIEWPORT.TITLE
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

                if (event.ctrlKey) {
                    EntityAPI.linkEntities(entityDragged, undefined)
                    SelectionStore.engineSelected = [entityDragged.id]
                    EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
                    HierarchyController.updateHierarchy()
                } else if (event.shiftKey) {
                    const clone = entityDragged.clone()

                    clone.parentCache = undefined
                    clone.parent = undefined

                    dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: clone})
                }
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
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <button
            on:click={() => {
                openTree = {...openTree, ...HierarchyController.openTree()}
            }}
            class="button">
        <ToolTip content={translate("SHOW_MAIN_ENTITY")}/>
        <Icon styles="font-size: .9rem">center_focus_strong</Icon>
    </button>
    <Input
            hasBorder={true}
            width="50%"
            height="22px"
            placeholder={translate("SEARCH")}
            searchString={search}
            setSearchString={v => search = v}
    />

    <Dropdown buttonStyles="margin-left: auto">
        <button slot="button" data-highlight={filteredComponent != null ? "-" : undefined} class="dropdown">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={translate("COMPONENT_FILTER")}/>
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
            translate={translate}
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
    .button{
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }
</style>