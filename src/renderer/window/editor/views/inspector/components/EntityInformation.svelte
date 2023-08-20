<script lang="ts">
    import EntityNamingService from "../../../services/engine/EntityNamingService";

    import Selector from "../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte";
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService";

    import Input from "../../../../shared/components/input/Input.svelte";
    import ColorPicker from "../../../../shared/components/color-picker/ColorPicker.svelte";
    import EditorEntity from "../../../../../engine/tools/EditorEntity";
    import PropertyHeader from "../../../../shared/components/PropertyHeader.svelte";
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte";
    import TransformationForm from "./TransformationForm.svelte";
    import AddComponent from "./AddComponent.svelte";
    import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem";
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";
    import EngineStateService from "../../../services/engine/EngineStateService";

    export let entity: EditorEntity

    const ID = crypto.randomUUID()
    let entityName = entity.name
    let entityID
    $: {
        if (entityID !== entity.id) {
            // if (entityID)
            //     EntityManager.removeListener(entityID, ID)
            // EntityManager.addListener(entity.id, ID, () => {
            //     entityName = entity.name
            // })
            entityName = entity.name
            entityID = entity.id
        }
    }

   // onDestroy(() => {
    //   EntityManager.removeListener(entityID, ID)
    //})
</script>


<PropertyHeader title={entityName}/>
<AddComponent entity={entity}/>
<TransformationForm/>
<Accordion title={LocalizationEN.BASIC} startOpen={true}>
    <div data-svelteform="-">
        <Input
                width="100%"
                hasBorder={true}
                onBlur={(_,v) => EntityNamingService.renameEntity(v, entity)}
                onEnter={v => EntityNamingService.renameEntity(v, entity)}
                inputValue={entityName}
                height="23px"
                placeholder={LocalizationEN.MY_ENTITY}
        >
            <small slot="label">{LocalizationEN.NAME}</small>
        </Input>
        {#if entity.parent}
            <Selector
                    type="parent"
                    selected={entity.parent}
                    handleChange={v => {
                        if(v === entity){
                            ToastNotificationSystem.getInstance().error(LocalizationEN.COULD_NOT_LINK_ENTITIES)
                            return
                        }
                        entity.addParent(v)
                         if(entity.parent !== v){
                            ToastNotificationSystem.getInstance().error(LocalizationEN.COULD_NOT_LINK_ENTITIES)
                            return
                        }
                        EntityHierarchyService.updateHierarchy()
                    }}
            />
        {/if}
    </div>
</Accordion>
<Accordion title={LocalizationEN.VIEWPORT}>
    <div data-svelteform="-">
        <Checkbox
                checked={entity.active}
                handleCheck={_ => EngineStateService.toggleEntityVisibility(entity.id)}
                label={LocalizationEN.ACTIVE}
        />

        <ColorPicker
                label={LocalizationEN.COLOR}
                value={entity.colorIdentifier||[255,255,255]}
                submit={(_, arr) => {
                entity.colorIdentifier = arr
                EntityHierarchyService.updateHierarchy()
            }}
        />
    </div>
</Accordion>

<style>
    fieldset {
        background: none;
    }
</style>
