<script>
    import VIEWS from "../../../shared/components/view/VIEWS";
    import Icon from "../../../shared/components/icon/Icon.svelte";
    import {onDestroy} from "svelte";
    import KEYS from "../../../../public/engine/static/KEYS";
    import Localization from "../../../shared/libs/Localization";
    import SettingsStore from "../../stores/SettingsStore";


    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings = v)
    onDestroy(() => unsubscribeSettings())

    const translate = key => Localization.PROJECT.VIEWPORT[key]
    const addNewTab = () => {
        const views = [...settings.views, {
            name: translate("NEW_TAB") + settings.views.length,
            bottom: [VIEWS.CONSOLE],
            right: [VIEWS.HIERARCHY],
            left: []
        }]
        SettingsStore.updateStore({...settings, views})

    }
    const handler = (e, v, i) => {
        switch (e.type) {
            case "keydown": {
                if
                (e.code !== KEYS.Enter)
                    break
                v.name = e.target.value
                e.currentTarget.type = "button"
                break
            }
            case "dblclick": {
                e.currentTarget.type = "text"
                break
            }
            case "input":
                v.name = e.target.value
                break
            case "blur":
                e.currentTarget.type = "button"
                break
            case "click":
                SettingsStore.updateStore({...settings, currentView: i})
                break
        }

    }
    const removeView = (i) => {
        const obj = {...settings}
        if (i === obj.currentView)
            obj.currentView = 0
        else
            obj.currentView--
        obj.views = obj.views.filter((_, index) => i !== index)
        SettingsStore.updateStore(obj)
    }
</script>

<div class="container">
    {#each settings.views as v, i}
        <div data-highlight={i === settings.currentView ? "-" : undefined} class="view">
            <input
                    on:dblclick={e => handler(e, v)}
                    on:input={e => handler(e, v)}
                    on:keydown={e => handler(e, v)}
                    on:blur={e => handler(e, v)}
                    on:click={e => handler(e, v, i)}
                    class="view-input"
                    data-view={i}
                    type="button"
                    value={v.name}
            >
            <button disabled={settings.currentView === i} on:click={() => removeView(i)}
                    class="remove-button">
                <Icon styles="font-size: .8rem">
                    clear
                </Icon>
            </button>
        </div>
    {/each}
    {#if settings.views.length < 10}
        <button on:click={addNewTab} class="add-button">
            <Icon styles="font-size: .9rem">
                add
            </Icon>
        </button>
    {/if}
</div>

<style>
    .view {
        color: var(--pj-color-quaternary);
        display: flex;
        align-items: center;
        overflow: hidden;

        border-radius: 3px;
    }

    .view[data-highlight="-"] {
        background: var(--pj-border-primary);
        color: var(--pj-color-secondary);
    }

    .view-input {
        color: var(--pj-color-secondary);
        background: transparent;
        border: none;
        outline: none;
    }

    .remove-button {
        --pj-accent-color: #ff5555;
        border: none;
        padding: 0;
        background: transparent;
        width: 23px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input, button {
        height: 20px;
        font-size: .7rem;
        border-radius: 3px;
    }

    .add-button {
        border: none;
        width: 23px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .container {
        display: flex;
        align-items: center;
        gap: 4px;
    }
</style>