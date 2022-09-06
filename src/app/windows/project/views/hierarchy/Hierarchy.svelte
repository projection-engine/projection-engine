<script>
    import Localization from "../../../../libs/Localization";
    import Input from "../../../../components/input/Input.svelte";
    import Header from "../../../../components/view/components/Header.svelte";
    import {v4} from "uuid"
    import Icon from "../../../../components/icon/Icon.svelte";
    import EngineHierarchyView from "./views/EngineView.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import UIHierarchy from "./views/UIView.svelte";
    import COMPONENTS from "../../libs/engine/production/data/COMPONENTS";


    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined
    let search = ""
    const ID = v4()
    const translate = key => Localization.PROJECT.HIERARCHY[key]
    let viewTab = 0
    let filteredComponent = undefined
    let isEmpty = true
</script>


<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"account_tree"}
>
    <div data-vertdivider="-" style="	margin: 0 2px;"></div>
    <Dropdown hideArrow={true}>
        <button slot="button" class="dropdown">
            <Icon styles="font-size: .9rem">
                {#if viewTab === 0}
                    public
                {:else}
                    grid_view
                {/if}
            </Icon>
            <ToolTip>{translate("HIERARCHY_SOURCE")}</ToolTip>
        </button>
        <button on:click={() => viewTab = 0} class="button">
            {#if viewTab === 0}
                <Icon styles="font-size: .9rem">
                    check
                </Icon>
            {/if}
            {translate("ENGINE")}
        </button>
        <button on:click={() => viewTab = 1} class="button">
            {#if viewTab === 1}
                <Icon styles="font-size: .9rem">
                    check
                </Icon>
            {/if}
            {translate("UI")}
        </button>
    </Dropdown>

    <Input
            hasBorder={true}
            width={"100%"}
            height="20px"
            placeholder={translate("SEARCH")}
            searchString={search}
            setSearchString={v => search = v}
    />
    {#if viewTab === 0}
        <Dropdown hideArrow={true}>
            <button slot="button" class="dropdown">
                <Icon styles="font-size: .9rem">filter_alt</Icon>
                <ToolTip>{translate("COMPONENT_FILTER")}</ToolTip>
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
    {/if}
</Header>

    <div
            data-self={"-"}
            class="wrapper"
            style={hidden ? "display: none" :(isEmpty ? "background: transparent" : undefined)}
            id={ID}
    >
        {#if viewTab === 0}
            <EngineHierarchyView setIsEmpty={v => isEmpty = v} searchString={search.toLowerCase()} filteredComponent={filteredComponent} translate={translate} ID={ID}/>
        {:else}
            <UIHierarchy setIsEmpty={v => isEmpty = v} searchString={search.toLowerCase()} translate={translate} ID={ID}/>
        {/if}
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