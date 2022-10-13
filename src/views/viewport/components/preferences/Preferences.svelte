<script>
    import {onMount} from "svelte";
    import Localization from "../../../../libs/libs/Localization";
    import PostProcessing from "./components/PostProcessing.svelte";
    import Rendering from "./components/Rendering.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ViewportSettings from "./components/ViewportSettings.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Sidebar from "shared-resources/frontend/components/Sidebar.svelte";
    import Shortcuts from "./components/Shortcuts.svelte";
    import SettingsStore from "../../../../stores/SettingsStore";
    import VisualsStore from "../../../../stores/VisualsStore";


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
    const OPTIONS = [translate("VIEWPORT"), translate("SHORTCUTS"), translate("POST_PROCESSING"), translate("RENDERING")]

</script>

<div class="wrapper">

    {#if settings != null}
        <div class="sidebar">
            {#each OPTIONS as option, index}
                <button class="row" on:click={_ => tab = index} style={ tab===index ? "color: var(--pj-accent-color)" : undefined}>
                    {option}
                </button>
            {/each}
            <div style="margin-top: auto;" class="sidebar">
                <button
                        on:click={() => apply(true)}
                        class="row"
                        style="color: #ff5555"
                >
                    {translate("UNDO")}
                </button>
                <button
                        on:click={() => apply(true)}
                        class="row"
                        style="height: 18px"
                        data-focusbutton="-"
                >
                    {translate("APPLY")}
                </button>
            </div>

        </div>


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

<style>

    .sidebar {
        width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 8px;

    }

    .row {
        text-align: left;
        font-size: .7rem;
        color: var(--pj-color-secondary);
        border: none;
    }

    h3 {
        font-weight: 500;
        margin-top: 0;
        margin-bottom: 8px
    }

    .wrapper {
        left: 50%;
        transform: translateX(-50%);
        padding: 32px 0;
        position: absolute;
        top: 0;
        width: clamp(500px, 50vw, 1000px);
        height: 100%;
        justify-items: center;
        overflow: hidden;
        display: flex;
        gap: 5%;
    }


    .form {
        width: 100%;
        display: grid;
        align-content: flex-start;
        gap: 4px;
        overflow: auto;
    }
</style>