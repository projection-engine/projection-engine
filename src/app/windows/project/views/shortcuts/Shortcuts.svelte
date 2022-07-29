<script>
    import SHORTCUTS_ID from "../../static/misc/SHORTCUTS_ID"
    import LABELED_KEYS from "../../static/misc/LABELED_KEYS";
    import {onDestroy, onMount} from "svelte";
    import Icon from "../../../../components/Icon/Icon.svelte";
    import KEYS from "../../libs/engine/data/KEYS";
    import "./styles/Shortcuts.css"
    import DataStoreController from "../../stores/DataStoreController";

    export let isEngineReady
    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings=v)

    function handler(event) {
        if (document.activeElement?.tagName !== "INPUT") {
            const l = window.shortcuts.all.length
            if (event.type === "keydown") {
                if (event.ctrlKey) {
                    window.shortcuts.active[KEYS.ControlLeft] = true
                    window.shortcuts.active[KEYS.ControlRight] = true
                }

                window.shortcuts.active[event.code] = true
                for (let i = 0; i < l; i++) {
                    const a = window.shortcuts.all[i]
                    let trigger = true
                    a.require.forEach(r => {
                        trigger = trigger && window.shortcuts.active[r]
                    })

                    if (trigger && !a.disabled && a.callback !== undefined)
                        a.callback()
                }
            } else {
                if (event.code === KEYS.ControlLeft || event.code === KEYS.ControlRight) {
                    delete window.shortcuts.active[KEYS.ControlLeft]
                    delete window.shortcuts.active[KEYS.ControlRight]
                } else
                    delete window.shortcuts.active[event.code]
            }
            window.shortcuts.updateShortcuts()
        }
    }

    let focusedWindow
    let actions = []
    let initialized = false
    $: {
        if(!initialized && isEngineReady) {
            initialized = true
            window.shortcuts.updateShortcuts = () => {
                const clickedLen = Object.keys(window.shortcuts.active).length
                actions = window.shortcuts.all.filter(a => (a.require.length === 1 && clickedLen === 0) || a.require.find(e => window.shortcuts.active[e] === true) !== undefined)
                focusedWindow = window.shortcuts.window
            }
        }
    }
    onMount(() => {
        document.addEventListener("keydown", handler)
        document.addEventListener("keyup", handler)
    })
    onDestroy(() => {
        unsubscribeSettings()
        document.removeEventListener("keyup", handler)
        document.removeEventListener("keydown", handler)
    })
</script>
<div
    class={"wrapper shortcuts"}
    id={SHORTCUTS_ID}
    style={settings.visible.shortcuts ? undefined :"display: none"}
>
    {#if focusedWindow}
        <div data-item={"-"} data-action={"-"}>
            <Icon styles="font-size: 1rem">{focusedWindow.icon}</Icon>
            <div>{focusedWindow.label}</div>
        </div>
    {:else}
        <div data-item={"-"}>
            Nothing focused
        </div>
    {/if}
    {#each actions as a}
        <div data-action={"-"}>
            <div data-item={"-"}>
                {#each a.require as e, i}
                    {LABELED_KEYS[e] + (i < a.require.length - 1 ? " + " : "")}
                {/each}
            </div>
            <div>
                {a.label}
            </div>
        </div>
    {/each}
</div>
