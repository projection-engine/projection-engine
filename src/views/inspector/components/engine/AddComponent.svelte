<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import componentConstructor from "../../../../utils/component-constructor";
    import SelectionStore from "../../../../stores/SelectionStore";
    import Localization from "../../../../templates/LOCALIZATION_EN";

    const nativeComponents = getNativeComponents()

    export let entity

    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())
</script>


<Dropdown hideArrow={true} buttonStyles="border-radius: 3px; background: var(--pj-background-secondary);">
    <button
            slot="button"
            class="add-button"
            data-overflow="-"
    >
        <Icon>add</Icon>
        {Localization.ADD_COMPONENT}
        <ToolTip content={Localization.ADD_COMPONENT}/>
    </button>

    {#each nativeComponents as [key,  label, icon]}
        <button
                on:click={(e) =>{
                    entity.addComponent(key)
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