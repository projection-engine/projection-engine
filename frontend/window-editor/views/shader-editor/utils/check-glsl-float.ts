export default function checkGlslFloat(v) {
	if (typeof v === "string")
		return v
	const str = v.toString()
	if (str.includes("."))
		return str
	if (v < 1)
		return "." + str
	return str + "."
}
