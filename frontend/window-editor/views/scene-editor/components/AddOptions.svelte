<script lang="ts">

    import getEntityCreationOptions from "../../../templates/get-entity-creation-options"
    import OptionDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte"
    import LocalizationEN from "../../../../../contants/LocalizationEN"

    const options = getEntityCreationOptions()
</script>

<OptionDropdown
        options={options}
        label={LocalizationEN.ADD}
        autoClose={true}
/>