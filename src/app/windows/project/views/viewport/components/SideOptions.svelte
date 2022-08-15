<script>
    import CameraTab from "./settings/CameraSettings.svelte"
    import ViewportTab from "./settings/3DCursorSettings.svelte"
    // import Transform from "../../inspector/views/Transform"
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import RendererStoreController from "../../../stores/RendererStoreController";
    import {onDestroy} from "svelte";

    export let translate
    let settings = {}
    const unsubscribeSettings = RendererStoreController.getSettings(v => settings=v)
    onDestroy(() => unsubscribeSettings())
</script>

<VerticalTabs
        absolute={true}
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
                submitRotation: (axis, libs) => updateEntityTransformation(axis, libs, "rotation", selectedEntity),
                submitScaling: (axis, libs) => updateEntityTransformation(axis, libs, "scaling", selectedEntity),
                submitTranslation: (axis, libs) => updateEntityTransformation(axis, libs, "translation", selectedEntity),
            }
        }

         */
    ]}
>

</VerticalTabs>
