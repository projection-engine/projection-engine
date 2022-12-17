<script>
    import {ALL_NODES} from "../static/ALL_NODES"
    import Input from "frontend/shared/components/input/Input.svelte";
    import Dropdown from "frontend/shared/components/dropdown/Dropdown.svelte";
    import Icon from "frontend/shared/components/icon/Icon.svelte";
    import "../../../components/selector/css/selector.css"
    import Localization from "../../../templates/LOCALIZATION_EN";
    import getDropdownHeaderStyles from "../../../utils/get-dropdown-header-styles";

    const parseStr = (str) => str.toLowerCase().replace(/\s/g, "")
    let searchString = ""
    let nodes
    $: {
        const s = parseStr(searchString)
        if (!s)
            nodes = ALL_NODES
        nodes = ALL_NODES.filter(i => parseStr(i.label).includes(s))
    }
</script>

<Dropdown buttonStyles={getDropdownHeaderStyles()}>
    <button slot="button" data-view-header-dropdown="-">
        <Icon style="font-size: 1rem">add</Icon>
        {Localization.ADD}
    </button>
    <div class="modal-available-nodes selector">
        <div class="content">
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
                placeholder={Localization.SEARCH}
            >
                <Icon slot="icon">search</Icon>
            </Input>
        </div>
    </div>
</Dropdown>


<style>
    .content{
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2px;
        max-height: 100%;
        overflow-y: auto;
    }
</style>