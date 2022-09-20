import { settings } from 'cluster';
import { Notify, QVueGlobals } from 'quasar'
import { useSettingsStore } from 'src/stores/settings';
import { PartnerVideo, Script } from 'src/_SCRIPTAPIINDEX';
export const RATING_STEPS = 5;
export function valueToRating(value: number, reverse = false) {
	if (reverse) {
		return Math.round((100 / (RATING_STEPS - 1)) * (value - 1))
	} else {
		return Math.round(((value * (RATING_STEPS - 1)) / 100) + 1);
	}
}

export function showConnectionKeyDialog($q: QVueGlobals, cb: (((key: string) => void) | undefined) = undefined) {
	$q.dialog({
		title: 'Type in your Handys connection key',
		message: 'The script tokens and script requests are bound to a Handy, so in order to download script tokens you will need to tyoe in your Connection Key. NB! The Handy browser extension will override this value!',
		prompt: {
			model: useSettingsStore().connectionKey,
			isValid: val => val.length > -1, // << Disabled length validation so the user can remove the key
			type: 'text' // optional
		},
		cancel: true,
		persistent: true
	}).onOk(data => {
		console.log('>>>> OK, received', data);
		if (data === "") {
			createNotifySuccess("Key deleted");
			useSettingsStore().connectionKey = "";
		} else {
			createNotifySuccess("Key: " + data, "Connection key set");
			useSettingsStore().connectionKey = data;
			if (cb !== undefined) {
				cb(data);
			}
		}
	})
}

export function isVideoVoted(script: Script) {
	const settings = useSettingsStore();
	const isFound = settings.videoVotes.some(vote => {
		if (vote.scriptId === script.scriptId) {
			return true;
		}
		return false;
	});
	return isFound;
}

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
