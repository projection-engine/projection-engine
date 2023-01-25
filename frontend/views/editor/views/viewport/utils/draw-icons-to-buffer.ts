import GPU from "../../../../../../engine-core/GPU";
import StaticFBO from "../../../../../../engine-core/lib/StaticFBO";
import StaticEditorShaders from "../../../../../../engine-tools/lib/StaticEditorShaders";
import IconsSystem from "../../../../../../engine-tools/runtime/IconsSystem";
import SettingsStore from "../../../stores/SettingsStore";
import ResourceEntityMapper from "../../../../../../engine-core/resource-libs/ResourceEntityMapper";
import StaticMeshes from "../../../../../../engine-core/lib/StaticMeshes";
import StaticShaders from "../../../../../../engine-core/lib/StaticShaders";
import CameraAPI from "../../../../../../engine-core/lib/utils/CameraAPI";
import VisibilityRenderer from "../../../../../../engine-core/runtime/VisibilityRenderer";


export default function drawIconsToBuffer() {
    StaticFBO.visibility.use()
    StaticEditorShaders.iconToDepth.bind()
    GPU.context.activeTexture(GPU.context.TEXTURE0)
    GPU.context.bindTexture(GPU.context.TEXTURE_2D, IconsSystem.iconsTexture)
    IconsSystem.loop(IconsSystem.drawIcon, SettingsStore.data, StaticEditorShaders.iconToDepthUniforms)
    StaticFBO.visibility.stop()
}
