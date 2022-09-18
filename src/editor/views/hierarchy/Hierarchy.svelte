<script>
    import Localization from "../../../shared/libs/Localization";
    import Input from "../../../shared/components/input/Input.svelte";
    import Header from "../../../shared/components/view/components/Header.svelte";
    import {v4} from "uuid"
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import EngineHierarchyView from "./components/View.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";

    import COMPONENTS from "../../../../public/engine/static/COMPONENTS.json";
    import {onDestroy, onMount} from "svelte";
    import HotKeys from "../../components/metrics/libs/HotKeys";
    import getHotkeys from "../viewport/utils/get-hotkeys";


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
        HotKeys.bindAction(
            ref,
            getHotkeys(),
            "public",
            Localization.PROJECT.VIEWPORT.TITLE
        )
    })
    onDestroy(() => {
        HotKeys.unbindAction(ref)
    })
</script>


<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <div data-vertdivider="-" style="	margin: 0 2px;"></div>
    <Input
            hasBorder={true}
            width={"100%"}
            height="20px"
            placeholder={translate("SEARCH")}
            searchString={search}
            setSearchString={v => search = v}
    />

    <Dropdown hideArrow={true}>
        <button slot="button" class="dropdown">
            <Icon styles="font-size: .9rem">filter_alt</Icon>
            <ToolTip content={translate("COMPONENT_FILTER")}/>
        </button>
        {#each Object.keys(COMPONENTS) as key}
            <button on:click={() => filteredComponent=== key ? filteredComponent = undefined : filteredComponent = key}
                    class="button">
                {#if filteredComponent === key}
                    <Icon styles="font-size: .9rem">
                        check
                    </Icon>
                {/if}
                {translate(key)}
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
            searchString={search.toLowerCase()}
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
        display: grid;
        align-content: flex-start;
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;

        height: 100%;
        max-height: 100%;
        background: linear-gradient(
                to bottom,
                var(--pj-background-tertiary),
                var(--pj-background-tertiary) 50%,
                #252525 50%,
                #252525
        );
        /* The rectangle in which to repeat.
           It can be fully wide in this case */
        background-size: 100% 46px;
    }
</style>