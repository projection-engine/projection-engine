<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Property from "./Property.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import getComponentIcon from "../../../utils/get-component-icon";
    import removeComponent from "../../../utils/remove-component";
    import Localization from "../../../../../templates/Localization";

    export let key
    export let index
    export let component
    export let entity
    export let submit


    const translate = key => Localization.PROJECT.INSPECTOR[key]

    $: title = key === "TRANSFORMATION" ? translate("TRANSFORMATION") : (translate(component.name) ? translate(component.name) : component.name)
</script>

<fieldset>
    <legend>
        {title}
        {#if key !== "TRANSFORMATION"}
            <button class="button" on:click={() => removeComponent(entity, index, key)}>
                <Icon>delete_forever</Icon>
            </button>
        {/if}
    </legend>
    {#if Array.isArray(component.props)}
        {#each component.props as propAttr}
            {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
                <fieldset>
                    <legend>{translate(propAttr.label) ? translate(propAttr.label) : propAttr.label}</legend>
                    {#each propAttr.children as attribute}
                        <Property
                                component={component}
                                submit={submit}
                                translate={translate}
                                attribute={attribute}
                        />
                    {/each}
                </fieldset>

            {:else if propAttr.type !== "group"}
                <Property
                        component={component}
                        submit={submit}
                        translate={translate}
                        attribute={propAttr}
                />
            {/if}
        {/each}
    {/if}
</fieldset>

<style>
    legend{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-weight: 500;
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