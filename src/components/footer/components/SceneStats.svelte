<script>
    import EngineStore from "../../../stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import GPUResources from "../../../../public/engine/GPUResources";
    import Engine from "../../../../public/engine/Engine";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Localization from "../../../templates/Localization";

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
        GPUResources.meshes.forEach(m => t = t + m.trianglesQuantity)
        triangles = t
        meshes = GPUResources.meshes.size
        materials = GPUResources.materials.size
        textures = GPUResources.textures.size
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
<small>Meshes {meshes}<ToolTip content={Localization.NATIVE_MESHES}/></small>

<div data-vertdivider="-"></div>
<small>Triangles {triangles}<ToolTip content={Localization.NATIVE_MESHES}/></small>

<div data-vertdivider="-"></div>
<small>Materials {materials}<ToolTip content={Localization.NATIVE_MATERIALS}/></small>

<div data-vertdivider="-"></div>
<small>Textures {textures}<ToolTip content={Localization.NATIVE_TEXTURES}/></small>


<style>
    small{
        font-size: .675rem;
    }
</style>