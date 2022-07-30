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
            {nodes.map((d, i) => (
                <div
                    class="optionAvailableNodes"
                    draggable={true}
                    onDragStart={e => e.dataTransfer.setData("text", d.dataTransfer)}
                    key={d.dataTransfer + "-" + i}
                >
                    <Icon>drag_indicator</Icon>
                    {d.label}
                </div>
            ))}
        </div>
        <div class="headerAvailableNodes">
            <Input
                width={"100%"}
                searchString={searchString}
                setSearchString={v => searchString  = v}
                placeholder={translate("SEARCH")}
            />
        </div>
    </div>
</Dropdown>
