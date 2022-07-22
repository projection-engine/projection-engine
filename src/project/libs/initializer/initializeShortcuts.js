import * as DOM from "react-dom/client"
import SHORTCUTS_ID from "../../static/misc/SHORTCUTS_ID"
import {Icon} from "@f-ui/core"
import LABELED_KEYS from "../../static/misc/LABELED_KEYS"
import React from "react"

export default function initializeShortcuts() {
    const shortcutsRoot = DOM.createRoot(document.getElementById(SHORTCUTS_ID))
    window.shortcuts = {all: [], active: {}}
    window.shortcuts.updateShortcuts = () => {
        const clickedLen = Object.keys(window.shortcuts.active).length
        const actions = window.shortcuts.all.filter(a => (a.require.length === 1 && clickedLen === 0) || a.require.find(e => window.shortcuts.active[e] === true) !== undefined)
        shortcutsRoot.render(
            <>
                {window.shortcuts.window ?
                    <div data-item={"-"} data-action={"-"}>
                        <Icon styles={{fontSize: "1rem"}}>{window.shortcuts.window.icon}</Icon>
                        <label>{window.shortcuts.window.label}</label>
                    </div>
                    :
                    <div data-item={"-"}>
						Nothing focused
                    </div>}

                {actions.map((a, i) => (
                    <div
                        data-action={"-"}
                        key={"short-cut-" + a.label + "-" + i}
                        style={{display: a.disabled ? "none" : undefined}}
                    >
                        <div data-item={"-"}>
                            {a.require.map((e, i) => LABELED_KEYS[e] + (i < a.require.length - 1 ? " + " : ""))}
                        </div>
                        <div>
                            {a.label}
                        </div>
                    </div>
                ))}
            </>
        )
    }

}