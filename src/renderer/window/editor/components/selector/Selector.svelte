<script>
    import Options from "./components/Options.svelte"
    import EmbeddedMeshes from "../../../../engine/core/static/EmbeddedMeshes"
    import Icon from "../../../shared/components/icon/Icon.svelte"
    import ToolTip from "../../../shared/components/tooltip/ToolTip.svelte"
    import Dropdown from "../../../shared/components/dropdown/Dropdown.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"
    import SelectorUtil from "../../util/SelectorUtil"

    export let type
    export let handleChange
    export let selected
    export let noDefault
    export let mergeMaterials = true
    export let styles = ""
    export let disabled
    export let terrainMaterials


    let state
    $: {
    	if (type === "parent")
    		state = selected ? selected : {name: LocalizationEN.EMPTY}
    	else if (selected) {
    		if (Object.values(EmbeddedMeshes).find(s => s === selected))
    			state = {
    				name: LocalizationEN[Object.values(EmbeddedMeshes).find(s => s === selected)],
    				registryID: selected
    			}
    		else {
    			const rID = selected?.registryID ? selected?.registryID : selected
    			let data = SelectorUtil.getType(type, mergeMaterials, terrainMaterials).find(e => e.registryID === rID || e.id === rID)
    			if (data?.registryID !== undefined)
    				state = data
    			else
    				state = {name: LocalizationEN.EMPTY}
    		}
    	} else
    		state = {name: LocalizationEN.EMPTY}
    }
</script>

<div data-svelteinline="-" class="wrapper" style={styles}>
    <Dropdown
            disabled={disabled}
            hideArrow={true}
            styles="max-width: clamp(250px, 20vw, 500px); width: clamp(250px, 20vw, 500px);"
            buttonStyles="width: 100%; overflow: hidden"
    >
        <button data-sveltebuttondefault="-"
                disabled={disabled}
                slot="button"
                data-svelteinline="-"
                style="height: 22px; border: none; padding: 0 2px; width: 100%"
        >
            <div class="icon" data-svelteinline="-">
                <Icon styles="font-size: 1rem">{SelectorUtil.getIcon(type)}</Icon>
                <Icon styles="font-size: 1rem">arrow_drop_down</Icon>
            </div>
            <div data-sveltevertdivider="-" style="margin: 0"></div>
            <ToolTip content={state?.name}/>
            <small data-svelteoverflow="-" style="text-align: left">{state?.name}</small>
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
        />
    </Dropdown>
    <div data-sveltevertdivider="-" style="margin: 0"></div>
    <button data-sveltebuttondefault="-" class="remove-button" on:click={_ => handleChange(null)}>
        <Icon styles="font-size: 1rem">clear</Icon>
        <ToolTip content={LocalizationEN.CLEAR}/>
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