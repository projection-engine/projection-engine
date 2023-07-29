<script lang="ts">
    import Engine from "../../../../../engine/core/Engine";
    import EntityNamingService from "../../../services/engine/EntityNamingService";

    import Selector from "../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../shared/components/checkbox/Checkbox.svelte";
    import EntityFactoryService from "../../../services/engine/EntityFactoryService";
    import EntityHierarchyService from "../../../services/engine/EntityHierarchyService";

    import Input from "../../../../shared/components/input/Input.svelte";
    import ColorPicker from "../../../../shared/components/color-picker/ColorPicker.svelte";
    import Entity from "../../../../../engine/core/instances/Entity";
    import PropertyHeader from "../../../../shared/components/PropertyHeader.svelte";
    import Accordion from "../../../../shared/components/accordion/Accordion.svelte";
    import TransformationForm from "./TransformationForm.svelte";
    import EntityUpdateService from "../../../services/engine/EntityUpdateService";
    import {onDestroy} from "svelte";
    import AddComponent from "./AddComponent.svelte";
    import ToastNotificationSystem from "../../../../shared/components/alert/ToastNotificationSystem";
    import LocalizationEN from "../../../../../../shared/enums/LocalizationEN";

    export let entity: Entity

    const ID = crypto.randomUUID()
    let entityName = entity.name
    let entityID
    $: {
        if (entityID !== entity.id) {
            if (entityID)
                EntityUpdateService.removeListener(entityID, ID)
            EntityUpdateService.addListener(entity.id, ID, () => {
                entityName = entity.name
            })
            entityName = entity.name
            entityID = entity.id
        }
    }

    onDestroy(() => {
        EntityUpdateService.removeListener(entityID, ID)
    })
</script>


<PropertyHeader title={entityName}/>
<AddComponent entity={entity}/>
{#if !entity.isCollection}
    <TransformationForm/>
{/if}
<Accordion title={LocalizationEN.BASIC} startOpen={entity.isCollection}>
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

        <Input
                width="100%"
                hasBorder={true}
                onChange={v => {
                    Engine.queryMap.delete(entity.queryKey)
                    Engine.queryMap.set(v, entity)
                    entity.queryKey = v
                }}
                height="23px"
                inputValue={entity.queryKey}
                placeholder={LocalizationEN.QUERY_KEY}
        >
            <small slot="label">{LocalizationEN.QUERY_KEY}</small>
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
                handleCheck={_ =>  {
                const inv = !entity.active
                EntityFactoryService.toggleEntityVisibility(entity.id)
                entity.active = inv
            }}
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
