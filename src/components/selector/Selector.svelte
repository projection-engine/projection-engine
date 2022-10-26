<script>

    import FilesStore from "../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Options from "./components/Options.svelte";
    import FALLBACK_MATERIAL from "../../../public/engine/static/FALLBACK_MATERIAL";
    import STATIC_MESHES from "../../../public/engine/static/resources/STATIC_MESHES";
    import getType from "./utils/get-type";


    export let type
    export let handleChange
    export let selected
    export let noDefault
    export let mergeMaterials = true
    export let styles = ""
    export let disabled
    export let terrainMaterials


    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())


    let state
    $: {
        if (selected === FALLBACK_MATERIAL)
            state = {name: Localization.DEFAULT_MATERIAL, registryID: FALLBACK_MATERIAL}
        else if (Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected))
            state = {
                name: Localization[Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected)],
                registryID: selected
            }
        else {
            const rID = selected?.registryID ? selected?.registryID : selected
            let data = getType(store, type, mergeMaterials, terrainMaterials).find(e => e.registryID === rID)
            state = data ? data : {name: Localization.EMPTY}
        }
    }
</script>

<Dropdown
        disabled={disabled}
        asButton={true}
        styles="max-width: clamp(250px, 20vw, 500px); width: clamp(250px, 20vw, 500px);"
        buttonStyles={"max-width: 100%; overflow: hidden; width: 100%;" + styles}>
    <button
            disabled={disabled}
            slot="button"
            style={`width: 100%; border: none;` + styles}
    >
        <ToolTip content={state.name}/>
        <div class="wrapper">
            <div data-overflow="-" style="text-align: left">
                {state.name}
            </div>
            <small>
                {Localization[type.toUpperCase()]}
            </small>
        </div>
    </button>
    <Options
            terrainMaterials={terrainMaterials}
            mergeMaterials={mergeMaterials}
            noDefault={noDefault}
            handleChange={handleChange}
            type={type}

            selected={selected}
            setState={v => state = v}
            state={state}
            store={store}
    />
</Dropdown>


<style>

    .wrapper {
        max-width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        height: 100%;
    }

</style>