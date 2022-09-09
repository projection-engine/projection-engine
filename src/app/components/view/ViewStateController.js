export default class ViewStateController {
    static states = {}

    static getState(viewID, viewIndex) {
        return ViewStateController.states[viewID + "-" + viewIndex]
    }
    static updateState(viewID, viewIndex, state) {
        ViewStateController.states[viewID + "-" + viewIndex] = state
    }
}