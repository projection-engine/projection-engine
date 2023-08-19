import Engine from "../../Engine"
import InputEventsAPI from "../utils/InputEventsAPI"
import FileSystemAPI from "../utils/FileSystemAPI"
import UIComponent from "../../components/UIComponent"
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";

const STYLES = {
    position: "absolute",
    top: "0",
    zIndex: 1,
    boxSizing: "border-box",
    display: "block",
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "none",
}
export default class UIAPI {
    static document?: HTMLElement

    static #mapToObject(el: HTMLElement, component: UIComponent) {
        const obj: { [key: string]: string } = {}
        component.wrapperStyles.forEach(([k, v]) => obj[k] = v)
        Object.assign(el.style, obj)
    }

    static async updateAllElements() {
        const elements = Array.from(Engine.UILayouts.keys())
        const UIComponents = EntityManager.withComponent(Components.UI).array
        for (let i = 0; i < elements.length; i++) {
            const found = elements[i]
            const entities = UIComponents.filter(e => EntityManager.getComponent<UIComponent>(e, Components.UI).uiLayoutID === found)
            if (!entities.length) {
                Engine.UILayouts.delete(found)
                continue
            }
            Engine.UILayouts.set(found, await FileSystemAPI.readAsset(found))
            entities.forEach(e => {
                UIAPI.updateUIEntity(e)
            })
        }
    }

    static deleteUIEntity(entity: EngineEntity) {
        if (!EntityManager.hasComponent(entity, Components.UI))
            return;
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIComponent.__element || !UIAPI.document?.parentElement)
            return
        const children = UIComponent.__element.querySelectorAll("[data-enginewrapper='-']")
        children.forEach(c => {
            UIComponent.__element.removeChild(c)
            UIAPI.document.appendChild(c)
            UIComponent.anchorElement = undefined
        })
        UIComponent.__element.parentElement?.removeChild?.(UIComponent.__element)
    }

    static async createUIEntity(entity: EngineEntity) {
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIAPI.document?.parentElement || UIComponent.__element != undefined)
            return
        const el = document.createElement("div")
        el.setAttribute("data-engineelement", "-")
        el.setAttribute("data-enginewrapper", "-")
        el.setAttribute("data-entityid", entity)

        UIAPI.#mapToObject(el, UIComponent)

        el.id = entity
        if (UIComponent.uiLayoutID != null && !Engine.UILayouts.has(UIComponent.uiLayoutID)) {
            const asset = await FileSystemAPI.readAsset(UIComponent.uiLayoutID)
            if (asset) {
                Engine.UILayouts.set(UIComponent.uiLayoutID, asset)
                el.innerHTML = asset
            }
        } else if (UIComponent.uiLayoutID != null) {
            el.innerHTML = Engine.UILayouts.get(UIComponent.uiLayoutID)
        }

        const children = el.children
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            if (child.tagName !== "STYLE")
                child.setAttribute("data-engineelement", "-")
        }

        UIAPI.document.appendChild(el)
        UIComponent.__element = el

        return {parent: UIComponent.anchorElement, element: el}
    }

    static buildUI(mounting: HTMLElement) {
        const target = mounting || InputEventsAPI.targetElement
        UIAPI.destroyUI()
        UIAPI.document = document.createElement("div")
        Object.assign(UIAPI.document.style, STYLES)
        target.appendChild(UIAPI.document)

        const elementsToBind = []
        const entities = EntityManager.withComponent(Components.UI).array
        for (let i = 0; i < entities.length; i++)
            elementsToBind.push(UIAPI.createUIEntity(entities[i]))
        Promise.all(elementsToBind).then(() => {
            for (let i = 0; i < elementsToBind.length; i++) {
                if (!elementsToBind[i])
                    continue
                const {parent, element} = elementsToBind[i]
                const parentElement = document.getElementById(parent)
                if (!parentElement)
                    continue
                UIAPI.document.removeChild(element)
                parentElement.appendChild(element)
            }
        })
    }

    static destroyUI() {
        if (!UIAPI.document?.parentElement)
            return

        UIAPI.document.parentElement.removeChild(UIAPI.document)
        const entities = EntityManager.withComponent(Components.UI).array
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i]
            const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
            UIComponent.__element = undefined
        }
    }

    static updateUIEntity(entity: EngineEntity) {
        if (!UIAPI.document?.parentElement)
            return
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIComponent.__element)
            return
        const el = UIComponent.__element
        if (!el)
            return
        el.removeAttribute("style")
        UIAPI.#mapToObject(el, UIComponent)
        el.id = entity
        const html = Engine.UILayouts.get(UIComponent.uiLayoutID)
        el.innerHTML = html ? html : ""
    }


    static hideUI() {
        if (!UIAPI.document?.parentElement)
            return
        UIAPI.document.style.display = "none"
    }

    static showUI() {
        if (!UIAPI.document?.parentElement)
            return
        UIAPI.document.style.display = "block"
    }
}
