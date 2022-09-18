<script>
    import Localization from "../../shared/libs/Localization";
    import Input from "../../shared/components/input/Input.svelte";
    import Dropdown from "../../shared/components/dropdown/Dropdown.svelte";
    import Icon from "../../shared/components/icon/Icon.svelte";
    import "../css/ProjectRow.css"
    import FilesAPI from "../../shared/libs/files/FilesAPI";

    const {ipcRenderer} = window.require("electron")

    const translate = (key) => Localization.HOME.CARD[key]

    export let open
    export let data
    export let onRename

    $: console.log(data)
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
        <strong>{data.meta.lastModification ? data.meta.lastModification : translate("NEVER")}</strong>
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
