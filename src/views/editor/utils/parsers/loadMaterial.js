import ImageProcessor from "../../../../services/workers/ImageProcessor";

export function getFetchPromise(obj, database, allData = false,) {
    return new Promise((resolve) => {

        if (obj.type === 'object' && obj.ref)
            database.getBlob(obj.ref)
                .then(res => resolve(res))
                .catch(() => resolve())
        else if (obj.type === 'string')
            resolve(ImageProcessor.colorToImage(obj.ref))
        else
            resolve()
    })
}

export function loadMaterial(file, database) {
    let parsedBlob = {}
    try {
        parsedBlob = JSON.parse(file.blob)
    } catch (e) {

    }

    if (parsedBlob.response) {
        let albedo = getFetchPromise(parsedBlob.response.albedo, database),
            metallic = getFetchPromise(parsedBlob.response.metallic, database),
            roughness = getFetchPromise(parsedBlob.response.roughness, database),
            normal = getFetchPromise(parsedBlob.response.normal, database),
            height = getFetchPromise(parsedBlob.response.height, database),
            ao = getFetchPromise(parsedBlob.response.ao, database)
        return {
            mat: file,
            promise: Promise.all([albedo, metallic, roughness, normal, height, ao])
        }
    }
    return {}
}

export default function loadPromises(mat, database, gpu, callback) {
    const obj = loadMaterial(mat, database)
    if (obj.promise !== undefined) {
        obj.promise.then(promiseRes => {
            callback({
                name: mat.name,
                id: mat.id
            }, [...promiseRes])
        })
    } else
        callback(undefined, [])
}
