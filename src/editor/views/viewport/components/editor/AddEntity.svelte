<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import STATIC_MESHES from "../../../../../../public/engine/static/resources/STATIC_MESHES";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import EntityConstructor from "../../../../libs/EntityConstructor";

    const translate = key => Localization.PROJECT.VIEWPORT[key]


</script>

<Dropdown>
    <button slot="button" data-viewbutton="-">
        {translate("ADD")}
        <ToolTip content={translate("ADD_DETAILS")}/>
    </button>


    <button on:click={EntityConstructor.createEmpty}>
        <Icon>inventory_2</Icon>
        {translate("EMPTY_ENTITY")}
    </button>
    <div class={"divider-wrapper"}>
        {translate("MESHES")}
        <div data-divider="-"></div>
    </div>
    <button on:click={e => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CUBE, e)}>
        <Icon>category</Icon>
        {translate("CUBE")}
    </button>
    <button on:click={e => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.SPHERE, e)}>
        <Icon>category</Icon>
        {translate("ICO_SPHERE")}
    </button>
    <button on:click={e => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.PLANE, e)}>
        <Icon>category</Icon>
        {translate("PLANE")}
    </button>
    <button on:click={e => EntityConstructor.createMesh(STATIC_MESHES.PRODUCTION.CYLINDER, e)}>
        <Icon>category</Icon>
        {translate("CYLINDER")}
    </button>


    <div class={"divider-wrapper"}>
        {translate("LIGHTS")}
        <div data-divider="-"></div>
    </div>
    <button on:click={EntityConstructor.createPointLight}>
        <Icon>lightbulb</Icon>
        {translate("POINT_LIGHT")}
    </button>

    <button on:click={EntityConstructor.createDirectionalLight}>
        <Icon>light_mode</Icon>
        {translate("DIRECTIONAL_LIGHT")}
    </button>

    <div class={"divider-wrapper"}>
        {translate("AMBIENT")}
        <div data-divider="-"></div>
    </div>

    <button on:click={e => EntityConstructor.createProbe(false,e)}>
        <Icon>lens_blur</Icon>
        {translate("SPECULAR_PROBE")}
    </button>
    <button on:click={e => EntityConstructor.createProbe(true,e)}>
        <Icon>lens_blur</Icon>
        {translate("DIFFUSE_PROBE")}
    </button>
    <div class={"divider-wrapper"}>
        {translate("UTILS")}
        <div data-divider="-"></div>
    </div>
    <button
            on:click={EntityConstructor.createCamera}
    >
        <Icon>videocam</Icon>
        {translate("CAMERA")}
    </button>
    <button
            on:click={EntityConstructor.createSprite}
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