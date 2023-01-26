<script>
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import componentConstructor from "../../../../utils/component-constructor";
    import SelectionStore from "../../../../stores/SelectionStore";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import UndoRedoAPI from "../../../../lib/utils/UndoRedoAPI";
    import ACTION_HISTORY_TARGETS from "../../../../static/ACTION_HISTORY_TARGETS.ts";
    import Icon from "../../../../../../components/icon/Icon.svelte";
    import ToolTip from "../../../../../../components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../../components/dropdown/Dropdown.svelte";
    import NATIVE_COMPONENTS from "../../static/NATIVE_COMPONENTS";

    export let entity

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown hideArrow={true} buttonStyles="border-radius: 3px; background: var(--pj-background-secondary); margin-left: auto">
    <button data-sveltebuttondefault="-"
            slot="button"
            class="add-button"
            data-svelteoverflow="-"
    >
        <Icon>add</Icon>
        {LOCALIZATION_EN.ADD_COMPONENT}
        <ToolTip content={LOCALIZATION_EN.ADD_COMPONENT}/>
    </button>

    {#each NATIVE_COMPONENTS as [key,  label, icon]}
        <button data-sveltebuttondefault="-"
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
    <div data-sveltedivider="-"></div>
    {#each store.components as script}
        <button data-sveltebuttondefault="-"  on:click={(e) => {
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