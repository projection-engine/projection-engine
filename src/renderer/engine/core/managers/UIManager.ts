import Engine from "../Engine"
import EngineFileSystemManager from "./EngineFileSystemManager"
import UIComponent from "@engine-core/lib/components/UIComponent"
import {Components} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import GPUState from "@engine-core/states/GPUState";

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
export default class UIManager {
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
            const uiLayoutId = elements[i]
            const entities = UIComponents.filter(e => EntityManager.getComponent<UIComponent>(e, Components.UI).uiLayoutID === uiLayoutId)
            if (!entities.length) {
                Engine.UILayouts.delete(uiLayoutId)
                continue
            }
            Engine.UILayouts.set(uiLayoutId, await EngineFileSystemManager.readAsset(uiLayoutId))
            entities.forEach(e => {
                UIManager.updateUIEntity(e)
            })
        }
    }

    static deleteUIEntity(entity: EngineEntity) {
        if (!EntityManager.hasComponent(entity, Components.UI))
            return;
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIComponent.__element || !UIManager.document?.parentElement)
            return
        const children = UIComponent.__element.querySelectorAll("[data-enginewrapper='-']")
        children.forEach(c => {
            UIComponent.__element.removeChild(c)
            UIManager.document.appendChild(c)
            UIComponent.anchorElement = undefined
        })
        UIComponent.__element.parentElement?.removeChild?.(UIComponent.__element)
    }

    static async createUIEntity(entity: EngineEntity) {
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIManager.document?.parentElement || UIComponent.__element != undefined)
            return
        const el = document.createElement("div")
        el.setAttribute("data-engineelement", "-")
        el.setAttribute("data-enginewrapper", "-")
        el.setAttribute("data-entityid", entity)

        UIManager.#mapToObject(el, UIComponent)

        el.id = entity
        if (UIComponent.uiLayoutID != null && !Engine.UILayouts.has(UIComponent.uiLayoutID)) {
            const asset = await EngineFileSystemManager.readAsset(UIComponent.uiLayoutID)
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

        UIManager.document.appendChild(el)
        UIComponent.__element = el

        return {parent: UIComponent.anchorElement, element: el}
    }

    static buildUI(mounting: HTMLElement) {
        const target = mounting || GPUState.canvas.parentElement
        UIManager.destroyUI()
        UIManager.document = document.createElement("div")
        Object.assign(UIManager.document.style, STYLES)
        target.appendChild(UIManager.document)

        const elementsToBind = []
        const entities = EntityManager.withComponent(Components.UI).array
        for (let i = 0; i < entities.length; i++)
            elementsToBind.push(UIManager.createUIEntity(entities[i]))
        Promise.all(elementsToBind).then(() => {
            for (let i = 0; i < elementsToBind.length; i++) {
                if (!elementsToBind[i])
                    continue
                const {parent, element} = elementsToBind[i]
                const parentElement = document.getElementById(parent)
                if (!parentElement)
                    continue
                UIManager.document.removeChild(element)
                parentElement.appendChild(element)
            }
        })
    }

    static destroyUI() {
        if (!UIManager.document?.parentElement)
            return

        UIManager.document.parentElement.removeChild(UIManager.document)
        const entities = EntityManager.withComponent(Components.UI).array
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i]
            const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
            UIComponent.__element = undefined
        }
    }

    static updateUIEntity(entity: EngineEntity) {
        if (!UIManager.document?.parentElement)
            return
        const UIComponent = EntityManager.getComponent<UIComponent>(entity, Components.UI)
        if (!UIComponent.__element)
            return
        const el = UIComponent.__element
        if (!el)
            return
        el.removeAttribute("style")
        UIManager.#mapToObject(el, UIComponent)
        el.id = entity
        const html = Engine.UILayouts.get(UIComponent.uiLayoutID)
        el.innerHTML = html ? html : ""
    }


    static hideUI() {
        if (!UIManager.document?.parentElement)
            return
        UIManager.document.style.display = "none"
    }

    static showUI() {
        if (!UIManager.document?.parentElement)
            return
        UIManager.document.style.display = "block"
    }
}
