<script>
    import EnglishLocalization from "../../../static/EnglishLocalization";
    import Input from "../../../components/input/Input.svelte";
    import Dropdown from "../../../components/dropdown/Dropdown.svelte";
    import Icon from "../../../components/Icon/Icon.svelte";
    import "./css/card.css"
    import FileSystem from "../../../libs/FileSystem";

    const {ipcRenderer, shell} = window.require("electron")

    const translate = (key) => EnglishLocalization.HOME.CARD[key]

    export let open = () => null
    export let data = {meta: {}}
    export let onRename = () => null
    export let onDelete = () => null

    let name = data.meta.name
    let openForChange = false
</script>


<div
        class={"wrapper"}
        data-card={data.id}
>
    <div class={"info"} style="width: 200%">
        {#if openForChange}
            <Input
                placeholder={data.meta.name}
                value={name}
                width="200%"
                setSearchString={v => {
                    name = v
                    onRename(v)
                }}
                onBlur={(changed, v) => {
                    if(changed)
                        onRename(v)
                   openForChange = false
                }}
                onEnter={v => {
                    name = v
                    openForChange = false
                    onRename(v)
                }}
            />
        {:else}
            <strong>{name}</strong>
        {/if}
    </div>
    <div class={"divider"}></div>
    <div class={"info"}>
        <strong>{data.meta.lastModification ? data.meta.lastModification : translate("NEVER")}</strong>
        <small>{translate("LAST_MODIFIED")}</small>
    </div>
    <div class={"divider"}></div>
    <div class={"info"}>
        <strong>{data.meta.creationDate}</strong>
        <small>{translate("CREATION")}</small>
    </div>

    <div class={"divider"}></div>
    <div class={"section"}>
        <button class="button card-home" on:click={() => openForChange = true}>
            <Icon styles="font-size: 1rem">edit</Icon>
        </button>

        <Dropdown hideArrow={true}>
            <button class="button card-home" slot="button">
                <Icon>
                    more_horiz
                </Icon>
            </button>

            <button
                    on:click={() => shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FileSystem.sep + data.id)}
            >
                <Icon styles={"font-size: 1.1rem"}>folder</Icon>
                {translate("SHOW_IN_EXPLORER")}
            </button>
            <button
                    on:click={() => onDelete()}
            >
                <Icon styles={"font-size: 1.1rem"}>delete_forever</Icon>
                {translate("DELETE")}
            </button>
        </Dropdown>
        <button
                on:click={() => open()}
                class="button card-home"
                style="background: var(--pj-border-primary)"
        >
            <Icon styles={"font-size: 1rem"}>open_in_new</Icon>
        </button>
    </div>
</div>


<style>
    .wrapper {
        position: relative;
        width: 100%;
        border-radius: 3px;
        overflow: hidden;
        transition: 150ms linear;
        padding: 4px;
        color: var(--pj-color-secondary);
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: var(--pj-border-primary) 1px solid;
        height: 45px;
    }

    .wrapper:hover {
        background: var(--pj-background-primary);
    }

    .divider {
        max-height: 25px;
        height: 25px;
        width: 1px;
        background: var(--pj-border-primary);
    }

    .wrapper:hover {
        background: var(--pj-background-primary);
    }


    .section {
        width: 400px;
        padding-top: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        overflow: hidden;
    }


    .info {
        width: 100%;
        padding-left: 4px;
        display: grid;
        align-items: center;
        justify-content: flex-start;
    }

</style>
