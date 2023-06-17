import TEXTURE_TEMPLATE from "../../../../engine-core/static/TEXTURE_TEMPLATE"
import readTypedFile from "../../../utils/read-typed-file"
import ElectronWindowService from "../../ElectronWindowService"
import * as path from "path"
import * as fs from "fs"
import sharp from "sharp"
import FileTypes from "../../../../shared/FileTypes";

export default async function buildImage(resourceRoot, image, fileID) {
	let base64
	if (image.uri.includes("data:image"))
		base64 = image.uri
	else
		base64 = `data:image/${image.uri.split(".").pop()};base64,` + await readTypedFile(resourceRoot + path.sep + image.uri, "base64")

	const pathToPreview = path.resolve(ElectronWindowService.getInstance().pathToPreviews + path.sep + fileID + FileTypes.PREVIEW)
	const bufferPreview = await sharp(Buffer.from(base64.split(";base64,").pop(), "base64")).resize(256, 256).png().toBuffer()
	await fs.promises.writeFile(pathToPreview, "data:image/png;base64," + bufferPreview.toString("base64"))

	return {
		...TEXTURE_TEMPLATE,
		base64
	}
}
