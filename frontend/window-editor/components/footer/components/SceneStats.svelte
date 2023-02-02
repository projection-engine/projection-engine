<script>
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import GPU from "../../../../../engine-core/GPU";
    import Engine from "../../../../../engine-core/Engine";
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";

    let engine
    const unsubscribe = EngineStore.getStore(v => engine = v)
    let entities
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
        entities = Engine.entities.map.size
    }

    onMount(() => {
        refresh()
        interval = setInterval(refresh, 2500)
    })
    onDestroy(() => {
        unsubscribe()
        clearInterval(interval)
    })
</script>

<div class="wrapper footer-header">
    <small>Entities {entities}</small>
    <div data-sveltevertdivider="-"></div>
    <small>Meshes {meshes}
        <ToolTip content={LOCALIZATION_EN.NATIVE_MESHES}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Triangles {triangles}
        <ToolTip content={LOCALIZATION_EN.NATIVE_MESHES}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Materials {materials}
        <ToolTip content={LOCALIZATION_EN.NATIVE_MATERIALS}/>
    </small>

    <div data-sveltevertdivider="-"></div>
    <small>Textures {textures}
        <ToolTip content={LOCALIZATION_EN.NATIVE_TEXTURES}/>
    </small>
</div>

