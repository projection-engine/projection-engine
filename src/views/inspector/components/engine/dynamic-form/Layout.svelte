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

    $: title = key === "TRANSFORMATION" ? Localization.TRANSFORMATION : (Localization[component.name] || component.name)
</script>

<fieldset>
    <legend class="legend">
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
                    <legend>{Localization[propAttr.label]||propAttr.label}</legend>
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
</fieldset>

<style>
    .legend{
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