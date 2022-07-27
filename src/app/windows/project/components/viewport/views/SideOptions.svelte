<script>
    import CameraTab from "../components/settings/CameraSettings.svelte"
    import ViewportTab from "../components/settings/3DCursorSettings.svelte"
    // import Transform from "../../component/components/Transform"
    import VerticalTabs from "../../../../../components/vertical-tab/VerticalTabs.svelte";
    import {settingsStore} from "../../../stores/settings-store";
    import {get} from "svelte/store";
    import StoreController from "../../../stores/StoreController";
    import {onDestroy} from "svelte";

    export let selectedEntity
    export let translate
    let settings = {}
    const unsubscribeSettings = StoreController.getSettings(v => settings=v)
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
