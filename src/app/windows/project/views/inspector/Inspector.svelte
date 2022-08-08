<script>
    import Localization from "../../../../libs/Localization";
    import Header from "../../../../components/view/components/Header.svelte";
    import Input from "../../../../components/input/Input.svelte";
    import DataStoreController from "../../stores/DataStoreController";
    import {onDestroy} from "svelte";
    import Components from "./views/Components.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import FileStoreController from "../../stores/FileStoreController";
    import {v4} from "uuid";
    import componentConstructor from "../../libs/component-constructor";
    import COMPONENTS from "../../libs/engine/data/COMPONENTS";
    import getNativeComponents from "./utils/get-native-components";
    import TransformComponent from "../../libs/engine/libs/components/TransformComponent";

    export let hidden = undefined
    export let switchView = undefined
    export let orientation = undefined

    let engine = {}
    let store = {}
    const unsubscribeEngine = DataStoreController.getEngine(v => engine = v)
    const unsubscribeStore = FileStoreController.getStore(v => store = v)
    onDestroy(() => {
        unsubscribeEngine()
        unsubscribeStore()
    })
    const nativeComponents = getNativeComponents()
    const translate = key => Localization.PROJECT.INSPECTOR[key]
</script>
<Header
        orientation={orientation}
        hidden={hidden}
        switchView={switchView}
        title={translate("TITLE")}
        icon={"category"}
>
    {#if engine.selectedEntity != null}

        <Input
                width="100%"
                setSearchString={v => {
                engine.selectedEntity.name = v
                DataStoreController.updateEngine({...engine, changeID: v4()})
            }}
                searchString={engine.selectedEntity.name}
                placeholder={translate("ENTITY_NAME")}
        />
        <Dropdown hideArrow={true} disabled={store.components.length === 0}>
            <button slot="button" class="button" disabled={store.components.length === 0}>
                <Icon>add</Icon>
                <ToolTip content={translate("LINK_COMPONENT")}/>
            </button>
            {#each nativeComponents as [key, instance, label, icon]}
                <button
                        on:click={() =>{
                    if(!engine.selectedEntity.components[COMPONENTS.TRANSFORM])
                        engine.selectedEntity.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                    if(!engine.selectedEntity.components[key])
                        engine.selectedEntity.components[key] = new instance(undefined, engine.selectedEntity)
                }}>
                    <Icon>{icon}</Icon>
                    {label}
                </button>
            {/each}
            <div class="divider"></div>
            {#each store.components as script}
                <button on:click={() => componentConstructor(engine.selectedEntity, script.registryID).catch()}>
                    {script.name}
                </button>
            {/each}
        </Dropdown>

    {/if}
</Header>
{#if !hidden}
    <div class="content">
        {#if engine.selectedEntity != null}
            <Components
                    translate={translate}
                    engine={engine}
            />
        {:else}
            <div class="empty">
                <Icon styles="font-size: 75px">category</Icon>
                {translate("TITLE")}
            </div>
        {/if}
    </div>
{/if}


<style>
    .divider {
        width: 100%;
        height: 1px;
        background: var(--pj-border-primary);
    }

    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
        height: 100%;

        font-size: .8rem;
        color: var(--pj-color-quaternary);
    }

    .button {
        padding: 0 !important;
        width: 23px;
        height: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 3px;
    }

    .content {
        width: 100%;
        height: 100%;
        display: grid;

        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>