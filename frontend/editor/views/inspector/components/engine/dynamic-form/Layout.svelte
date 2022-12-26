<script>
    import Property from "./Property.svelte";
    import removeComponent from "../../../utils/remove-component";
    import LOCALIZATION_EN from "../../../../../../static/LOCALIZATION_EN";
    import Component from "../../../../../../../engine-core/templates/components/Component";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import getComponentLabel from "../../../utils/get-component-label";

    export let key
    export let index
    export let component
    export let entity
    export let submit

    $: title = getComponentLabel(key) || component.name

    function checkIsDisabled(propAttr) {
        return typeof propAttr.disabledIf === "function" ? propAttr.disabledIf(component) : component[propAttr.disabledIf]
    }
</script>

<div data-inline="-" class="title-wrapper">
    <strong>{title}</strong>
    <button class="button" on:click={() => removeComponent(entity, index, key)}>
        <Icon>delete_forever</Icon>
    </button>
</div>
{#if Array.isArray(component.props)}
    {#each component.props as propAttr}
        {#if propAttr.type === Component.propTypes.GROUP && Array.isArray(propAttr.children) && !checkIsDisabled(propAttr)}
            <fieldset>
                <legend>{LOCALIZATION_EN[propAttr.label] || propAttr.label}</legend>
                {#each propAttr.children as attribute}
                    {#if !checkIsDisabled(attribute)}
                        <Property
                                component={component}
                                submit={submit}
                                attribute={attribute}
                        />
                    {/if}
                {/each}
            </fieldset>

        {:else if propAttr.type !== Component.propTypes.GROUP && !checkIsDisabled(propAttr)}
            <Property
                    component={component}
                    submit={submit}
                    attribute={propAttr}
            />
        {/if}
    {/each}
{/if}


<style>
    .title-wrapper {
        background: var(--pj-background-secondary);
        justify-content: space-between;
        width: 100%;
        font-weight: 500;
        font-size: .8rem;
        height: 25px;
        border-radius: 3px;
        padding: 4px 8px;
    }

    .button {
        border: none;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>