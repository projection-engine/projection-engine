<script>
    import Preview from "../../preview/Preview.svelte";
    import FileSystem from "../../../windows/project/libs/FileSystem";
    import Icon from "../../Icon/Icon.svelte";

    export let state
    export let type
    $: previewPath = window.fileSystem.path + FileSystem.sep + "previews" + FileSystem.sep + state.registryID + ".preview"
</script>

{#if type === "mesh"}
    <Preview path={previewPath}>
        <img class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">view_in_ar</Icon>
    </Preview>
{:else if type === "image"}
    <Preview path={previewPath}>
        <img class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">image</Icon>
    </Preview>
{:else if type === "material"}
    <Preview path={previewPath}>
        <img class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">texture</Icon>
    </Preview>
{:else if type === "script"}
    <Icon slot="icon" styles="font-size: 1.6rem">javascript</Icon>
{/if}
<style>
    .img{
        object-fit: cover;
        width: 30px;
        height: 30px;
        border-radius: 5px;
    }
</style>