<script>

    import Icon from "../../Icon/Icon.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Input from "../../input/Input.svelte";
    import getType from "../utils/get-type";
    import Option from "./Option.svelte";


    export let handleChange
    export let type
    export let setState
    export let state
    export let store
    export let translate
    $: images = store.images
    $: meshes = store.meshes


        let searchString = ""
    $: filtered = getType(store, type).filter(e => e.name.toLowerCase().includes(searchString.toLowerCase()))


</script>
<div class="search-wrapper">
    <h1 class="search-title">
        {type}
    </h1>
    <Input searchString={searchString} setSearchString={v => searchString = v} width={"100%"}/>
    {#if type === "material"}
        <button
                class="reset-button"
                on:click={() => {
                handleChange(undefined, () => setState({name: translate("EMPTY")}))
            }}

        >
            <ToolTip>{translate("DEFAULT_MATERIAL")}</ToolTip>
            <Icon>clear</Icon>
        </button>
    {/if}
    {#if type === "script"}
        <button
                class="reset-button"

                on:click={() => {
                handleChange(undefined, () => setState({name: translate("EMPTY")}))
            }}
        >
            <ToolTip>{translate("REMOVE_SCRIPT")}</ToolTip>
            <Icon>clear</Icon>
        </button>
    {/if}
</div>
<div class="content-wrapper">
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


<style>
    .content-wrapper {
        margin-top: 4px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        gap: 4px;

        padding: 4px;
        overflow-y: auto;
    }

    .search-title {
        margin: 0;
        font-weight: 550;
        font-size: 0.75rem;
        text-transform: capitalize;
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

        background: var(--pj-border-primary);
        border-radius: 3px;
        padding: 4px;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        justify-content: space-between;
    }

    .reset-button {
        height: 20px !important;
        width: 20px !important;
        padding: 0 !important;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>