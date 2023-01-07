<script>
    import ALL_NODES from "../static/ALL_NODES"
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import Input from "../../../../../components/input/Input.svelte";

    let inputValue = ""
    $: nodes = !inputValue ? ALL_NODES : ALL_NODES.filter(i => i.label.includes(inputValue))
</script>

<div class="modal-available-nodes selector" style="height: 100%">
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
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2px;
        max-height: 100%;
        overflow-y: auto;
    }
</style>