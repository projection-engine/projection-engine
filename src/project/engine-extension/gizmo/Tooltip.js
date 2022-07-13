const CSS = {
    backdropFilter: "blur(10px) brightness(70%)",
    borderRadius: "5px",
    width: "fit-content",
    height: "fit-content",
    position: "absolute",
    top: "4px",
    left: "4px",
    zIndex: "10",
    color: "white",
    padding: "8px",
    fontSize: ".75rem",
    display: "none"
}

export default class Tooltip {
    constructor() {
        const targetID = window.gpu.canvas.id + "-gizmo"
        if (document.getElementById(targetID) !== null)
            this.renderTarget = document.getElementById(targetID)
        else {
            this.renderTarget = document.createElement("div")
            this.renderTarget.id = targetID
            Object.assign(this.renderTarget.style, CSS)
            document.body.appendChild(this.renderTarget)
        }
    }

    start( ) {
        Object.assign(this.renderTarget.style, {
            display: "flex",
            justifyContent: "space-evenly",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "4px",
            top: "unset",
            width: "300px",
            overflow: "hidden"
        })
    }
    stop(){
        Object.assign(this.renderTarget.style, {
            display: "none",
            justifyContent: "unset",
            left: "unset",
            transform: "unset",
            bottom: "unset",
            top: "unset",
            width: "fit-content"
        })

        this.renderTarget.innerHTML = ""
    }

    render([x, y, z]) {
        this.renderTarget.innerHTML = ` 
        <div style="display: flex;align-items: center;justify-content: center; width: 100%;gap: 4px">
            <label style="color: red;font-weight: bolder; font-size: .9rem"">X:</label> ${x.toFixed(2)}
        </div>
        <div style="display: flex;align-items: center;justify-content: center; width: 100%;gap: 4px ">
            <label style="color: darkgreen; font-weight: bolder; font-size: .9rem">Y:</label> ${y.toFixed(2)}
        </div>
        <div style="display: flex;align-items: center;justify-content: center; width: 100%;gap: 4px ">
            <label style="color: blue;font-weight: bolder; font-size: .9rem"">Z:</label> ${z.toFixed(2)}
        </div>
    `
    }

}

