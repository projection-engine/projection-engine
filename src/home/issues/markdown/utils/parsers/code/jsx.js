import React from "react";

export default function jsxParser(component){
    if (component.type === React.Fragment && component.props.children && component.props.children.length > 0) {
        let data = ''
        component.props.children.forEach(child => {
            data = data + '<br>' + jsxParser(child)
        })

        return data
    } else
        try {

            let type = component.type?.name;
            let props = component.props;
            let propsString = "";
            let childrenNode = ''
            for (let key in props) {
                let propValue = props[key];
                if (key !== "children" && typeof propValue !== 'function' && typeof propValue !== 'boolean') {

                    let value = "";
                    if (propValue instanceof Object) {
                        value = `{${JSON.stringify(propValue).replace(/['"]+/g, '')}}`;
                    } else {
                        value = `"${propValue}"`;
                    }
                    propsString += ` <b style="color: #0095ff">${key}=</b><i style="color: #007d07">${value}</i>`;
                } else if (typeof props[key] === 'function')
                    propsString += ` <b style="color: #0095ff">${key}=</b><i style="color: #FFBF00">${key}</i>`;
                else if (typeof propValue === 'boolean')
                    propsString += ` <b style="color: #0095ff">${key}=</b><i style="color: #FF1500">${propValue}</i>`;
            }
            if (props.children) {
                switch (true) {
                    case Array.isArray(props.children): {
                        childrenNode = props.children.join('').replace(/\s\s+/g, ' ')
                        break
                    }
                    case React.isValidElement(props.children): {
                        childrenNode = jsxParser(props.children)
                        break
                    }
                    default: {
                        childrenNode = props.children
                        break
                    }
                }
            }

            if (type)
                return props.children ?
                    `&lt;<b style="color:#86128f;">${type}</b>${propsString}&gt;` + '<br>   ' + childrenNode + '<br>' + `&lt;/<b style="color:#86128f;">${type}</b>&gt;`
                    :
                    `&lt;<b style="color:#86128f;">${type}</b>${propsString}/&gt;`;
            else
                return childrenNode
        } catch (e) {
            return component
        }
}