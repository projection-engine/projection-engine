<script>
    import Localization from "../../../../../shared/libs/Localization";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import AssetAPI from "../../../../../shared/libs/AssetAPI";
    import GPU from "../../../../../../public/engine/production/GPU";
    import updateMaterialAsset from "../../utils/update-material-asset";
    import TerrainMaterialLayer from "./TerrainMaterialLayer.svelte";
    import TERRAIN_MATERIAL_UNIFORMS from "../../../../../../public/engine/static/templates/TERRAIN_MATERIAL_UNIFORMS";
    import TERRAIN_MATERIAL
        from "../../../../../../public/engine/production/materials/terrain-layered/TERRAIN_MATERIAL";
    import DATA_TYPES from "../../../../../../public/engine/static/DATA_TYPES";


    export let item
    export let data

    let material
    $: material = {...data}
    $: layers = material?.uniformData ? (material.uniformData.length - TERRAIN_MATERIAL_UNIFORMS.length) / 3 : 0

    const translate = key => Localization.PROJECT.INSPECTOR[key]
    const updateAsset = (key, v, index) => {
        let value = v
        if (index != null) {
            value = [...material.uniformData[0].data]
            value[index] = v
        }
        updateMaterialAsset(
            key,
            value,
            item.registryID,
            material,
            v => {
                material = v
                if (GPU.materials.get(item.registryID) != null) {
                    GPU.destroyMaterial(item.registryID)
                    GPU.allocateMaterialInstance(v, item.registryID)
                    GPU.cleanUpTextures()
                }
            },
            undefined,
            false
        )
    }


    function addLayer() {
        const uniformData = [...material.uniformData]
        uniformData.push(
            {
                key: "albedo" + layers,
                type:  DATA_TYPES.TEXTURE
            },
            {
                key: "normal" + layers,
                type:  DATA_TYPES.TEXTURE
            },
            {
                key: "roughness" + layers,
                type:  DATA_TYPES.TEXTURE
            }
        )

        const size = (uniformData.length - TERRAIN_MATERIAL_UNIFORMS.length) / 3

        material = {
            original: TERRAIN_MATERIAL + size,
            uniformData
        }
        AssetAPI.updateAsset(item.registryID, JSON.stringify(material)).then(() => alert.pushAlert(translate("UPDATING_ASSET"), "alert"))
    }

    function removeLayer(index) {
        const start = index * 3 + TERRAIN_MATERIAL_UNIFORMS.length
        const uniformData = [...material.uniformData]
        uniformData.splice(start, 3)
        const size = (uniformData.length - TERRAIN_MATERIAL_UNIFORMS.length) / 3
        material = {
            original: TERRAIN_MATERIAL + size,
            uniformData
        }
        AssetAPI.updateAsset(item.registryID, JSON.stringify(material)).then(() => alert.pushAlert(translate("UPDATING_ASSET"), "alert"))
    }

</script>

<fieldset>
    <legend>{translate("LAYERS_CONTROLLER")}</legend>
    <Selector
            selected={material.uniformData[1].data}
            type="image"
            handleChange={v => updateAsset("layerController", v.registryID)}
    />

</fieldset>
{#if layers > 0}
    {#each Array(layers) as _, index}
        <TerrainMaterialLayer
                layer={index}
                uniforms={material.uniformData}
                removeLayer={() => removeLayer(index)}
                update={updateAsset}/>
    {/each}
{/if}
<button data-focusbutton="-" disabled={layers === 3} on:click={addLayer}>{translate("ADD_LAYER")}</button>
