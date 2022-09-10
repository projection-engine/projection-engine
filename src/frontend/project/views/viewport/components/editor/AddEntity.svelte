<script>
    import COMPONENTS from "../../../../../../../public/engine/production/data/COMPONENTS";
    import SpriteComponent from "../../../../../../../public/engine/production/components/rendering/SpriteComponent";
    import Entity from "../../../../../../../public/engine/production/instances/entity/Entity";
    import ProbeComponent from "../../../../../../../public/engine/production/components/rendering/ProbeComponent";
    import STATIC_TEXTURES from "../../../../../../../public/engine/static/STATIC_TEXTURES";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../../stores/templates/dispatch-renderer-entities";
    import MeshComponent from "../../../../../../../public/engine/production/components/rendering/MeshComponent";
    import FALLBACK_MATERIAL from "../../../../../../../public/engine/production/data/FALLBACK_MATERIAL";
    import Localization from "../../../../../libs/Localization";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import CameraComponent from "../../../../../../../public/engine/production/components/misc/CameraComponent";
    import STATIC_MESHES from "../../../../../../../public/engine/static/STATIC_MESHES";
    import PointLightComponent
        from "../../../../../../../public/engine/production/components/rendering/PointLightComponent";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import DirectionalLightComponent
        from "../../../../../../../public/engine/production/components/rendering/DirectionalLightComponent";

    const translate = key => Localization.PROJECT.VIEWPORT[key]

    const addSprite = (entity, img) => {
        entity.components[COMPONENTS.SPRITE] = new SpriteComponent(img)
        entity.components[COMPONENTS.SPRITE].attributes = [1, 0]
    }
    const createCM = (asDiffuse, e) => {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        actor.components[COMPONENTS.PROBE] = new ProbeComponent()
        actor.components[COMPONENTS.PROBE].specularProbe = !asDiffuse
        addSprite(actor, STATIC_TEXTURES.PROBE)
        actor.translation = [...window.engineCursor.translation]
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        e.target.closeDropdown()
    }
    const createMesh = (id, e) => {
        const actor = new Entity(undefined, translate("MESH_RENDERER"))
        actor.components[COMPONENTS.MESH] = new MeshComponent(id, FALLBACK_MATERIAL)
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        e.target.closeDropdown()
    }

</script>

<Dropdown>
    <button slot="button" data-viewbutton="-">
        {translate("ADD")}
        <ToolTip content={translate("ADD_DETAILS")}/>
    </button>


    <button
        on:click={(e) => {
            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: new Entity()})
            e.target.closeDropdown()
        }}
    >
        <Icon>inventory_2</Icon>
        {translate("EMPTY_ENTITY")}
    </button>
    <div class={"divider-wrapper"}>
        {translate("MESHES")}
        <div data-divider="-"></div>
    </div>
    <button on:click={(e) => createMesh(STATIC_MESHES.PRODUCTION.CUBE, e)}>
        <Icon>category</Icon>
        {translate("CUBE")}
    </button>
    <button on:click={(e) => createMesh(STATIC_MESHES.PRODUCTION.SPHERE, e)}>
        <Icon>category</Icon>
        {translate("ICO_SPHERE")}
    </button>
    <button on:click={(e) => createMesh(STATIC_MESHES.PRODUCTION.PLANE, e)}>
        <Icon>category</Icon>
        {translate("PLANE")}
    </button>
    <button on:click={(e) => createMesh(STATIC_MESHES.PRODUCTION.CYLINDER, e)}>
        <Icon>category</Icon>
        {translate("CYLINDER")}
    </button>


    <div class={"divider-wrapper"}>
        {translate("LIGHTS")}
        <div data-divider="-"></div>
    </div>
    <button
        on:click={(e) =>  {
            const actor = new Entity(undefined, translate("POINT_LIGHT"))
            actor.components[COMPONENTS.POINT_LIGHT] = new PointLightComponent()
            addSprite(actor, STATIC_TEXTURES.POINT_LIGHT)
            actor.translation = [...window.engineCursor.translation]
            actor.lockedRotation = true
            actor.lockedScaling = true

            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.target.closeDropdown()
        }}
    >
        <Icon>lightbulb</Icon>
        {translate("POINT_LIGHT")}
    </button>

    <button
        on:click={(e) => {
            const actor = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))
            addSprite(actor, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
            actor.translation = [...window.engineCursor.translation]
            actor.lockedRotation = true
            actor.lockedScaling = true
            actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new DirectionalLightComponent(undefined, actor)

            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.target.closeDropdown()
        }}
    >
        <Icon>light_mode</Icon>
        {translate("DIRECTIONAL_LIGHT")}
    </button>

    <div class={"divider-wrapper"}>
        {translate("AMBIENT")}
        <div data-divider="-"></div>
    </div>

    <button on:click={(e) => createCM(false, e)}>
        <Icon>lens_blur</Icon>
        {translate("SPECULAR_PROBE")}
    </button>
    <button on:click={(e) => createCM(true, e)}>
        <Icon>lens_blur</Icon>
        {translate("DIFFUSE_PROBE")}
    </button>
    <div class={"divider-wrapper"}>
        {translate("UTILS")}
        <div data-divider="-"></div>
    </div>
    <button
        on:click={(e) => {
            const actor = new Entity(undefined, translate("CAMERA"))
            actor.components[COMPONENTS.CAMERA] = new CameraComponent()

            actor.translation = [...window.engineCursor.translation]
            actor.rotation = [0, 0, 0]
            actor.scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
            actor.lockedScaling = true
            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.target.closeDropdown()
        }}
    >
        <Icon>videocam</Icon>
        {translate("CAMERA")}
    </button>
    <button
        on:click={(e) => {
            const actor = new Entity(undefined, translate("SPRITE_RENDERER"))
            actor.components[COMPONENTS.SPRITE] = new SpriteComponent()
            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.target.closeDropdown()
        }}
    >
        <Icon>image</Icon>
        {translate("SPRITE")}
    </button>
</Dropdown>


<style>
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