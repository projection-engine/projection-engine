<script>
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import getType from "../utils/get-type";
    import Option from "./Option.svelte";
    import FALLBACK_MATERIAL from "../../../../public/engine/templates/materials/simple/FALLBACK_MATERIAL";
    import STATIC_MESHES from "../../../../public/engine/static/resources/STATIC_MESHES";
    import "../css/selector.css"
    import VirtualList from '@sveltejs/svelte-virtual-list';

    export let handleChange
    export let type
    export let setState
    export let state
    export let store
    export let translate
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
            if (type === "material")
                current.push({name: translate("DEFAULT_MATERIAL"), registryID: FALLBACK_MATERIAL})
            else if (type === "mesh")
                Object.entries(STATIC_MESHES.PRODUCTION).forEach(sm => {
                    if(translate(sm[0]) != null)
                        current.push({
                            name: translate(sm[0]),
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
                {translate("NOTHING")}
            </div>
        {/if}
    </div>
    <div class="header-available-nodes selector">
        <Input
                width={"100%"}
                searchString={searchString}
                setSearchString={v => searchString  = v}
                placeholder={translate("SEARCH")}
        >
            <Icon slot="icon">search</Icon>
        </Input>
    </div>
</div>

<style>

    .content{
        position: relative;
        height: 100%;
    }
</style>