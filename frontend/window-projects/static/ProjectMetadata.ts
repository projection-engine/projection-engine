import MutableObject from "../../../engine-core/MutableObject";

type Metadata  = {
    [key: string]: string | number,
    name: string,
    creationDate: string
    lastModification: string
}

interface ProjectMetadata {
    [key: string]: string | number | MutableObject
    id: string
    meta: Metadata
    path: string
}

export default ProjectMetadata