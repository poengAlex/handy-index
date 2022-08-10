import { Notify } from 'quasar'

// Remove padding on parent element
export function removePaddingOnParent(elementId: string) {
    const child = document.getElementById(elementId);
    if (child !== null) {
        if (child.parentElement !== null) {
            child.parentElement!.style.padding = "0px";
        } else {
            console.error("Cannot remove padding on parent. Parent is null");
        }
    } else {
        console.error("Cannot remove padding on parent. Child is null");
    }
}

export function createNotifyWarning(message: string, header = "") {
    createNotify(message, header, "warning")
}

export function createNotifySuccess(message: string, header = "") {
    createNotify(message, header, "positive")
}

export function createNotify(message: string | object, header: string | object | undefined = undefined, type = "negative") {
    // console.log('createNotify', message, header, type);
    if (typeof (message) === "object") message = JSON.stringify(message);
    if (typeof (header) === "object") header = JSON.stringify(header);
    let caption;
    if (header !== undefined) {
        const temp = message;
        message = header;
        caption = temp;
    }
    Notify.create({
        type,
        position: "bottom-right",
        caption,
        message
    })
}

// export function rgbaObjectToRgbaString(color: Color, alpha = 1) {
//     return "rgba(" + color.red + "," + color.green + "," + color.blue + "," + alpha + ")";
// }
export const hex2rgba = (hex: string, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

export function nonReactiveObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Converts a object to nested ul list
 * <span v-html="objectToList(OBJECT)">
 * @param obj
 */
export function objectToList(obj: any) {
    let html = '<ul>';
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            html += `<li><b>${key}</b>:`;
            if (typeof (value) === "object" && value !== null) {
                html += objectToList(value);
            } else {
                html += value
            }
            html += '</li>'
        }
    }
    html += "</ul>"
    return html;
}
