<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import StyleField from "../components/StyleField.svelte";
    import TextArea from "../../../../../components/input/TextArea.svelte";
    import {onDestroy} from "svelte";
    import FilesStore from "../../../stores/FilesStore";
    import FilesAPI from "../../../../../libs/files/FilesAPI";
    import RegistryAPI from "../../../../../libs/files/RegistryAPI";
    import UIStore from "../../../stores/UIStore";

    export let translate
    export let selected

    let store
    const unsubscribe = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribe())

    $: valid = Object.values(selected.styles).length

    const updateTag = (ev, tag) => {
        selected.tag = tag
        ev.currentTarget.parentElement.closeDropdown()
    }
    const updateLayout = async (e, layout) => {
        const t = e.currentTarget.parentElement
        try {
            const reg = await RegistryAPI.readRegistryFile(layout.registryID)
            selected.layoutBlock = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path)
            t.closeDropdown()
            UIStore.updateStore()
        } catch (err) {
            console.error(err)
        }
    }
</script>


<Accordion>
    <svelte:fragment slot="header">
        Attributes
    </svelte:fragment>
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

    <fieldset>
        <legend>Layout block</legend>
        <Dropdown>
            <button slot="button" class="button-dropdown">
                {translate("FROM_LAYOUT")}
            </button>
            {#each store.uiLayouts as layout}
                <button on:click={(e) => updateLayout(e, layout)}>
                    {layout.name}
                </button>
            {/each}

        </Dropdown>
        <TextArea
                placeholder={"LAYOUT_BLOCK"}
                value={selected.layoutBlock}
                setValue={v => selected.layoutBlock = v}
        />
    </fieldset>

    <fieldset>
        <legend>Text Content</legend>
        <TextArea
                placeholder={"TEXT_CONTENT"}
                value={selected.textContent}
                setValue={v => selected.textContent = v}
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