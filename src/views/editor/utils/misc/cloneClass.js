export default function cloneClass(orig){
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)
}