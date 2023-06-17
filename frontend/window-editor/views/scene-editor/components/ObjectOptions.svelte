<script>
    import getViewportContext from "../../../templates/get-viewport-context"
    import LocalizationEN from "../../../../../contants/LocalizationEN"
    import OptionDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte"

    export let settings
    let mappedOptions = []
    $: {
    	const cache = []

    	getViewportContext(settings, true).forEach((v, i, arr) => {
    		if (i >= arr.length - 1)
    			return
    		if (v.children) {
    			cache.push({divider: true, label: v.label})
    			v.children.forEach(v => {
    				cache.push(v)
    			})
    		} else
    			cache.push(v)
    	})
    	mappedOptions = cache
    }
</script>

<OptionDropdown
        options={mappedOptions}
        label={LocalizationEN.OBJECT}
        autoClose={true}
/>