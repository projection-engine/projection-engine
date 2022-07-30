export default function bindContextTarget(targetID, triggers) {
    return {

        rebind: (options) => {
            window.contextMenu.targets[targetID] = {
                options,
                triggers
            }
        },
        onDestroy() {
            delete window.contextMenu.targets[targetID]
        }
    }
}