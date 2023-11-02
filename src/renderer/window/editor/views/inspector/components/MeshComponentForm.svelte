<script lang="ts">
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte";
    import InspectorUtil from "../../../util/InspectorUtil";
    import MaterialUniforms from "../../../components/MaterialUniformsForm.svelte";
    import MeshComponent from "@engine-core/lib/components/MeshComponent";
    import EditorEntity from "../../../../../engine/tools/EditorEntity";

    export let component: MeshComponent
    export let entity: EditorEntity

    function updateMaterialUniform(index, value) {
        const c = component as MeshComponent
        const uniforms = c.materialUniforms
        c.updateMaterialUniformValue(uniforms[index].key, value)
    }
</script>
{#if component.materialID != null}
    <fieldset>
        <legend>{LocalizationEN.MATERIAL_VALUES}</legend>
        <Checkbox
                label={LocalizationEN.OVERRIDE_PROPERTIES}
                handleCheck={() => InspectorUtil.updateEntityComponent(entity, "overrideMaterialUniforms", !component.overrideMaterialUniforms, component)}
                checked={component.overrideMaterialUniforms}
        />
        {#if component.overrideMaterialUniforms}
            <MaterialUniforms
                    {component}
                    uniforms={component.materialUniforms}
                    update={updateMaterialUniform}

            />
        {/if}
    </fieldset>
{/if}
