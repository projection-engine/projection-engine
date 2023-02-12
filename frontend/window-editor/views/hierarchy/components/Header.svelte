<script>
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import HierarchyController from "../../../lib/controllers/HierarchyController";
    import Input from "../../../../shared/components/input/Input.svelte";
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import NATIVE_COMPONENTS from "../../inspector/static/NATIVE_COMPONENTS";
    import EntityFactory from "../../../lib/controllers/EntityFactory";

    export let filteredComponent, setFilteredComponent;
    export let search, setSearch;

</script>
<ViewHeader>
    <div data-svelteinline="-" style="justify-content: flex-start; width: 100%">
        <button data-sveltebuttondefault="-"
                on:click={() => HierarchyController.openTree()}
                data-svelteview-header-button="-"
        >
            <ToolTip content={LOCALIZATION_EN.SHOW_SELECTED}/>
            <Icon styles="font-size: .9rem">center_focus_strong</Icon>
        </button>
        <Input
                hasBorder={true}
                width="100%"
                height="22px"
                placeholder={LOCALIZATION_EN.SEARCH}
                inputValue={search}
                onChange={setSearch}
        />
    </div>
    <div data-svelteinline="-" style="justify-content: flex-end; padding: 0; gap: 6px; width: 100%">
        <Dropdown buttonStyles={getDropdownHeaderStyles(filteredComponent != null ? "-" : undefined)}>
            <button data-sveltebuttondefault="-" slot="button" data-svelteview-header-dropdown="-">
                <Icon styles="font-size: .9rem">filter_alt</Icon>
                <ToolTip content={LOCALIZATION_EN.COMPONENT_FILTER}/>
            </button>
            {#each NATIVE_COMPONENTS as component}
                <button
                        data-sveltebuttondefault="-"
                        on:click={_ => {
                            if(filteredComponent=== component[0])
                                setFilteredComponent(undefined)
                            else setFilteredComponent(component[0])
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
        <button data-sveltebuttondefault="-"
                on:click={() => EntityFactory.createEmpty(true)}
                data-svelteview-header-button="-"
                style="position: relative"
        >
            <ToolTip content={LOCALIZATION_EN.CREATE_COLLECTION}/>
            <Icon styles="font-size: .9rem">inventory_2</Icon>
        </button>
    </div>
</ViewHeader>