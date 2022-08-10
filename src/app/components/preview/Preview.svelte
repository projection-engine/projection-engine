<script>

    import {onMount} from "svelte";
    import AsyncFS from "../../libs/AsyncFS";

    export let drawOnError
    export let path
    let error = false

    let src
    onMount(async () => {
        try {
            AsyncFS.read(path).then(res => {
                if (!res[0]) {
                    src = res[1]
                    error = false
                } else
                    error = true
            })
        } catch (err) {
            error = true
        }
    })

</script>

{#if error}
    <slot name="icon"/>
{:else}
    <slot name="image" draggable="false" src={src}/>
{/if}
{#if !error || drawOnError}
    <slot/>
{/if}

