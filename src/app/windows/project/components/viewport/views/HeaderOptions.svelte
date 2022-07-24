<script>
    import Add from "../components/Add.svelte"
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";

    let fullscreen = false
    let ref

    const handleFullscreen = () => {
        fullscreen = document.fullscreenElement;
    }
    onMount(() => document.addEventListener("fullscreenchange", handleFullscreen))
    onDestroy(() => document.removeEventListener("fullscreenchange", handleFullscreen))

    const onClickFullscreen = () => {
        if (!fullscreen) {
            ref.parentNode.requestFullscreen()
                .then(() => fullscreen = true)
                .catch()
        } else
            document.exitFullscreen()
                .catch()
                .finally(() => fullscreen = false)
    }

</script>

{#if !fullscreen}
    <div class={"options"} bind:this={ref} draggable="false">
        <div style="display: flex; align-items: center; gap: 4px; justify-content: flex-start">
            <button class="dropdown" on:click={onClickFullscreen}>
                <Icon styles="fontSize: 1.1rem">fullscreen</Icon>
            </button>
            <!--            <Visible />-->
            <Add/>
        </div>
        <!--        <ViewTabs/>-->
        <!--        <Shading/>-->
    </div>
{/if}

<style>
    .options{
        display: grid;
        grid-template-columns: 200px calc(100% - 400px) 200px;
        align-items: center;
        justify-items: flex-end;

        width: 100%;
        padding: 0 2px;
        height: 23px;
        user-select: none;
        top: 20px;
        z-index: 10;
    }
</style>