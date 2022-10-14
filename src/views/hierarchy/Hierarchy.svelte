<script>
    import Localization from "../../libs/libs/Localization";
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import Header from "../../components/view/components/ViewHeader.svelte";
    import {v4} from "uuid"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import EngineHierarchyView from "./components/View.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../libs/libs/HotKeysController";
    import getNativeComponents from "../inspector/utils/get-native-components";
    import dragDrop from "../../components/drag-drop/drag-drop";
    import EngineStore from "../../stores/EngineStore";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities";
    import {EntityAPI} from "../../../public/engine/production";
    import HierarchyController from "../../libs/HierarchyController";
    import SelectionStore from "../../stores/SelectionStore";
    import SettingsStore from "../../stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import VIEWS from "../../components/view/data/VIEWS";


    export let switchView = undefined
    export let orientation = undefined
    let search = ""
    const ID = v4()
    const translate = key => Localization.PROJECT.HIERARCHY[key]

    let filteredComponent = undefined
    let isEmpty = true
    let ref
    let settings
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
    <Input
            hasBorder={true}
            width={"100%"}
            height="22px"
            placeholder={translate("SEARCH")}
            searchString={search}
            setSearchString={v => search = v}
    />

    <Dropdown asButton={true}>
        <button slot="button" data-highlight={filteredComponent != null ? "-" : undefined} class="dropdown">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={translate("COMPONENT_FILTER")}/>
        </button>
        {#each nativeComponents as component}
            <button
                    data-highlight={component[0] === filteredComponent ?  "-" : undefined}
                    on:click={e => {
                        if(filteredComponent=== component[0] )
                            filteredComponent = undefined
                        else filteredComponent = component[0]
                            e.currentTarget.closeDropdown()
                    }}
                    class="button"
            >
                <Icon styles="font-size: .9rem">{component[2]}</Icon>
                {component[1]}
            </button>
        {/each}
    </Dropdown>
    {#if filteredComponent != null}
        <button on:click={() => filteredComponent = undefined} class="remove-button">
            <ToolTip content={translate("REMOVE_FILTER")}/>
            <Icon styles="font-size: .9rem">close</Icon>
        </button>
    {/if}
</Header>

<div
        data-self={"-"}
        class="wrapper"
        style={isEmpty ? "background: transparent" : undefined}
        id={ID}
        bind:this={ref}
>
    <EngineHierarchyView
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
    .remove-button{
        padding: 0;
        width: 1rem;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }
</style>