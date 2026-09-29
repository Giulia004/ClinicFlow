import { n as J, x as z } from "./p-CthoZqG1-DNgJKc7C.js";
import { u as n$1 } from "./p-DEvF_E6y-DzsfL3hb.js";
import { n as c, s as l } from "./p-HO1CDBeU-BOLSiGcG.js";
//#region node_modules/@ionic/core/components/p-CpcdCRug.js
/*!
* (C) Ionic http://ionicframework.com - MIT License
*/
var n = () => {
	const n = window;
	n.addEventListener("statusTap", (() => {
		z((() => {
			const o = document.elementFromPoint(n.innerWidth / 2, n.innerHeight / 2);
			if (!o) return;
			const e = l(o);
			e && new Promise(((o) => n$1(e, o))).then((() => {
				J((async () => {
					e.style.setProperty("--overflow", "hidden"), await c(e, 300), e.style.removeProperty("--overflow");
				}));
			}));
		}));
	}));
};
//#endregion
export { n as startStatusTap };
