<script>
    import Localization from "../../../../static/LOCALIZATION_EN";
    import entityCreationOptions from "../../../templates/entity-creation-options";
    import getDropdownHeaderStyles from "../../../../components/dropdown/utils/get-dropdown-header-styles";
    import Dropdown from "../../../../components/dropdown/Dropdown.svelte";
    import ToolTip from "../../../../components/tooltip/ToolTip.svelte";
    import Icon from "../../../../components/icon/Icon.svelte";
    import SingleSelectDropdown from "../../../../components/dropdown/OptionDropdown.svelte";

    const options = entityCreationOptions()
</script>

<SingleSelectDropdown
    options={options}
    label={Localization.ADD}
    autoClose={true}
/>