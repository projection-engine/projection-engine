<script>
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import Engine from "../../../../../public/engine/Engine";
    import EntityNameController from "../../../../lib/controllers/EntityNameController";
    import Localization from "../../../../templates/LOCALIZATION_EN";

    const nativeComponents = getNativeComponents()
    export let entity
</script>



<fieldset>
    <legend style="font-weight: 500">{Localization.METADATA}</legend>
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
</fieldset>

