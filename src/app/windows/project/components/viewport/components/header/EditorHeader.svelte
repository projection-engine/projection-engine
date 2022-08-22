<script>
    import COMPONENTS from "../../../../libs/engine/production/data/COMPONENTS";
    import CameraComponent from "../../../../libs/engine/production/templates/components/CameraComponent";
    import TransformComponent from "../../../../libs/engine/production/templates/components/TransformComponent";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ProbeComponent from "../../../../libs/engine/production/templates/components/ProbeComponent";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../../stores/templates/dispatch-renderer-entities";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import RendererStoreController from "../../../../stores/RendererStoreController";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Range from "../../../../../../components/range/Range.svelte";
    import ShadingOption from "./ShadingOption.svelte";
    import PointLightComponent from "../../../../libs/engine/production/templates/components/PointLightComponent";
    import DirectionalLightComponent
        from "../../../../libs/engine/production/templates/components/DirectionalLightComponent";
    import Entity from "../../../../libs/engine/production/templates/basic/Entity";


    export let settings
    export let engine
    export let translate

    const createCM = (asDiffuse) => {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        actor.components[COMPONENTS.PROBE] = new ProbeComponent()
        actor.components[COMPONENTS.PROBE].specularProbe = !asDiffuse
        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        actor.components[COMPONENTS.TRANSFORM].translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
    }

</script>

<div class="left-content">

    <Dropdown>
        <button slot="button" class="dropdown">
            <Icon styles="font-size: 1rem">visibility</Icon>
            <div data-overflow="-">
                {translate("VISIBLE")}
            </div>
        </button>

        <button on:click={() => {
                    RendererStoreController.updateSettings({...settings, gridVisibility: !settings.gridVisibility})
                }}>
            {#if settings.gridVisibility}
                <Icon>check</Icon>
            {/if}
            {translate("GRID")}
        </button>

        <button on:click={() => RendererStoreController.updateSettings({...settings, iconsVisibility: !settings.iconsVisibility})}>
            {#if settings.iconsVisibility}
                <Icon>check</Icon>
            {/if}
            {translate("ICONS")}
        </button>

        <button
                on:click={() => RendererStoreController.updateSettings({...settings, cameraAnimation: settings.cameraAnimation})}
        >
            {#if settings.cameraAnimation}
                <Icon>check</Icon>
            {/if}
            {translate("CAM_ANIM")}
        </button>

        <button on:click={() => RendererStoreController.updateSettings({...settings, background: !settings.background})}>
            {#if settings.background}
                <Icon>check</Icon>
            {/if}
            {translate("BACKGROUND")}
        </button>

        <div class={"range-wrapper"}>
            <Range
                    label={translate("ICON_SIZE")}
                    value={settings.iconSize}
                    maxValue={5} minValue={.1}
                    onFinish={v => RendererStoreController.updateSettings({...settings, iconSize: v})}
            />
        </div>
    </Dropdown>

    <Dropdown>
        <button slot="button" class="dropdown">
            {translate("ADD")}
            <ToolTip>{translate("ADD_DETAILS")}</ToolTip>
        </button>

        <button
                on:click={() => dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})}
        >
            <Icon>inventory_2</Icon>
            {translate("EMPTY_ENTITY")}
        </button>
        <div class={"divider-wrapper"}>
            {translate("LIGHTS")}
            <div data-divider="-"></div>
        </div>
        <button
                on:click={() =>  {
                        const actor = new Entity(undefined, translate("POINT_LIGHT"))
                        actor.components[COMPONENTS.POINT_LIGHT] = new PointLightComponent()
                        const transformComponent = new TransformComponent()
                        transformComponent.translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        transformComponent.lockedRotation = true
                        transformComponent.lockedScaling = true
                        actor.components[COMPONENTS.TRANSFORM] = transformComponent
                        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }}
        >
            <Icon>lightbulb</Icon>
            {translate("POINT_LIGHT")}
        </button>

        <button
                on:click={() => {
                        const actor = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))

                        const transformComponent = new TransformComponent()
                        transformComponent.translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        transformComponent.lockedRotation = true
                        transformComponent.lockedScaling = true
                        actor.components[COMPONENTS.TRANSFORM] = transformComponent
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new DirectionalLightComponent(undefined, actor)

                        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }}
        >
            <Icon>light_mode</Icon>
            {translate("DIRECTIONAL_LIGHT")}
        </button>


        <div class={"divider-wrapper"}>
            {translate("AMBIENT")}
            <div data-divider="-"></div>
        </div>


        <button on:click={() => createCM()}>
            <Icon>lens_blur</Icon>
            {translate("SPECULAR_PROBE")}
        </button>
        <button on:click={() => createCM(true)}>
            <Icon>lens_blur</Icon>
            {translate("DIFFUSE_PROBE")}
        </button>
        <div class={"divider-wrapper"}>
            {translate("UTILS")}
            <div data-divider="-"></div>
        </div>
        <button
                on:click={() => {
                        const actor = new Entity(undefined, translate("CAMERA"))
                        actor.components[COMPONENTS.CAMERA] = new CameraComponent()

                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
                        actor.components[COMPONENTS.TRANSFORM].rotation = [0, 0, 0]
                        actor.components[COMPONENTS.TRANSFORM].scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true


                        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }}
        >
            <Icon>videocam</Icon>
            {translate("CAMERA")}
        </button>
    </Dropdown>
</div>

<div class="right-content">
    <ShadingOption translate={translate}/>
</div>

<style>
    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;

        width: fit-content;
        --color-to-apply: white;
        font-size: 0.7rem;
        height: 18px;
        border-radius: 3px;
        overflow: hidden;
        padding: 0 0 0 4px;
        border: none;
    }

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

    .range-wrapper {
        user-select: none;
        display: flex;
        align-items: center;
        padding: 4px;
        gap: 4px;
        color: var(--pj-color-secondary);
    }

    .divider-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        color: var(--pj-color-primary);
        gap: 8px;
        font-size: 0.7rem !important;
        padding: 2px 6px 0;
        overflow: hidden;
    }
</style>