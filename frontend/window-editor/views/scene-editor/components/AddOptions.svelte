<script lang="ts">

    import entityCreationOptions from "../../../templates/entity-creation-options"
    import SingleSelectDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte"
    import LocalizationEN from "../../../../../contants/LocalizationEN"

    const options = entityCreationOptions()
</script>

<SingleSelectDropdown
        options={options}
        label={LocalizationEN.ADD}
        autoClose={true}
/>