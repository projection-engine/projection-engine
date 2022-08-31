<script>
    import Dropdown from "../dropdown/Dropdown.svelte";
    import Icon from "../icon/Icon.svelte";
    import logo from '../../../assets/logo.png';
    import Localization from "../../libs/Localization";
    import About from "./About.svelte";

    const {ipcRenderer} = window.require("electron")

    export let pageInfo = {}
    export let background = undefined
    export let label = undefined
    export let options = []

    let isAboutOpen = false
    const translate = (key) => Localization.COMPONENTS.FRAME[key]
</script>

<div class="wrapper" style={background ? `background: ${background}` : "background: var(--pj-background-quaternary);"}>
    {#if isAboutOpen}
        <About handleClose={() => isAboutOpen = false} translate={translate}/>
    {/if}
    <div class="options">
        <Dropdown hideArrow={true}>
            <button slot="button" class={"logo-button"}>
                <div class={"logo-wrapper"}>
                    <img src={logo} alt={"LOGO"} class={"logo"}/>
                </div>
            </button>
            <button on:click={() => isAboutOpen = true}>
                {translate("ABOUT")}
            </button>
            {#if pageInfo.closeEvent}
                <button
                        on:click={() => {
                    if (typeof pageInfo.closeEvent === "function")
                        pageInfo.closeEvent()
                    else
                        ipcRenderer.send("close" + sessionStorage.getItem("electronWindowID"))
                }}>
                    {translate("EXIT")}
                </button>
            {/if}
        </Dropdown>
        {#if label}
            <div class={"title"} data-overflow="-" >{label}</div>
        {/if}
        {#each options as option}
            {#if option.divider}
                <div class={"divider"}></div>
            {:else }
                {#if option.options}
                    <Dropdown class={"button"} style={"padding-right: 0"}>
                        <button on:click={option.onClick} class={"button"} slot="button">
                            {#if option.icon}
                                <Icon styles="font-size: 1.1rem">{option.icon}</Icon>
                            {/if}
                            {option.label}
                        </button>
                        {#each option.options as subOption}
                            {#if subOption.divider}
                                <div class={"vert-divider"}></div>
                            {:else}
                                <button
                                        class={"option-button"}
                                        disabled={subOption.disabled}
                                        on:click={subOption.onClick}
                                >
                                    <div class={"icon-container"}>
                                        {#if subOption.icon}
                                            <Icon styles="font-size: 1.1rem">{subOption.icon}</Icon>
                                        {/if}
                                    </div>
                                    {subOption.label}
                                </button>
                            {/if}
                        {/each}
                    </Dropdown>
                {:else}
                    <button on:click={option.onClick} class={"button"}>
                        {#if option.icon}
                            <Icon styles="font-size: 1.1rem">{option.icon}</Icon>
                        {/if}
                        {option.label}
                    </button>
                {/if}
            {/if}
        {/each}
    </div>
    <div class="draggable"></div>
    <div class={"action-wrapper"}>
        {#if pageInfo.minimizeEvent}
            <button
                    on:click={() => {
                    if (typeof pageInfo.minimizeEvent === "function")
                        pageInfo.minimizeEvent()
                    else
                        ipcRenderer.send("minimize" + sessionStorage.getItem("electronWindowID"))
                }}
                    class={"action-button"}
                    style={"--pj-accent-color: #0095ff"}
            >
                <Icon styles="font-size: 1.1rem">minimize</Icon>
            </button>
        {/if}
        {#if pageInfo.maximizeEvent}
            <button
                    on:click={() => {
                    if (typeof pageInfo.maximizeEvent === "function")
                        pageInfo.maximizeEvent()
                    else
                        ipcRenderer.send("maximize" + sessionStorage.getItem("electronWindowID"))
                }}
                    class={"action-button"}
                    style={"--pj-accent-color: #0095ff"}
            >
                <Icon styles="font-size: 1rem">check_box_outline_blank</Icon>
            </button>
        {/if}
        {#if pageInfo.closeEvent}
            <button
                    on:click={() => {
                    if (typeof pageInfo.closeEvent === "function")
                        pageInfo.closeEvent()
                    else
                        ipcRenderer.send("close" + sessionStorage.getItem("electronWindowID"))
                }}
                    class={"action-button"}
                    style={"--pj-accent-color: red"}
            >
                <Icon styles="font-size: 1.1rem">close</Icon>
            </button>
        {/if}
    </div>
</div>


<style>
    .wrapper {
        display: flex;

        width: 100vw;
        min-height: 30px;
        max-height: 30px;
        user-select: none;
        overflow: hidden;

        border-bottom: var(--pj-border-primary) 1px solid;
    }

    .draggable {
        width: 100%;
        min-height: 100%;
        cursor: grab;
        user-select: none;
        -webkit-app-region: drag;
    }

    .action-wrapper {
        display: flex;
        align-items: center;
    }

    .logo-wrapper {
        height: 100%;
        overflow: hidden;
        min-width: 54px;
        max-width: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
    }

    .logo {
        height: 100%;
    }

    .logo-button {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 25px;
        width: 25px;
        background: var(--pj-background-tertiary);
        border-radius: 3px;
        padding: 4px !important;

        border: var(--pj-border-primary) 1px solid;
    }

    .divider {
        min-width: 1px;
        background: var(--pj-border-primary);
        margin: 4px;
        height: 25px;
    }

    .title {
        font-weight: 550;
        text-align: left;
        color: var(--pj-color-secondary);
        white-space: nowrap;

        max-width: 10vw;
        font-size: .7rem;
    }


    .button {
        display: flex;
        align-items: center;
        gap: 4px;
        width: fit-content;
        white-space: nowrap;
        font-size: 0.7rem;
        font-weight: 550;
        height: 25px;

        border: none;
    }

    .options {
        padding: 0 2px;
        display: flex;
        align-items: center;
        min-height: 29px;
        gap: 4px;

    }

    .vert-divider {
        margin-top: 2px;
        margin-bottom: 2px;
        width: 100%;
        max-height: 1px;
        height: 1px;
        background: var(--pj-border-primary);
    }

    .action-button {
        width: clamp(35px, 2vw, 50px);
        height: 25px;
        border-radius: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: var(--pj-color-quinary);
    }
    .action-button:hover{
        color: var(--pj-accent-color)
    }
    .action-button:active{
        background: var(--pj-accent-color);
        color: white !important;
    }
    .icon-container {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .option-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 2px;
        height: 25px;
        padding: 2px 4px !important;
    }
</style>