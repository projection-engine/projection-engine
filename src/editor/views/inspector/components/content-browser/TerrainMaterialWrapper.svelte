<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import AssetAPI from "../../../../../shared/libs/files/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import MaterialAPI from "../../../../../../public/engine/production/apis/rendering/MaterialAPI";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Range from "../../../../../shared/components/range/Range.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import SIMPLE_MATERIAL_TEMPLATE
        from "../../../../../../public/engine/production/materials/simple/SIMPLE_MATERIAL_UNIFORMS";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import getUniformObject from "../../utils/get-uniform-object";
    import updateMaterialAsset from "../../utils/update-material-asset";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import TerrainMaterialLayer from "./TerrainMaterialLayer.svelte";
    import TERRAIN_MATERIAL_UNIFORMS from "../../../../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";


    export let item
    export let data

    let material = {...data}
    const translate = key => Localization.PROJECT.INSPECTOR[key]
    const updateAsset = (key, value) => updateMaterialAsset(key, value, item.registryID, material, v => material = v, SIMPLE_MATERIAL_TEMPLATE)

    $: layers = (material.length - TERRAIN_MATERIAL_UNIFORMS.length) / 3

    function addLayer() {
        const uniformData = [...material.uniformData]
        uniformData.push(
            {
                key: "albedo" + layers,
                type: "sampler"
            },
            {
                key: "normal" + layers,
                type: "sampler"
            },
            {
                key: "roughness" + layers,
                type: "sampler"
            }
        )
        material = {
            ...material,
            uniformData:
        }
    }
</script>


{#each Array(layers) as _, index}
    <TerrainMaterialLayer layer={index} uniforms={material.uniformData} update={() => null}/>
{/each}
<button data-focusbutton="-" disabled={layers === 2} on:click={addLayer}>{translate("ADD_LAYER")}</button>
