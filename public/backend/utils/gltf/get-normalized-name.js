export default function getNormalizedName(name, index) {
    const pName = !name || typeof name !== "string" ? "asset-" + index : name
    return pName.replaceAll(/((\s|<|>|\}|\\|\.|´|`|{|\/|\||\*|\?|'|")+)/g, "_")
}
