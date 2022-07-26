<script>
    import EnglishLocalization from "../../../static/EnglishLocalization";
    import Dropdown from "../../dropdown/Dropdown.svelte";
    import ToolTip from "../../tooltip/ToolTip.svelte";
    import Icon from "../../Icon/Icon.svelte";
    import VIEWS from "../VIEWS";

    export let icon
    export let title
    export let children
    export let orientation
    export let hidden
    export let switchView
    const translate = key => EnglishLocalization.COMPONENTS.VIEWS[key]
</script>
<div
    class:headerHidden={hidden}
    class:header={!hidden}
>
    <Dropdown hideArrow={true}>
        <button
                style={"height: " +  (orientation === "vertical" && hidden ? "fit-content" : "25px")}
                class={"title"}
                slot="button"
        >
            <div class={"icon"}>
                <Icon styles="font-size: 1rem">{icon}</Icon>
            </div>
            <ToolTip content={title}/>
        </button>
        <button on:click={() => switchView(undefined)}>
            <Icon styles="font-size: 1rem">close</Icon>
            {translate("CLOSE")}
        </button>

        <div class={"divider"}></div>
        <button on:click={() => switchView(VIEWS.HIERARCHY)}>
            <Icon styles="font-size: 1rem">account_tree</Icon>
            {translate("HIERARCHY")}
        </button>
        <button on:click={() => switchView(VIEWS.COMPONENT)}>
            <Icon styles="font-size: 1rem">category</Icon>
            {translate("COMP_EDITOR")}
        </button>
        <button on:click={() => switchView(VIEWS.FILES)}>
            <Icon styles="font-size: 1rem">folder</Icon>
            {translate("CONTENT_BROWSER")}
        </button>
        <button on:click={() => switchView(VIEWS.BLUEPRINT)}>
            <Icon styles="font-size: 1rem">texture</Icon>
            {translate("SHADER_EDITOR")}
        </button>
        <button on:click={() => switchView(VIEWS.CONSOLE)}>
            <Icon styles="font-size: 1rem">terminal</Icon>
            {translate("CONSOLE")}
        </button>
    </Dropdown>
    {#if !hidden}
        <slot/>
    {/if}
</div>