<script lang="ts">
    import TreeBranchContent from "./EntityTreeBranchContent.svelte";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import EntityFactory from "../../../lib/controllers/EntityFactory";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Entity from "../../../../../engine-core/instances/Entity";
    import QueryAPI from "../../../../../engine-core/lib/utils/QueryAPI";
    import Component from "../../../../../engine-core/instances/components/Component";
    import getComponentIcon from "../../inspector/utils/get-component-icon";
    import getComponentLabel from "../../inspector/utils/get-component-label";

    export let depth: number
    export let component: Component
    export let key: Component

    $: icon = getComponentIcon(key)
    $: label = getComponentLabel(key)
</script>

<div
        class="wrapper hierarchy-branch"
        class:element={true}
        style={"padding-left:" +  (depth * 18 + "px;") + (component.entity.active ? "" : "opacity: .5") }
>
    <div class="button-icon hierarchy-branch">
        <Icon styles="font-size: 1rem; color: var(--pj-accent-color-tertiary)">{icon}</Icon>
    </div>

    <small>{label}</small>
</div>

<style>
    .element{
        background: none !important;
        gap: 2px;
    }
    small{
        font-size: .7rem;
    }
</style>