<script>
    import Option from "./Option.svelte"
    import EmbeddedMeshes from "../../../../../engine/core/static/EmbeddedMeshes"
    import VirtualList from "@sveltejs/svelte-virtual-list"

    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Input from "../../../../shared/components/input/Input.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import SelectorUtil from "../../../util/SelectorUtil"

    export let handleChange
    export let type
    export let setState
    export let state
    export let noDefault
    export let mergeMaterials
    export let terrainMaterials

    let inputValue = ""
    let filtered


    $: {
    	const temp = SelectorUtil.getType(type, mergeMaterials, terrainMaterials)
    	let current
    	if (inputValue)
    		current = temp.filter(e => e.name.includes(inputValue))
    	else
    		current = [...temp]
    	if (!noDefault) {
    		if (type === "mesh")
    			Object.entries(EmbeddedMeshes).forEach(sm => {
    				if (LocalizationEN[sm[0]] != null)
    					current.push({
    						name: LocalizationEN[sm[0]],
    						registryID: sm[1]
    					})
    			})
    	}
    	filtered = current
    }

</script>

<div class="modal-available-nodes selector">
    <div class="content">
        {#if filtered.length > 0}
            <VirtualList items={filtered} let:item>
                <Option
                        type={type}
                        setState={setState}
                        data={item}
                        handleChange={handleChange}
                        state={state}
                />
            </VirtualList>
        {:else}
            <div data-svelteempty="-">
                <Icon styles="font-size: 2rem">folder</Icon>
                {LocalizationEN.NOTHING}
            </div>
        {/if}
    </div>
    <div class="header-available-nodes selector">
        <Input
                width={"100%"}
                inputValue={inputValue}
                onChange={v => inputValue  = v}
                placeholder={LocalizationEN.SEARCH}
        >
            <Icon slot="icon">search</Icon>
        </Input>
    </div>
</div>

<style>

    .content {
        position: relative;
        height: 100%;
        padding: 3px;
        overflow-y: auto;
    }
</style>