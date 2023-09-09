import TerrainUtil from "@engine-core/utils/TerrainUtil";



self.onmessage = async event => {
    const {base64, dimensions} = event.data as { base64: string, dimensions: number }
    const [data, transferable] = await TerrainUtil.buildTerrain(base64, dimensions)

    // @ts-ignore
    self.postMessage(data[0], transferable)
}
