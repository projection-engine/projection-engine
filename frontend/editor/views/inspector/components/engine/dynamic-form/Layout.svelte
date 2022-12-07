<script>
    import Property from "./Property.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import removeComponent from "../../../utils/remove-component";
    import Localization from "../../../../../templates/LOCALIZATION_EN";

    export let key
    export let index
    export let component
    export let entity
    export let submit

    $: title = Localization[component.name] || component.name
</script>

<div data-inline="-" class="title-wrapper">
    <strong>{title}</strong>
    <button class="button" on:click={() => removeComponent(entity, index, key)}>
        <Icon>delete_forever</Icon>
    </button>
</div>
{#if Array.isArray(component.props)}
    {#each component.props as propAttr}
        {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
            <fieldset>
                <legend>{Localization[propAttr.label] || propAttr.label}</legend>
                {#each propAttr.children as attribute}
                    <Property
                            component={component}
                            submit={submit}
                            attribute={attribute}
                    />
                {/each}
            </fieldset>

        {:else if propAttr.type !== "group"}
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