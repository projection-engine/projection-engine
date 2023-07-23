<script>
    import Preview from "../../../../../shared/components/preview/Preview.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import ModalInput from "../../../../components/modal-input/ModalInput.svelte"

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
    export let isNotDraggable

</script>
<div
        data-svelteisitem="-"
        data-svelteid={data.id}
        data-sveltename={data.name}
        on:dblclick={() => ContentBrowserUtil.openItem(data, setCurrentDirectory, reset)}
        on:click={e => ContentBrowserUtil.handleSelection(e, data)}
        style={(isSelected && !isOnRename? "background: var(--pj-accent-color-light);" : (isOnRename ? "background: transparent; box-shadow: none;" : "")) +  (isToBeCut || isNotDraggable ? "opacity: .5;" : "")}
        class="file"
>
    <div class="icon">
        {#if icon != null}
            <Icon styles={(data.isFolder ? "color: var(--folder-color);" : "") + "font-size: 3.5rem; "}>{icon}</Icon>
        {:else if metadata.type === FileTypes.MATERIAL}
            <div data-svelteshaded-material="-" style="width: 60px; height: 60px"></div>
        {:else if metadata.type === FileTypes.PRIMITIVE || metadata.type === FileTypes.TEXTURE}
            <Preview path={metadata.path}>
                <img
                        class="image-item"
                        slot="image"
                        alt="logo"
                        let:src src={src}
                >
                <Icon slot="icon" styles="font-size: 4rem">
                    {#if metadata.type === FileTypes.PRIMITIVE}
                        category
                    {:else}
                        image
                    {/if}
                </Icon>
            </Preview>

        {/if}
    </div>
    <small data-svelteoverflow="-" style="padding: 4px; text-align: center; font-size: .7rem">{data.name}</small>
    {#if isOnRename}
        <ModalInput
                alignBottom={true}
                initialValue={data.name}
                handleClose={submitRename}
        />
    {/if}
</div>

<style>
    .icon {
        position: relative;
        color: var(--pj-color-secondary);
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .image-item {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border: var(--pj-border-primary) 1px solid;

    }

    .file {
        position: relative;
        overflow: hidden;
        border-radius: 5px;
        color: var(--pj-color-secondary);
        gap: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 115px;
        max-width: 115px;
        width: 115px;
        outline: transparent 2px solid;
        cursor: pointer;
        flex: 1 1 80px;
        padding: 4px 4px 0;
    }

    .file:hover {
        border-color: transparent;
        background: var(--pj-background-primary);
        box-shadow: var(--pj-boxshadow);
    }
</style>
