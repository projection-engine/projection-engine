export default function bindShortcuts({
                                          focusTargetLabel,
                                          focusTargetIcon,
                                          actions
                                      }) {
    let initialized = false
    function handler(e) {
        e.currentTarget.focus()
        window.shortcuts.window = {
            label: focusTargetLabel,
            icon: focusTargetIcon
        }
        window.shortcuts.all = actions
        window.shortcuts.updateShortcuts()
        window.shortcuts.active = {}
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
            target.addEventListener("mouseenter", handler)
        },
        onDestroy: (target) => {
            if (!target)
                return
            target.removeEventListener("mouseenter", handler)
        },
        rebind(target, disabled) {
            this.onDestroy(target)
            this.onMount(target, disabled)
        }
    }
}

