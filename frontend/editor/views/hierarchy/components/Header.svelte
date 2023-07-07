<script>
    import ViewHeader from "../../../components/view/components/ViewHeader.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"

    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService"
    import Input from "../../../../shared/components/input/Input.svelte"
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles"
    import NATIVE_COMPONENTS from "../../inspector/static/NATIVE_COMPONENTS"
    import EntityFactoryService from "../../../services/engine/EntityFactoryService"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import EmptyIcon from "../../../../shared/components/icon/EmptyIcon.svelte"

    export let filteredComponent, setFilteredComponent
    export let search, setSearch

</script>
<ViewHeader>
    <div data-svelteinline="-" style="justify-content: flex-start; width: 100%">
        <button data-sveltebuttondefault="-"
                on:click={() => EntityHierarchyService.openTree()}
                data-svelteview-header-button="-"
        >
            <ToolTip content={LocalizationEN.SHOW_SELECTED}/>
            <Icon styles="font-size: .9rem">center_focus_strong</Icon>
        </button>
        <Input
                hasBorder={true}
                width="100%"
                height="22px"
                placeholder={LocalizationEN.SEARCH}
                inputValue={search}
                onChange={setSearch}
        />
    </div>
    <div data-svelteinline="-" style="justify-content: flex-end; padding: 0; gap: 6px; width: 100%">
        <Dropdown buttonStyles={getDropdownHeaderStyles(filteredComponent != null ? "-" : undefined)}>
            <button data-sveltebuttondefault="-" slot="button" data-svelteview-header-dropdown="-">
                <Icon styles="font-size: .9rem">filter_alt</Icon>
                <ToolTip content={LocalizationEN.COMPONENT_FILTER}/>
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
                        <EmptyIcon/>
                    {/if}

                    {component[1]}
                </button>
            {/each}
        </Dropdown>
        <button data-sveltebuttondefault="-"
                on:click={() => EntityFactoryService.createEmpty(true)}
                data-svelteview-header-button="-"
                style="position: relative"
        >
            <ToolTip content={LocalizationEN.CREATE_COLLECTION}/>
            <Icon styles="font-size: .9rem">inventory_2</Icon>
        </button>
    </div>
</ViewHeader>