<script>
    import {onMount} from "svelte";
    import {marked} from "marked/lib/marked.esm.js"

    export let release
    export let close

    let ref

    onMount(() => {
        ref.innerHTML = marked.parse(release.body);
    })
</script>

<div bind:this={ref} class="wrapper"></div>

<style>
    .wrapper{
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 100%;
    }
</style>