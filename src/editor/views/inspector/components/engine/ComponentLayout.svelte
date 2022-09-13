<script>
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import ComponentAttribute from "./ComponentAttribute.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import EngineStore from "../../../../stores/EngineStore";
    import getComponentIcon from "../../../../utils/get-component-icon";
    import SelectionStore from "../../../../stores/SelectionStore";
    import {v4} from "uuid";

    export let key
    export let index
    export let component
    export let submit
    export let translate

    const removeComponent = () => {

        const entity = SelectionStore.selectedEntity
        if (!entity)
            return
        if (index != null) {
            entity.scripts[index] = undefined
            entity.scripts = entity.scripts.filter(e => e)
        } else
            entity.components.delete(key)

        SelectionStore.updateStore()
        EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
    }
    $: title = key === "TRANSFORMATION" ? translate("TRANSFORMATION") : (translate(component.name) ? translate(component.name) : component.name)
</script>

<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem; width: 1rem">
                {getComponentIcon(key, component)}
            </Icon>
        </div>
        {title}
        {#if key !== "TRANSFORMATION"}
            <button class="button" on:click={() => removeComponent()}>
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