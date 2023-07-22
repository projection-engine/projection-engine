import {getFontEmbedCSS, toPng} from "html-to-image"
import ElectronResources from "../renderer/window/shared/lib/ElectronResources"

const W = 7 * 512
const H = 512
const STYLE = `
    font-family: 'Material Icons Round' !important;
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    font-size: ${H}px;
    color: white;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
`
export default async function doWork() {
	try {
		const div = document.createElement("div")
		div.style.display = "flex"
		div.innerHTML = `
            <span style="${STYLE}">category</span>
            <span style="${STYLE}">light_mode</span>
            <span style="${STYLE}">lightbulb</span>
            <span style="${STYLE}">lens_blur</span>
            <span style="${STYLE}">highlight</span>
            <span style="${STYLE}">wb_twilight</span>
            <span style="${STYLE}">layers</span>
        `


		const fontEmbedCss = await getFontEmbedCSS(document.body)
		console.log(fontEmbedCss)
		const icons = await toPng(div, {width: W, height: H, fontEmbedCSS: fontEmbedCss})
		console.log(__dirname.replace("build", "static/image.base64"))
		await ElectronResources.fs.promises.writeFile(__dirname.replace("build", "static/image.base64"), icons)
	} catch (err) {
		console.error(err)
	}
}