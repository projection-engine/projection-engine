<script>

    import Input from "../../../../../../components/input/Input.svelte";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import componentConstructor from "../../../../libs/component-constructor";
    import Accordion from "../../../../../../components/accordion/Accordion.svelte";
    import Engine from "../../../../libs/engine/production/Engine";
    import Entity from "../../../../libs/engine/production/templates/Entity";
    import EntityNameController from "../../../../stores/templates/EntityNameController";

    const nativeComponents = getNativeComponents()

    export let entity
    export let translate

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => {
        unsubscribeStore()
    })


</script>


<Dropdown hideArrow={true}>
    <button
            slot="button"
            data-focusbutton="-"
            style="width: 100%; height: 25px"
    >
        <Icon>add</Icon>
        {translate("ADD_COMPONENT")}
        <ToolTip content={translate("ADD_COMPONENT")}/>
    </button>
    {#if entity instanceof Entity}
        {#each nativeComponents as [key, instance, label, icon]}
            <button
                    on:click={() =>{
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
                setSearchString={v => EntityNameController.renameEntity(v, entity)}
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
                Engine.queryMap.delete(entity.queryKey)
                Engine.queryMap.set(v, entity)
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