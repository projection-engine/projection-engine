<script>
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import ComponentAttribute from "./Property.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import getComponentIcon from "../../utils/get-component-icon";
    import removeComponent from "../../utils/remove-component";

    export let key
    export let index
    export let component
    export let entity
    export let submit
    export let translate


    $: title = key === "TRANSFORMATION" ? translate("TRANSFORMATION") : (translate(component.name) ? translate(component.name) : component.name)
</script>

<Accordion startOpen={ key === "TRANSFORMATION"}>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem; width: 1rem">
                {getComponentIcon(key, component)}
            </Icon>
        </div>
        {title}
        {#if key !== "TRANSFORMATION"}
            <button class="button" on:click={() => removeComponent(entity, index, key)}>
                <Icon>delete_forever</Icon>
            </button>
        {/if}
    </svelte:fragment>
    {#if Array.isArray(component.props)}
        {#each component.props as propAttr}
            {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
                <fieldset>
                    <legend>{translate(propAttr.label) ? translate(propAttr.label) : propAttr.label}</legend>
                    {#each propAttr.children as attribute}
                        <ComponentAttribute
                                component={component}
                                submit={submit}
                                translate={translate}
                                attribute={attribute}
                        />
                    {/each}
                </fieldset>

            {:else if propAttr.type !== "group"}
                <ComponentAttribute
                        component={component}
                        submit={submit}
                        translate={translate}
                        attribute={propAttr}
                />
            {/if}
        {/each}
    {/if}
</Accordion>

<style>

    .icon {
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
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