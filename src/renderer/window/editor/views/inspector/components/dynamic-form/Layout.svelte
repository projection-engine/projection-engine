<script>
    import Property from "./Property.svelte"

    import Component from "../../../../../../engine/core/instances/components/Component"
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte"
    import PropertyHeader from "../../../../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../../util/InspectorUtil"
    import EditorUtil from "../../../../util/EditorUtil";
    import COMPONENTS from "../../../../../../engine/core/static/COMPONENTS";
    import UIComponent from "../UIComponent.svelte";
    import MaterialUniforms from "../../../../components/MaterialUniformsForm.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";

    export let key
    export let index
    export let component
    export let entity
    export let submit
    export let updateTabs

    $: layoutTitle = EditorUtil.getComponentLabel(key) || component?.name

    function checkIsDisabled(propAttr) {
        return typeof propAttr.disabledIf === "function" ? propAttr.disabledIf(component) : component[propAttr.disabledIf]
    }
    const onDelete = () => {
        InspectorUtil.removeComponent(entity, index, key)
        updateTabs()
    }

    function updateMaterialUniform(index, value) {
        const ref = component
        const uniforms = ref.materialUniforms
        ref.updateMaterialUniformValue(uniforms[index].key, value)
    }
</script>

{#if component.componentKey === COMPONENTS.UI}
    <UIComponent {entity} {submit}/>
{:else if component.componentKey === COMPONENTS.MESH && component.hasMaterial}
    <fieldset>
        <legend>{LocalizationEN.MATERIAL_VALUES}</legend>
        <Checkbox
                label={LocalizationEN.OVERRIDE_PROPERTIES}
                handleCheck={() => InspectorUtil.updateEntityComponent(entity, "overrideMaterialUniforms", !component.overrideMaterialUniforms, component)}
                checked={component.overrideMaterialUniforms}
        />
        {#if component.overrideMaterialUniforms}
            <MaterialUniforms
                    uniforms={component.materialUniforms}
                    update={updateMaterialUniform}
            />
        {/if}
    </fieldset>
{:else}
    {#if layoutTitle}
        <PropertyHeader
                title={layoutTitle}
                allowDeletion={entity}
                onDelete={onDelete}
        />
    {/if}
    {#if Array.isArray(component.props)}
        {#each component.props as propAttr, index}
            {#if propAttr.type === Component.propTypes.GROUP && Array.isArray(propAttr.children) && !checkIsDisabled(propAttr)}
                <Accordion startOpen={index === 0} title={LocalizationEN[propAttr.label] || propAttr.label}
                           styles="display: flex; flex-direction: column; gap: 4px;">
                    {#each propAttr.children as attribute}
                        {#if !checkIsDisabled(attribute)}
                            <Property
                                    component={component}
                                    submit={submit}
                                    attribute={attribute}
                            />
                        {/if}
                    {/each}
                </Accordion>
            {:else if propAttr.type !== Component.propTypes.GROUP && !checkIsDisabled(propAttr)}
                <Property
                        component={component}
                        submit={submit}
                        attribute={propAttr}
                />
            {/if}
        {/each}
    {/if}
{/if}
