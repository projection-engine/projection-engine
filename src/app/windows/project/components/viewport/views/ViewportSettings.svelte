<script>
    import Add from "../components/Add.svelte"
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../../../components/Icon/Icon.svelte";
    import Range from "../../../../../components/range/Range.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";

    export let settings
    export let translate
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
            <Dropdown >
                <button slot="button" class={"summary"}>
                    <Icon styles={{fontSize: "1.1rem"}}>visibility</Icon>
                    <div class={"overflow"}>
                        {translate("VISIBLE")}
                    </div>
                </button>

                <button on:click={() => settings.gridVisibility = !settings.gridVisibility}>
                    {#if settings.gridVisibility}
                        <Icon styles={"font-size: 1.1rem"}>check</Icon>
                    {/if}
                    {translate("GRID")}
                </button>

                <button on:click={() => settings.iconsVisibility = !settings.iconsVisibility}>
                    {#if settings.iconsVisibility}
                        <Icon styles={"font-size: 1.1rem"}>check</Icon>
                    {/if}
                    {translate("ICONS")}
                </button>

                <button
                    on:click={() => {
                        const v = !settings.cameraAnimation
                        settings.cameraAnimation = v
                        window.renderer.camera.animated = v
                    }}
                >
                    {#if settings.cameraAnimation}
                        <Icon styles={"font-size: 1.1rem"}>check</Icon>
                    {/if}
                    {translate("CAM_ANIM")}
                </button>

                <button on:click={() => settings.background = !settings.background}>
                    {#if settings.background}
                        <Icon styles={"font-size: 1.1rem"}>check</Icon>
                    {/if}
                    {translate("BACKGROUND")}
                </button>

                <div class={"rangeWrapper"}>
                    <Range
                        label={translate("ICON_SIZE")}
                        value={settings.iconSize}
                        maxValue={5} minValue={.1}
                        onFinish={v => settings.iconSize = v}
                    />
                </div>
            </Dropdown>
            <Add translate={translate}/>
        </div>
        <!--        <ViewTabs/>-->
        <!--        <Shading/>-->
    </div>
{/if}

<style>
    .options {
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