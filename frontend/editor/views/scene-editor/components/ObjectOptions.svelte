<script>
    import viewportContext from "../../../templates/viewport-context";
    import Localization from "../../../templates/LOCALIZATION_EN";
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
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
        label={Localization.OBJECT}
        autoClose={true}
/>