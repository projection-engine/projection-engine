<script>
    import {onMount} from "svelte";
    import INFORMATION_CONTAINER from "../../../data/INFORMATION_CONTAINER";

    let isChanging = false
    onMount(() => {
        const e = document.getElementById(INFORMATION_CONTAINER.TRANSFORMATION)
        e.isChanging = () => {
            if (isChanging)
                return
            isChanging = true
        }
        e.finished = () => isChanging = false
    })
</script>


<div id={INFORMATION_CONTAINER.TRANSFORMATION} style={!isChanging ? "display: none" : undefined} class="tooltip"></div>

<style>
    .tooltip{
        position: absolute;
        bottom: 4px;
        left: 4px;
        backdrop-filter: blur(10px) brightness(75%);
        padding: 4px;
        border-radius: 3px;
        font-size: .7rem;
    }
</style>