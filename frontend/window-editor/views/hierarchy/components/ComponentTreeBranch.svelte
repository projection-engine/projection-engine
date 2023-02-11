<script lang="ts">
    import TreeBranchContent from "./EntityTreeBranchContent.svelte";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import EntityFactory from "../../../lib/controllers/EntityFactory";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";
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
    <div class="info hierarchy-branch"    data-sveltenode={entity.id}
         on:click={e => updateSelection(entity.id, e.ctrlKey)}>

        <button
                class="button-icon hierarchy-branch"
                style={`--button-color: rgb(${entity.isCollection ? entity.colorIdentifier : [203, 158, 53]})`}
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
</style>