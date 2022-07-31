<script>
    import {allNodes} from "../templates/all-nodes"
    import Input from "../../../../../components/input/Input.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";

    export let translate
    const parseStr = (str) => {
        return str.toLowerCase().replace(/\s/g, "")
    }

    let searchString = ""
    let nodes = []
    $: {
        const s = parseStr(searchString)
        if (!s)
            nodes = allNodes
        nodes = allNodes.filter(i => parseStr(i.label).includes(s))
    }
</script>

<Dropdown>
    <button slot="button" class="button">
        {translate("ADD")}
    </button>
    <div class="modalAvailableNodes">
        <div class="contentAvailableNodes">
            {#each nodes as d, i}
                <div
                    class="optionAvailableNodes"
                    draggable="true"
                    on:dragstart={e => e.dataTransfer.setData("text", d.dataTransfer)}
                >
                    <Icon>drag_indicator</Icon>
                    {d.label}
                </div>
            {/each}
        </div>
        <div class="headerAvailableNodes">
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
</Dropdown>

<style>
    .button {
        display: flex;
        align-items: center;
        gap: 4px;
        height: 23px;
        font-size: .7rem !important;
        background: var(--pj-border-primary);
    }

    .modalAvailableNodes{
        max-height: 350px;
        width: 250px;
        max-width: unset;

        display: grid;
        gap: 4px;
    }

    .headerAvailableNodes {
        position: sticky;
        bottom: 0;
        background: var(--pj-background-secondary);
        width: 100%;

        padding:4px ;
        color: var(--pj-color-secondary);
        font-size: 0.8rem;
        font-weight: 550;
    }

    .contentAvailableNodes {
        display: grid;
        gap: 2px;
        width: 100%;
        padding:4px ;
    }
    .optionAvailableNodes {
        width: 100%;
        height: 30px;
        border-radius: 3px;
        padding: 4px !important;
        transition: 150ms linear;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        font-size: 0.7rem;
        font-weight: 550;
        background-color: var(--pj-background-primary);
        border: transparent 1px dashed;
        color: var(--pj-color-secondary);
    }

    .optionAvailableNodes:hover {
        color: var(--pj-accent-color);
    }

    .optionAvailableNodes:active {
        cursor: grabbing;
        border-color: var(--pj-accent-color);
    }
</style>