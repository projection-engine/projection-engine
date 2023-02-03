<script>
    import LOCALIZATION_EN from "../../../../shared/static/LOCALIZATION_EN";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import SingleSelectDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte";

    const options = entityCreationOptions()
</script>

<SingleSelectDropdown
    options={options}
    label={LOCALIZATION_EN.ADD}
    autoClose={true}
/>