self.onmessage = ({data: {entities, COMPONENTS, materials, meshes}}) => {
    const meshesFiltered = {...meshes}, materialsFiltered = {...materials}
    console.log(entities)
    const values = entities.values()

    for(let i = 0; i < values.length; i++){
        const meshComp = values[i].components[COMPONENTS.MESH]
        const matComp = values[i].components[COMPONENTS.MATERIAL]

        if(meshComp !== undefined)
            delete meshesFiltered[meshComp.meshID]

        if(matComp !== undefined)
            delete materialsFiltered[matComp.materialID]
    }
    self.postMessage({meshesFiltered, materialsFiltered})
}