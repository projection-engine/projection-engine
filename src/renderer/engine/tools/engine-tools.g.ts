interface EditorCameraActionMap {
    mouseRight: boolean;
    mouseLeft: boolean;
    left: boolean;
    fasterJonny: boolean;
    forward: boolean;
    backward: boolean;
    right: boolean
}

interface EditorCameraKeys {
    mouseRight: boolean;
    mouseLeft: boolean;
    left: string;
    fasterJonny: string;
    forward: string;
    backward: string;
    right: string;
    invertDirection: boolean
}

interface IEditorEntity {
    id: EngineEntity
    _colorIdentifier: [number, number, number]
    name: string
    __isSelected: boolean
}

interface RegisteredIcon  {
    entity: IEditorEntity,
    imageIndex: number,
    doNotFaceCamera: number,
    drawSphere: number,
    removeSphereCenter: number,
    scale: number
}
