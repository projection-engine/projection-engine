<script>
    import {onMount} from "svelte";
    import Localization from "../../libs/libs/Localization";
    import PostProcessing from "./components/PostProcessing.svelte";
    import Rendering from "./components/Rendering.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ViewportSettings from "./components/ViewportSettings.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Sidebar from "shared-resources/frontend/components/Sidebar.svelte";
    import Shortcuts from "./components/Shortcuts.svelte";
    import SettingsStore from "../../stores/SettingsStore";
    import VisualsStore from "../../stores/VisualsStore";


    let settings
    let visuals

    let originalSettings
    let tab = 0
    let changed = false


    onMount(() => {
        originalSettings = structuredClone(SettingsStore.data)
        settings = SettingsStore.data
        visuals = VisualsStore.data
    })

    function apply(clone) {
        SettingsStore.updateStore(clone ? originalSettings : settings)
        changed = false
    }

    const translate = (key) => Localization.SETTINGS.MAIN[key]
    const OPTIONS = [["desktop_windows", translate("VIEWPORT")], ["keyboard", translate("SHORTCUTS")], ["grain", translate("POST_PROCESSING")], ["high_quality", translate("RENDERING")]]

</script>

<div class="wrapper">
    <div class="content">
        {#if settings != null}
            <Sidebar
                    version={Localization.PROJECT.INFO.VERSION}
                    tab={tab}
                    setTab={v => tab = v}
                    options={OPTIONS}
            />

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
                    <h3>{translate("SHORTCUTS")}</h3>
                    <Shortcuts
                            translate={translate}
                            settings={settings}
                            update={(key, value) => {
                                        changed = true
                                    settings = {...settings, [key]: value}
                                }}
                    />


                {:else if tab === 2}
                    <h3>{translate("POST_PROCESSING")}</h3>
                    <PostProcessing
                            settings={settings}
                            update={(key, value) => {
                                changed = true
                            settings = {...settings, [key]: value}
                        }}
                    />
                {:else if tab === 3 && visuals}
                    <h3>{translate("RENDERING")}</h3>
                    <Rendering
                            settings={visuals}
                            update={(key, value) => {
                                changed = true
                                visuals = {...visuals, [key]: value}
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
    h3 {
        font-weight: 500;
        margin-top: 0;
        margin-bottom: 8px
    }

    .wrapper {
        padding: 16px;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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
        padding: 32px;
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow: auto;
    }
</style>