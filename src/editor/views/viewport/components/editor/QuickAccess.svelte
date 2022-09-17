<script>
    import CameraTab from "./settings/CameraSettings.svelte"
    import ViewportTab from "./settings/3DCursorSettings.svelte"
    import VerticalTabs from "../../../../../shared/components/vertical-tab/VerticalTabs.svelte";
    import {onDestroy} from "svelte";
    import SettingsStore from "../../../../stores/SettingsStore";

    export let translate
    let settings = {}
    const unsubscribeSettings = SettingsStore.getStore(v => settings=v)
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
        }
    ]}
>
</VerticalTabs>
