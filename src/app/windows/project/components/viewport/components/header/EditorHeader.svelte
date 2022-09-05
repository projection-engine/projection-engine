<script>
    import COMPONENTS from "../../../../libs/engine/production/data/COMPONENTS";
    import CameraComponent from "../../../../libs/engine/production/templates/CameraComponent";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ProbeComponent from "../../../../libs/engine/production/templates/ProbeComponent";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../../stores/templates/dispatch-renderer-entities";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import ShadingOption from "./editor/ShadingOption.svelte";
    import PointLightComponent from "../../../../libs/engine/production/templates/PointLightComponent";
    import DirectionalLightComponent from "../../../../libs/engine/production/templates/DirectionalLightComponent";
    import Entity from "../../../../libs/engine/production/templates/Entity";
    import MeshComponent from "../../../../libs/engine/production/templates/MeshComponent";
    import STATIC_MESHES from "../../../../libs/engine/static/STATIC_MESHES";
    import FALLBACK_MATERIAL from "../../../../libs/engine/production/data/FALLBACK_MATERIAL";
    import EditorRenderer from "../../../../libs/engine/editor/EditorRenderer";
    import SpriteComponent from "../../../../libs/engine/production/templates/SpriteComponent";
    import STATIC_TEXTURES from "../../../../libs/engine/static/STATIC_TEXTURES";
    import SettingsStore from "../../../../stores/SettingsStore";
    import ActiveFeatures from "./editor/ActiveFeatures.svelte";
    import AddEntity from "./editor/AddEntity.svelte";
    import GizmoSettings from "./editor/GizmoSettings.svelte";
    import ViewportActions from "../../../../libs/ViewportActions";
    import SelectionStore from "../../../../stores/SelectionStore";


    export let settings
    export let engine
    export let translate


</script>

<div class="left-content">
    <ActiveFeatures settings={settings}/>
    <Dropdown>
        <button slot="button" data-viewbutton="-">
            {translate("SELECT")}
        </button>

        <button on:click={() => ViewportActions.selectAll()}>
            {translate("ALL")}
        </button>

        <button on:click={() => ViewportActions.invertSelection()}>
            {translate("INVERT")}
        </button>

        <button on:click={() => SelectionStore.engineSelected = []}>
            {translate("NONE")}
        </button>
    </Dropdown>
    <AddEntity/>

</div>
<GizmoSettings settings={settings}/>
<div class="right-content">
    <ShadingOption translate={translate}/>
</div>

<style>

    .left-content {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-start;
        width: 100%;

    }

    .right-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;

    }

</style>