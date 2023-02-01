<script>
    import Checkbox from "../../../../../components/checkbox/Checkbox.svelte";
    import LOCALIZATION_EN from "../../../static/LOCALIZATION_EN";
    import ROUTES from "../../../../../../backend/static/ROUTES";
    import OptionDropdown from "../../../../../components/dropdown/OptionDropdown.svelte";
    import {onMount} from "svelte";
    import DEFAULT_GLOBAL_SETTINGS from "../../../../../../backend/static/DEFAULT_GLOBAL_SETTINGS";
    import {AngleBackends} from "../../../../../../backend/static/ANGLE_BACKENDS";

    const {ipcRenderer} = window.require("electron")


    let globalSettings = {...DEFAULT_GLOBAL_SETTINGS}

    onMount(() => {
        ipcRenderer.once(ROUTES.GET_GLOBAL_SETTINGS, (_, data) => globalSettings = data)
        ipcRenderer.send(ROUTES.GET_GLOBAL_SETTINGS)
    })


</script>

<div data-svelteform="-">

    <OptionDropdown
            noPadding={true}
            label={LOCALIZATION_EN.GRAPHICS_BACKEND}
            options={[
                {icon:                  globalSettings.graphicsBackend === AngleBackends.OPEN_GL    ? "check":undefined,label: "OpenGL", onClick: () => globalSettings.graphicsBackend= AngleBackends.OPEN_GL},
                {icon:                  globalSettings.graphicsBackend === AngleBackends.VULKAN     ? "check":undefined,label: "Vulkan (Default)", onClick: () => globalSettings.graphicsBackend= AngleBackends.VULKAN },
                {icon:                  globalSettings.graphicsBackend === AngleBackends.D3D11      ? "check":undefined,label: "D3D11 (Slow shader compilation)", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D11  },
                {disabled: true,icon:   globalSettings.graphicsBackend === AngleBackends.D3D9       ? "check":undefined,label: "D3D9", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D9   },
                {disabled: true,icon:   globalSettings.graphicsBackend === AngleBackends.D3D12      ? "check":undefined,label: "D3D12", onClick: () => globalSettings.graphicsBackend= AngleBackends.D3D12  }
            ]}
    />

    <OptionDropdown
            noPadding={true}
            label={LOCALIZATION_EN.MAX_MEMORY}
            options={[
            {icon: globalSettings.maxMemory === 1024 ? "check":undefined,label: "1024mb", onClick: () => globalSettings.maxMemory = 1024},
            {icon: globalSettings.maxMemory === 2048 ? "check":undefined,label: "2048mb", onClick: () => globalSettings.maxMemory = 2048},
            {icon: globalSettings.maxMemory === 4096 ? "check":undefined,label: "4096mb", onClick: () => globalSettings.maxMemory = 4096},
            {icon: globalSettings.maxMemory === 8192 ? "check":undefined,label: "8192mb", onClick: () => globalSettings.maxMemory = 8192},
            {icon: globalSettings.maxMemory === 16384 ? "check":undefined,label: "16384mb", onClick: () => globalSettings.maxMemory = 16384}
        ]}
    />
    <Checkbox
            checked={globalSettings.vsync}
            handleCheck={() => globalSettings.vsync =  !globalSettings.vsync}
            label={LOCALIZATION_EN.VSYNC}
    />
    <button
            data-sveltebuttondefault="-"
            style="width: 100%"
            on:click={() => ipcRenderer.send(ROUTES.UPDATE_GLOBAL_SETTINGS, globalSettings)}>
        {LOCALIZATION_EN.APPLY}
    </button>


</div>