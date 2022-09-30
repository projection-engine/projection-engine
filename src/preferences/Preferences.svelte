<script>
    import {onMount} from "svelte";
    import ROUTES from "../static/ROUTES";
    import WindowFrame from "../shared/components/window-frame/WindowFrame.svelte";
    import Localization from "../shared/libs/Localization";

    import ResizableBar from "../shared/components/resizable/ResizableBar.svelte";
    import PostProcessing from "./components/PostProcessing.svelte";
    import Rendering from "./components/Rendering.svelte";
    import Icon from "../shared/components/icon/Icon.svelte";
    import ViewportSettings from "./components/ViewportSettings.svelte";
    import ToolTip from "../shared/components/tooltip/ToolTip.svelte";
    import Sidebar from "../shared/components/Sidebar.svelte";

    const {ipcRenderer} = window.require('electron')
    let settings
    let originalSettings
    let tab = 0
    let changed = false
    const LOAD = ROUTES.LOAD_SETTINGS + sessionStorage.getItem("electronWindowID")
    onMount(() => {
        ipcRenderer.once(
            LOAD,
            (_, data) => {
                settings = data
                originalSettings = structuredClone(data)
            })
        ipcRenderer.send(LOAD)
    })

    function apply(clone) {
        ipcRenderer.send(ROUTES.UPDATE_SETTINGS + sessionStorage.getItem("electronWindowID"), clone ? originalSettings : settings)
        changed = false
    }

    const translate = (key) => Localization.SETTINGS.MAIN[key]
</script>

<div class="wrapper">
    <WindowFrame
            options={[]}
            label={translate("PREFERENCES")}
            pageInfo={{
			closeEvent: true
		}}
    />
    <div class="content">
        <Sidebar tab={tab} setTab={v => tab = v} options={[translate("VIEWPORT"), translate("POST_PROCESSING"), translate("RENDERING")]}/>
        {#if settings}
            <ResizableBar type="width"/>
            <div class="form">
                {#if tab === 0}
                    <h3>{translate("VIEWPORT")}</h3>
                    <ViewportSettings
                            translate={translate}
                            settings={settings}
                            update={(key, value) => {
                                changed = true
                            settings = {...settings, [key]: value}
                        }}
                    />

                {:else if tab === 1}
                    <h3>{translate("POST_PROCESSING")}</h3>
                    <PostProcessing
                            settings={settings}
                            update={(key, value) => {
                                changed = true
                            settings = {...settings, [key]: value}
                        }}
                    />
                {:else if tab === 2}
                    <h3>{translate("RENDERING")}</h3>
                    <Rendering
                            settings={settings}
                            update={(key, value) => {
                                changed = true
                            settings = {...settings, [key]: value}
                        }}
                    />
                {/if}

            </div>
        {/if}
    </div>
    <div class="footer">
        <button
                on:click={() => apply(true)}
                style="display: flex; align-items: center; justify-content: center; border: none"
        >
            <ToolTip content={translate("UNDO")}/>
            <Icon>restart_alt</Icon>
        </button>
        <button disabled={!changed} on:click={() => apply(false)} data-focusbutton="-" style="height: 25px">
            <Icon>check</Icon>
            {translate("APPLY")}
        </button>
    </div>
</div>

<style>
    h3{
        font-weight: 550;
        margin-bottom: 8px
    }
    .wrapper {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: var(--pj-background-tertiary);
    }

    .content {
        height: 100%;
        display: flex;
        overflow: hidden;
    }

    .footer {
        border-top: var(--pj-border-primary) 1px solid;
        height: 35px;
        width: 100%;
        background: var(--pj-background-secondary);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
    }




    .form {
        width: 100%;
        padding: 4px;
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow: auto;
    }
</style>