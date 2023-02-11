<script>
    import FilesStore from "../../../../../shared/stores/FilesStore";
    import {onDestroy} from "svelte";
    import componentConstructor from "../../../../utils/component-constructor";
    import SelectionStore from "../../../../../shared/stores/SelectionStore";
    import LOCALIZATION_EN from "../../../../../../static/objects/LOCALIZATION_EN";
    import EditorActionHistory from "../../../../lib/utils/EditorActionHistory";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import NATIVE_COMPONENTS from "../../static/NATIVE_COMPONENTS";

    export let entity

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown buttonStyles="border-radius: 3px; background: transparent; overflow: hidden;">
    <button data-sveltebuttondefault="-"
            slot="button"
            class="add-button"
            data-svelteoverflow="-"
    >
        <slot/>
    </button>

    {#each NATIVE_COMPONENTS as [key,  label, icon]}
        <button data-sveltebuttondefault="-"
                on:click={(e) =>{
                    EditorActionHistory.save(entity)
                    entity.addComponent(key)
                    EditorActionHistory.save(entity)

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
        padding: 0 !important;
    }
</style>