<script>
    import VIEWS from "../../view/static/VIEWS"
    import SettingsStore from "../../../../stores/SettingsStore"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import LocalizationEN from "../../../../../shared/LocalizationEN"

    function setTabs(newValue, direction) {
    	const settings = SettingsStore.getData()
    	const viewTabs = settings.views[settings.currentView]
    	const clone = [...settings.views]
    	clone[settings.currentView][direction] = [...viewTabs[direction], newValue]
    	SettingsStore.getInstance().updateStore({views: clone})
    }

</script>

<button data-sveltebuttondefault="-"
        on:click={() => setTabs( [{color: [255,255,255], type: VIEWS.COMPONENT}], "left")}>
    <Icon styles="font-size: 1.2rem; rotate: 180deg">vertical_split</Icon>
    <ToolTip content={LocalizationEN.SPLIT_LEFT}/>
</button>
<button data-sveltebuttondefault="-"
        on:click={() => setTabs( [{color: [255,255,255], type: VIEWS.COMPONENT}], "bottom")}>
    <Icon styles="font-size: 1.2rem;">horizontal_split</Icon>
    <ToolTip content={LocalizationEN.SPLIT_BOTTOM}/>
</button>
<button data-sveltebuttondefault="-"
        on:click={() => setTabs([{color: [255,255,255], type: VIEWS.COMPONENT}], "top")}>
    <Icon styles="font-size: 1.2rem; rotate: 180deg">horizontal_split</Icon>
    <ToolTip content={LocalizationEN.SPLIT_TOP}/>
</button>
<button data-sveltebuttondefault="-"
        on:click={() => setTabs( [{color: [255,255,255], type: VIEWS.COMPONENT}], "right")}>
    <Icon styles="font-size: 1.2rem;">vertical_split</Icon>
    <ToolTip content={LocalizationEN.SPLIT_RIGHT}/>
</button>

<style>
    button {
        background: none;
        border: none;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>