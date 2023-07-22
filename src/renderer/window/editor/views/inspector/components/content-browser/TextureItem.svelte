<script>

    import TEXTURE_FORMATS from "../../../../../../engine/core/static/texture/TEXTURE_FORMATS"
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte"
    import ElectronResources from "../../../../../shared/lib/ElectronResources"
    import GPU from "../../../../../../engine/core/GPU"
    import TEXTURE_FILTERING from "../../../../../../engine/core/static/texture/TEXTURE_FILTERING"
    import TEXTURE_WRAPPING from "../../../../../../engine/core/static/texture/TEXTURE_WRAPPING"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte"
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte"
    import Range from "../../../../../shared/components/range/Range.svelte"
    import TEXTURE_TEMPLATE from "../../../../../../engine/core/static/TEXTURE_TEMPLATE"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import EditorFSUtil from "../../../../util/EditorFSUtil"

    const B = "height: 22px; border-radius: 3px; background: var(--pj-background-tertiary); border:var(--pj-border-primary) 1px solid;"
    export let item
    export let data
    let flipChanged = false
    let changed = false

    function updateAsset(key, value) {
    	let temp = {...TEXTURE_TEMPLATE, ...data}
    	if (key === "format")
    		temp = {...temp, ...value}
    	else
    		temp = {...temp, [key]: value}
    	changed = true
    	if (key === "flipY" || key === "flipX")
    		flipChanged = true
    	data = temp
    }

    async function apply() {
    	if (flipChanged) {
    		const canvas = document.createElement("canvas"),
    			ctx = canvas.getContext("2d"),
    			img = new Image()

    		img.src = data.base64
    		await new Promise(resolve => {
    			img.onload = () => {
    				const width = img.naturalWidth, height = img.naturalHeight

    				canvas.width = width
    				canvas.height = height
    				let scaleH = data.flipX ? -1 : 1,
    					scaleV = data.flipY ? -1 : 1,
    					posX = data.flipX ? width * -1 : 0,
    					posY = data.flipY ? height * -1 : 0

    				ctx.save()
    				ctx.scale(scaleH, scaleV)
    				ctx.drawImage(img, posX, posY, width, height)
    				ctx.restore()

    				data.base64 = canvas.toDataURL()
    				resolve()
    			}
    		})
    	}
    	EditorFSUtil.updateAsset(item.registryID, JSON.stringify(data)).catch(console.error)
    	changed = false
    	const existing = GPU.textures.get(item.registryID)
    	if (existing != null)
    		existing.update({...data, img: data.base64})
    }
</script>

<button data-sveltebuttondefault="-" disabled={!changed} data-sveltefocusbutton="-" style="height: 22px"
        on:click={apply}>{LocalizationEN.APPLY}</button>
<Accordion startOpen={true} title={LocalizationEN.TEXTURE_QUALITY}>
    <div data-svelteform="-">
        <Range
                label={LocalizationEN.COMPRESSION_RATIO}
                onFinish={v => updateAsset("compressionRatio", v)}
                value={data.compressionRatio}
                minValue={0.001}
                maxValue={1}
        />
        <Range
                label={LocalizationEN.RESOLUTION_SCALE}
                onFinish={v => updateAsset("resolutionScale", v)}
                value={data.resolutionScale}
                minValue={0.001}
                maxValue={1}
        />
    </div>
</Accordion>


<fieldset>
    <legend>{LocalizationEN.FLIP_TEXTURE}</legend>
    <div data-svelteform="-">
        <Checkbox label={LocalizationEN.FLIP_Y} checked={data?.flipY}
                  handleCheck={ async () => await updateAsset("flipY", !data.flipY)}/>
        <Checkbox label={LocalizationEN.FLIP_X} checked={data?.flipX}
                  handleCheck={async() => await updateAsset("flipX", !data.flipX)}/>
    </div>
</fieldset>
<fieldset>
    <legend>{LocalizationEN.TEXTURE_FORMAT}</legend>
    <div data-svelteform="-">
        <Dropdown buttonStyles={B}>
            <button data-sveltebuttondefault="-" slot="button" class="dropdown">
                {data?.internalFormat}
            </button>
            <button data-sveltebuttondefault="-" on:click={() => updateAsset("format", TEXTURE_FORMATS.RGB)}>
                RGB
            </button>
            <button data-sveltebuttondefault="-" on:click={() => updateAsset("format", TEXTURE_FORMATS.RGBA)}>
                RGBA
            </button>
            <button data-sveltebuttondefault="-" on:click={() => updateAsset("format", TEXTURE_FORMATS.SRGBA)}>
                SRGB8_ALPHA8
            </button>
        </Dropdown>
    </div>
</fieldset>
<Accordion title={LocalizationEN.TEXTURE_FILTERING}>
    <div data-svelteform="-">
        <Dropdown buttonStyles={B}>
            <button data-sveltebuttondefault="-" slot="button" class="dropdown">
                {LocalizationEN[data?.minFilter]}
                <small>
                    {LocalizationEN.TEXTURE_MIN_FILTER}
                </small>
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter",  TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_LINEAR)}>
                {LocalizationEN.NEAREST_MIPMAP_LINEAR}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_NEAREST)}>
                {LocalizationEN.LINEAR_MIPMAP_NEAREST}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR_MIPMAP_LINEAR)}>
                {LocalizationEN.LINEAR_MIPMAP_LINEAR}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST_MIPMAP_NEAREST)}>
                {LocalizationEN.NEAREST_MIPMAP_NEAREST}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.LINEAR)}>
                {LocalizationEN.LINEAR}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("minFilter", TEXTURE_FILTERING.MIN.NEAREST)}>
                {LocalizationEN.NEAREST}
            </button>
        </Dropdown>

        <Dropdown buttonStyles={B}>
            <button data-sveltebuttondefault="-" slot="button" class="dropdown">

                {LocalizationEN[data?.magFilter]}
                <small>
                    {LocalizationEN.TEXTURE_MAG_FILTER}
                </small>
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("magFilter",  TEXTURE_FILTERING.MAG.NEAREST)}>
                {LocalizationEN.NEAREST}
            </button>
            <button data-sveltebuttondefault="-"
                    on:click={() => updateAsset("magFilter", TEXTURE_FILTERING.MAG.LINEAR)}>
                {LocalizationEN.LINEAR}
            </button>
        </Dropdown>
    </div>
</Accordion>

<Accordion title={LocalizationEN.TEXTURE_WRAPPING}>
    <div data-svelteform="-">
        {#each ["wrapS", "wrapT"] as key}
            <Dropdown buttonStyles={B}>
                <button data-sveltebuttondefault="-" slot="button" class="dropdown">
                    {#if data}
                        {LocalizationEN[data[key]]}
                    {/if}
                    <small>
                        {LocalizationEN[key]}
                    </small>
                </button>
                <button data-sveltebuttondefault="-"
                        on:click={() => updateAsset(key,  TEXTURE_WRAPPING.MIRRORED_REPEAT)}>
                    {LocalizationEN.MIRRORED_REPEAT}
                </button>
                <button data-sveltebuttondefault="-" on:click={() => updateAsset(key, TEXTURE_WRAPPING.REPEAT)}>
                    {LocalizationEN.REPEAT}
                </button>
                <button data-sveltebuttondefault="-" on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_EDGE)}>
                    {LocalizationEN.CLAMP_TO_EDGE}
                </button>
                <button data-sveltebuttondefault="-"
                        on:click={() => updateAsset(key, TEXTURE_WRAPPING.CLAMP_TO_BORDER)}>
                    {LocalizationEN.CLAMP_TO_BORDER}
                </button>
            </Dropdown>
        {/each}
    </div>
</Accordion>

<div class="link"
     on:click={() => ElectronResources.shell.openExternal("https://registry.khronos.org/OpenGL-Refpages/es2.0/xhtml/glTexParameter.xml")}>
    <Icon>help</Icon>
    {LocalizationEN.OPENGL_DOCS}
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