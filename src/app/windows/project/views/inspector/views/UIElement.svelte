<script>
    import Accordion from "../../../../../components/accordion/Accordion.svelte";
    import Dropdown from "../../../../../components/dropdown/Dropdown.svelte";
    import Input from "../../../../../components/input/Input.svelte";
    import StyleField from "../components/engine/StyleField.svelte";
    import TextArea from "../../../../../components/input/TextArea.svelte";
    import {onDestroy} from "svelte";
    import FilesStore from "../../../stores/FilesStore";
    import FilesAPI from "../../../../../libs/files/FilesAPI";
    import RegistryAPI from "../../../../../libs/files/RegistryAPI";
    import UIStore from "../../../stores/UIStore";

    export let translate
    export let component

    let store
    const unsubscribe = FilesStore.getStore(v => store = v)
    onDestroy(() => unsubscribe())

    $: valid = Object.values(component.styles).length

    const updateTag = (ev, tag) => {
        component.tag = tag
        ev.currentTarget.parentElement.closeDropdown()
    }
    const updateLayout = async (e, layout) => {
        const t = e.currentTarget.parentElement
        try {
            const reg = await RegistryAPI.readRegistryFile(layout.registryID)
            component.layoutBlock = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + reg.path)
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
            {#if component.tag === "div"}
                Container
            {:else if component.tag === "button"}
                Button
            {:else if component.tag === "input"}
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
                value={component.layoutBlock}
                setValue={v => component.layoutBlock = v}
        />
    </fieldset>

    <fieldset>
        <legend>Text Content</legend>
        <TextArea
                placeholder={"TEXT_CONTENT"}
                value={component.textContent}
                setValue={v => component.textContent = v}
        />
    </fieldset>

    <fieldset>
        <legend>Classname</legend>
        <Input
                hasBorder={true}
                placeholder={"CSS_CLASS"}
                searchString={component.className}
                setSearchString={v => component.className = v}
        />
    </fieldset>
</Accordion>
<Accordion>
    <svelte:fragment slot="header">
        Styles
    </svelte:fragment>
    <StyleField component={component} isInput={true}/>
    {#if valid}
        <div data-divider="-"></div>
    {/if}
    {#each Object.entries(component.styles) as initial}
        <StyleField component={component} initial={initial}/>
    {/each}
</Accordion>


<style>
    .button-dropdown {
        height: 25px;
        width: 100%;
    }
</style>