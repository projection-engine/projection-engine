<script>

    import FileStoreController from "../../windows/project/stores/FileStoreController";
    import {onDestroy} from "svelte";
    import EnglishLocalization from "../../static/EnglishLocalization";
    import Dropdown from "../dropdown/Dropdown.svelte";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import DataIcon from "./components/DataIcon.svelte";
    import Options from "./components/Options.svelte";

    export let size
    export let type
    export let handleChange
    export let selected

    const translate = key => EnglishLocalization.COMPONENTS.SELECTOR[key]
    let store = {}
    const unsubscribeStore = FileStoreController.getStore(v => store = v)
    onDestroy(() => unsubscribeStore())


    let state
    $: {
        const rID = (selected?.registryID ? selected?.registryID : selected)
        let name = translate("EMPTY"),
            data = store[type + "s"]?.find(e => e.registryID === rID)
        state = data ? data : {name}
    }

</script>

<Dropdown hideArrow={true} styles="width: 250px;" >
    <button
            slot="button"
            style={`max-height: ${size === "small" ? "25px" : "43px"}; min-height:  ${size === "small" ? "25px" : "43px"}; width: 100%`}
    >
        <ToolTip content={state.name}/>
        <div class="wrapper">
            {#if size !== "small"}
                <DataIcon state={state} type={type}/>
            {/if}
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
        font-weight: 550;
        display: flex;
        align-items: center;
        gap: 4px;
        height: 100%;
    }

</style>