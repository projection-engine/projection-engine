export default function bindContextTarget(targetID, triggers, onFocus) {
    return {

        rebind: (options) => {
            window.contextMenu.targets[targetID] = {
                options,
                triggers,
                onFocus
            }
        },
        onDestroy() {
            delete window.contextMenu.targets[targetID]
        }
    }
}