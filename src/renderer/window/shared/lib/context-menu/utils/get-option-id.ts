export default function getOptionID(label:string, parent:string|null) {
	return label.toUpperCase().trim() + (parent ? parent : "-")
}