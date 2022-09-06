<script>
    import Input from "../../../../../../components/input/Input.svelte";
    import ContentBrowserAPI from "../../../../../../libs/files/ContentBrowserAPI";
    import Localization from "../../../../../../libs/Localization";
    import FilesStore from "../../../../stores/FilesStore";
    import FilesAPI from "../../../../../../libs/files/FilesAPI";
    import FILE_TYPES from "../../../../../../../data/FILE_TYPES";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import TEXTURE_FORMATS from "../../../../libs/engine/production/data/texture/TEXTURE_FORMATS";
    import Checkbox from "../../../../../../components/checkbox/Checkbox.svelte";
    import AssetAPI from "../../../../../../libs/files/AssetAPI";
    import GPU from "../../../../libs/engine/production/controllers/GPU";
    import TEXTURE_FILTERING from "../../../../libs/engine/production/data/texture/TEXTURE_FILTERING";
    import TEXTURE_WRAPPING from "../../../../libs/engine/production/data/texture/TEXTURE_WRAPPING";

    const {shell} = window.require("electron")
    const B = "height: 35px; border-radius: 3px; background: var(--pj-background-tertiary); border:var(--pj-border-primary) 1px solid;"
    export let item
    let data
    const translate = key => Localization.PROJECT.INSPECTOR[key]

    $: isValid = "." + item.type === FILE_TYPES.TEXTURE
    $: {
        if (isValid) {
            FilesAPI.readFile(FilesStore.ASSETS_PATH + item.id, "json").then(res => data = res)
        } else
            data = undefined
    }

    const updateAsset = (key, value) => {

        if (key === "format")
            data = {...data, ...value}
        else
            data = {...data, [key]: value}

        alert.pushAlert(translate("UPDATING_ASSET"), "alert")
        AssetAPI.updateAsset(item.registryID, JSON.stringify(data)).catch()

        if ("." + item.type === FILE_TYPES.TEXTURE && GPU.textures.get(item.registryID)) {
            alert.pushAlert(translate("ALLOCATING_TEXTURE"), "alert")
            GPU.destroyTexture(item.registryID)
            GPU.allocateTexture({
                ...data,
                img: data.base64,
                yFlip: data.flipY
            }, item.registryID)
        }
    }
</script>


{#if !isValid}
    <div data-empty="-">
        <Icon styles="font-size: 75px">category</Icon>
        {translate("TITLE")}
    </div>
{:else}
    <Checkbox label={translate("FLIP_Y")} checked={data?.flipY} handleCheck={() => updateAsset("flipY", !data.flipY)}/>
    <fieldset>
        <legend>{translate("TEXTURE_FORMAT")}</legend>
        <Dropdown asButton="true" buttonStyles={B}>
            <button slot="button" class="dropdown">
                {data?.format}
            </button>
            <button on:click={() => updateAsset("format", TEXTURE_FORMATS.RGB)}>
                RGB
            </button>
            <button on:click={() => updateAsset("format", TEXTURE_FORMATS.RGBA)}>
                RGBA
            </button>
            <button on:click={() => updateAsset("format", TEXTURE_FORMATS.SRGBA)}>
                sRGBA
            </button>
        </Dropdown>
    </fieldset>
    <fieldset>
        <legend>{translate("TEXTURE_FILTERING")}</legend>

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
    </fieldset>


    <fieldset>
        <legend>{translate("TEXTURE_WRAPPING")}</legend>
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
    </fieldset>

    <div class="link" on:click={() => shell.openExternal("https://registry.khronos.org/OpenGL-Refpages/es2.0/xhtml/glTexParameter.xml")}>
        <Icon>help</Icon>
        {translate("OPENGL_DOCS")}
    </div>
{/if}
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