import { b as v$1, d as a, f as d$1, h as n$1, n as J } from "./p-CthoZqG1-DNgJKc7C.js";
import { t as d$2 } from "./p-ZjP4CjeZ-BnW-oeAv.js";
import { a as f$1 } from "./p-DEvF_E6y-DzsfL3hb.js";
//#region node_modules/@ionic/core/components/p-CPGp3WWG.js
/*!
* (C) Ionic http://ionicframework.com - MIT License
*/
var t$1;
var i = (e, o, i) => {
	const n = o.startsWith("animation") ? (r = e, void 0 === t$1 && (t$1 = void 0 === r.style.animationName && void 0 !== r.style.webkitAnimationName ? "-webkit-" : ""), t$1) : "";
	var r;
	e.style.setProperty(n + o, i);
};
var n = (e = [], o) => {
	if (void 0 !== o) {
		const t = Array.isArray(o) ? o : [o];
		return [...e, ...t];
	}
	return e;
};
var r$1 = (t) => {
	let r, a, s, d, f, l, c, v, m, u, p, y = [], g = [], A = [], b = !1, C = {}, E = [], h = [], S = {}, j = 0, k = !1, R = !1, w = !0, T = !1, D = !0, F = !1;
	const W = t, Z = [], I = [], K = [], M = [], P = [], q = [], x = [], G = [], z = [], B = [], H = [], J = "function" == typeof AnimationEffect || void 0 !== d$2 && "function" == typeof d$2.AnimationEffect, L = "function" == typeof Element && "function" == typeof Element.prototype.animate && J, N = () => H, O = (e, o) => {
		const t = o.findIndex(((o) => o.c === e));
		t > -1 && o.splice(t, 1);
	}, Q = (e, o) => ((o?.oneTimeCallback ? I : Z).push({
		c: e,
		o
	}), p), U = () => {
		L && (H.forEach(((e) => {
			e.cancel();
		})), H.length = 0);
	}, V = () => {
		q.forEach(((e) => {
			e?.parentNode && e.parentNode.removeChild(e);
		})), q.length = 0;
	}, X = () => void 0 !== f ? f : c ? c.getFill() : "both", Y = () => void 0 !== v ? v : void 0 !== l ? l : c ? c.getDirection() : "normal", $ = () => k ? "linear" : void 0 !== s ? s : c ? c.getEasing() : "linear", _ = () => R ? 0 : void 0 !== m ? m : void 0 !== a ? a : c ? c.getDuration() : 0, ee = () => void 0 !== d ? d : c ? c.getIterations() : 1, oe = () => void 0 !== u ? u : void 0 !== r ? r : c ? c.getDelay() : 0, te = () => {
		0 !== j && (j--, 0 === j && ((() => {
			z.forEach(((e) => e())), B.forEach(((e) => e()));
			const e = w ? 1 : 0, o = E, t = h, n = S;
			M.forEach(((e) => {
				const r = e.classList;
				o.forEach(((e) => r.add(e))), t.forEach(((e) => r.remove(e)));
				for (const o in n) n.hasOwnProperty(o) && i(e, o, n[o]);
			})), m = void 0, v = void 0, u = void 0, Z.forEach(((o) => o.c(e, p))), I.forEach(((o) => o.c(e, p))), I.length = 0, D = !0, w && (T = !0), w = !0;
		})(), c && c.animationFinish()));
	}, ie = () => {
		(() => {
			x.forEach(((e) => e())), G.forEach(((e) => e()));
			const e = g, o = A, t = C;
			M.forEach(((n) => {
				const r = n.classList;
				e.forEach(((e) => r.add(e))), o.forEach(((e) => r.remove(e)));
				for (const e in t) t.hasOwnProperty(e) && i(n, e, t[e]);
			}));
		})(), y.length > 0 && L && (M.forEach(((e) => {
			const o = e.animate(y, {
				id: W,
				delay: oe(),
				duration: _(),
				easing: $(),
				iterations: ee(),
				fill: X(),
				direction: Y()
			});
			o.pause(), H.push(o);
		})), H.length > 0 && (H[0].onfinish = () => {
			te();
		})), b = !0;
	}, ne = (e) => {
		e = Math.min(Math.max(e, 0), .9999), L && H.forEach(((o) => {
			o.currentTime = o.effect.getComputedTiming().delay + _() * e, o.pause();
		}));
	}, re = (e) => {
		H.forEach(((e) => {
			e.effect.updateTiming({
				delay: oe(),
				duration: _(),
				easing: $(),
				iterations: ee(),
				fill: X(),
				direction: Y()
			});
		})), void 0 !== e && ne(e);
	}, ae = (e = !1, o = !0, t) => (e && P.forEach(((i) => {
		i.update(e, o, t);
	})), L && re(t), p), se = () => {
		b && (L ? H.forEach(((e) => {
			e.pause();
		})) : M.forEach(((e) => {
			i(e, "animation-play-state", "paused");
		})), F = !0);
	}, de = (e) => new Promise(((o) => {
		e?.sync && (R = !0, Q((() => R = !1), { oneTimeCallback: !0 })), b || ie(), T && (L && (ne(0), re()), T = !1), D && (j = P.length + 1, D = !1);
		const t = () => {
			O(i, I), o();
		}, i = () => {
			O(t, K), o();
		};
		Q(i, { oneTimeCallback: !0 }), K.push({
			c: t,
			o: { oneTimeCallback: !0 }
		}), P.forEach(((e) => {
			e.play();
		})), L ? (H.forEach(((e) => {
			e.play();
		})), 0 !== y.length && 0 !== M.length || te()) : te(), F = !1;
	})), fe = (e, o) => {
		const t = y[0];
		return void 0 === t || void 0 !== t.offset && 0 !== t.offset ? y = [{
			offset: 0,
			[e]: o
		}, ...y] : t[e] = o, p;
	};
	return p = {
		parentAnimation: c,
		elements: M,
		childAnimations: P,
		id: W,
		animationFinish: te,
		from: fe,
		to: (e, o) => {
			const t = y[y.length - 1];
			return void 0 === t || void 0 !== t.offset && 1 !== t.offset ? y = [...y, {
				offset: 1,
				[e]: o
			}] : t[e] = o, p;
		},
		fromTo: (e, o, t) => fe(e, o).to(e, t),
		parent: (e) => (c = e, p),
		play: de,
		pause: () => (P.forEach(((e) => {
			e.pause();
		})), se(), p),
		stop: () => {
			P.forEach(((e) => {
				e.stop();
			})), b && (U(), b = !1), k = !1, R = !1, D = !0, v = void 0, m = void 0, u = void 0, j = 0, T = !1, w = !0, F = !1, K.forEach(((e) => e.c(0, p))), K.length = 0;
		},
		destroy: (e) => (P.forEach(((o) => {
			o.destroy(e);
		})), ((e) => {
			U(), e && V();
		})(e), M.length = 0, P.length = 0, y.length = 0, Z.length = 0, I.length = 0, b = !1, D = !0, p),
		keyframes: (e) => {
			const o = y !== e;
			return y = e, o && ((e) => {
				L && N().forEach(((o) => {
					const t = o.effect;
					if (t.setKeyframes) t.setKeyframes(e);
					else o.effect = new KeyframeEffect(t.target, e, t.getTiming());
				}));
			})(y), p;
		},
		addAnimation: (e) => {
			if (null != e) if (Array.isArray(e)) for (const o of e) o.parent(p), P.push(o);
			else e.parent(p), P.push(e);
			return p;
		},
		addElement: (o) => {
			if (null != o) if (1 === o.nodeType) M.push(o);
			else if (o.length >= 0) for (let e = 0; e < o.length; e++) M.push(o[e]);
			else d$1("createAnimation - Invalid addElement value.");
			return p;
		},
		update: ae,
		fill: (e) => (f = e, ae(!0), p),
		direction: (e) => (l = e, ae(!0), p),
		iterations: (e) => (d = e, ae(!0), p),
		duration: (e) => (L || 0 !== e || (e = 1), a = e, ae(!0), p),
		easing: (e) => (s = e, ae(!0), p),
		delay: (e) => (r = e, ae(!0), p),
		getWebAnimations: N,
		getKeyframes: () => y,
		getFill: X,
		getDirection: Y,
		getDelay: oe,
		getIterations: ee,
		getEasing: $,
		getDuration: _,
		afterAddRead: (e) => (z.push(e), p),
		afterAddWrite: (e) => (B.push(e), p),
		afterClearStyles: (e = []) => {
			for (const o of e) S[o] = "";
			return p;
		},
		afterStyles: (e = {}) => (S = e, p),
		afterRemoveClass: (e) => (h = n(h, e), p),
		afterAddClass: (e) => (E = n(E, e), p),
		beforeAddRead: (e) => (x.push(e), p),
		beforeAddWrite: (e) => (G.push(e), p),
		beforeClearStyles: (e = []) => {
			for (const o of e) C[o] = "";
			return p;
		},
		beforeStyles: (e = {}) => (C = e, p),
		beforeRemoveClass: (e) => (A = n(A, e), p),
		beforeAddClass: (e) => (g = n(g, e), p),
		onFinish: Q,
		isRunning: () => 0 !== j && !F,
		progressStart: (e = !1, o) => (P.forEach(((t) => {
			t.progressStart(e, o);
		})), se(), k = e, b || ie(), ae(!1, !0, o), p),
		progressStep: (e) => (P.forEach(((o) => {
			o.progressStep(e);
		})), ne(e), p),
		progressEnd: (e, o, t) => (k = !1, P.forEach(((i) => {
			i.progressEnd(e, o, t);
		})), void 0 !== t && (m = t), T = !1, w = !0, 0 === e ? (v = "reverse" === Y() ? "normal" : "reverse", "reverse" === v && (w = !1), L ? (ae(), ne(1 - o)) : (u = (1 - o) * _() * -1, ae(!1, !1))) : 1 === e && (L ? (ae(), ne(o)) : (u = o * _() * -1, ae(!1, !1))), void 0 === e || c || de(), p)
	};
};
//#endregion
//#region node_modules/@ionic/core/components/p-CEs5NmKW.js
/*!
* (C) Ionic http://ionicframework.com - MIT License
*/
var r = "ionViewWillEnter";
var t = "ionViewDidEnter";
var s = "ionViewWillLeave";
var c = "ionViewDidLeave";
var l = "ionViewWillUnload";
var u = (n) => {
	n.tabIndex = -1, n.focus();
};
var d = (n) => null !== n.offsetParent;
var f = "ion-last-focus";
var p = (e) => {
	if (n$1.get("focusManagerPriority", !1)) {
		const n = document.activeElement;
		null !== n && e?.contains(n) && n.setAttribute(f, "true");
	}
};
var w = (i) => {
	const a$2 = n$1.get("focusManagerPriority", !1);
	if (Array.isArray(a$2) && !i.contains(document.activeElement)) {
		const n = i.querySelector(`[${f}]`);
		if (n && d(n)) return void u(n);
		for (const n of a$2) switch (n) {
			case "content":
				const a$1 = i.querySelector("main, [role=\"main\"]");
				if (a$1 && d(a$1)) return void u(a$1);
				break;
			case "heading":
				const o = i.querySelector("h1, [role=\"heading\"][aria-level=\"1\"]");
				if (o && d(o)) return void u(o);
				break;
			case "banner":
				const r = i.querySelector("header, [role=\"banner\"]");
				if (r && d(r)) return void u(r);
				break;
			default: a(`Unrecognized focus manager priority value ${n}`);
		}
		u(i);
	}
};
var v = (n) => new Promise(((e, a) => {
	J((() => {
		const i = U(n);
		m(n, i), g(n).then(((i) => {
			i.animation && i.animation.destroy(), b(n), e(i);
		}), ((e) => {
			b(n), a(e);
		})).finally((() => {
			A(i, !1);
		}));
	}));
}));
var m = (n, e) => {
	const i = n.enteringEl, a = n.leavingEl;
	p(a), x(i, a, n.direction), A(e, !0), n.showGoBack ? i.classList.add("can-go-back") : i.classList.remove("can-go-back"), W(i, !1), i.style.setProperty("pointer-events", "none"), a && (W(a, !1), a.style.setProperty("pointer-events", "none"));
};
var g = async (n) => {
	const e = await y(n);
	return e && v$1.isBrowser ? h(e, n) : P(n);
};
var b = (n) => {
	const e = n.enteringEl, i = n.leavingEl;
	e.classList.remove("ion-page-invisible"), e.style.removeProperty("pointer-events"), void 0 !== i && (i.classList.remove("ion-page-invisible"), i.style.removeProperty("pointer-events")), w(e);
};
var y = async (n) => {
	if (n.leavingEl && n.animated && 0 !== n.duration) return n.animationBuilder ? n.animationBuilder : "ios" === n.mode ? (await import("./@ionic_angular.js").then((n) => n.n)).iosTransitionAnimation : (await import("./@ionic_angular.js").then((n) => n.t)).mdTransitionAnimation;
};
var h = async (n, e) => {
	await k(e, !0);
	const i = n(e.baseEl, e);
	D(e.enteringEl, e.leavingEl);
	const a = await C(i, e);
	return e.progressCallback && e.progressCallback(void 0), a && E(e.enteringEl, e.leavingEl), {
		hasCompleted: a,
		animation: i
	};
};
var P = async (e) => {
	const i = e.enteringEl, a = e.leavingEl;
	return await k(e, n$1.get("focusManagerPriority", !1)), D(i, a), E(i, a), { hasCompleted: !0 };
};
var k = async (n, e) => {
	(void 0 !== n.deepWait ? n.deepWait : e) && await Promise.all([M(n.enteringEl), M(n.leavingEl)]), await V(n.viewIsReady, n.enteringEl);
};
var V = async (n, e) => {
	n && await n(e);
};
var C = (n, e) => {
	const i = e.progressCallback, a = new Promise(((e) => {
		n.onFinish(((n) => e(1 === n)));
	}));
	return i ? (n.progressStart(!0), i(n)) : n.play(), a;
};
var D = (n, e) => {
	j(e, s), j(n, r);
};
var E = (n, e) => {
	j(n, t), j(e, c);
};
var j = (n, e) => {
	if (n) {
		const i = new CustomEvent(e, {
			bubbles: !1,
			cancelable: !1
		});
		n.dispatchEvent(i);
	}
};
var L = () => new Promise(((n) => f$1((() => f$1((() => n()))))));
var M = async (n) => {
	const e = n;
	if (e) {
		if (null != e.componentOnReady) {
			if (null != await e.componentOnReady()) return;
		} else if (null != e.__registerHost) {
			await new Promise(((n) => f$1(n)));
			return;
		}
		await Promise.all(Array.from(e.children).map(M));
	}
};
var W = (n, e) => {
	e ? (n.setAttribute("aria-hidden", "true"), n.classList.add("ion-page-hidden")) : (n.hidden = !1, n.removeAttribute("aria-hidden"), n.classList.remove("ion-page-hidden"));
};
var x = (n, e, i) => {
	void 0 !== n && (n.style.zIndex = "back" === i ? "99" : "101"), void 0 !== e && (e.style.zIndex = "100");
};
var A = (n, e) => {
	if (!n) return;
	const i = "header-transitioning";
	e ? n.classList.add(i) : n.classList.remove(i);
};
var B = (n) => {
	if (n.classList.contains("ion-page")) return n;
	return n.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs") || n;
};
var U = (n) => {
	if ("ios" !== n.mode) return null;
	const e = "back" === n.direction ? n.leavingEl : n.enteringEl;
	return e ? e.querySelector("ion-header") : null;
};
//#endregion
export { c as a, r as c, v as d, r$1 as f, W as i, s as l, L as n, j as o, M as r, l as s, B as t, t as u };
