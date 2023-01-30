<script>
    import LOCALIZATION_EN from "../../views/editor/static/LOCALIZATION_EN";
    import ToolTip from "../tooltip/ToolTip.svelte";
    import Icon from "../icon/Icon.svelte";
    import EngineStore from "../../views/editor/stores/EngineStore";
    import {onDestroy} from "svelte";
    import GPU from "../../../engine-core/GPU";

    import Modal from "../modal/Modal.svelte";
    import WindowChangeStore from "./WindowChangeStore";
    import ChangesTrackerStore from "../../views/editor/stores/ChangesTrackerStore";

    let engine
    let hasChanges = false
    let message = undefined

    const unsubscribe = EngineStore.getStore(v => engine = v)
    const unsubscribeMessage = WindowChangeStore.getStore(v => message = v)
    const unsubscribeChanges = ChangesTrackerStore.getStore(v => hasChanges = v)
    const {ipcRenderer} = window.require("electron")

    onDestroy(() => {
        unsubscribeChanges()
        unsubscribeMessage()
        unsubscribe()
    })

    function toggleFullscreen() {
        if (document.fullscreenElement != null)
            document.exitFullscreen()
        else {
            if (engine.executingAnimation)
                GPU.canvas.requestFullscreen()
            else
                document.body.requestFullscreen()
        }
    }
</script>

{#if message !== undefined}
    <Modal handleClose={() => WindowChangeStore.updateStore(undefined)} styles="max-width: 30vw; padding: 8px">
        <div data-svelteinline="-" style="width: 100%; gap: 12px">
            <Icon styles="font-size: 50px">help_outline</Icon>
            <h4>{message.message}</h4>
        </div>
        <div data-svelteinline="-" style="width: 100%; gap: 8px">
            <button
                    data-sveltebuttondefault="-"
                    data-sveltefocusbutton="-"
                    class="modal-button"
                    on:click={() => {
                        message.callback?.()
                    }}
                    style="--pj-accent-color: red"
            >
                {LOCALIZATION_EN.YES}
            </button>
            <button
                    data-sveltebuttondefault="-"
                    data-sveltefocusbutton="-"
                    class="modal-button"
                    on:click={() => {
                       WindowChangeStore.updateStore(undefined)
                    }}
            >
                {LOCALIZATION_EN.NO}
            </button>
        </div>
    </Modal>
{/if}

<div data-svelteinline="-" style="margin-left: auto">
    <button
            data-sveltebuttondefault="-"
            on:click={toggleFullscreen}
            style="background: transparent"
    >
        <Icon styles="font-size: 1rem">fullscreen</Icon>
        <ToolTip content={LOCALIZATION_EN.FULLSCREEN}/>
    </button>
    <div data-sveltevertdivider="-" style="height: 15px"></div>
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
            on:click={_ => {
                if(hasChanges)
                    WindowChangeStore.updateStore({message: LOCALIZATION_EN.UNSAVED_CHANGES, callback: () => ipcRenderer.send("close")})
                else
                    ipcRenderer.send("close")
            }}
            style="--pj-accent-color: red"
    >
        <Icon styles="font-size: 1rem">close</Icon>
        <ToolTip content={LOCALIZATION_EN.CLOSE}/>
    </button>
</div>

<style>
    .modal-button {
        max-width: unset;
        max-height: 30px;
        min-height: 30px;
        width: 100%;
        font-weight: 550;
        font-size: .8rem;
    }

    h4 {
        font-weight: 550;
        margin-top: 0;
    }

    button {
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