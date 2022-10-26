<script>
    import VIEWS from "../view/data/VIEWS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"

    import SettingsStore from "../../stores/SettingsStore";
    import {onDestroy} from "svelte";
    import Localization from "../../templates/LOCALIZATION_EN";

    let settings
    const unsubscribe = SettingsStore.getStore(v => settings = v)

    onDestroy(() => unsubscribe())
    $: tabs = settings.views[settings.currentView]

    function setTabs(newValue, direction) {
        const clone = [...settings.views]
        clone[settings.currentView][direction] = newValue
        SettingsStore.updateStore({...settings, views: clone})
    }

</script>



<button on:click={_ => setTabs([...tabs.left, [VIEWS.CONSOLE]], "left")}>
    <Icon styles="font-size: 1.2rem; rotate: 180deg">vertical_split</Icon>
    <ToolTip content={Localization.SPLIT_LEFT}/>
</button>
<button on:click={_ => setTabs([...tabs.bottom, [VIEWS.CONSOLE]], "bottom")}>
    <Icon styles="font-size: 1.2rem;">horizontal_split</Icon>
    <ToolTip content={Localization.SPLIT_BOTTOM}/>
</button>
<button on:click={_ => setTabs([...tabs.top, [VIEWS.CONSOLE]], "top")}>
    <Icon styles="font-size: 1.2rem; rotate: 180deg">horizontal_split</Icon>
    <ToolTip content={Localization.SPLIT_TOP}/>
</button>
<button on:click={_ => setTabs([...tabs.right, [VIEWS.CONSOLE]], "right")}>
    <Icon styles="font-size: 1.2rem;">vertical_split</Icon>
    <ToolTip content={Localization.SPLIT_RIGHT}/>
</button>

<style>

    button {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 4px;
        color: var(--pj-color-secondary);

        border: none;
        background: transparent;
        padding: 0 2px;
        min-height: 30px;
        max-height: 30px;
        min-width: 30px;
        max-width: 30px;
        white-space: nowrap;
    }

    button:hover {
        background: var(--pj-border-primary);
    }

    button:active {
        background: transparent;
        color: var(--pj-accent-color);
        opacity: .9;
    }

</style>