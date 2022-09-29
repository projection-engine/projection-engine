<script>
    import Localization from "../../../shared/libs/Localization";
    import Input from "../../../shared/components/input/Input.svelte";
    import Header from "../../../shared/components/view/components/Header.svelte";
    import {v4} from "uuid"
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import EngineHierarchyView from "./components/View.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../../shared/libs/HotKeysController";
    import getNativeComponents from "../inspector/utils/get-native-components";
    import dragDrop from "../../../shared/components/drag-drop/drag-drop";
    import EngineStore from "../../stores/EngineStore";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../stores/templates/dispatch-renderer-entities";
    import {EntityAPI} from "../../../../public/engine/production";
    import HierarchyController from "../../libs/HierarchyController";
    import SelectionStore from "../../stores/SelectionStore";
    import VIEWPORT_HOTKEYS from "../../templates/VIEWPORT_HOTKEYS";


    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    let search = ""
    const ID = v4()
    const translate = key => Localization.PROJECT.HIERARCHY[key]

    let filteredComponent = undefined
    let isEmpty = true
    let ref
    onMount(() => {
        HotKeysController.bindAction(
            ref,
            Object.values(VIEWPORT_HOTKEYS),
            "public",
            Localization.PROJECT.VIEWPORT.TITLE
        )
    })
    onDestroy(() => {
        HotKeysController.unbindAction(ref)
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
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <div data-vertdivider="-" style="margin: 0 2px;"></div>
    <Input
            hasBorder={true}
            width={"100%"}
            height="20px"
            placeholder={translate("SEARCH")}
            searchString={search}
            setSearchString={v => search = v}
    />

    <Dropdown hideArrow={true}>
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
</Header>

<div
        data-self={"-"}
        class="wrapper"
        style={hidden ? "display: none" :(isEmpty ? "background: transparent" : undefined)}
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
        background: linear-gradient(
                to bottom,
                var(--pj-background-tertiary),
                var(--pj-background-tertiary) 50%,
                #252525 50%,
                #252525
        );
        background-size: 100% 46px;
    }
</style>