self.onmessage = ({data: {entities, COMPONENTS, materials, meshes}}) => {
    const meshesFiltered = {...meshes}, materialsFiltered = {...materials}

    for(let i = 0; i < entities.length; i++){
        const meshComp = entities[i].components[COMPONENTS.MESH]
        const matComp = entities[i].components[COMPONENTS.MATERIAL]

        if(meshComp !== undefined)
            delete meshesFiltered[meshComp.meshID]

        if(matComp !== undefined)
            delete materialsFiltered[matComp.materialID]
    }
    self.postMessage({meshesFiltered, materialsFiltered})
}