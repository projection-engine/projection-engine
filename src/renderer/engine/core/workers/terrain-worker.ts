import TerrainUtil from "@engine-core/utils/TerrainUtil";


self.onmessage = async event => {
    const {base64} = event.data as { base64: string }
    const [data, transferable] = await TerrainUtil.buildTerrain(base64)
    // @ts-ignore
    self.postMessage(data, transferable)
}
