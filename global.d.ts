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

type GenericVoidFunctionWith3P<T, R, V> = (param1: T, param2: R, param3: V) => void
type GenericVoidFunctionWith2P<T, R> = (param1: T, param2: R) => void
type GenericVoidFunctionWithP<T> = (param1: T) => void
type GenericVoidFunction = () => void
type GenericNonVoidFunctionWithP<T, R> = (state: T) => R
type GenericNonVoidFunction<R> = () => R
