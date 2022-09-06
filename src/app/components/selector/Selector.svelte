<script>

    import FilesStore from "../../windows/project/stores/FilesStore";
    import {onDestroy} from "svelte";
    import Localization from "../../libs/Localization";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Options from "./components/Options.svelte";
    import FALLBACK_MATERIAL from "../../windows/project/libs/engine/production/data/FALLBACK_MATERIAL";
    import STATIC_MESHES from "../../windows/project/libs/engine/static/STATIC_MESHES";

    export let size
    export let type
    export let handleChange
    export let selected

    const translate = key => Localization.COMPONENTS.SELECTOR[key]
    let store = {}
    const unsubscribeStore = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())

    function getParsedType(){
        switch (type){
            case "image":
                return "textures"
            case "material":
                return "materials"
            case "mesh":
                return "meshes"
            default:
                return undefined
        }
    }
    let state
    $: {
        if(selected === FALLBACK_MATERIAL)
            state = {name: translate("DEFAULT_MATERIAL"), registryID: FALLBACK_MATERIAL}
        else if(Object.values(STATIC_MESHES).find(s => s === selected))
            state = {name: translate(Object.values(STATIC_MESHES).find(s => s === selected)), registryID: selected}
        else {
            const rID = selected?.registryID ? selected?.registryID : selected
            let data = store[getParsedType()]?.find(e => e.registryID === rID)
            state = data ? data : {name: translate("EMPTY")}
        }
    }

</script>

<Dropdown hideArrow={true} styles="width: clamp(250px, 20vw, 500px);" buttonStyles="max-width: 100%; overflow: hidden;" >
    <button
            slot="button"
            style={`max-height: ${size === "small" ? "25px" : "43px"}; min-height:  ${size === "small" ? "25px" : "43px"}; width: 100%`}
    >
        <ToolTip content={state.name}/>
        <div class="wrapper">
            <div data-overflow="-" style="text-align: left">
                {state.name}
            </div>
            <small>
                {type}
            </small>
        </div>
    </button>
    <Options
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
        overflow:hidden;
        display: flex;
        align-items: center;
        gap: 4px;
        height: 100%;
    }

</style>