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
    import {EntityAPI, Engine} from "../../../../../../public/engine/production";
    import UIAPI from "../../../../../../public/engine/production/apis/UIAPI";

    export let entity
    export let submit

    $: component = entity.components.get(COMPONENTS.UI)
    $: styles = component.wrapperStyles
    $: hasStyles = styles.length > 0

    const translate = key => Localization.PROJECT.INSPECTOR[key]

    function update(key, value) {
        submit(key, value)
        UIAPI.updateUIEntity(entity)
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
        <button class="button" on:click={() => removeComponent(entity, undefined, COMPONENTS.UI)}>
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
                submit={(key, value) => {
                  if(!key || !value)
                      return
                    update("wrapperStyles", [...styles, [key, value]])
                }}
        />
        {#if hasStyles}
            <div data-divider="-"></div>
        {/if}
        {#each styles as style, i}
            <StyleField
                    component={component}
                    submit={(key, value) => {
                        const existingKey = styles.findIndex(s => s[0] === key)
                        const newData = [...styles]
                        if(key && value){
                            if(existingKey > -1 && existingKey !== i){
                                newData[existingKey] = [key, value]
                                newData.splice(i, 1);
                            }
                            else
                                newData[i] = [key, value]
                        }
                        else
                            newData.splice(i, 1);

                        update("wrapperStyles", newData)
                    }}
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