<script>
    import Checkbox from "../../shared/components/checkbox/Checkbox.svelte"
    import OptionDropdown from "../../shared/components/dropdown/OptionDropdown.svelte"
    import ElectronResources from "../../shared/lib/ElectronResources"
    import {onMount} from "svelte"
    import DEFAULT_GLOBAL_SETTINGS from "../../../../main/static/DEFAULT_GLOBAL_SETTINGS"
    import PropertyHeader from "../../shared/components/PropertyHeader.svelte"
    import LocalizationEN from "../../../../shared/enums/LocalizationEN"
    import IPCRoutes from "../../../../shared/enums/IPCRoutes"
    import AngleBackends from "../../../../shared/enums/AngleBackends"


    let globalSettings = {...DEFAULT_GLOBAL_SETTINGS}

    onMount(() => {
    	ElectronResources.ipcRenderer.once(IPCRoutes.GET_GLOBAL_SETTINGS, (_, data) => globalSettings = data)
    	ElectronResources.ipcRenderer.send(IPCRoutes.GET_GLOBAL_SETTINGS)
    })
</script>

<PropertyHeader title={LocalizationEN.GLOBAL}/>
<fieldset>
    <OptionDropdown
            noPadding={true}
            buttonStyles="border: none;"
            label={LocalizationEN.GRAPHICS_BACKEND}
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
            buttonStyles="border: none;"
            label={LocalizationEN.MAX_MEMORY}
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
            label={LocalizationEN.VSYNC}
    />
    <button
            data-sveltebuttondefault="-"
            style="width: 100%"
            on:click={() => ElectronResources.ipcRenderer.send(IPCRoutes.UPDATE_GLOBAL_SETTINGS, globalSettings)}>
        {LocalizationEN.APPLY}
    </button>
</fieldset>
