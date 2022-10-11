<script>
    import VIEWS from "../data/VIEWS";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte"
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte"

    import SettingsStore from "../../../../editor/stores/SettingsStore";
    import {onDestroy} from "svelte";
    import Localization from "../../../libs/Localization";

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


<button
        on:click={() => setTabs([...tabs.left, [VIEWS.CONSOLE]], "left")}
        class="extend-view left"
>
    <ToolTip content={translate("CREATE_LEFT")}/>
    <Icon styles="font-size: .85rem; rotate: 90deg">arrow_drop_down</Icon>
</button>

<button
        on:click={() => setTabs([...tabs.right, [VIEWS.CONSOLE]], "right")}
        class="extend-view right"
>
    <ToolTip content={translate("CREATE_RIGHT")}/>
    <Icon styles="font-size: .85rem; rotate: -90deg">arrow_drop_down</Icon>
</button>

<div class="vertical">
    <button on:click={() => setTabs([...tabs.top, [VIEWS.CONSOLE]], "top")} class="extend-view">
        <ToolTip content={translate("CREATE_TOP")}/>
        <Icon styles="font-size: .85rem; rotate: 180deg">arrow_drop_down</Icon>
    </button>
    <button on:click={() => setTabs([...tabs.bottom, [VIEWS.CONSOLE]], "bottom")} class="extend-view">
        <ToolTip content={translate("CREATE_BOTTOM")}/>
        <Icon styles="font-size: .85rem">arrow_drop_down</Icon>
    </button>
</div>


<style>
    .vertical {
        display: flex;
        gap: 2px;
        position: absolute;
        z-index: 20;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -25%);
    }

    .extend-view {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        padding: 0;
        background: var(--pj-border-secondary);
        z-index: 20;
        border: none;
        outline: none;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
    }

    .extend-view:hover {
        color: var(--pj-accent-color);
    }

    .extend-view:active {
        color:white;
        background: var(--pj-accent-color);
    }

    .left {
        position: absolute;
        z-index: 20;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 8px;
    }

    .right {
        position: absolute;
        z-index: 20;
        transform: translate(50%, -50%);
        top: 50%;
        right: 8px;
    }

</style>