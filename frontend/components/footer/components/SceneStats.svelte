<script>
    import EngineStore from "../../../editor/stores/EngineStore";
    import {onDestroy, onMount} from "svelte";
    import GPU from "../../../../engine-core/GPU";
    import Engine from "../../../../engine-core/Engine";
    import Localization from "../../../static/LOCALIZATION_EN";
    import ToolTip from "../../tooltip/ToolTip.svelte";

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
        meshes = GPU.meshes.size
        materials = GPU.materials.size
        textures = GPU.textures.size
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