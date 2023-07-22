<script>
    import {onDestroy, onMount} from "svelte"
    import GPU from "../../../../../engine/core/GPU"
    import Engine from "../../../../../engine/core/Engine"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"

    let entities = 0
    let triangles = 0
    let materials = 0
    let interval
    let textures = 0
    let meshes = 0

    function refresh() {
    	let t = 0
    	GPU.meshes.forEach(m => t = t + m.trianglesQuantity)
    	triangles = t
    	meshes = GPU.meshes.size
    	materials = GPU.materials.size
    	textures = GPU.textures.size
    	entities = Engine.entities.size
    }

    onMount(() => {
    	refresh()
    	interval = setInterval(refresh, 2500)
    })
    onDestroy(() => clearInterval(interval))
</script>

<div class="wrapper footer-header">
    <small>Entities {entities}</small>
    <div data-sveltevertdivider="-"></div>
    <small>Meshes {meshes}
        <ToolTip content={LocalizationEN.NATIVE_MESHES}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Triangles {triangles}
        <ToolTip content={LocalizationEN.NATIVE_MESHES}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Materials {materials}
        <ToolTip content={LocalizationEN.NATIVE_MATERIALS}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Textures {textures}
        <ToolTip content={LocalizationEN.NATIVE_TEXTURES}/>
    </small>
</div>

