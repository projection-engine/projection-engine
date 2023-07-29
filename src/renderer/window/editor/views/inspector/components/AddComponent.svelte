<script lang="ts">
    import ContentBrowserStore from "../../../../shared/stores/ContentBrowserStore"
    import {onDestroy, onMount} from "svelte"

    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte"
    import ComponentRow from "./ComponentRow.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EditorUtil from "../../../util/EditorUtil"
    import NATIVE_COMPONENTS from "../static/NATIVE_COMPONENTS";
    import Entity from "../../../../../engine/core/instances/Entity";
    import EditorActionHistory from "../../../services/EditorActionHistory";

    const COMPONENT_ID = crypto.randomUUID()
    export let entity: Entity

    let components = []
    let scripts = []

    onMount(() => ContentBrowserStore.getInstance().addListener(COMPONENT_ID, data => scripts = data.components, ["components"]))
    onDestroy(() => ContentBrowserStore.getInstance().removeListener(COMPONENT_ID))

    $:components = [
        ...scripts.map(s => ({type: "script", data: s})),
        ...NATIVE_COMPONENTS
            .filter(native => !entity.components.has(native[0]))
            .map(n => ({
                type: "native",
                data: n
            }))
    ]

</script>


<Dropdown
        styles="width: 20vw; padding: 4px;  overflow: hidden"
        buttonStyles="min-height: 22px, max-height: 22px; "
>
    <button
            data-sveltebuttondefault="-"
            data-svelteinline="-"
            slot="button"
    >
        <Icon styles="font-size: 1rem">add</Icon>
        {LocalizationEN.ADD_COMPONENT}
    </button>
    {#each components as component}
        {#if component.type === "native"}
            <button
                    data-sveltebuttondefault="-"
                    data-svelteinline="-"
                    on:click={(e) =>{
                        EditorActionHistory.save(entity)
                        entity.addComponent(component.data[0])
                        EditorActionHistory.save(entity)
                        e.target.closeDropdown()
                    }}
            >
                <Icon styles="font-size: 1rem">{component.data[2]}</Icon>
                <small data-svelteoverflow="-">{component.data[1]}</small>
            </button>
        {:else}
            <button
                    data-sveltebuttondefault="-"
                    data-svelteinline="-"
                    on:click={(e) => {
                        EditorUtil.componentConstructor(entity, component.data.registryID).catch(console.error)
                        e.target.closeDropdown()
                    }}>
                <Icon styles="font-size: 1rem">add</Icon>
                {component.data.name}
            </button>
        {/if}
    {/each}
</Dropdown>

<style>
    button {
        justify-content: flex-start;
        gap: 4px;
        max-height: 22px;
        min-height: 22px;
        border: none;
        width: 100%;
    }
</style>
