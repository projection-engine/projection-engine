<script>
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import TEXTURE_FORMATS from "../../../../../public/engine/static/texture/TEXTURE_FORMATS";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import AssetAPI from "../../../../libs/AssetAPI";
    import GPUResources from "../../../../../public/engine/GPUResources";
    import TEXTURE_FILTERING from "../../../../../public/engine/static/texture/TEXTURE_FILTERING";
    import TEXTURE_WRAPPING from "../../../../../public/engine/static/texture/TEXTURE_WRAPPING";

    import GPUController from "../../../../../public/engine/GPUController";

    const {shell} = window.require("electron")
    const B = "height: 22px; border-radius: 3px; background: var(--pj-background-tertiary); border:var(--pj-border-primary) 1px solid;"
    export let item
    export let data


    const updateAsset = async (key, value, d = data) => {
        let temp = {...d}
        if (key === "format")
            temp = {...temp, ...value}
        else
            temp = {...temp, [key]: value}


        if (key === "flipY" || temp === "flipX") {
            const canvas = document.createElement("canvas"),
                ctx = canvas.getContext('2d'),
                img = new Image()

            img.src = temp.base64
            await new Promise(resolve => {
                img.onload = () => {
                    const width = img.naturalWidth, height = img.naturalHeight

                    canvas.width = width
                    canvas.height = height
                    let scaleH = temp.flipX ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
                        scaleV = temp.flipY ? -1 : 1, // Set verical scale to -1 if flip vertical
                        posX = temp.flipX ? width * -1 : 0, // Set x position to -100% if flip horizontal
                        posY = temp.flipY ? height * -1 : 0; // Set y position to -100% if flip vertical

                    ctx.save();
                    ctx.scale(scaleH, scaleV);
                    ctx.drawImage(img, posX, posY, width, height);
                    ctx.restore();

                    temp.base64 = canvas.toDataURL()
                    resolve()
                }
            })

        }
        AssetAPI.updateAsset(item.registryID, JSON.stringify(temp)).catch()

        if (GPUResources.textures.get(item.registryID) != null) {
            GPUController.destroyTexture(item.registryID)
            GPUController.allocateTexture({
                ...temp,
                img: temp.base64
            }, item.registryID)
        }
        data = temp
    }
</script>

<fieldset>
    <legend>{Localization.FLIP_TEXTURE}</legend>
    <Checkbox label={Localization.FLIP_Y} checked={data?.flipY}
              handleCheck={ async () => await updateAsset("flipY", !data.flipY, data)}/>
    <Checkbox label={Localization.FLIP_X} checked={data?.flipX}
              handleCheck={async() => await updateAsset("flipX", !data.flipX, data)}/>
</fieldset>
<fieldset>
    <legend>{Localization.TEXTURE_FORMAT}</legend>
    <Dropdown buttonStyles={B}>
        <button slot="button" class="dropdown">
            {data?.internalFormat}
        </button>
        <button on:click={() => updateAsset("format", TEXTURE_FORMATS.RGB)}>
            RGB
        </button>
        <button on:click={() => updateAsset("format", TEXTURE_FORMATS.RGBA)}>
            RGBA
        </button>
        <button on:click={() => updateAsset("format", TEXTURE_FORMATS.SRGBA)}>
            SRGB8_ALPHA8
        </button>
    </Dropdown>
</fieldset>
<fieldset>
    <legend>{Localization.TEXTURE_FILTERING}</legend>

    <Dropdown buttonStyles={B}>
        <button slot="button" class="dropdown">
            {Localization[data?.minFilter]}
            <small>
                {Localization.TEXTURE_MIN_FILTER}
            </small>
        </button>
        <button on:click={() => updateAsset("minFilter",  TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_LINEAR)}>
            {Localization.NEAREST_MIPMAP_LINEAR}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_NEAREST)}>
            {Localization.LINEAR_MIPMAP_NEAREST}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR)}>
            {Localization.LINEAR_MIPMAP_LINEAR}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_NEAREST)}>
            {Localization.NEAREST_MIPMAP_NEAREST}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR)}>
            {Localization.LINEAR}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST)}>
            {Localization.NEAREST}
        </button>
    </Dropdown>

    <Dropdown buttonStyles={B}>
        <button slot="button" class="dropdown">

            {Localization[data?.magFilter]}
            <small>
                {Localization.TEXTURE_MAG_FILTER}
            </small>
        </button>
        <button on:click={() => updateAsset("magFilter",  TEXTURE_FILTERING.MAG.NEAREST)}>
            {Localization.NEAREST}
        </button>
        <button on:click={() => updateAsset("magFilter", TEXTURE_FILTERING.MAG.LINEAR)}>
            {Localization.LINEAR}
        </button>
    </Dropdown>
</fieldset>

<fieldset>
    <legend>{Localization.TEXTURE_WRAPPING}</legend>
    {#each ["wrapS", "wrapT"] as key}
        <Dropdown buttonStyles={B}>
            <button slot="button" class="dropdown">
                {#if data}
                    {Localization[data[key]]}
                {/if}
                <small>
                    {Localization[key]}
                </small>
            </button>
            <button on:click={() => updateAsset(key,  TEXTURE_WRAPPING.MIRRORED_REPEAT)}>
                {Localization.MIRRORED_REPEAT}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.REPEAT)}>
                {Localization.REPEAT}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_EDGE)}>
                {Localization.CLAMP_TO_EDGE}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_BORDER)}>
                {Localization.CLAMP_TO_BORDER}
            </button>
        </Dropdown>
    {/each}
</fieldset>

<div class="link"
     on:click={() => shell.openExternal("https://registry.khronos.org/OpenGL-Refpages/es2.0/xhtml/glTexParameter.xml")}>
    <Icon>help</Icon>
    {Localization.OPENGL_DOCS}
</div>

<style>
    .link {

        cursor: pointer;
        width: 100%;
        font-size: .75rem;

        display: flex;
        align-items: center;
        justify-content: flex-start;

        gap: 4px;
        border-bottom: transparent 1px solid;
    }

    .link:hover {
        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .dropdown {
        width: 100%;
        border: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>