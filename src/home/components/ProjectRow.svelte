<script>
    import Localization from "../../shared/libs/Localization";
    import Input from "../../shared/components/input/Input.svelte";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import "../css/ProjectRow.css"

    const {ipcRenderer} = window.require("electron")

    const translate = (key) => Localization.HOME.CARD[key]

    export let open
    export let data
    export let onRename
    let changeDate

    $: {
        if(data.meta.lastModification) {
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
        }
        else
            changeDate = translate("NEVER")
    }

    $: console.log(changeDate)
    let openForChange = false
</script>


<div class={"wrapper card-home"} data-card={data.id}>
    <div class={"info card-home"} style="width: 200%">
        {#if openForChange}
            <Input
                placeholder={data.meta.name}
                searchString= {data.meta.name}
                width="200%"
                setSearchString={v => {
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
            <strong>{data.meta.name}</strong>
        {/if}
    </div>

    <div class={"info card-home"} style="justify-content: flex-end; justify-items: flex-end">
        <strong>{changeDate}</strong>
        <small>{translate("LAST_MODIFIED")}</small>
    </div>



    <div class={"section card-home"}>
        <button class="button card-home" on:click={() => openForChange = true}>
            <Icon>edit</Icon>
        </button>
        <button
                on:click={() => open()}
                class="button card-home"
                style="background: var(--pj-border-primary)"
        >
            <Icon>open_in_new</Icon>
        </button>
    </div>
</div>


<style>
    strong{
        font-weight: 550;
    }
</style>
