<script>
    import StyleField from "./UIStyles.svelte"
    import COMPONENTS from "../../../../../../engine-core/static/COMPONENTS.ts"

    import Selector from "../../../../components/selector/Selector.svelte"
    import removeComponent from "../../utils/remove-component"
    import FSRegistryService from "../../../../services/file-system/FSRegistryService"
    import FSFilesService from "../../../../services/file-system/FSFilesService"
    import UIAPI from "../../../../../../engine-core/lib/rendering/UIAPI"
    import Engine from "../../../../../../engine-core/Engine"
    import Input from "../../../../../shared/components/input/Input.svelte"
    import Icon from "../../../../../shared/components/icon/Icon.svelte"
    import FileSystemService from "../../../../../shared/lib/FileSystemService"
    import LocalizationEN from "../../../../../../shared/LocalizationEN"

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
    	const ref = FSRegistryService.getRegistryEntry(reg.registryID)
    	if (!ref)
    		return
    	const file = await FSFilesService.readFile(FileSystemService.getInstance().ASSETS_PATH + FileSystemService.getInstance().sep + ref.path)
    	if (!file)
    		return
    	Engine.UILayouts.set(reg.registryID, file)
    	update("uiLayoutID", reg.registryID)
    }

</script>

<fieldset>
    <legend class="legend">
        {LocalizationEN.UI_COMPONENT}
        <button data-sveltebuttondefault="-" class="button"
                on:click={() => removeComponent(entity, undefined, COMPONENTS.UI)}>
            <Icon>delete_forever</Icon>
        </button>
    </legend>
    <fieldset>
        <legend>{LocalizationEN.IMPORT_LAYOUT}</legend>
        <Selector
                selected={component.uiLayoutID}
                type="ui"
                handleChange={loadUILayout}
        />
    </fieldset>
    <fieldset>
        <legend>{LocalizationEN.ANCHOR_ELEMENT_ID}</legend>
        <Input
                inputValue={component.anchorElement}
                placeholder={LocalizationEN.ELEMENT_ID}
                onBlur={(_, v) => update("anchorElement", v)}
                onEnter={v => update("anchorElement", v)}
                onChange={v =>  update("anchorElement", v)}
        />
    </fieldset>

    <fieldset>
        <legend>{LocalizationEN.WRAPPER_STYLES}</legend>
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
            <div data-sveltedivider="-"></div>
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
                                newData.splice(i, 1)
                            }
                            else
                                newData[i] = [key, value]
                        }
                        else
                            newData.splice(i, 1)

                        update("wrapperStyles", newData)
                    }}
                    initial={style}
            />
        {/each}
    </fieldset>
</fieldset>

<style>
    .legend {
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