<script>
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import Engine from "../../../../../public/engine/Engine";
    import EntityNameController from "../../../../lib/controllers/EntityNameController";
    import Localization from "../../../../templates/LOCALIZATION_EN";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte"
    import Selector from "../../../../components/selector/Selector.svelte";
    import Checkbox from "../../../../components/checkbox/Checkbox.svelte";
    import EntityConstructor from "../../../../lib/controllers/EntityConstructor";

    const nativeComponents = getNativeComponents()
    export let entity
</script>



<fieldset>
    <legend style="font-weight: 500">{Localization.METADATA}</legend>
    <div>
        <small>{Localization.NAME}</small>
        <Input
                width="100%"
                hasBorder={true}
                onBlur={(_,v) => EntityNameController.renameEntity(v, entity)}
                onEnter={v => EntityNameController.renameEntity(v, entity)}
                searchString={entity.name}
                placeholder={Localization.MY_ENTITY}
        />
    </div>

    <div>
        <small>{Localization.QUERY_KEY}</small>
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
    </div>
</fieldset>


<fieldset>
    <legend style="font-weight: 500">{Localization.RELATIONS}</legend>
    <Selector
        type="parent"
        selected={entity.parent?.id}
        handleChange={v => {
            console.log(v)

        }}
    />
</fieldset>

<fieldset>
    <legend style="font-weight: 500">{Localization.VISIBILITY}</legend>
    <Checkbox checked={entity.active} handleCheck={_ =>  {EntityConstructor.toggleEntityVisibility(entity)}} label={Localization.ACTIVE}/>
</fieldset>
