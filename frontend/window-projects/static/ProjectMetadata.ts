
type Metadata  = {
    [key: string]: string | number,
    name: string,
    creationDate: string
    lastModification: string
}

interface ProjectMetadata {
    [key: string]: any
    id: string
    meta: Metadata
    path: string
}

export default ProjectMetadata