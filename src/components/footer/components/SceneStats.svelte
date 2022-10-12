<script>
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import {Engine, GPU} from "../../../../public/engine/production";
    import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
    import STATIC_TEXTURES from "../../../../public/engine/static/resources/STATIC_TEXTURES";

    let engine
    const unsubscribe = EngineStore.getStore(v => engine = v)
    let changeID
    let entities
    let triangles = 0
    let materials = 0
    let interval
    let textures = 0
    let meshes = 0
    $:{
        changeID = engine.changeID
        entities = Engine.entitiesMap.size
    }
    function refresh(){
        let t = 0
        GPU.meshes.forEach(m => t = t + m.trianglesQuantity)
        triangles = t
        meshes = GPU.meshes.size - Object.keys(STATIC_MESHES.EDITOR).length
        materials = GPU.materials.size
        textures = GPU.textures.size - Object.keys(STATIC_TEXTURES).length
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


<small>Entities {entities}</small>
<div data-vertdivider="-"></div>
<small>Meshes {meshes}</small>

<div data-vertdivider="-"></div>
<small>Triangles {triangles}</small>

<div data-vertdivider="-"></div>
<small>Materials {materials}</small>

<div data-vertdivider="-"></div>
<small>Textures {textures}</small>


<style>
    small{
        font-size: .675rem;
    }
</style>