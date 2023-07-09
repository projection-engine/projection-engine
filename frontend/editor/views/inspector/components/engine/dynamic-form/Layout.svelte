<script>
    import Property from "./Property.svelte"

    import Component from "../../../../../../../engine-core/core/instances/components/Component"
    import Accordion from "../../../../../../shared/components/accordion/Accordion.svelte"
    import PropertyHeader from "../../../../../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../../../util/InspectorUtil"
    import EditorUtil from "../../../../../util/EditorUtil";

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
</script>

{#if layoutTitle}
    <PropertyHeader title={layoutTitle} allowDeletion={entity} onDelete={() => {
        InspectorUtil.removeComponent(entity, index, key)
        updateTabs()
    }}/>
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
