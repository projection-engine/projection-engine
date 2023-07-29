<script>

    import KEYS from "../../../static/KEYS.ts"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"


    export let initial
    export let isInput
    export let component
    export let submit
    let ref
    let key = initial ? initial[0] : ""
    let value = initial ? initial[1] : ""
    let changed = false
    $: {
    	if (ref && initial != null) {
    		const inputs = ref.querySelectorAll("input")
    		inputs[0].value = initial[0]
    		inputs[1].value = initial[1]
    		value = initial[1]
    		key = initial[0]
    	}
    }


    const save = () => {
    	if (!changed)
    		return

    	if (isInput && value && key) {
    		submit(key, value)
    		value = ""
    		key = ""
    		const inputs = ref.querySelectorAll("input")
    		inputs[0].value = ""
    		inputs[1].value = ""
    		inputs[0].blur()
    		inputs[1].blur()
    	} else
    		submit(key, value)

    }

    function apply(v, isKey) {

    	if (isKey)
    		key = v
    	else
    		value = v
    	if (!v) {
    		if (isInput)
    			return
    		submit(key, value)
    	} else
    		save()
    	changed = false
    }
</script>

<div class="wrapper" bind:this={ref}>
    <input
            on:input={() => changed = true}
            placeholder={LocalizationEN.KEY}
            on:blur={e => apply(e.currentTarget.value, true)}
            on:keydown={e => {
                if(e.code !== KEYS.Enter)
                  return
                apply(e.currentTarget.value, true)
            }}
    />
    :
    <input
            on:input={() => changed = true}
            placeholder={LocalizationEN.VALUE}
            on:blur={e => apply(e.currentTarget.value)}
            on:keydown={e => {
                if(e.code !== KEYS.Enter)
                  return
                apply(e.currentTarget.value)
            }}
    />

</div>

<style>

    .wrapper {
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    input {
        font-size: .7rem;
        border: none;
        background: none;
        outline: none;
        color: var(--pj-color-tertiary);
        width: 100%;
        overflow: hidden;
    }

    input:first-child {
        color: green;
    }
</style>
