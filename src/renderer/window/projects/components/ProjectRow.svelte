<script>


    import ToolTip from "../../shared/components/tooltip/ToolTip.svelte"
    import Input from "../../shared/components/input/Input.svelte"
    import LocalizationEN from "../../../../shared/enums/LocalizationEN"

    export let open
    export let data
    export let onRename
    export let selected


    let openForChange = false
    let changeDate
    let hovered

    $: isSelected = selected === data.id

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
    			changeDate = "Today"
    		else if (b.getTime() === c.getTime())
    			changeDate = "Yesterday"
    		else
    			changeDate = data.meta.lastModification
    	} else
    		changeDate = LocalizationEN.NEVER
    }
</script>


<div style={isSelected ? "border-color: var(--pj-accent-color)" : ""} class="wrapper card-home"
     data-sveltecard={data.id}
     on:mouseenter={() => hovered = true} on:mouseleave={() => hovered = false}>
    <div
            class="info card-home"
            style="width: 200%; display: flex; justify-content: unset; gap: 4px"
            on:dblclick={() => openForChange = true}
    >
        <ToolTip content={LocalizationEN.DOUBLE_CLICK_TO_RENAME}/>
        {#if openForChange}
            <Input
                    placeholder={data?.meta?.name}
                    inputValue={data?.meta?.name}
                    width="200%"
                    onChange={v => {
                        data.meta.name = v
                        onRename(v, data)
                    }}
                    onBlur={(changed, v) => {
                    if(changed){
                       onRename(v, data)
                       data.meta.name = v
                    }
                   openForChange = false
                }}
                    onEnter={v => {
                    data.meta.name = v
                    openForChange = false
                    onRename(v, data)
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

        <div class={"info card-home"} style="text-align: right" data-svelteoverflow="-">
            <strong>{changeDate}</strong>
            <small>{LocalizationEN.LAST_MODIFIED}</small>
        </div>
        <div data-sveltevertdivider="-"></div>
        <button data-sveltebuttondefault="-" on:click={() => open(data.path)}
                data-sveltefocusbutton="-">{LocalizationEN.OPEN}</button>
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
