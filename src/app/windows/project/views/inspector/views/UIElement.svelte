<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import ToolTip from "../../../../../components/tooltip/ToolTip.svelte";
    import StyleField from "../components/StyleField.svelte";
    import TextArea from "../../../../../components/input/TextArea.svelte";

    export let translate
    export let store
    export let selected

    $: valid = Object.values(selected.styles).length

    const updateTag = (ev, tag) => {
        selected.tag = tag
        ev.currentTarget.parentElement.closeDropdown()
    }
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
    <button on:click={e => updateTag(e, "div")}>
        Container
    </button>
    <button on:click={e => updateTag(e, "input")}>
        Input
    </button>
    <button on:click={e => updateTag(e, "button")}>
        Button
    </button>
</Dropdown>


<Accordion>
    <svelte:fragment slot="header">
        Attributes
    </svelte:fragment>
    <fieldset>
        <legend>Text Content</legend>
        <TextArea
                placeholder={"TEXT_CONTENT"}
                value={selected.textContent}
                setValue={v => {
                    console.log(v)
                    selected.textContent = v
                }}
        />
    </fieldset>

    <fieldset>
        <legend>Classname</legend>
        <Input
                hasBorder={true}
                placeholder={"CSS_CLASS"}
                searchString={selected.className}
               setSearchString={v => selected.className = v}
        />
    </fieldset>
</Accordion>
<Accordion>
    <svelte:fragment slot="header">
        Styles
    </svelte:fragment>
    <StyleField selected={selected} isInput={true}/>
    {#if valid}
        <div data-divider="-"></div>
    {/if}
    {#each Object.entries(selected.styles) as initial}
        <StyleField selected={selected} initial={initial}/>
    {/each}
</Accordion>


<style>
    .button-dropdown {
        height: 25px;
        width: 100%;
    }
</style>