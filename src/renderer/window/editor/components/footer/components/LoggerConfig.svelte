<script>
    import LoggerTypes from "../../../../../../shared/enums/LoggerTypes"
    import RendererLogger from "../../../../../../shared/logger/RendererLogger"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import ToolTip from "../../../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"

    let loggerLevel = RendererLogger.level

    function setLoggerLevel(level) {
    	loggerLevel = level
    	RendererLogger.level = loggerLevel
    }
</script>
<div class="wrapper footer-header" style="background: var(--pj-background-primary)">
    <button
            data-sveltebuttondefault="-"
            style={loggerLevel === LoggerTypes.DETAILED ? "color: var(--pj-accent-color)" : undefined}
            on:click={() => setLoggerLevel(LoggerTypes.DETAILED)}>
        <Icon styles="font-size: 1rem">bug_report</Icon>
        <ToolTip content={LocalizationEN.LOGGER_DETAILED}/>
    </button>
    <div data-sveltevertdivider="-" style="margin: 0 2px"></div>
    <button
            data-sveltebuttondefault="-"
            style={loggerLevel === LoggerTypes.SILENT ? "color: var(--pj-accent-color)" : undefined}
            on:click={() => setLoggerLevel(LoggerTypes.SILENT)}>
        <Icon styles="font-size: 1rem">do_not_disturb</Icon>
        <ToolTip content={LocalizationEN.LOGGER_SILENT}/>
    </button>
</div>

<style>
    button {
        border: none;
        padding: 0;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>