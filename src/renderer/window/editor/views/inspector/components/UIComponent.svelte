<script lang="ts">
    import StyleField from "./UIStyles.svelte"
    import Selector from "../../../components/selector/Selector.svelte"
    import EditorFSUtil from "../../../util/EditorFSUtil"
    import FileSystemUtil from "../../../../shared/FileSystemUtil"
    import UIManager from "@engine-core/managers/UIManager"
    import Engine from "../../../../../engine/core/Engine"
    import Input from "../../../../shared/components/input/Input.svelte"
    import Icon from "../../../../shared/components/icon/Icon.svelte"
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN"
    import InspectorUtil from "../../../util/InspectorUtil"
    import EditorEntity from "../../../../../engine/tools/EditorEntity";
    import {Components} from "@engine-core/engine.enum";
    import UIComponent from "@engine-core/lib/components/UIComponent";

    export let entity: EditorEntity
    export let submit:  GenericVoidFunctionWith3P<string, any, boolean>

    let component: UIComponent
    $: component = entity.getComponent<UIComponent>(Components.UI)
    $: wrapperStyles = component.wrapperStyles
    $: hasStyles = wrapperStyles.length > 0


    function update(key, value) {
    	submit(key, value, false)
    	UIManager.updateUIEntity(entity.id)
    }

    async function loadUILayout(reg) {
    	const ref = EditorFSUtil.getRegistryEntry(reg.registryID)
    	if (!ref)
    		return
    	const file = await FileSystemUtil.readFile(FileSystemUtil.ASSETS_PATH + FileSystemUtil.sep + ref.path)
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
                on:click={() => InspectorUtil.removeComponent(entity, component.getComponentKey())}>
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
                    update("wrapperStyles", [...wrapperStyles, [key, value]])
                }}
        />
        {#if hasStyles}
            <div data-sveltedivider="-"></div>
        {/if}
        {#each wrapperStyles as style, i}
            <StyleField
                    component={component}
                    submit={(key, value) => {
                        const existingKey = wrapperStyles.findIndex(s => s[0] === key)
                        const newData = [...wrapperStyles]
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
