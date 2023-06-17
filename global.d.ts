/// <reference types="svelte" />
declare module "*.glsl" {
    const value: string // Add better type definitions here if desired.
    export default value
}
declare module "*.frag" {
    const value: string // Add better type definitions here if desired.
    export default value
}
declare module "*.vert" {
    const value: string // Add better type definitions here if desired.
    export default value
}
declare module "*.svg" {
    const value: string // Add better type definitions here if desired.
    export default value
}

interface MutableObject {
    [key: string | number | symbol]: any
}

interface RegistryFile {
    [key: string]: any

    path: string
    id: string
}
