<script>
    import Preview from "../../preview/Preview.svelte";
    import FilesAPI from "../../../libs/files/FilesAPI";
    import Icon from "../../icon/Icon.svelte";

    export let state
    export let type
    let previewPath
    $: {
        if(state) previewPath =  FilesAPI.path + FilesAPI.sep + "previews" + FilesAPI.sep + state.registryID + ".preview"
    }
</script>

{#if type === "mesh"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">view_in_ar</Icon>
    </Preview>
{:else if type === "image"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">image</Icon>
    </Preview>
{:else if type === "material"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" styles="font-size: 1.6rem">texture</Icon>
    </Preview>
{/if}
<style>
    .img{
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        border-radius: 5px;
    }
</style>