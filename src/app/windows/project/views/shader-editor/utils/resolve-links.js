
export default function resolveLinks(links){
    return links.map(l => {
        return {
            target: l.target.id + l.target.attribute.key,
            source: l.source.id + l.source.attribute.key,
            targetKey: l.target.attribute.key,
            sourceKey: l.source.attribute.key,

            sourceType: l.source.attribute.type,
            targetType: l.target.attribute.type
        }
    })
}