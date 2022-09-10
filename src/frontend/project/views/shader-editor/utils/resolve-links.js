
export default function resolveLinks(links){
    let res = []
    for(let i =0; i < links.length; i++){
        const l = links[i]
        if(l?.target?.attribute?.key && l?.source?.attribute?.key)
            res.push({
                target: l.target.id + l.target.attribute.key,
                source: l.source.id + l.source.attribute.key,
                targetKey: l.target.attribute.key,
                sourceKey: l.source.attribute.key,
                sourceType: l.source.attribute.type,
                targetType: l.target.attribute.type
            })
    }

    return res
}