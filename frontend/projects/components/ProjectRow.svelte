<script>

    import LOCALIZATION_EN from "../../static/LOCALIZATION_EN";
    import ToolTip from "../../components/tooltip/ToolTip.svelte";
    import Input from "../../components/input/Input.svelte";

    export let open
    export let data
    export let onRename
    export let selected

    $: isSelected = selected === data.id
    let changeDate
    let hovered


    $: {
        if (data.meta.lastModification) {
            let a = new Date()
            let b = new Date(a.getTime() - 8.64e+7)
            let c = new Date(data.meta.lastModification)

            b.setHours(0)
            b.setMinutes(0)
            b.setSeconds(0, 0)

            a.setHours(0)
            a.setMinutes(0)
            a.setSeconds(0, 0)

            c.setHours(0)
            c.setMinutes(0)
            c.setSeconds(0, 0)

            if (a.getTime() === c.getTime())
                changeDate = "Today";
            else if (b.getTime() === c.getTime())
                changeDate = "Yesterday";
            else
                changeDate = data.meta.lastModification
        } else
            changeDate = LOCALIZATION_EN.NEVER
    }


    let openForChange = false
</script>


<div style={isSelected ? "border-color: var(--pj-accent-color)" : ""} class="wrapper card-home" data-card={data.id}
     on:mouseenter={() => hovered = true} on:mouseleave={() => hovered = false}>
    <div
            class="info card-home"
            style="width: 200%; display: flex; justify-content: unset; gap: 4px"
            on:dblclick={() => openForChange = true}
    >
        <ToolTip content={LOCALIZATION_EN.DOUBLE_CLICK_TO_RENAME}/>
        {#if openForChange}
            <Input
                    placeholder={data.meta.name}
                    inputValue={data.meta.name}
                    width="200%"
                    onChange={v => {
                    data.meta.name = v
                    onRename(v)
                }}
                    onBlur={(changed, v) => {
                    if(changed){
                       onRename(v)
                       data.meta.name = v
                    }
                   openForChange = false
                }}
                    onEnter={v => {
                    data.meta.name = v
                    openForChange = false
                    onRename(v)
                }}
            />
        {:else}
            <div class="item-data">
                <strong>{data.meta.name}</strong>
                <small>{data.path}</small>
            </div>
        {/if}

    </div>

    <div class="content">

        <div class={"info card-home"} style="text-align: right" data-overflow="-">
            <strong>{changeDate}</strong>
            <small>{LOCALIZATION_EN.LAST_MODIFIED}</small>
        </div>
        <div data-vertdivider="-"></div>
        <button on:click={() => open()} data-focusbutton="-">{LOCALIZATION_EN.OPEN}</button>
    </div>
</div>


<style>
    .item-data {
        display: grid;
        justify-content: flex-start;
    }

    small {
        font-size: .65rem;
    }

    strong {
        font-weight: 550;
    }

    .open-icon > small {
        opacity: 0;
    }

    .hovered > small {
        opacity: 1;
    }

    .content {
        margin-left: 8px;
        width: fit-content;
        display: flex;
        align-items: center;
        gap: 2px;
        justify-content: flex-end;
        justify-items: flex-end;
    }
</style>
