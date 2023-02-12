<script>
    import Property from "./Property.svelte";
    import removeComponent from "../../../utils/remove-component";
    import LOCALIZATION_EN from "../../../../../../../static/objects/LOCALIZATION_EN";
    import Component from "../../../../../../../engine-core/instances/components/Component";
    import getComponentLabel from "../../../../../utils/get-component-label";
    import Accordion from "../../../../../../shared/components/accordion/Accordion.svelte";
    import PropertyHeader from "../../../../../../shared/components/PropertyHeader.svelte";

    export let key
    export let index
    export let component
    export let entity
    export let submit
    export let updateTabs

    $: title = getComponentLabel(key) || component?.name

    function checkIsDisabled(propAttr) {
        return typeof propAttr.disabledIf === "function" ? propAttr.disabledIf(component) : component[propAttr.disabledIf]
    }
</script>

{#if title}
    <PropertyHeader title={title} allowDeletion={entity} onDelete={() => {
        removeComponent(entity, index, key)
        updateTabs()
    }}/>
{/if}
{#if Array.isArray(component.props)}
    {#each component.props as propAttr, index}
        {#if propAttr.type === Component.propTypes.GROUP && Array.isArray(propAttr.children) && !checkIsDisabled(propAttr)}
            <Accordion startOpen={index === 0} title={LOCALIZATION_EN[propAttr.label] || propAttr.label}
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
