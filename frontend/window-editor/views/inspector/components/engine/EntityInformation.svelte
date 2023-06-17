<script lang="ts">
    import Engine from "../../../../../../engine-core/Engine";
    import NameController from "../../../../lib/controllers/NameController";

    import Selector from "../../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import EntityFactory from "../../../../lib/controllers/EntityFactory";
    import HierarchyController from "../../../../lib/controllers/HierarchyController";

    import Input from "../../../../../shared/components/input/Input.svelte";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Entity from "../../../../../../engine-core/instances/Entity";
    import PropertyHeader from "../../../../../shared/components/PropertyHeader.svelte";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import TransformationForm from "./TransformationForm.svelte";
    import EntityUpdateController from "../../../../lib/controllers/EntityUpdateController";
    import {onDestroy} from "svelte";
    import AddComponent from "./AddComponent.svelte";
    import AlertController from "../../../../../shared/components/alert/AlertController";
    import LocalizationEN from "../../../../../../contants/LocalizationEN";

    export let entity: Entity

    const ID = crypto.randomUUID()
    let entityName = entity.name
    let entityID
    $: {
        if (entityID !== entity.id) {
            if (entityID)
                EntityUpdateController.removeListener(entityID, ID)
            EntityUpdateController.addListener(entity.id, ID, () => {
                entityName = entity.name
            })
            entityName = entity.name
            entityID = entity.id
        }
    }

    onDestroy(() => {
        EntityUpdateController.removeListener(entityID, ID)
    })
</script>


<div data-svelteinline="-" style="overflow: hidden; min-height: 22px">
    <AddComponent entity={entity}>
        <PropertyHeader title={entityName}/>
    </AddComponent>
</div>

{#if !entity.isCollection}
    <TransformationForm/>
{/if}

<Accordion title={LocalizationEN.BASIC} startOpen={entity.isCollection}>
    <div data-svelteform="-">
        <Input
                width="100%"
                hasBorder={true}
                onBlur={(_,v) => NameController.renameEntity(v, entity)}
                onEnter={v => NameController.renameEntity(v, entity)}
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
                            AlertController.error(LocalizationEN.COULD_NOT_LINK_ENTITIES)
                            return
                        }
                        entity.addParent(v)
                         if(entity.parent !== v){
                            AlertController.error(LocalizationEN.COULD_NOT_LINK_ENTITIES)
                            return
                        }
                        HierarchyController.updateHierarchy()
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
                EntityFactory.toggleEntityVisibility(entity.id)
                entity.active = inv
            }}
                label={LocalizationEN.ACTIVE}
        />

        <ColorPicker
                label={LocalizationEN.COLOR}
                value={entity.colorIdentifier||[255,255,255]}
                submit={(_, arr) => {
                entity.colorIdentifier = arr
                HierarchyController.updateHierarchy()
            }}
        />
    </div>
</Accordion>


<style>
    fieldset {
        background: none;
    }
</style>