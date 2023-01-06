<script>
    import StyleField from "./UIStyles.svelte";
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS.js"
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import Selector from "../../../../../components/selector/Selector.svelte";
    import removeComponent from "../../utils/remove-component";
    import RegistryAPI from "../../../../lib/fs/RegistryAPI";
    import FilesAPI from "../../../../lib/fs/FilesAPI";
    import UIAPI from "../../../../../../engine-core/lib/rendering/UIAPI";
    import Engine from "../../../../../../engine-core/Engine";
    import Input from "../../../../../components/input/Input.svelte";
    import Icon from "../../../../../components/icon/Icon.svelte";
    import FS from "../../../../../lib/FS/FS";

    export let entity
    export let submit

    $: component = entity.uiComponent
    $: styles = component.wrapperStyles
    $: hasStyles = styles.length > 0


    function update(key, value) {
        submit(key, value)
        UIAPI.updateUIEntity(entity)
    }

    async function loadUILayout(reg) {
        const ref = RegistryAPI.getRegistryEntry(reg.registryID)
        if (!ref)
            return
        const file = await FilesAPI.readFile(FS.ASSETS_PATH  + FS.sep + ref.path)
        if (!file)
            return
        Engine.UILayouts.set(reg.registryID, file)
        update("uiLayoutID", reg.registryID)
    }

</script>

<fieldset>
    <legend class="legend">
        {LOCALIZATION_EN.UI_COMPONENT}
        <button class="button" on:click={() => removeComponent(entity, undefined, COMPONENTS.UI)}>
            <Icon>delete_forever</Icon>
        </button>
    </legend>
    <fieldset>
        <legend>{LOCALIZATION_EN.IMPORT_LAYOUT}</legend>
        <Selector
                selected={component.uiLayoutID}
                type="ui"
                handleChange={loadUILayout}
        />
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.ANCHOR_ELEMENT_ID}</legend>
        <Input
                inputValue={component.anchorElement}
                placeholder={LOCALIZATION_EN.ELEMENT_ID}
                onBlur={(_, v) => update("anchorElement", v)}
                onEnter={v => update("anchorElement", v)}
                onChange={v =>  update("anchorElement", v)}
        />
    </fieldset>

    <fieldset>
        <legend>{LOCALIZATION_EN.WRAPPER_STYLES}</legend>
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
</fieldset>

<style>
    .legend{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-weight: 500;
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