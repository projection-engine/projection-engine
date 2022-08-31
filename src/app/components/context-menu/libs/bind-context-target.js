import HotKeys from "../../../windows/project/components/metrics/libs/HotKeys";

export default function bindContextTarget(targetID, triggers, onFocus) {
    return {

        rebind: (options) => {
            HotKeys.data.targets[targetID] = {
                options,
                triggers,
                onFocus
            }
        },
        onDestroy() {
            delete HotKeys.data.targets[targetID]
        }
    }
}