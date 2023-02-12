<script>
    import viewportContext from "../../../templates/viewport-context";
    import LOCALIZATION_EN from "../../../../../static/objects/LOCALIZATION_EN";
    import OptionDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte";

    export let settings
    let mappedOptions = []
    $: {
        const cache = []

        viewportContext(settings, true).forEach((v, i, arr) => {
            if(i >= arr.length - 1)
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
        label={LOCALIZATION_EN.OBJECT}
        autoClose={true}
/>