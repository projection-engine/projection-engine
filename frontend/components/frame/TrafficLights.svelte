<script>
    import LOCALIZATION_EN from "../../views/editor/static/LOCALIZATION_EN";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Icon from "../icon/Icon.svelte";

    const {ipcRenderer} = window.require("electron")
</script>

<div data-svelteinline="-" style="margin-left: auto">
    <button
            data-sveltebuttondefault="-"
            on:click={_ => ipcRenderer.send("minimize")}
    >
        <Icon styles="font-size: 1rem">minimize</Icon>
        <ToolTip content={LOCALIZATION_EN.MINIMIZE}/>
    </button>
    <button
            data-sveltebuttondefault="-"
            on:click={_ => ipcRenderer.send("maximize")}
    >
        <Icon styles="font-size: 1rem">maximize</Icon>
        <ToolTip content={LOCALIZATION_EN.MAXIMIZE}/>
    </button>
    <button
            data-sveltebuttondefault="-"
            on:click={_ => ipcRenderer.send("close")}
            style="--pj-accent-color: red"
    >
        <Icon styles="font-size: 1rem">close</Icon>
        <ToolTip content={LOCALIZATION_EN.CLOSE}/>
    </button>
</div>

<style>
    button{
        border: none;
        min-height: 22px;
        max-height: 22px;
        min-width: 22px;
        max-width: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--pj-background-primary);
        border-radius: 3px;
    }
</style>