<script>
    import ALL_NODES from "../static/ALL_NODES"

    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Input from "../../../../shared/components/input/Input.svelte"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

    let inputValue = ""
    $: nodes = !inputValue ? ALL_NODES : ALL_NODES.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
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
                placeholder={LocalizationEN.SEARCH}
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