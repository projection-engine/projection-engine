<script>
    import Localization from "../../../libs/Localization";
    import Dropdown from "../../dropdown/Dropdown.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Icon from "../../icon/Icon.svelte";
    import VIEWS from "../VIEWS";
    import SettingsStore from "../../../../editor/stores/SettingsStore";

    export let icon
    export let title
    export let orientation
    export let hidden
    export let switchView
    export let currentView


    const translate = key => Localization.COMPONENTS.VIEWS[key]

</script>
<div
        class:headerHidden={hidden}
        class:header={!hidden}
>
    <Dropdown asButton={true} styles="width: clamp(250px, 20vw, 500px);">
        <button
                style={"height: " +  (orientation === "vertical" && hidden ? "fit-content" : "25px")}
                class="title"
                slot="button"
        >
            <Icon styles="font-size: .9rem">{icon}</Icon>
            <ToolTip content={title}/>
        </button>
        <button on:click={() => switchView(undefined)}>
            <Icon styles="font-size: 1rem">close</Icon>
            <small data-overflow="-">{translate("CLOSE_VIEW")}</small>
        </button>
        <div class="content">
            <fieldset>
                <legend>{translate("MISC")}</legend>
                <div class="column">
                    <button class="button" on:click={() => switchView(VIEWS.FILES)} data-highlight={currentView === VIEWS.FILES ? "-" : ""}>
                        <Icon styles="font-size: 1rem">folder</Icon>
                        <small data-overflow="-">{translate("CONTENT_BROWSER")}</small>
                    </button>
                    <button class="button" on:click={() => switchView(VIEWS.BLUEPRINT)} data-highlight={currentView === VIEWS.BLUEPRINT ? "-" : ""}>
                        <Icon styles="font-size: 1rem">texture</Icon>
                        <small data-overflow="-">{translate("SHADER_EDITOR")}</small>
                    </button>
                </div>
            </fieldset>
            <fieldset>
                <legend>{translate("DATA")}</legend>
                <div class="column">
                    <button class="button" on:click={() => switchView(VIEWS.HIERARCHY)} data-highlight={currentView === VIEWS.HIERARCHY ? "-" : ""}>
                        <Icon styles="font-size: 1rem">account_tree</Icon>
                        <small data-overflow="-">{translate("HIERARCHY")}</small>
                    </button>
                    <button class="button" on:click={() => switchView(VIEWS.COMPONENT)} data-highlight={currentView === VIEWS.COMPONENT ? "-" : ""}>
                        <Icon styles="font-size: 1rem">category</Icon>
                        <small data-overflow="-">{translate("INSPECTOR")}</small>
                    </button>
                </div>
            </fieldset>
            <fieldset>
                <legend>{translate("SCRIPTING")}</legend>
                <div class="column">
                    <button class="button" on:click={() => switchView(VIEWS.CONSOLE)} data-highlight={currentView === VIEWS.CONSOLE ? "-" : ""}>
                        <Icon styles="font-size: 1rem">terminal</Icon>
                        <small data-overflow="-">{translate("CONSOLE")}</small>
                    </button>
                </div>
            </fieldset>
        </div>
    </Dropdown>
    {#if !hidden}
        <slot/>
    {/if}
</div>

<style>
    small {
        font-size: .7rem;
    }

    .button {
        display: flex;
        align-items: center;
        gap: 4px;
        border: none;
        height: 30px;
        background: var(--pj-background-secondary);
        white-space: nowrap;
        overflow: hidden;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 2px;

        padding: 0 2px;

        border: none;
    }


    .header {
        display: flex;
        align-items: center;
        align-content: center;
        width: 100%;
        min-height: 28px;
        max-height: 28px;
        background-color: var(--pj-background-secondary);
        padding: 0 2px;
        gap: 2px;

        overflow-y: hidden;
        overflow-x: auto;
        max-width: 100%;
    }

    .headerHidden {
        height: 100%;
        width: 100%;
        padding: 2px;
    }

    .content {
        display: flex;
        width: 100%;
        overflow: hidden;
        padding-bottom: 2px;
    }

    .column {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 3px;
    }

    fieldset {
        width: 100%;
    }
</style>