export default class ContextMenuController {
    static data = {targets: {}, focused: undefined}

    static mount(metadata, options, target, triggers=[], onFocus) {
        ContextMenuController.data.targets[target] = {
            options,
            triggers,
            onFocus,
            metadata
        }
    }

    static destroy(target) {
        delete ContextMenuController.data.targets[target]
    }
}