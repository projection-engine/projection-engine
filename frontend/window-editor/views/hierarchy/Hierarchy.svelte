<script>
    import LOCALIZATION_EN from "../../../shared/static/LOCALIZATION_EN";
    import ViewHeader from "../../components/view/components/ViewHeader.svelte";

    import EngineHierarchyView from "./components/Tree.svelte";
    import {onDestroy, onMount} from "svelte";
    import HotKeysController from "../../../shared/lib/HotKeysController";
    import dragDrop from "../../../shared/components/drag-drop/drag-drop";
    import HierarchyController from "./lib/HierarchyController";
    import SettingsStore from "../../../shared/stores/SettingsStore";
    import viewportHotkeys from "../../templates/viewport-hotkeys";
    import Engine from "../../../../engine-core/Engine";
    import handleDrop from "./utils/handle-drop";
    import getDropdownHeaderStyles from "../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import EntityConstructor from "../../lib/controllers/EntityConstructor";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import Input from "../../../shared/components/input/Input.svelte";
    import NATIVE_COMPONENTS from "../inspector/static/NATIVE_COMPONENTS";

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

    const draggable = dragDrop()
    onMount(() => {
        draggable.onMount({
            targetElement: ref,
            onDrop: (entityDragged, event) => {
                const node = event.composedPath().find(n => n?.getAttribute?.("data-sveltenode") != null)?.getAttribute?.("data-sveltenode")
                handleDrop(event, entityDragged, node ? Engine.entities.map.get(node) : undefined)
            },
            onDragOver: (_, ev) => {
                if(ev.ctrlKey)
                    return `Drop to make child`;
                if(ev.shiftKey)
                    return `Drop to clone into...`;
                return `CTRL to parent | SHIFT to clone`
            }
        })
    })

    onDestroy(() => {
        HotKeysController.unbindAction(ref)
        unsubscribeSettings()
        draggable.onDestroy()
    })

</script>


<ViewHeader>
    <button data-sveltebuttondefault="-"
            on:click={() => HierarchyController.openTree()}
            data-svelteview-header-button="-"
    >
        <ToolTip content={LOCALIZATION_EN.SHOW_SELECTED}/>
        <Icon styles="font-size: .9rem">center_focus_strong</Icon>
    </button>
    <button data-sveltebuttondefault="-"
            on:click={() => EntityConstructor.createEmpty()}
            data-svelteview-header-button="-"
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
        <button data-sveltebuttondefault="-"  slot="button" data-svelteview-header-dropdown="-">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={LOCALIZATION_EN.COMPONENT_FILTER}/>
        </button>
        {#each NATIVE_COMPONENTS as component}
            <button data-sveltebuttondefault="-"
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
        data-svelteself={"-"}
        class="wrapper"
        style={isEmpty ? "background: transparent" : undefined}
        id={ID}
        bind:this={ref}
>
    <EngineHierarchyView
            openTree={openTree}
            setOpenTree={v => {
                openTree = v
                HierarchyController.updateHierarchy()
            }}
            setIsEmpty={v => isEmpty = v}
            inputValue={search}
            filteredComponent={filteredComponent}

            ID={ID}
    />
</div>


<style>
    .wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;

        height: 100%;
        max-height: 100%;

    }
</style>