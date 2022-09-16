<script>
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import Dropdown from "../../../../../shared/components/dropdown/Dropdown.svelte";
    import Input from "../../../../../shared/components/input/Input.svelte";
    import StyleField from "./Styles.svelte";
    import TextArea from "../../../../../shared/components/input/TextArea.svelte";
    import COMPONENTS from "../../../../../../public/engine/static/COMPONENTS.json"
    import Localization from "../../../../../shared/libs/Localization";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import Selector from "../../../../../shared/components/selector/Selector.svelte";
    import getComponentIcon from "../../../../utils/get-component-icon";
    import Icon from "../../../../../shared/components/icon/Icon.svelte";
    import removeComponent from "../../utils/remove-component";
    import RegistryAPI from "../../../../../shared/libs/files/RegistryAPI";
    import FilesAPI from "../../../../../shared/libs/files/FilesAPI";
    import FilesStore from "../../../../stores/FilesStore";
    import {BundlerAPI, Engine} from "../../../../../../public/engine/production";

    export let entity
    export let submit

    let target
    $: target = entity
    $: component = target.components.get(COMPONENTS.UI)
    $: styles = Object.entries(component.wrapperStyles)
    $: hasStyles = styles.length > 0
    $: console.log(target, component, styles)
    const translate = key => Localization.PROJECT.INSPECTOR[key]

    function update(key, value) {
        submit(key, value)
        target = entity
        BundlerAPI.updateUIEntity(entity)
    }

    async function loadUILayout(reg) {
        const ref = await RegistryAPI.readRegistryFile(reg.registryID)
        if (!ref)
            return
        const file = await FilesAPI.readFile(FilesStore.ASSETS_PATH + FilesAPI.sep + ref.path)
        if (!file)
            return
        update("uiLayoutData", file)
    }

</script>

<Accordion>
    <svelte:fragment slot="header">
        <div class="icon">
            <Icon styles="font-size: .9rem; width: 1rem">
                {getComponentIcon(COMPONENTS.UI, component)}
            </Icon>
        </div>
        {translate("UI_COMPONENT")}
        <button class="button" on:click={() => removeComponent(undefined, COMPONENTS.UI)}>
            <Icon>delete_forever</Icon>
        </button>
    </svelte:fragment>
    <fieldset>
        <legend>{translate("IMPORT_LAYOUT")}</legend>
        <Selector
                selected={component.uiLayoutData}
                type="ui"
                handleChange={loadUILayout}
        />
    </fieldset>
    <fieldset>
        <legend>{translate("ANCHOR_ELEMENT_ID")}</legend>
        <Input
                searchString={component.anchorElement}
                placeholder={translate("ELEMENT_ID")}
                onBlur={(_, v) => update("anchorElement", v)}
                onEnter={v => update("anchorElement", v)}
                setSearchString={v =>  update("anchorElement", v)}
        />
    </fieldset>

    <fieldset>
        <legend>{translate("WRAPPER_STYLES")}</legend>
        <StyleField
                component={component}
                isInput={true}

                submit={v => {
                    update("wrapperStyles", v)
                    if (component.__element != null)
                        Object.assign(component.__element.style, component.wrapperStyles)
                }}
        />
        {#if hasStyles}
            <div data-divider="-"></div>
        {/if}
        {#each styles as style}
            <StyleField
                    component={component}
                    submit={v => update("wrapperStyles", v)}
                    initial={style}
            />
        {/each}
    </fieldset>
</Accordion>

<style>

    .icon {
        width: 17px;
        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .button {
        border: none;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
</style>