<script>
    import NodeFS from "../../lib/FS/NodeFS";

    export let drawOnError
    export let path
    let lastPath
    let error = false
    let timeout
    let src
    $: {
        if (lastPath !== path) {
            clearTimeout(timeout)
            lastPath = path

        }
        src = null
        timeout = setTimeout(() => {
            try {
                NodeFS.read(path).then(res => {
                    error = !res
                    if(res)
                        src= res
                })
            } catch (err) {
                error = true
            }
        }, 500)
    }
</script>

{#if error || src == null}
    <slot name="icon"/>
{:else}
    <slot name="image" draggable="false" src={src}/>
{/if}
{#if !error || drawOnError}
    <slot/>
{/if}

