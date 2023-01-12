<script lang="ts">
    import Engine from "../../../../../../../engine-core/Engine";
    import EntityNameController from "../../../../lib/controllers/EntityNameController";
    import LOCALIZATION_EN from "../../../../static/LOCALIZATION_EN";
    import Selector from "../../../../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../../../components/checkbox/Checkbox.svelte";
    import EntityConstructor from "../../../../lib/controllers/EntityConstructor";
    import EntityAPI from "../../../../../../../engine-core/lib/utils/EntityAPI";
    import HierarchyController from "../../../hierarchy/lib/HierarchyController";

    import Input from "../../../../../../components/input/Input.svelte";
    import ColorPicker from "../../../../../../components/color-picker/ColorPicker.svelte";
    import Entity from "../../../../../../../engine-core/instances/Entity";

    export let entity: Entity | undefined
</script>


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
    <legend>{LOCALIZATION_EN.COLOR}</legend>
    <ColorPicker
            label={LOCALIZATION_EN.HIERARCHY_COLOR}
            value={entity._hierarchyColor||[255,255,255]}
            submit={(_, arr) => {
                entity._hierarchyColor = arr
                HierarchyController.updateHierarchy()
            }}
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

<fieldset>
    <legend style="font-weight: 500">{LOCALIZATION_EN.RELATIONS}</legend>
    <Selector
            type="parent"
            selected={entity.parent}
            handleChange={v => {
                EntityAPI.linkEntities(entity, v)
                HierarchyController.updateHierarchy()
            }}
    />
</fieldset>

<fieldset>
    <legend style="font-weight: 500">{LOCALIZATION_EN.VISIBILITY}</legend>
    <Checkbox
            checked={entity.active}
            handleCheck={_ =>  {
                const inv = !entity.active
                EntityConstructor.toggleEntityVisibility(entity)
                entity.active = inv
            }}
            label={LOCALIZATION_EN.ACTIVE}
    />
</fieldset>
