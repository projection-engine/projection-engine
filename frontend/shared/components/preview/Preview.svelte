<script>
    export let drawOnError
    export let path
    let error = false
    let src
    $:fetch(path).then(res => {
    	res.text()
    		.then(res => src = res)
    		.catch(_ => src = null)
    }).catch(_ => src = null)

</script>

{#if error || !src }
    <slot name="icon"/>
{:else}
    <slot name="image" draggable="false" src={src}/>
{/if}
{#if !error || drawOnError}
    <slot/>
{/if}

