<script>

    import Input from "../../../../../components/input/Input.svelte";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import {v4} from "uuid";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import CBStoreController from "../../../stores/CBStoreController";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../utils/get-native-components";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
    import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
    import componentConstructor from "../../../libs/component-constructor";
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Renderer from "../../../libs/engine/Renderer";
    import Entity from "../../../libs/engine/templates/basic/Entity";
    import UIStoreController from "../../../stores/UIStoreController";

    const nativeComponents = getNativeComponents()

    export let entity
    export let translate

    let store = {}
    const unsubscribeStore = CBStoreController.getStore(v => store = v)
    onDestroy(() => {
        unsubscribeStore()
    })

    const renameEntity = (v) => {
        entity.name = v
        if (entity instanceof Entity)
            RendererStoreController.updateEngine()
        else
            UIStoreController.updateStore()
    }
</script>


<Dropdown hideArrow={true}>
    <button
            slot="button"
            data-accentbutton="-"
            style="width: 100%;"
    >
        <Icon>add</Icon>
        {translate("ADD_COMPONENT")}
        <ToolTip content={translate("ADD_COMPONENT")}/>
    </button>
    {#if entity instanceof Entity}
        {#each nativeComponents as [key, instance, label, icon]}
            <button
                    on:click={() =>{
                    if(!entity.components[COMPONENTS.TRANSFORM])
                        entity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                    if(!entity.components[key])
                        entity.components[key] = new instance(undefined, entity)
                }}>
                <Icon>{icon}</Icon>
                {label}
            </button>
        {/each}
        <div class="divider"></div>
    {/if}

    {#each store.components as script}
        <button on:click={() => componentConstructor(entity, script.registryID).catch()}>
            {script.name}
        </button>
    {/each}
</Dropdown>
<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem">settings</Icon>
        </div>
        {entity.name}
    </svelte:fragment>
    <fieldset>
        <legend>{translate("NAME")}</legend>
        <Input
                width="100%"
                hasBorder={true}
                setSearchString={renameEntity}
                searchString={entity.name}
                placeholder={translate("MY_ENTITY")}
        />
    </fieldset>

    <fieldset>
        <legend>{translate("QUERY_KEY")}</legend>
        <Input
                width="100%"
                hasBorder={true}
                setSearchString={v => {
                Renderer.queryMap.delete(entity.queryKey)
                Renderer.queryMap.set(v, entity)
                entity.queryKey = v
            }}
                searchString={entity.queryKey}
                placeholder={translate("QUERY_KEY")}
        />
    </fieldset>
</Accordion>

<style>
    .divider {
        width: 100%;
        height: 1px;
        background: var(--pj-border-primary);
    }

    .icon {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>