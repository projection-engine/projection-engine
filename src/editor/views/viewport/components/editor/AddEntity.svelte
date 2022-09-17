<script>
    import COMPONENTS from "../../../../../../public/engine/static/COMPONENTS.json";
    import Entity from "../../../../../../public/engine/production/instances/Entity";
    import STATIC_TEXTURES from "../../../../../../public/engine/static/resources/STATIC_TEXTURES";
    import dispatchRendererEntities, {ENTITY_ACTIONS} from "../../../../stores/templates/dispatch-renderer-entities";
    import Localization from "../../../../../shared/libs/Localization";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import STATIC_MESHES from "../../../../../../public/engine/static/resources/STATIC_MESHES";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import {vec3} from "gl-matrix";

    const translate = key => Localization.PROJECT.VIEWPORT[key]

    const addSprite = (entity, img) => {
        const e = entity.addComponent(COMPONENTS.SPRITE)
        e.imageID = img
        e.attributes = [1, 0]
    }
    const createCM = (asDiffuse, e) => {
        const actor = new Entity(undefined, asDiffuse ? "Diffuse probe" : "Specular probe")
        const p = actor.addComponent(COMPONENTS.PROBE)
        p.specularProbe = !asDiffuse
        addSprite(actor, STATIC_TEXTURES.PROBE)
        vec3.copy(actor.translation, window.engineCursor.translation)

        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        e.currentTarget.closeDropdown()
    }
    const createMesh = (id, e) => {
        const actor = new Entity(undefined, translate("MESH_RENDERER"))
        const m = actor.addComponent(COMPONENTS.MESH)
        m.meshID = id
        dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
        e.currentTarget.closeDropdown()
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
            e.currentTarget.closeDropdown()
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
            actor.addComponent(COMPONENTS.POINT_LIGHT)
            addSprite(actor, STATIC_TEXTURES.POINT_LIGHT)
            vec3.copy(actor.translation, window.engineCursor.translation)

            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.currentTarget.closeDropdown()
        }}
    >
        <Icon>lightbulb</Icon>
        {translate("POINT_LIGHT")}
    </button>

    <button
        on:click={(e) => {
            const actor = new Entity(undefined, translate("DIRECTIONAL_LIGHT"))
            addSprite(actor, STATIC_TEXTURES.DIRECTIONAL_LIGHT)
            vec3.copy(actor.translation, window.engineCursor.translation)

            actor.addComponent(COMPONENTS.DIRECTIONAL_LIGHT)

            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.currentTarget.closeDropdown()
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
            actor.addComponent(COMPONENTS.CAMERA)

            vec3.copy(actor.translation, window.engineCursor.translation)

            actor.scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]

            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.currentTarget.closeDropdown()
        }}
    >
        <Icon>videocam</Icon>
        {translate("CAMERA")}
    </button>
    <button
        on:click={(e) => {
            const actor = new Entity(undefined, translate("SPRITE_RENDERER"))
            actor.addComponent(COMPONENTS.SPRITE)
            dispatchRendererEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
            e.currentTarget.closeDropdown()
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