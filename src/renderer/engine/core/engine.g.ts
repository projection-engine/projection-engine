interface EntityListenerOptions{
    once?: boolean,
    targetEntityId?: string,
    targetComponent?: string
}

interface EntityListenerEvent<T, R>{
    target?: T,
    all?: T[],
    type: EntityEventTypes,
    targetComponents?: R[]
}

interface EntityManagerListener<T, R>{
    callback: GenericVoidFunctionWithP<EntityListenerEvent<T, R>>,
    options?: EntityListenerOptions
}

type EntityEventTypes = "hard-change" | "component-add" | "component-remove" | "create" | "delete" | "update"
