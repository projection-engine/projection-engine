<script>

    import FilesStore from "../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";
    import Options from "./components/Options.svelte";
    import STATIC_MESHES from "../../../../engine-core/static/resources/STATIC_MESHES";
    import getType from "./utils/get-type";
    import getIcon from "./utils/get-icon";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte";
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte";


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
        if (type === "parent") {
            state = selected ? selected : {name: Localization.EMPTY}
        } else if (selected) {
            if (Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected))
                state = {
                    name: Localization[Object.values(STATIC_MESHES.PRODUCTION).find(s => s === selected)],
                    registryID: selected
                }
            else {
                const rID = selected?.registryID ? selected?.registryID : selected
                let data = getType(store, type, mergeMaterials, terrainMaterials).find(e => e.registryID === rID || e.id === rID)
                if (data?.registryID !== undefined)
                    state = data
                else
                    state = {name: Localization.EMPTY}
            }
        } else
            state = {name: Localization.EMPTY}
    }
</script>

<div data-inline="-" class="wrapper" style={styles}>

    <Dropdown
            disabled={disabled}
            hideArrow={true}
            styles="max-width: clamp(250px, 20vw, 500px); width: clamp(250px, 20vw, 500px);"
            buttonStyles="width: 100%; overflow: hidden"
    >
        <button
                disabled={disabled}
                slot="button"
                data-inline="-"
                style="height: 22px; border: none; padding: 0 2px; width: 100%"
        >
            <div class="icon" data-inline="-">
                <Icon styles="font-size: 1rem">{getIcon(type)}</Icon>
                <Icon styles="font-size: 1rem">arrow_drop_down</Icon>
            </div>
            <div data-vertdivider="-" style="margin: 0"></div>
            <ToolTip content={state.name}/>
            <small data-overflow="-" style="text-align: left">{state.name}</small>
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
    <div data-vertdivider="-" style="margin: 0"></div>
    <button class="remove-button" on:click={_ => handleChange(null)}>
        <Icon styles="font-size: 1rem">clear</Icon>
        <ToolTip content={Localization.CLEAR}/>
    </button>
</div>


<style>
    .icon {
        width: 28px;
        height: 22px;
        gap: 0;
    }

    .wrapper {
        width: 100%;
        position: relative;
        overflow: hidden;
        height: 22px;
        background: var(--pj-background-secondary);
        border-radius: 3px;
        gap: 0;
        border: var(--pj-border-primary) 1px solid;
    }

    .remove-button {
        border: none;
        --pj-accent-color: #ff5555;
        width: 22px;
        height: 22px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>