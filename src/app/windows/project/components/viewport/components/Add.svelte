<script>
    import EnglishLocalization from "../../../../../static/EnglishLocalization";
    import {get} from "svelte/store";
    import {engine as engineStore} from "../../../stores/engine-store";
    import Entity from "../../../libs/engine/basic/Entity";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import ProbeComponent from "../../../libs/engine/components/ProbeComponent";
    import TransformComponent from "../../../libs/engine/components/TransformComponent";
    import {ENTITY_ACTIONS} from "../../../libs/engine-extension/entityReducer";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import CameraComponent from "../../../libs/engine/components/CameraComponent";
    import PointLightComponent from "../../../libs/engine/components/PointLightComponent";
    import DirectionalLightComponent from "../../../libs/engine/components/DirectionalLightComponent";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";

    const engine = get(engineStore)
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
    const translate = (key) => EnglishLocalization.PROJECT.VIEWPORT[key]
</script>

<Dropdown>
    <button slot="button">
        {translate("ADD")}
        <ToolTip>{translate("ADD_DETAILS")}</ToolTip>
    </button>

    <div class={"divider-wrapper"}>
        {translate("LIGHTS")}
        <div class={"divider"}></div>
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
        <Icon styles={"font-size: 1.1rem"}>lightbulb</Icon>
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
        <Icon styles={"font-size: 1.1rem"}>light_mode</Icon>
        {translate("DIRECTIONAL_LIGHT")}
    </button>

    <div class={"divider-wrapper"}>
        {translate("AMBIENT")}
        <div class={"divider"}></div>
    </div>


    <button on:click={() => createCM()}>
        <Icon styles={"font-size: 1.1rem"}>lens_blur</Icon>
        {translate("SPECULAR_PROBE")}
    </button>
    <button on:click={() => createCM(true)}>
        <Icon styles={"font-size: 1.1rem"}>lens_blur</Icon>
        {translate("DIFFUSE_PROBE")}
    </button>
    <div class={"divider-wrapper"}>
        {translate("UTILS")}
        <div class={"divider"}></div>
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
        <Icon styles={"font-size: 1.1rem"}>videocam</Icon>
        {translate("CAMERA")}
    </button>
</Dropdown>

<style>
    .divider-wrapper {
        padding: 4px 4px 0;
        font-size: .75rem;
        font-weight: 550;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .divider {
        height: 2px;
        background: var(--pj-border-primary);
        width: 100%;
    }
</style>