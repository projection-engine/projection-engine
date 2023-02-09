<script lang="ts">
    import Engine from "../../../../../../engine-core/Engine";
    import EntityNameController from "../../../../lib/controllers/EntityNameController";
    import LOCALIZATION_EN from "../../../../../../static/objects/LOCALIZATION_EN";
    import Selector from "../../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../../shared/components/checkbox/Checkbox.svelte";
    import EntityConstructor from "../../../../lib/controllers/EntityConstructor";
    import HierarchyController from "../../../../lib/HierarchyController";

    import Input from "../../../../../shared/components/input/Input.svelte";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Entity from "../../../../../../engine-core/instances/Entity";
    import PropertyHeader from "../../../../../shared/components/PropertyHeader.svelte";
    import Accordion from "../../../../../shared/components/accordion/Accordion.svelte";
    import TransformationForm from "./TransformationForm.svelte";

    export let entity: Entity | undefined
</script>


<PropertyHeader title={LOCALIZATION_EN.ENTITY_PROPERTIES}/>
{#if !entity.isCollection}
    <TransformationForm/>
{/if}
<Accordion title={LOCALIZATION_EN.NAME_AND_KEY} startOpen={entity.isCollection}>
    <fieldset>
        <legend>{LOCALIZATION_EN.NAME}</legend>
        <Input
                width="100%"
                hasBorder={true}
                onBlur={(_,v) => EntityNameController.renameEntity(v, entity)}
                onEnter={v => EntityNameController.renameEntity(v, entity)}
                inputValue={entity.name}
                placeholder={LOCALIZATION_EN.MY_ENTITY}
        />
    </fieldset>
    <fieldset>
        <legend>{LOCALIZATION_EN.QUERY_KEY}</legend>
        <Input
                width="100%"
                hasBorder={true}
                onChange={v => {
                    Engine.queryMap.delete(entity.queryKey)
                    Engine.queryMap.set(v, entity)
                    entity.queryKey = v
                }}
                inputValue={entity.queryKey}
                placeholder={LOCALIZATION_EN.QUERY_KEY}
        />
    </fieldset>
</Accordion>
<Accordion title={LOCALIZATION_EN.VIEWPORT}>
    <Checkbox
            checked={entity.active}
            handleCheck={_ =>  {
            const inv = !entity.active
            EntityConstructor.toggleEntityVisibility(entity)
            entity.active = inv
        }}
            label={LOCALIZATION_EN.ACTIVE}
    />

    <ColorPicker
            label={LOCALIZATION_EN.COLOR}
            value={entity.colorIdentifier||[255,255,255]}
            submit={(_, arr) => {
                entity.colorIdentifier = arr
                HierarchyController.updateHierarchy()
            }}
    />
</Accordion>

<Accordion title={LOCALIZATION_EN.RELATIONS}>
    <Selector
            type="parent"
            selected={entity.parent}
            handleChange={v => {
                entity.addParent(v)
                HierarchyController.updateHierarchy()
            }}
    />
</Accordion>

<style>
    fieldset {
        background: none;
    }
</style>