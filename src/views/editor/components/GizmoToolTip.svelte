<script>
    import {onMount} from "svelte";
    import INFORMATION_CONTAINER from "../../../data/INFORMATION_CONTAINER";

    let ref
    let isChanging = false
    onMount(() => {
        ref.isChanging = () => {
            if (isChanging)
                return
            isChanging = true
        }
        ref.finished = () => isChanging = false
    })

</script>


<div id={INFORMATION_CONTAINER.TRANSFORMATION} bind:this={ref} style={!isChanging ? "display: none" : undefined} class="wrapper"></div>

<style>
    .wrapper{
        position: absolute;
        bottom: 4px;
        left: 4px;
        backdrop-filter: blur(10px) brightness(75%);
        padding: 4px;
        border-radius: 3px;
        font-size: .7rem;
        z-index: 999;
    }
</style>