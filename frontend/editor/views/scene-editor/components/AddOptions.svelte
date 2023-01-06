<script>
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import SingleSelectDropdown from "../../../../components/dropdown/OptionDropdown.svelte";

    const options = entityCreationOptions()
</script>

<SingleSelectDropdown
    options={options}
    label={LOCALIZATION_EN.ADD}
    autoClose={true}
/>