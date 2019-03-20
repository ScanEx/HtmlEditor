var Demo = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function noop() {}

  function assign(tar, src) {
  	for (var k in src) {
  		tar[k] = src[k];
  	}return tar;
  }

  function addLoc(element, file, line, column, char) {
  	element.__svelte_meta = {
  		loc: { file: file, line: line, column: column, char: char }
  	};
  }

  function run(fn) {
  	fn();
  }

  function insert(target, node, anchor) {
  	target.insertBefore(node, anchor);
  }

  function detachNode(node) {
  	node.parentNode.removeChild(node);
  }

  function createElement(name) {
  	return document.createElement(name);
  }

  function addListener(node, event, handler, options) {
  	node.addEventListener(event, handler, options);
  }

  function removeListener(node, event, handler, options) {
  	node.removeEventListener(event, handler, options);
  }

  function blankObject() {
  	return Object.create(null);
  }

  function destroy(detach) {
  	this.destroy = noop;
  	this.fire('destroy');
  	this.set = noop;

  	this._fragment.d(detach !== false);
  	this._fragment = null;
  	this._state = {};
  }

  function destroyDev(detach) {
  	destroy.call(this, detach);
  	this.destroy = function () {
  		console.warn('Component was already destroyed');
  	};
  }

  function _differs(a, b) {
  	return a != a ? b == b : a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
  }

  function fire(eventName, data) {
  	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
  	if (!handlers) return;

  	for (var i = 0; i < handlers.length; i += 1) {
  		var handler = handlers[i];

  		if (!handler.__calling) {
  			try {
  				handler.__calling = true;
  				handler.call(this, data);
  			} finally {
  				handler.__calling = false;
  			}
  		}
  	}
  }

  function flush(component) {
  	component._lock = true;
  	callAll(component._beforecreate);
  	callAll(component._oncreate);
  	callAll(component._aftercreate);
  	component._lock = false;
  }

  function get$1() {
  	return this._state;
  }

  function init(component, options) {
  	component._handlers = blankObject();
  	component._slots = blankObject();
  	component._bind = options._bind;
  	component._staged = {};

  	component.options = options;
  	component.root = options.root || component;
  	component.store = options.store || component.root.store;

  	if (!options.root) {
  		component._beforecreate = [];
  		component._oncreate = [];
  		component._aftercreate = [];
  	}
  }

  function on(eventName, handler) {
  	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
  	handlers.push(handler);

  	return {
  		cancel: function cancel() {
  			var index = handlers.indexOf(handler);
  			if (~index) handlers.splice(index, 1);
  		}
  	};
  }

  function set$1(newState) {
  	this._set(assign({}, newState));
  	if (this.root._lock) return;
  	flush(this.root);
  }

  function _set(newState) {
  	var oldState = this._state,
  	    changed = {},
  	    dirty = false;

  	newState = assign(this._staged, newState);
  	this._staged = {};

  	for (var key in newState) {
  		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
  	}
  	if (!dirty) return;

  	this._state = assign(assign({}, oldState), newState);
  	this._recompute(changed, this._state);
  	if (this._bind) this._bind(changed, this._state);

  	if (this._fragment) {
  		this.fire("state", { changed: changed, current: this._state, previous: oldState });
  		this._fragment.p(changed, this._state);
  		this.fire("update", { changed: changed, current: this._state, previous: oldState });
  	}
  }

  function _stage(newState) {
  	assign(this._staged, newState);
  }

  function setDev(newState) {
  	if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) !== 'object') {
  		throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
  	}

  	this._checkReadOnly(newState);
  	set$1.call(this, newState);
  }

  function callAll(fns) {
  	while (fns && fns.length) {
  		fns.shift()();
  	}
  }

  function _mount(target, anchor) {
  	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
  }

  var protoDev = {
  	destroy: destroyDev,
  	get: get$1,
  	fire: fire,
  	on: on,
  	set: setDev,
  	_recompute: noop,
  	_set: _set,
  	_stage: _stage,
  	_mount: _mount,
  	_differs: _differs
  };

  var HTML_ESC_MAP = {
      "nbsp": " ",
      "iexcl": "¡",
      "cent": "¢",
      "pound": "£",
      "curren": "¤",
      "yen": "¥",
      "brvbar": "¦",
      "sect": "§",
      "uml": "¨",
      "copy": "©",
      "ordf": "ª",
      "laquo": "«",
      "not": "¬",
      "reg": "®",
      "macr": "¯",
      "deg": "°",
      "plusmn": "±",
      "sup2": "²",
      "sup3": "³",
      "acute": "´",
      "micro": "µ",
      "para": "¶",
      "middot": "·",
      "cedil": "¸",
      "sup1": "¹",
      "ordm": "º",
      "raquo": "»",
      "frac14": "¼",
      "frac12": "½",
      "frac34": "¾",
      "iquest": "¿",
      "Agrave": "À",
      "Aacute": "Á",
      "Acirc": "Â",
      "Atilde": "Ã",
      "Auml": "Ä",
      "Aring": "Å",
      "AElig": "Æ",
      "Ccedil": "Ç",
      "Egrave": "È",
      "Eacute": "É",
      "Ecirc": "Ê",
      "Euml": "Ë",
      "Igrave": "Ì",
      "Iacute": "Í",
      "Icirc": "Î",
      "Iuml": "Ï",
      "ETH": "Ð",
      "Ntilde": "Ñ",
      "Ograve": "Ò",
      "Oacute": "Ó",
      "Ocirc": "Ô",
      "Otilde": "Õ",
      "Ouml": "Ö",
      "times": "×",
      "Oslash": "Ø",
      "Ugrave": "Ù",
      "Uacute": "Ú",
      "Ucirc": "Û",
      "Uuml": "Ü",
      "Yacute": "Ý",
      "THORN": "Þ",
      "szlig": "ß",
      "agrave": "à",
      "aacute": "á",
      "acirc": "â",
      "atilde": "ã",
      "auml": "ä",
      "aring": "å",
      "aelig": "æ",
      "ccedil": "ç",
      "egrave": "è",
      "eacute": "é",
      "ecirc": "ê",
      "euml": "ë",
      "igrave": "ì",
      "iacute": "í",
      "icirc": "î",
      "iuml": "ï",
      "eth": "ð",
      "ntilde": "ñ",
      "ograve": "ò",
      "oacute": "ó",
      "ocirc": "ô",
      "otilde": "õ",
      "ouml": "ö",
      "divide": "÷",
      "oslash": "ø",
      "ugrave": "ù",
      "uacute": "ú",
      "ucirc": "û",
      "uuml": "ü",
      "yacute": "ý",
      "thorn": "þ",
      "yuml": "ÿ",
      "fnof": "ƒ",
      "Alpha": "Α",
      "Beta": "Β",
      "Gamma": "Γ",
      "Delta": "Δ",
      "Epsilon": "Ε",
      "Zeta": "Ζ",
      "Eta": "Η",
      "Theta": "Θ",
      "Iota": "Ι",
      "Kappa": "Κ",
      "Lambda": "Λ",
      "Mu": "Μ",
      "Nu": "Ν",
      "Xi": "Ξ",
      "Omicron": "Ο",
      "Pi": "Π",
      "Rho": "Ρ",
      "Sigma": "Σ",
      "Tau": "Τ",
      "Upsilon": "Υ",
      "Phi": "Φ",
      "Chi": "Χ",
      "Psi": "Ψ",
      "Omega": "Ω",
      "alpha": "α",
      "beta": "β",
      "gamma": "γ",
      "delta": "δ",
      "epsilon": "ε",
      "zeta": "ζ",
      "eta": "η",
      "theta": "θ",
      "iota": "ι",
      "kappa": "κ",
      "lambda": "λ",
      "mu": "μ",
      "nu": "ν",
      "xi": "ξ",
      "omicron": "ο",
      "pi": "π",
      "rho": "ρ",
      "sigmaf": "ς",
      "sigma": "σ",
      "tau": "τ",
      "upsilon": "υ",
      "phi": "φ",
      "chi": "χ",
      "psi": "ψ",
      "omega": "ω",
      "thetasym": "ϑ",
      "upsih": "ϒ",
      "piv": "ϖ",
      "bull": "•",
      "hellip": "…",
      "prime": "′",
      "Prime": "″",
      "oline": "‾",
      "frasl": "⁄",
      "weierp": "℘",
      "image": "ℑ",
      "real": "ℜ",
      "trade": "™",
      "alefsym": "ℵ",
      "larr": "←",
      "uarr": "↑",
      "rarr": "→",
      "darr": "↓",
      "harr": "↔",
      "crarr": "↵",
      "lArr": "⇐",
      "uArr": "⇑",
      "rArr": "⇒",
      "dArr": "⇓",
      "hArr": "⇔",
      "forall": "∀",
      "part": "∂",
      "exist": "∃",
      "empty": "∅",
      "nabla": "∇",
      "isin": "∈",
      "notin": "∉",
      "ni": "∋",
      "prod": "∏",
      "sum": "∑",
      "minus": "−",
      "lowast": "∗",
      "radic": "√",
      "prop": "∝",
      "infin": "∞",
      "ang": "∠",
      "and": "∧",
      "or": "∨",
      "cap": "∩",
      "cup": "∪",
      "int": "∫",
      "there4": "∴",
      "sim": "∼",
      "cong": "≅",
      "asymp": "≈",
      "ne": "≠",
      "equiv": "≡",
      "le": "≤",
      "ge": "≥",
      "sub": "⊂",
      "sup": "⊃",
      "nsub": "⊄",
      "sube": "⊆",
      "supe": "⊇",
      "oplus": "⊕",
      "otimes": "⊗",
      "perp": "⊥",
      "sdot": "⋅",
      "lceil": "⌈",
      "rceil": "⌉",
      "lfloor": "⌊",
      "rfloor": "⌋",
      "lang": "〈",
      "rang": "〉",
      "loz": "◊",
      "spades": "♠",
      "clubs": "♣",
      "hearts": "♥",
      "diams": "♦",
      "\"": "quot",
      "amp": "&",
      "lt": "<",
      "gt": ">",
      "OElig": "Œ",
      "oelig": "œ",
      "Scaron": "Š",
      "scaron": "š",
      "Yuml": "Ÿ",
      "circ": "ˆ",
      "tilde": "˜",
      "ndash": "–",
      "mdash": "—",
      "lsquo": "‘",
      "rsquo": "’",
      "sbquo": "‚",
      "ldquo": "“",
      "rdquo": "”",
      "bdquo": "„",
      "dagger": "†",
      "Dagger": "‡",
      "permil": "‰",
      "lsaquo": "‹",
      "rsaquo": "›",
      "euro": "€"
  };
  var HTML_ESC_MAP_EXP = new RegExp("&(" + Object.keys(HTML_ESC_MAP).join("|") + ");", "g");
  var decode = function decode(s) {
      return s ? s.replace(HTML_ESC_MAP_EXP, function (x) {
          return HTML_ESC_MAP[x.substring(1, x.length - 1)] || x;
      }) : s;
  };

  /* src\HtmlEditor.html generated by Svelte v2.16.1 */

  function data() {
  	return {
  		editable: false,
  		value: ''
  	};
  }
  var methods = {
  	enable: function enable(e) {
  		e.stopPropagation();

  		var _get = this.get(),
  		    editable = _get.editable;

  		if (!editable) {
  			this.refs.content.innerText = decode(this.refs.content.innerHTML);
  			this.refs.content.focus();
  			this.set({ editable: true });
  		}
  	},
  	disable: function disable(e) {
  		e.stopPropagation();

  		var _get2 = this.get(),
  		    editable = _get2.editable;

  		if (editable) {
  			this.refs.content.innerHTML = this.refs.content.innerText;
  			this.set({ editable: false, value: this.refs.content.innerHTML });
  		}
  	}
  };

  var file = "src\\HtmlEditor.html";

  function create_main_fragment(component, ctx) {
  	var div, current;

  	function onwindowclick(event) {
  		component.disable(event);	}
  	window.addEventListener("click", onwindowclick);

  	function click_handler(event) {
  		component.enable(event);
  	}

  	return {
  		c: function create() {
  			div = createElement("div");
  			addListener(div, "click", click_handler);
  			div.className = "scanex-html-editor";
  			div.contentEditable = ctx.editable;
  			addLoc(div, file, 1, 0, 44);
  		},

  		m: function mount(target, anchor) {
  			insert(target, div, anchor);
  			div.innerHTML = ctx.value;
  			component.refs.content = div;
  			current = true;
  		},

  		p: function update(changed, ctx) {
  			if (changed.value) {
  				div.innerHTML = ctx.value;
  			}

  			if (changed.editable) {
  				div.contentEditable = ctx.editable;
  			}
  		},

  		i: function intro(target, anchor) {
  			if (current) return;

  			this.m(target, anchor);
  		},

  		o: run,

  		d: function destroy$$1(detach) {
  			window.removeEventListener("click", onwindowclick);

  			if (detach) {
  				detachNode(div);
  			}

  			removeListener(div, "click", click_handler);
  			if (component.refs.content === div) component.refs.content = null;
  		}
  	};
  }

  function HtmlEditor(options) {
  	this._debugName = '<HtmlEditor>';
  	if (!options || !options.target && !options.root) {
  		throw new Error("'target' is a required option");
  	}

  	init(this, options);
  	this.refs = {};
  	this._state = assign(data(), options.data);
  	if (!('editable' in this._state)) console.warn("<HtmlEditor> was created without expected data property 'editable'");
  	if (!('value' in this._state)) console.warn("<HtmlEditor> was created without expected data property 'value'");
  	this._intro = !!options.intro;

  	this._fragment = create_main_fragment(this, this._state);

  	if (options.target) {
  		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		this._fragment.c();
  		this._mount(options.target, options.anchor);
  	}

  	this._intro = true;
  }

  assign(HtmlEditor.prototype, protoDev);
  assign(HtmlEditor.prototype, methods);

  HtmlEditor.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* demo\App.html generated by Svelte v2.16.1 */

  function data$1() {
  	return {
  		value: '<div style="color: red; font-weight: bold">DEFAULT CONTENT</div>'
  	};
  }
  function create_main_fragment$1(component, ctx) {
  	var htmleditor_updating = {},
  	    current;

  	var htmleditor_initial_data = {};
  	if (ctx.value !== void 0) {
  		htmleditor_initial_data.value = ctx.value;
  		htmleditor_updating.value = true;
  	}
  	var htmleditor = new HtmlEditor({
  		root: component.root,
  		store: component.store,
  		data: htmleditor_initial_data,
  		_bind: function _bind(changed, childState) {
  			var newState = {};
  			if (!htmleditor_updating.value && changed.value) {
  				newState.value = childState.value;
  			}
  			component._set(newState);
  			htmleditor_updating = {};
  		}
  	});

  	component.root._beforecreate.push(function () {
  		htmleditor._bind({ value: 1 }, htmleditor.get());
  	});

  	return {
  		c: function create() {
  			htmleditor._fragment.c();
  		},

  		m: function mount(target, anchor) {
  			htmleditor._mount(target, anchor);
  			current = true;
  		},

  		p: function update(changed, _ctx) {
  			ctx = _ctx;
  			var htmleditor_changes = {};
  			if (!htmleditor_updating.value && changed.value) {
  				htmleditor_changes.value = ctx.value;
  				htmleditor_updating.value = ctx.value !== void 0;
  			}
  			htmleditor._set(htmleditor_changes);
  			htmleditor_updating = {};
  		},

  		i: function intro(target, anchor) {
  			if (current) return;

  			this.m(target, anchor);
  		},

  		o: function outro(outrocallback) {
  			if (!current) return;

  			if (htmleditor) htmleditor._fragment.o(outrocallback);
  			current = false;
  		},

  		d: function destroy$$1(detach) {
  			htmleditor.destroy(detach);
  		}
  	};
  }

  function App(options) {
  	this._debugName = '<App>';
  	if (!options || !options.target && !options.root) {
  		throw new Error("'target' is a required option");
  	}

  	init(this, options);
  	this._state = assign(data$1(), options.data);
  	if (!('value' in this._state)) console.warn("<App> was created without expected data property 'value'");
  	this._intro = !!options.intro;

  	this._fragment = create_main_fragment$1(this, this._state);

  	if (options.target) {
  		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		this._fragment.c();
  		this._mount(options.target, options.anchor);

  		flush(this);
  	}

  	this._intro = true;
  }

  assign(App.prototype, protoDev);

  App.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  return App;

}());
//# sourceMappingURL=main.js.map
