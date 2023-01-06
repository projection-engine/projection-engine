<script>
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import componentConstructor from "../../../../utils/component-constructor";
    import SelectionStore from "../../../../stores/SelectionStore";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import UndoRedoAPI from "../../../../lib/utils/UndoRedoAPI";
    import ACTION_HISTORY_TARGETS from "../../../../static/ACTION_HISTORY_TARGETS.ts";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";

    const nativeComponents = getNativeComponents()

    export let entity

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown hideArrow={true} buttonStyles="border-radius: 3px; background: var(--pj-background-secondary); margin-left: auto">
    <button
            slot="button"
            class="add-button"
            data-overflow="-"
    >
        <Icon>add</Icon>
        {LOCALIZATION_EN.ADD_COMPONENT}
        <ToolTip content={LOCALIZATION_EN.ADD_COMPONENT}/>
    </button>

    {#each nativeComponents as [key,  label, icon]}
        <button
                on:click={(e) =>{
                    UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)
                    entity.addComponent(key)
                    UndoRedoAPI.save(entity, ACTION_HISTORY_TARGETS.ENGINE)

                    SelectionStore.updateStore()
                    e.target.closeDropdown()

                }}
        >
            <Icon>{icon}</Icon>
            {label}
        </button>
    {/each}
    <div data-divider="-"></div>
    {#each store.components as script}
        <button on:click={(e) => {
            componentConstructor(entity, script.registryID).catch()
            e.target.closeDropdown()
        }}>
            {script.name}
        </button>
    {/each}
</Dropdown>

<style>
    .add-button{

        border: none;
        display: flex;
        align-items: center;
        gap: 4px;
        max-height: 22px;
        min-height: 22px;
    }
</style>