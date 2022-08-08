<script>
    import {onDestroy} from "svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Shading from "../components/options/ShadingOption.svelte";
    import Entity from "../../../libs/engine/libs/basic/Entity";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import ProbeComponent from "../../../libs/engine/libs/components/ProbeComponent";
    import TransformComponent from "../../../libs/engine/libs/components/TransformComponent";
    import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
    import CameraComponent from "../../../libs/engine/libs/components/CameraComponent";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import PointLightComponent from "../../../libs/engine/libs/components/PointLightComponent";
    import DirectionalLightComponent from "../../../libs/engine/libs/components/DirectionalLightComponent";
    import Layout from "../components/Layout.svelte";
    import DataStoreController from "../../../stores/DataStoreController";

    export let settings
    export let translate

    let ref
    let engine = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    onDestroy(() => unsubscribeEngine())

    const createCM = (asDiffuse) => {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        actor.components[COMPONENTS.PROBE] = new ProbeComponent()
        actor.components[COMPONENTS.PROBE].specularProbe = !asDiffuse
        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
        actor.components[COMPONENTS.TRANSFORM].translation = window.renderer.cursor.components[COMPONENTS.TRANSFORM].translation
        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
    }

</script>


<div class={"options"} bind:this={ref}>
    <div class="left-content">
        <Dropdown>
            <button slot="button" class="dropdown">
                <Icon>visibility</Icon>
                <div data-overflow="-">
                    {translate("VISIBLE")}
                </div>
            </button>

            <button on:click={() => {
                    DataStoreController.updateSettings({...settings, gridVisibility: !settings.gridVisibility})
                }}>
                {#if settings.gridVisibility}
                    <Icon>check</Icon>
                {/if}
                {translate("GRID")}
            </button>

            <button on:click={() => DataStoreController.updateSettings({...settings, iconsVisibility: !settings.iconsVisibility})}>
                {#if settings.iconsVisibility}
                    <Icon>check</Icon>
                {/if}
                {translate("ICONS")}
            </button>

            <button
                    on:click={() => {
                        const v = !settings.cameraAnimation
                        DataStoreController.updateSettings({...settings, cameraAnimation: v})
                        window.renderer.camera.animated = v
                    }}
            >
                {#if settings.cameraAnimation}
                    <Icon>check</Icon>
                {/if}
                {translate("CAM_ANIM")}
            </button>

            <button on:click={() => DataStoreController.updateSettings({...settings, background: !settings.background})}>
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
                        onFinish={v => DataStoreController.updateSettings({...settings, iconSize: v})}
                />
            </div>
        </Dropdown>

        <Dropdown>
            <button slot="button" class="dropdown">
                {translate("ADD")}
                <ToolTip>{translate("ADD_DETAILS")}</ToolTip>
            </button>

            <button
                    on:click={() => engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})}
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
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
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

                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
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


                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }}
            >
                <Icon>videocam</Icon>
                {translate("CAMERA")}
            </button>
        </Dropdown>
        <Layout translate={translate}/>
    </div>


    <div class="right-content">
        <Shading translate={translate}/>
    </div>
</div>

<style>
    .options {
        display: flex;

        width: 100%;
        padding: 0 2px;
        height: 23px;
        user-select: none;
        top: 20px;
        z-index: 10;
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

    .dropdown {
        display: flex;
        align-items: center;
        gap: 4px;

        width: fit-content;
        --color-to-apply: white;
        font-size: 0.7rem;
        height: 17px;
        border-radius: 3px;
        overflow: hidden;
        padding: 0 !important;
        padding-left: 4px !important;
        border: none !important;
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