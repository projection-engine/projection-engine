<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import StyleField from "../components/StyleField.svelte";

    export let translate
    export let store
    export let selected
</script>

<Dropdown>
    <button slot="button" class="button-dropdown">
        {#if selected.tag === "div"}
            Container
        {:else if selected.tag === "button"}
            Button
        {:else if selected.tag === "input"}
            Input
        {/if}
    </button>
    <button data-closedropdown="-" on:click={() => selected.tag = "div"}>
        Container
    </button>
    <button data-closedropdown="-" on:click={() => selected.tag = "input"}>
        Input
    </button>
    <button data-closedropdown="-" on:click={() => selected.tag = "button"}>
        Button
    </button>
</Dropdown>


<Accordion>
    <svelte:fragment slot="header">
        Attributes
    </svelte:fragment>
    <fieldset>
        <legend>Text Content</legend>
        <Input placeholder={"TEXT_CONTENT"} searchString={selected.textContent}
               setSearchString={v => selected.textContent = v}/>
    </fieldset>

    <fieldset>
        <legend>Classname</legend>
        <Input placeholder={"CSS_CLASS"} searchString={selected.className}
               setSearchString={v => selected.className = v}/>
    </fieldset>
</Accordion>
<Accordion>
    <svelte:fragment slot="header">
        Styles
    </svelte:fragment>
    {#each Object.entries(selected.styles) as initial}
        <StyleField selected={selected} initial={initial}/>
    {/each}
    <StyleField selected={selected}/>
</Accordion>


<style>
    .button-dropdown {
        height: 25px;
        width: 100%;
    }
</style>