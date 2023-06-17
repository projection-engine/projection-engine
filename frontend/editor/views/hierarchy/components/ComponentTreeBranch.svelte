<!--suppress ALL -->
<script lang="ts">
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Component from "../../../../../engine-core/instances/components/Component";
    import getComponentIcon from "../../../utils/get-component-icon";
    import getComponentLabel from "../../../utils/get-component-label";
    import updateSelection from "../utils/update-selection";


    export let depth: number
    export let component: Component
    export let setLockedEntity: Function

    $: icon = getComponentIcon(component.componentKey)
    $: label = getComponentLabel(component.componentKey)
    $: entity = component.entity
</script>


<div
        class="wrapper hierarchy-branch"
        class:element={true}
        data-svelteentity={entity.id}
        style={"padding-left:" +  (depth * 18 + "px;") + (component.entity.active ? "" : "opacity: .5") }
>
    <!--suppress JSUnresolvedReference -->
    <div class="info hierarchy-branch" data-sveltenode={entity.id}
         on:click={e => updateSelection(entity.id, e.ctrlKey)}>
        {#each {length: depth} as _, i}
            <div data-sveltevertdivider="-"
                 style={`border-left-style: ${i === 0 ? "solid" : "dashed"}; left: ${i * 18}px`} class="divider"></div>
        {/each}
        <div class="button-small hierarchy-branch"></div>
        <button
                class="button-icon hierarchy-branch"
                on:click={() => setLockedEntity(entity.id)}
        >
            <Icon styles="font-size: 1rem; color: var(--pj-accent-color-tertiary)">{icon}</Icon>
        </button>
        <small>{label}</small>
    </div>
</div>

<style>
    small {
        font-size: .7rem;
    }

    .divider {
        position: absolute;
        height: 23px;
        transform: translateX(.3rem);
        z-index: 10;
        background: none;
        border-left: var(--pj-border-secondary) 1px dashed;
    }
</style>