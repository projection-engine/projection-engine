<script>
    import Localization from "../../../templates/LOCALIZATION_EN";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import getDropdownHeaderStyles from "../../../../shared/components/dropdown/utils/get-dropdown-header-styles";
    import Dropdown from "../../../../shared/components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte";
    import Icon from "../../../../shared/components/icon/Icon.svelte";
    import SingleSelectDropdown from "../../../../shared/components/dropdown/OptionDropdown.svelte";

    const options = entityCreationOptions()
</script>

<SingleSelectDropdown
    options={options}
    label={Localization.ADD}
    autoClose={true}
/>