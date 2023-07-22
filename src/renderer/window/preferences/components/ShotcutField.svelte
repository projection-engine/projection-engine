<script>

    import SETTINGS from "../../editor/static/SETTINGS"

    import KEYS from "../../editor/static/KEYS.ts"
    import SettingsStore from "../../shared/stores/SettingsStore"
    import ToolTip from "../../shared/components/tooltip/ToolTip.svelte"
    import Icon from "../../shared/components/icon/Icon.svelte"
    import ToastNotificationSystem from "../../shared/components/alert/ToastNotificationSystem"
    import LocalizationEN from "../../../../shared/enums/LocalizationEN"

    export let shortcut = []
    export let key
    export let wrapperKey
    export let all

    function update(key, value) {
    	SettingsStore.updateStore({[key]: value})
    }

    let currentShortcut
    $: currentShortcut = [...shortcut]
    let text = ""
    let onEdit = false
    $: original = SETTINGS[wrapperKey][key]
    $: isChanged = JSON.stringify(original) !== JSON.stringify(currentShortcut)
    $: label = key.replace("_", " ")
    $:  {

    	let str = ""
    	for (let i = 0; i < currentShortcut.length; i++) {
    		const current = currentShortcut[i]

    		let c
    		if (current === KEYS.ControlLeft || current === KEYS.ControlRight)
    			c = "ctrl"
    		else if (current === KEYS.ShiftLeft || current === KEYS.ShiftRight)
    			c = "shift"

    		else if (current === KEYS.AltLeft || current === KEYS.AltRight)
    			c = "alt"
    		else
    			c = current.replace("Key", "")
    		if (i > 0)
    			str += (i === 1 ? " + " : "") + c + (i < currentShortcut.length - 1 ? " + " : "")
    		else
    			str = c
    	}
    	text = str
    }

    function handler(event) {
    	if (event.type === "keyup") {
    		document.removeEventListener("keydown", handler)
    		onEdit = false
    		const c = JSON.stringify(currentShortcut)

    		if (all.find(a => JSON.stringify(a) === c) != null) {
    			currentShortcut = [...shortcut]
    			ToastNotificationSystem.getInstance().error(LocalizationEN.SHORTCUT_ALREADY_LINKED)
    		}
    		update(currentShortcut)
    	} else if (!event.repeat) {
    		event.preventDefault()
    		currentShortcut = [...currentShortcut, event.code]
    	}
    }

    function initialize() {
    	currentShortcut = []
    	onEdit = true
    	document.addEventListener("keydown", handler)
    	document.addEventListener("keyup", handler, {once: true})
    }
</script>

<div class="row">
    <b>{label}:</b>
    <div class="row" style="justify-content: unset; gap: 8px">
        <small class:editing={onEdit}>{text}</small>
        <div class="row" style="justify-content: unset;">
            {#if !onEdit}
                <button data-sveltebuttondefault="-" on:click={initialize}>
                    <Icon styles="font-size: .9rem">keyboard</Icon>
                </button>
                {#if isChanged}
                    <div data-sveltevertdivider="-" style="margin: 0"></div>
                    <button data-sveltebuttondefault="-" on:click={() => currentShortcut = [...original]}>
                        <Icon styles="font-size: .9rem">close</Icon>
                        <ToolTip content={LocalizationEN.ORIGINAL}/>
                    </button>
                {/if}
            {/if}
        </div>
    </div>
</div>


<style>
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .editing {
        background: var(--pj-border-primary);
        outline: #0095ff 2px solid;
        border-radius: 3px;
        height: 20px;
        padding: 0 4px;
        display: flex;
        align-items: center;

    }

    .row {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2px;
    }

    b {
        font-size: .7rem;
        font-weight: 500;
    }

    small {
        font-size: .7rem;
        text-transform: lowercase;
    }

</style>