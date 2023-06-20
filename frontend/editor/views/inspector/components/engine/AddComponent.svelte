<script>
    import FilesStore from "../../../../../shared/stores/FilesStore"
    import {onDestroy} from "svelte"

    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte"
    import ComponentRow from "./ComponentRow.svelte"
    import LocalizationEN from "../../../../../../shared/LocalizationEN"
    import EditorUtil from "../../../../util/EditorUtil"

    export let entity

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown styles={"width: 20vw; padding: 4px;  overflow: hidden"}
          buttonStyles="border-radius: 3px; background: transparent; overflow: hidden;">
    <button data-sveltebuttondefault="-"
            slot="button"
            class="add-button"
            data-svelteoverflow="-"
    >
        <slot/>
    </button>
    {#if !entity.isCollection}
        <fieldset>
            <legend>{LocalizationEN.COMPONENTS}</legend>
            <div data-sveltebuttongroup="-">
                <ComponentRow entity={entity} offset={0}/>
                <ComponentRow entity={entity} offset={3}/>
                <ComponentRow entity={entity} offset={6}/>
                <ComponentRow entity={entity} offset={9}/>
            </div>
        </fieldset>

    {:else if store.components.length === 0}
        <div class="empty-wrapper">
            <div data-svelteempty="-">
                <Icon styles="font-size: 75px">texture</Icon>
                {LocalizationEN.NO_CUSTOM_COMPONENTS_FOUND}
            </div>
        </div>
    {/if}
    {#if store.components.length > 0}
        {#if !entity.isCollection}
            <div data-sveltedivider="-"></div>
        {/if}
        <fieldset>
            <legend>{LocalizationEN.CUSTOM_COMPONENTS}</legend>
            {#each store.components as script}

                <button
                        data-sveltebuttondefault="-"
                        data-svelteinline="-"
                        style="justify-content: flex-start; gap: 4px; border: none; background: var(--pj-background-secondary)"
                        on:click={(e) => {
                            EditorUtil.componentConstructor(entity, script.registryID).catch()
                            e.target.closeDropdown()
                        }}>
                    <Icon styles="font-size: 1rem">add</Icon>
                    {script.name}
                </button>

            {/each}
        </fieldset>
    {/if}

</Dropdown>

<style>
    .add-button {
        border: none;
        display: flex;
        align-items: center;
        gap: 4px;
        max-height: 22px;
        min-height: 22px;
        padding: 0 !important;
    }

    .empty-wrapper {
        width: 100%;
        height: 105px;
        position: relative;
    }
</style>