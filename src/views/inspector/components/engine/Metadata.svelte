<script>
    import Input from "shared-resources/frontend/components/input/Input.svelte";
    import Icon from "shared-resources/frontend/components/icon/Icon.svelte";
    import ToolTip from "shared-resources/frontend/components/tooltip/ToolTip.svelte";
    import Dropdown from "shared-resources/frontend/components/dropdown/Dropdown.svelte";
    import FilesStore from "../../../../stores/FilesStore";
    import {onDestroy} from "svelte";
    import getNativeComponents from "../../utils/get-native-components";
    import componentConstructor from "../../../../utils/component-constructor";
    import Accordion from "../../../../components/accordion/Accordion.svelte";
    import Engine from "../../../../../public/engine/Engine";
    import EntityNameController from "../../../../libs/EntityNameController";
    import SelectionStore from "../../../../stores/SelectionStore";
    import Localization from "../../../../templates/Localization";
    const nativeComponents = getNativeComponents()
    export let entity
    const translate = key => Localization.PROJECT.INSPECTOR[key]
</script>



<fieldset>
    <legend style="font-weight: 500">{translate("METADATA")}</legend>
    <fieldset>
        <legend>{translate("NAME")}</legend>
        <Input
                width="100%"
                hasBorder={true}
                onBlur={(_,v) => EntityNameController.renameEntity(v, entity)}
                onEnter={v => EntityNameController.renameEntity(v, entity)}
                searchString={entity.name}
                placeholder={translate("MY_ENTITY")}
        />
    </fieldset>

    <fieldset>
        <legend>{translate("QUERY_KEY")}</legend>
        <Input
                width="100%"
                hasBorder={true}
                setSearchString={v => {
                    Engine.queryMap.delete(entity.queryKey)
                    Engine.queryMap.set(v, entity)
                    entity.queryKey = v
                }}
                searchString={entity.queryKey}
                placeholder={translate("QUERY_KEY")}
        />
    </fieldset>
</fieldset>

