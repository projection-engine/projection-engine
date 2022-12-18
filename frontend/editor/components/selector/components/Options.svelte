<script>
    import getType from "../utils/get-type";
    import Option from "./Option.svelte";
    import STATIC_MESHES from "../../../../../engine-core/static/resources/STATIC_MESHES";
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import Localization from "../../../templates/LOCALIZATION_EN";
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

    let searchString = ""
    let filtered


    $: {
        const temp = getType(store, type, mergeMaterials, terrainMaterials)
        let current
        if (searchString)
            current = temp.filter(e => e.name.includes(searchString))
        else
            current = [...temp]
        if (!noDefault) {
            if (type === "mesh")
                Object.entries(STATIC_MESHES.PRODUCTION).forEach(sm => {
                    if (Localization[sm[0]] != null)
                        current.push({
                            name: Localization[sm[0]],
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
            <div data-empty="-">
                <Icon styles="font-size: 2rem">folder</Icon>
                {Localization.NOTHING}
            </div>
        {/if}
    </div>
    <div class="header-available-nodes selector">
        <Input
                width={"100%"}
                searchString={searchString}
                setSearchString={v => searchString  = v}
                placeholder={Localization.SEARCH}
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