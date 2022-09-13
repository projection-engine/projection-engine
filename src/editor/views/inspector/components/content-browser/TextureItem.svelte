<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import TEXTURE_FORMATS from "../../../../../../public/engine/static/texture/TEXTURE_FORMATS";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import TEXTURE_FILTERING from "../../../../../../public/engine/static/texture/TEXTURE_FILTERING";
    import TEXTURE_WRAPPING from "../../../../../../public/engine/static/texture/TEXTURE_WRAPPING";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";

    const {shell} = window.require("electron")
    const B = "height: 35px; border-radius: 3px; background: var(--pj-background-tertiary); border:var(--pj-border-primary) 1px solid;"
    export let item
    export let data

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    const updateAsset = async (key, value, d=data) => {
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

                    ctx.save(); // Save the current state
                    ctx.scale(scaleH, scaleV); // Set scale to flip the image
                    ctx.drawImage(img, posX, posY, width, height); // draw the image
                    ctx.restore();

                    temp.base64 = canvas.toDataURL()
                    resolve()
                }
            })

        }
        alert.pushAlert(translate("UPDATING_ASSET"), "alert")
        AssetAPI.updateAsset(item.registryID, JSON.stringify(temp)).catch()

        if (GPU.textures.get(item.registryID) != null) {
            alert.pushAlert(translate("ALLOCATING_TEXTURE"), "alert")
            GPU.destroyTexture(item.registryID)
            GPU.allocateTexture({
                ...temp,
                img: temp.base64
            }, item.registryID)
        }
        data = temp
    }
</script>
<Accordion title={translate("FLIP_TEXTURE")}>
    <Checkbox label={translate("FLIP_Y")} checked={data?.flipY}
              handleCheck={ async () => await updateAsset("flipY", !data.flipY, data)}/>
    <Checkbox label={translate("FLIP_X")} checked={data?.flipX}
              handleCheck={async() => await updateAsset("flipX", !data.flipX, data)}/>
</Accordion>

<Accordion title={translate("TEXTURE_FORMAT")}>
    <Dropdown asButton="true" buttonStyles={B}>
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
</Accordion>
<Accordion title={translate("TEXTURE_FILTERING")}>

    <Dropdown asButton="true" buttonStyles={B}>
        <button slot="button" class="dropdown">
            {translate(data?.minFilter)}
            <small>
                {translate("TEXTURE_MIN_FILTER")}
            </small>
        </button>
        <button on:click={() => updateAsset("minFilter",  TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_LINEAR)}>
            {translate("NEAREST_MIPMAP_LINEAR")}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_NEAREST)}>
            {translate("LINEAR_MIPMAP_NEAREST")}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR)}>
            {translate("LINEAR_MIPMAP_LINEAR")}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_NEAREST)}>
            {translate("NEAREST_MIPMAP_NEAREST")}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR)}>
            {translate("LINEAR")}
        </button>
        <button on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST)}>
            {translate("NEAREST")}
        </button>
    </Dropdown>

    <Dropdown asButton="true" buttonStyles={B}>
        <button slot="button" class="dropdown">

            {translate(data?.magFilter)}
            <small>
                {translate("TEXTURE_MAG_FILTER")}
            </small>
        </button>
        <button on:click={() => updateAsset("magFilter",  TEXTURE_FILTERING.MAG.NEAREST)}>
            {translate("NEAREST")}
        </button>
        <button on:click={() => updateAsset("magFilter", TEXTURE_FILTERING.MAG.LINEAR)}>
            {translate("LINEAR")}
        </button>
    </Dropdown>
</Accordion>

<Accordion title={translate("TEXTURE_WRAPPING")}>
    {#each ["wrapS", "wrapT"] as key}
        <Dropdown asButton="true" buttonStyles={B}>
            <button slot="button" class="dropdown">
                {#if data}
                    {translate(data[key])}
                {/if}
                <small>
                    {translate(key)}
                </small>
            </button>
            <button on:click={() => updateAsset(key,  TEXTURE_WRAPPING.MIRRORED_REPEAT)}>
                {translate("MIRRORED_REPEAT")}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.REPEAT)}>
                {translate("REPEAT")}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_EDGE)}>
                {translate("CLAMP_TO_EDGE")}
            </button>
            <button on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_BORDER)}>
                {translate("CLAMP_TO_BORDER")}
            </button>
        </Dropdown>
    {/each}
</Accordion>

<div class="link"
     on:click={() => shell.openExternal("https://registry.khronos.org/OpenGL-Refpages/es2.0/xhtml/glTexParameter.xml")}>
    <Icon>help</Icon>
    {translate("OPENGL_DOCS")}
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