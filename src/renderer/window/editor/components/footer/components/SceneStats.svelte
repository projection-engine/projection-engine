<script>
    import {onDestroy, onMount} from "svelte"
    import GPU from "../../../../../engine/core/GPU"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import EntityManager from "@engine-core/managers/EntityManager";

    let entities = 0
    let triangles = 0
    let materials = 0
    let interval
    let textures = 0
    let meshes = 0

    function refresh() {
    	let t = 0

        // TODO - COMPUTE DATA BASED ON THE CURRENT SCENE, NOT LOADED
    	GPU.meshes.forEach(m => t = t + m.trianglesQuantity)
    	triangles = t
    	meshes = GPU.meshes.size
    	materials = GPU.materials.size
    	textures = GPU.textures.size
    	entities = EntityManager.getEntities().size
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

