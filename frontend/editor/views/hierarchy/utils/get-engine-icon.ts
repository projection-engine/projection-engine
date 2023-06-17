import LocalizationEN from "../../../../../shared/LocalizationEN";


export default function getEngineIcon(nodeRef): { icon: string, label: string }[] {
	const icons = []
	if (nodeRef) {

		if (nodeRef.atmosphereComponent)
			icons.push({
				icon: "wb_twilight",
				label: LocalizationEN.ATMOSPHERE
			})
		if (nodeRef.lightProbeComponent)
			icons.push({
				icon: "lens_blur",
				label: LocalizationEN.LIGHT_PROBE
			})
		if (nodeRef.meshComponent)

			icons.push({
				icon: "category",
				label: LocalizationEN.MESH
			})
		if (nodeRef.cameraComponent)

			icons.push({
				icon: "videocam",
				label: LocalizationEN.CAMERA
			})
		if (nodeRef.spriteComponent)
			icons.push({
				icon: "image",
				label: LocalizationEN.SPRITE
			})
		if (nodeRef.uiComponent)
			icons.push({
				icon: "widgets",
				label: LocalizationEN.UI_LAYOUT
			})

		if (nodeRef.lightComponent)
			icons.push({
				icon: "light_mode",
				label: LocalizationEN.LIGHT
			})
	}
	return icons
}