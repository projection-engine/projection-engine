<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import getComponentIcon from "../../../utils/get-component-icon";

    export let key
    export let index
    export let selected
    export let submit
    export let translate

    $: title = translate(selected.name) ? translate(selected.name) : selected.name
</script>

<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem">
                {getComponentIcon(key, selected)}
            </Icon>
        </div>
        {title}
        {#if index != null}
            <button
                    class="button"
                    on:click={() => {
                        const entity = DataStoreController.engine.selectedEntity
                       entity.scripts[index] = undefined
                       entity.scripts = entity.scripts.filter(e => e)
                        DataStoreController.updateEngine()
                    }}
            >
                <Icon>delete_forever</Icon>
            </button>
        {/if}
    </svelte:fragment>
    {#if Array.isArray(selected.props)}
        {#each selected.props as propAttr}
            {#if propAttr.type === "group" && Array.isArray(propAttr.children)}
                <fieldset class="fieldset">
                    <legend>{translate(propAttr.label) ? translate(propAttr.label) : propAttr.label}</legend>
                    {#each propAttr.children as attribute}
                        <ComponentAttribute
                                selected={selected}
                                submit={submit}
                                translate={translate}
                                attribute={attribute}
                        />
                    {/each}
                </fieldset>

            {:else if propAttr.type !== "group"}
                <ComponentAttribute
                        selected={selected}
                        submit={submit}
                        translate={translate}
                        attribute={propAttr}
                />
            {/if}
        {/each}
    {/if}
</Accordion>

<style>
    .fieldset {
        border: none;
        border-top: var(--pj-border-primary) 1px solid;
        display: grid;
        gap: 4px;
    }

    legend {
        font-size: .75rem;
        font-weight: 550;
    }

    .icon {
        width: 25px;
        height: 25px;
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