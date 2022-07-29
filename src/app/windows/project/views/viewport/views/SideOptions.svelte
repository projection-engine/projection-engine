<script>
    import CameraTab from "../components/settings/CameraSettings.svelte"
    import ViewportTab from "../components/settings/3DCursorSettings.svelte"
    // import Transform from "../../component-editor/views/Transform"
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import DataStoreController from "../../../stores/DataStoreController";
    import {onDestroy} from "svelte";

    export let translate
    let settings = {}
    const unsubscribeSettings = DataStoreController.getSettings(v => settings=v)
    onDestroy(() => unsubscribeSettings())
</script>

<VerticalTabs
        absolute={true}
        globalStyle={settings.visible.metricsViewport ? "bottom: 25px" : undefined}
        tabs={[
        {
            label: translate("CAMERA"),
            component: CameraTab,
            props: {}
        },
        {
            label: translate("TITLE"),
            component: ViewportTab,
            props: {}
        },
        /*
        {
            label: translate("ACTIVE_ENTITY"),
            disabled: !selectedEntity,
            content:  Transform,
            props: !selectedEntity ? {} : {
                selected: selectedEntity.views[COMPONENTS.TRANSFORM],
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
