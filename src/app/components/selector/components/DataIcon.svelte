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
        <Icon slot="icon">view_in_ar</Icon>
    </Preview>
{:else if type === "image"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon" >image</Icon>
    </Preview>
{:else if type === "material"}
    <Preview path={previewPath}>
        <img draggable="false" class="img" slot="image" alt="logo" let:src src={src}>
        <Icon slot="icon">texture</Icon>
    </Preview>
{/if}
<style>
    .img{
        object-fit: fill;
        max-height: 100%;
        border-radius: 3px;
    }
</style>