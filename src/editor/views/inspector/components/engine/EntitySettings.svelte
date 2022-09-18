<script>

    import Input from "../../../../../shared/components/input/Input.svelte";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import componentConstructor from "../../../../libs/component-constructor";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import Engine from "../../../../../../public/engine/production/Engine";
    import EntityNameController from "../../../../stores/templates/EntityNameController";
    import SelectionStore from "../../../../stores/SelectionStore";

    const nativeComponents = getNativeComponents()

    export let entity
    export let translate

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown hideArrow={true} closeOnClick={true}>
    <button
            slot="button"
            data-focusbutton="-"
            class="add-button"
    >
        <Icon>add</Icon>
        {translate("ADD_COMPONENT")}
        <ToolTip content={translate("ADD_COMPONENT")}/>
    </button>

    {#each nativeComponents as [key,  label, icon]}
        <button
                on:click={(e) =>{
                    entity.addComponent(key)
                    SelectionStore.updateStore()
                    e.target.closeDropdown()
                }}>
            <Icon>{icon}</Icon>
            {label}
        </button>
    {/each}
    <div class="divider"></div>
    {#each store.components as script}
        <button on:click={(e) => {
            componentConstructor(entity, script.registryID).catch()
            e.target.closeDropdown()
        }}>
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
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .add-button {
        width: 100%;
        height: 25px;
        justify-content: flex-start;
        font-size: .7rem;
        padding: 2px;
        gap: 2px;
    }
</style>