export default function bindShortcuts({
                                          focusTargetLabel,
                                          focusTargetIcon,
                                          actions
                                      }) {
    let initialized = false

    function handler(e) {
        switch (e.type) {
            case "mousedown":
                e.currentTarget.isClicked = true
                break;
            case "mouseenter":
                if (e.currentTarget.isClicked)
                    break;
                e.currentTarget.focus()
                window.shortcuts.window = {
                    label: focusTargetLabel,
                    icon: focusTargetIcon
                }
                window.shortcuts.all = actions
                window.shortcuts.updateShortcuts()
                window.shortcuts.active = {}

                break
            case "mouseup":
                e.currentTarget.isClicked = false
                break
        }
    }

    return {
        onMount: (target, disabled) => {
            if (!target || disabled)
                return

            if (document.activeElement === target) {
                window.shortcuts.all = actions
                window.shortcuts.updateShortcuts()
            }
            target.tabIndex = 0
            if (!initialized) {
                initialized = true
                target.focus()
            }
            target.addEventListener("mousedown", handler)
            target.addEventListener("mouseup", handler)
            target.addEventListener("mouseenter", handler)
        },
        onDestroy: (target) => {
            if (!target)
                return
            target.removeEventListener("mousedown", handler)
            target.removeEventListener("mouseup", handler)
            target.removeEventListener("mouseenter", handler)
        },
        rebind(target, disabled) {
            this.onDestroy(target)
            this.onMount(target, disabled)
        }
    }
}

