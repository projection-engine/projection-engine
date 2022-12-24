<script lang="ts">
    import getNativeComponents from "../../utils/get-native-components";
    import Engine from "../../../../../../engine-core/Engine";
    import EntityNameController from "../../../../lib/controllers/EntityNameController";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Selector from "../../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import EntityConstructor from "../../../../lib/controllers/EntityConstructor";
    import EntityAPI from "../../../../../../engine-core/lib/utils/EntityAPI";
    import EngineStore from "../../../../stores/EngineStore";
    import HierarchyController from "../../../hierarchy/lib/HierarchyController";
    import {v4} from "uuid";
    import Input from "../../../../../shared/components/input/Input.svelte";
    import ColorPicker from "../../../../../shared/components/color-picker/ColorPicker.svelte";
    import Entity from "../../../../../../engine-core/instances/Entity";

    const nativeComponents = getNativeComponents()
    export let entity: Entity | undefined
</script>


<fieldset>
    <legend>{Localization.NAME}</legend>
    <Input
            width="100%"
            hasBorder={true}
            onBlur={(_,v) => EntityNameController.renameEntity(v, entity)}
            onEnter={v => EntityNameController.renameEntity(v, entity)}
            searchString={entity.name}
            placeholder={Localization.MY_ENTITY}
    />
</fieldset>
<fieldset>
    <legend>{Localization.COLOR}</legend>
    <ColorPicker
            label={Localization.HIERARCHY_COLOR}
            value={entity._hierarchyColor||[255,255,255]}
            submit={(_, arr) => {
                entity._hierarchyColor = arr
                EngineStore.updateStore({...EngineStore.engine, changeID: crypto.randomUUID()})
            }}
    />
</fieldset>
<fieldset>
    <legend>{Localization.QUERY_KEY}</legend>
    <Input
            width="100%"
            hasBorder={true}
            setSearchString={v => {
                    Engine.queryMap.delete(entity.queryKey)
                    Engine.queryMap.set(v, entity)
                    entity.queryKey = v
                }}
            searchString={entity.queryKey}
            placeholder={Localization.QUERY_KEY}
    />
</fieldset>

<fieldset>
    <legend style="font-weight: 500">{Localization.RELATIONS}</legend>
    <Selector
            type="parent"
            selected={entity.parent}
            handleChange={v => {
                EntityAPI.linkEntities(entity, v)
                HierarchyController.updateHierarchy()
                EngineStore.updateStore({...EngineStore.engine, changeID: v4()})
            }}
    />
</fieldset>

<fieldset>
    <legend style="font-weight: 500">{Localization.VISIBILITY}</legend>
    <Checkbox
            checked={entity.active}
            handleCheck={_ =>  {
                const inv = !entity.active
                EntityConstructor.toggleEntityVisibility(entity)
                entity.active = inv
            }}
            label={Localization.ACTIVE}
    />
</fieldset>
