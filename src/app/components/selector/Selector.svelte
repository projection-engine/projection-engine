<script>

    import CBStoreController from "../../windows/project/stores/CBStoreController";
    import {onDestroy} from "svelte";
    import Localization from "../../libs/Localization";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Options from "./components/Options.svelte";

    export let size
    export let type
    export let handleChange
    export let selected

    const translate = key => Localization.COMPONENTS.SELECTOR[key]
    let store = {}
    const unsubscribeStore = CBStoreController.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())

    function getParsedType(){
        switch (type){
            case "image":
                return "images"
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
        const rID = selected?.registryID ? selected?.registryID : selected
        let data = store[getParsedType()]?.find(e => e.registryID === rID)
        state = data ? data : {name: translate("EMPTY")}
    }

</script>

<Dropdown hideArrow={true} styles="width: clamp(250px, 20vw, 500px);" >
    <button
            slot="button"
            style={`max-height: ${size === "small" ? "25px" : "43px"}; min-height:  ${size === "small" ? "25px" : "43px"}; width: 100%`}
    >
        <ToolTip content={state.name}/>
        <div class="wrapper">
            <div data-overflow="-" style="text-align: left">
                {state.name}
            </div>
            <div class="button-type">
                {type}
            </div>
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

    .button-type {
        font-size: 0.65rem;
        font-weight: normal;
        text-align: right;
        text-transform: capitalize;
        width: fit-content;
        margin-left: auto;
    }

    .wrapper {
        position: relative;
        overflow:hidden;
        font-weight: 550;
        display: flex;
        align-items: center;
        gap: 4px;
        height: 100%;
    }

</style>