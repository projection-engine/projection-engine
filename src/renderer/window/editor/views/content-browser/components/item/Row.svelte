<script>
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import KEYS from "../../../../static/KEYS"

    import FileTypes from "../../../../../../../shared/enums/FileTypes"
    import ContentBrowserUtil from "../../../../util/ContentBrowserUtil"

    export let data
    export let setCurrentDirectory
    export let reset
    export let isOnRename
    export let isSelected
    export let metadata
    export let submitRename
    export let icon
    export let isToBeCut

</script>

<div
        data-svelteisitem="-"
        data-svelteid={data.id}
        data-sveltename={data.name}
        on:dblclick={() => ContentBrowserUtil.openItem(data, setCurrentDirectory, reset)}
        on:click={e => ContentBrowserUtil.handleSelection(e, data)}
        style={(isSelected && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent; box-shadow: none;" : "")) +  (isToBeCut  ? "opacity: .5;" : "")}
        class="file"
>
    <div class="icon">
        {#if icon != null}
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 1rem; "}>{icon}</Icon>
        {:else if metadata.type === FileTypes.MATERIAL}
            <div data-svelteshaded-material="-" style="width: 20px; height: 20px"></div>
        {:else if metadata.type === FileTypes.PRIMITIVE || metadata.type === FileTypes.TEXTURE}
            <Icon slot="icon" styles="font-size: 1rem">
                {#if metadata.type === FileTypes.PRIMITIVE}
                    category
                {:else}
                    image
                {/if}
            </Icon>
        {/if}
    </div>

    <input
            data-svelteoverflow="-"
            disabled={!isOnRename}
            on:blur={ev =>  submitRename(ev.currentTarget.value)}
            on:keydown={e => {
                if(e.code === KEYS.Enter)
                    submitRename(e.currentTarget.value)
            }}
            value={data.name}
            style="text-align: left"
    />

    <small>{data.creationDate}</small>
    {#if !data.isFolder}
        <small>{(data.size / 1e+6).toFixed(2)}mb</small>
    {/if}
</div>

<style>
    input {
        padding: 0 2px;
        border-radius: 3px;
        background: none;
        text-align: center;
        outline: none;
        font-size: .7rem;
        color: var(--pj-color-primary);
        border: var(--pj-border-primary) 1px solid;
        background: rgba(0, 0, 0, .5);
        height: 23px;
    }

    input:disabled {
        border: none;
        background: none;
        color: var(--pj-color-quaternary);
    }

    small {
        font-size: .65rem;
    }

    .file {
        width: 100%;
        height: 23px;
        max-height: 23px;
        overflow: hidden;
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        grid-template-columns: 30px calc(80% - 30px) 10% 10%;
        gap: 4px;
    }

    .file:hover {
        border-color: transparent;
        background: var(--pj-background-primary);
        box-shadow: var(--pj-boxshadow);
    }

    .icon {
        width: 30px;
        position: relative;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
