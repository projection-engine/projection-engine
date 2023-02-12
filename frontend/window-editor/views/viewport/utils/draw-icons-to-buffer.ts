import GPU from "../../../../../engine-core/GPU";
import StaticFBO from "../../../../../engine-core/lib/StaticFBO";
import StaticEditorShaders from "../../../../../engine-tools/lib/StaticEditorShaders";
import IconsSystem from "../../../../../engine-tools/runtime/IconsSystem";
import SettingsStore from "../../../../shared/stores/SettingsStore";

export default function drawIconsToBuffer() {
    GPU.context.disable(GPU.context.DEPTH_TEST)
    StaticFBO.visibility.use()
    StaticEditorShaders.iconToDepth.bind()
    GPU.context.activeTexture(GPU.context.TEXTURE0)
    GPU.context.bindTexture(GPU.context.TEXTURE_2D, IconsSystem.iconsTexture)
    IconsSystem.loop(IconsSystem.drawIcon, SettingsStore.data, StaticEditorShaders.iconToDepthUniforms)
    StaticFBO.visibility.stopMapping()
    GPU.context.enable(GPU.context.DEPTH_TEST)
}
