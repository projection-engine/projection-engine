<script>
    import {allNodes} from "../templates/all-nodes"
    import Input from "../../../../components/input/Input.svelte";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import "../../../../components/selector/css/selector.css"

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

<Dropdown asButton="true">
    <button slot="button" class="button selector">
        {translate("ADD")}
    </button>
    <div class="modal-available-nodes selector">
        <div class="content-available-nodes selector">
            {#each nodes as d, i}
                <div
                    class="option-available-nodes selector"
                    draggable="true"
                    on:dragstart={e => e.dataTransfer.setData("text", d.dataTransfer)}
                >
                    <Icon>drag_indicator</Icon>
                    {d.label}
                </div>
            {/each}
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
</Dropdown>

