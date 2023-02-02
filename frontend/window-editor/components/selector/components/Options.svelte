<script>
    import getType from "../utils/get-type";
    import Option from "./Option.svelte";
    import EmbeddedMeshes from "../../../../../engine-core/static/EmbeddedMeshes";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import Input from "../../../../shared/components/input/Input.svelte";

    export let handleChange
    export let type
    export let setState
    export let state
    export let store
    export let noDefault
    export let mergeMaterials
    export let terrainMaterials

    let inputValue = ""
    let filtered


    $: {
        const temp = getType(store, type, mergeMaterials, terrainMaterials)
        let current
        if (inputValue)
            current = temp.filter(e => e.name.includes(inputValue))
        else
            current = [...temp]
        if (!noDefault) {
            if (type === "mesh")
                Object.entries(EmbeddedMeshes).forEach(sm => {
                    if (LOCALIZATION_EN[sm[0]] != null)
                        current.push({
                            name: LOCALIZATION_EN[sm[0]],
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
                {LOCALIZATION_EN.NOTHING}
            </div>
        {/if}
    </div>
    <div class="header-available-nodes selector">
        <Input
                width={"100%"}
                inputValue={inputValue}
                onChange={v => inputValue  = v}
                placeholder={LOCALIZATION_EN.SEARCH}
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