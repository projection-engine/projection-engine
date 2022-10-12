<script>
    import VIEWS from "./view/data/VIEWS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"

    import SettingsStore from "../stores/SettingsStore";
    import {onDestroy} from "svelte";
    import Localization from "../libs/libs/Localization";

    let settings
    const unsubscribe = SettingsStore.getStore(v => settings = v)

    onDestroy(() => unsubscribe())
    $: tabs = settings.views[settings.currentView]

    function setTabs(newValue, direction) {
        const clone = [...settings.views]
        clone[settings.currentView][direction] = newValue
        SettingsStore.updateStore({...settings, views: clone})
    }

    const translate = key => Localization.COMPONENTS.VIEWS[key]
</script>



<button style="width: 20px;" on:click={_ => setTabs([...tabs.left, [VIEWS.CONSOLE]], "left")}>
    <Icon>vertical_split</Icon>
    <ToolTip content={translate("SPLIT_LEFT")}/>
</button>
<button style="width: 20px;" on:click={_ => setTabs([...tabs.bottom, [VIEWS.CONSOLE]], "bottom")}>
    <Icon>horizontal_split</Icon>
    <ToolTip content={translate("SPLIT_BOTTOM")}/>
</button>
<button style="width: 20px;" on:click={_ => setTabs([...tabs.top, [VIEWS.CONSOLE]], "top")}>
    <Icon styles=" rotate: 180deg">horizontal_split</Icon>
    <ToolTip content={translate("SPLIT_TOP")}/>
</button>
<button style="width: 20px;" on:click={_ => setTabs([...tabs.right, [VIEWS.CONSOLE]], "right")}>
    <Icon styles="rotate: 180deg">vertical_split</Icon>
    <ToolTip content={translate("SPLIT_RIGHT")}/>
</button>

<style>

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        border: none;
        background: transparent;
        padding: 0 2px;
        height: 20px;


        white-space: nowrap;
    }

</style>