<script>

    import FilesStore from "../../../editor/stores/FilesStore";
    import {onDestroy} from "svelte";
    import Localization from "../../libs/Localization";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Options from "./components/Options.svelte";
    import FALLBACK_MATERIAL from "../../../../public/engine/static/FALLBACK_MATERIAL";
    import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
    import getType from "./utils/get-type";


    export let type
    export let handleChange
    export let selected
    export let noDefault
    export let mergeMaterials = true
    export let styles = ""
    const translate = key => Localization.COMPONENTS.SELECTOR[key]
    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())

    let state
    $: {
        if (selected === FALLBACK_MATERIAL)
            state = {name: translate("DEFAULT_MATERIAL"), registryID: FALLBACK_MATERIAL}
        else if (Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected))
            state = {name: translate(Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected)), registryID: selected}
        else {
            const rID = selected?.registryID ? selected?.registryID : selected
            let data = getType(store, type, mergeMaterials).find(e => e.registryID === rID)
            state = data ? data : {name: translate("EMPTY")}
        }
    }
</script>

<Dropdown asButton={true} styles="max-width: clamp(250px, 20vw, 500px); width: clamp(250px, 20vw, 500px);"
          buttonStyles={"max-width: 100%; overflow: hidden; width: 100%;" + styles}>
    <button
            slot="button"
            style={`width: 100%; border: none;` + styles}
    >
        <ToolTip content={state.name}/>
        <div class="wrapper">
            <div data-overflow="-" style="text-align: left">
                {state.name}
            </div>
            <small>
                {translate(type.toUpperCase())}
            </small>
        </div>
    </button>
    <Options
            mergeMaterials={mergeMaterials}
            noDefault={noDefault}
            translate={translate}
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