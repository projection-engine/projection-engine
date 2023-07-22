<script>

    import ToolTip from "../tooltip/ToolTip.svelte"
    import Icon from "../icon/Icon.svelte"
    import {onDestroy, onMount} from "svelte"

    import Modal from "../modal/Modal.svelte"
    import WindowChangeStore from "../../stores/WindowChangeStore"
    import ChangesTrackerStore from "../../stores/ChangesTrackerStore"
    import ElectronResources from "../../lib/ElectronResources"
    import RENDER_TARGET from "../../../editor/static/RENDER_TARGET"
    import HotKeysController from "../../lib/HotKeysController"
    import LevelService from "../../../editor/services/engine/LevelService"
    import LocalizationEN from "../../../../../shared/enums/LocalizationEN"

    const COMPONENT_ID = crypto.randomUUID()

    export let noChangeTracking

    let windowChangeState = {}

    onMount(() => WindowChangeStore.getInstance().addListener(COMPONENT_ID, data => windowChangeState = data))
    onDestroy(() => WindowChangeStore.getInstance().removeListener(COMPONENT_ID))

    function toggleFullscreen() {
    	if (document.fullscreenElement != null)
    		document.exitFullscreen()
    	else {
    		if (HotKeysController.blockActions)
    			document.getElementById(RENDER_TARGET).querySelector("canvas").requestFullscreen()
    		else
    			document.body.requestFullscreen()
    	}
    }
</script>

{#if windowChangeState.message !== undefined && !noChangeTracking}
    <Modal handleClose={() => WindowChangeStore.updateStore({})} styles="width: 30vw; padding: 8px">
        <div data-svelteinline="-" style="width: 100%; gap: 12px">
            <Icon styles="font-size: 50px">help_outline</Icon>
            <h5>{windowChangeState.message}</h5>
        </div>
        <div data-svelteinline="-" style="width: 100%; gap: 8px; padding-left: 50%">
            <button
                    data-sveltebuttondefault="-"
                    data-sveltefocusbutton="-"
                    class="modal-button"
                    on:click={windowChangeState.callback}
            >
                {LocalizationEN.YES}
            </button>
            <button
                    data-sveltebuttondefault="-"
                    class="modal-button"
                    on:click={() =>  WindowChangeStore.updateStore({})}
            >
                {LocalizationEN.CANCEL}
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
        <ToolTip content={LocalizationEN.FULLSCREEN}/>
    </button>
    <div data-sveltevertdivider="-" style="height: 15px"></div>
    <button
            data-sveltebuttondefault="-"
            on:click={_ => ElectronResources.ipcRenderer.send("minimize")}
    >
        <Icon styles="font-size: 1rem">minimize</Icon>
        <ToolTip content={LocalizationEN.MINIMIZE}/>
    </button>
    <button
            data-sveltebuttondefault="-"
            on:click={_ => ElectronResources.ipcRenderer.send("maximize")}
    >
        <Icon styles="font-size: 1rem">maximize</Icon>
        <ToolTip content={LocalizationEN.MAXIMIZE}/>
    </button>
    <button
            data-sveltebuttondefault="-"
            on:click={() => {
                if(ChangesTrackerStore.getData().changed)
                    WindowChangeStore.updateStore({message: LocalizationEN.UNSAVED_CHANGES, callback: async () => {
                        await LevelService.getInstance().save()
                        ElectronResources.ipcRenderer.send("close")
                    }})
                else
                    ElectronResources.ipcRenderer.send("close")
            }}
            style="--pj-accent-color: red"
    >
        <Icon styles="font-size: 1rem">close</Icon>
        <ToolTip content={LocalizationEN.CLOSE}/>
    </button>
</div>

<style>
    .modal-button {
        max-width: unset;
        max-height: 23px;
        min-height: 23px;
        width: 100%;

        font-size: .75rem;
    }

    h4 {

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