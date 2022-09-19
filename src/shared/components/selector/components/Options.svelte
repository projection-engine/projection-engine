<script>

    import Icon from "../../icon/Icon.svelte";
    import Input from "../../input/Input.svelte";
    import getType from "../utils/get-type";
    import Option from "./Option.svelte";
    import FALLBACK_MATERIAL from "../../../../../public/engine/static/FALLBACK_MATERIAL";
    import STATIC_MESHES from "../../../../../public/engine/static/resources/STATIC_MESHES";
    import "../css/selector.css"

    export let handleChange
    export let type
    export let setState
    export let state
    export let store
    export let translate
    export let noDefault
    export let mergeMaterials
    let searchString = ""
    let filtered
    $: {
        const temp = getType(store, type, mergeMaterials), s = searchString.toLowerCase()
        if (searchString)
            filtered = temp.filter(e => e.name.toLowerCase().includes(s))
        else
            filtered = temp
    }

    $: staticMeshes = Object.entries(STATIC_MESHES.PRODUCTION)
</script>

<div class="modal-available-nodes selector">
    <div class="content-available-nodes selector">
        {#if !noDefault}
            {#if type === "material"}
                <Option
                        type={type}
                        setState={setState}
                        data={{name: translate("DEFAULT_MATERIAL"), registryID: FALLBACK_MATERIAL}}
                        handleChange={handleChange}
                        state={state}
                />
            {:else if type === "mesh"}
                {#each staticMeshes as sm}
                    <Option
                            type={type}
                            setState={setState}
                            data={{name: translate(sm[0]), registryID: sm[1]}}
                            handleChange={handleChange}
                            state={state}
                    />
                {/each}
            {/if}
        {/if}
        {#if filtered.length > 0}
            {#each filtered as t, i}
                <Option
                        type={type}
                        setState={setState}
                        data={t}
                        handleChange={handleChange}
                        state={state}
                />
            {/each}
        {:else}
            <div class="nothing">
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
    .content-wrapper {
        margin-top: 4px;
        display: grid;
        align-content: flex-start;
        gap: 4px;

        padding: 4px;
        overflow-y: auto;
        max-height: 30vh;
    }


    .nothing {
        user-select: none;
        display: flex;
        align-items: center;
        gap: 16px;
        color: var(--pj-color-secondary);
        height: 45px;
        padding: 8px;
        font-size: 0.7rem;
        font-weight: 550;
    }

    .search-wrapper {
        width: 100%;
        padding: 4px;
        display: flex;
        align-items: center;
        background: var(--pj-background-primary);
    }

</style>