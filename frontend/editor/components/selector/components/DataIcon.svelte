<script lang="ts">
    import Preview from "../../../../shared/components/preview/Preview.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import Folders from "../../../../../shared/enums/Folders"
    import FileSystemUtil from "../../../../shared/FileSystemUtil"

    export let state
    export let type
    let previewPath
    $: {
    	if (state) previewPath = FileSystemUtil.path + FileSystemUtil.sep + Folders.PREVIEWS + FileSystemUtil.sep + state.registryID + ".preview"
    }
</script>

{#if type === "mesh"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon">category</Icon>
    </Preview>
{:else if type === "image"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon">image</Icon>
    </Preview>
{:else if type === "material"}
    <div data-svelteshaded-material="-"></div>
{:else if type === "ui"}
    <Icon slot="icon">widgets</Icon>
{:else if type === "code"}
    <Icon slot="icon">code</Icon>
{:else if type === "terrain"}
    <Icon slot="icon">landscape</Icon>
{/if}
<style>
    .img {
        object-fit: fill;
        max-height: 30px;
        border-radius: 3px;
    }
</style>