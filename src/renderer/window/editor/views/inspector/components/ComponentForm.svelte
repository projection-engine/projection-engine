<script lang="ts">
    import Property from "./ComponentProperty.svelte"
    import {Components,} from "@engine-core/engine.enum";
    import AbstractComponent from "@engine-core/lib/components/AbstractComponent"
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte"
    import PropertyHeader from "../../../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../util/InspectorUtil"
    import EditorUtil from "../../../util/EditorUtil";
    import UIComponent from "./UIComponent.svelte";
    import TransformationForm from "./TransformationForm.svelte";
    import COMPONENT_PROP_TYPES from "../../../static/COMPONENT_PROP_TYPES";
    import MeshComponent from "@engine-core/lib/components/MeshComponent";
    import COMPONENT_ATTRIBUTES from "../static/COMPONENT_ATTRIBUTES";
    import EditorEntity from "../../../../../engine/tools/EditorEntity";
    import MeshComponentForm from "./MeshComponentForm.svelte";

    export let key: Components
    export let component: AbstractComponent
    export let entity: EditorEntity
    export let submit: GenericVoidFunctionWith3P<string, any, boolean>
    export let updateTabs: VoidFunction

    $: layoutTitle = EditorUtil.getComponentLabel(key)

    function checkIsDisabled(propAttr) {
        return typeof propAttr.disabledIf === "function" ? propAttr.disabledIf(component) : component[propAttr.disabledIf]
    }

    const onDelete = () => {
        InspectorUtil.removeComponent(entity, key)
        updateTabs()
    }
</script>

{#if component.getComponentKey() === Components.UI}
    <UIComponent {entity} {submit}/>
{:else if component.getComponentKey() === Components.TRANSFORMATION}
    <TransformationForm/>
{:else if component instanceof MeshComponent}
    <MeshComponentForm component={component} entity={entity}/>
{:else}
    {#if layoutTitle}
        <PropertyHeader
                title={layoutTitle}
                allowDeletion={entity}
                onDelete={onDelete}
        />
    {/if}
    {#if Object.hasOwn(COMPONENT_ATTRIBUTES, component.getComponentKey())}
        {#each COMPONENT_ATTRIBUTES[component.getComponentKey()] as propAttr, index}
            {#if propAttr.type === COMPONENT_PROP_TYPES.GROUP && Array.isArray(propAttr.children) && !checkIsDisabled(propAttr)}
                <Accordion
                        startOpen={index === 0}
                        title={LocalizationEN[propAttr.label] || propAttr.label}
                        styles="display: flex; flex-direction: column; gap: 4px;"
                >
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
            {:else if propAttr.type !== COMPONENT_PROP_TYPES.GROUP && !checkIsDisabled(propAttr)}
                <Property
                        component={component}
                        submit={submit}
                        attribute={propAttr}
                />
            {/if}
        {/each}
    {/if}
{/if}
