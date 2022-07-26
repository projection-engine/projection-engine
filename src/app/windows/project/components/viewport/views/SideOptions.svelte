<script>
    import CameraTab from "../components/CameraTab.svelte"
    import ViewportTab from "../components/3DCursorPosition.svelte"
    // import Transform from "../../component/components/Transform"
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import updateEntityTransformation from "../../../utils/update-entity-transformation";
    import COMPONENTS from "../../../libs/engine/data/COMPONENTS";

    export let selectedEntity
    export let translate
</script>

<VerticalTabs
        absolute={true}
        tabs={[
        {
            label: translate("CAMERA"),
            content: CameraTab
        },
        {
            label: translate("TITLE"),
            content: ViewportTab
        },
        /*
        {
            label: translate("ACTIVE_ENTITY"),
            disabled: !selectedEntity,
            content:  Transform,
            props: !selectedEntity ? {} : {
                selected: selectedEntity.components[COMPONENTS.TRANSFORM],
                entityID: selectedEntity.id,
                submitRotation: (axis, data) => updateEntityTransformation(axis, data, "rotation", selectedEntity),
                submitScaling: (axis, data) => updateEntityTransformation(axis, data, "scaling", selectedEntity),
                submitTranslation: (axis, data) => updateEntityTransformation(axis, data, "translation", selectedEntity),
            }
        }

         */
    ]}
>

</VerticalTabs>
