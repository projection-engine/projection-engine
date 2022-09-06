<script>
    import Localization from "../../../libs/Localization";
    import Dropdown from "../../dropdown/Dropdown.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Icon from "../../icon/Icon.svelte";
    import VIEWS from "../VIEWS";

    export let icon
    export let title
    export let orientation
    export let hidden
    export let switchView
    const translate = key => Localization.COMPONENTS.VIEWS[key]
</script>
<div
    class:headerHidden={hidden}
    class:header={!hidden}
>
    <Dropdown hideArrow={true} asButton={true} buttonStyles="max-width: 22px">
        <button
                style={"height: " +  (orientation === "vertical" && hidden ? "fit-content" : "25px")}
                class="title"
                slot="button"
        >
            <Icon styles="font-size: .9rem">{icon}</Icon>
            <ToolTip content={title}/>
        </button>
        <button on:click={() => switchView(undefined)}>
            <Icon styles="font-size: 1rem">close</Icon>
            {translate("CLOSE")}
        </button>

        <div data-divider="-"></div>
        <button class="button" on:click={() => switchView(VIEWS.HIERARCHY)}>
            <Icon styles="font-size: 1rem">account_tree</Icon>
            {translate("HIERARCHY")}
        </button>
        <button class="button" on:click={() => switchView(VIEWS.COMPONENT)}>
            <Icon styles="font-size: 1rem">category</Icon>
            {translate("INSPECTOR")}
        </button>
        <button  class="button" on:click={() => switchView(VIEWS.FILES)}>
            <Icon styles="font-size: 1rem">folder</Icon>
            {translate("CONTENT_BROWSER")}
        </button>
        <button  class="button" on:click={() => switchView(VIEWS.BLUEPRINT)}>
            <Icon styles="font-size: 1rem">texture</Icon>
            {translate("SHADER_EDITOR")}
        </button>
        <button class="button" on:click={() => switchView(VIEWS.CONSOLE)}>
            <Icon styles="font-size: 1rem">terminal</Icon>
            {translate("CONSOLE")}
        </button>

    </Dropdown>
    {#if !hidden}
        <slot/>
    {/if}
</div>

<style>
    .button{
        height: 20px;

    }

    .title {
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 22px;
        min-width: 22px;
        max-height: 22px;
        max-width: 22px;
        border: none;
    }

    .header {
        font-size: .7rem;
        display: flex;
        align-items: center;
        align-content: center;
        width: 100%;
        min-height: 28px;
        max-height: 28px;
        background-color: var(--pj-background-secondary);
        padding: 0 2px;
        gap: 2px;

        overflow-y: hidden;
        overflow-x:auto ;
        max-width: 100%;
    }

    .headerHidden {
        font-size: .7rem;
        height: 100%;
        width: 100%;
        background-color: var(--pj-background-primary);
        padding: 2px;
    }
</style>