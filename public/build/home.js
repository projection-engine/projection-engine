
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/app/components/Icon/Icon.svelte generated by Svelte v3.49.0 */

    const file$7 = "src/app/components/Icon/Icon.svelte";

    function create_fragment$7(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "style", /*styles*/ ctx[0]);
    			attr_dev(span, "data-icon", "-");
    			add_location(span, file$7, 4, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*styles*/ 1) {
    				attr_dev(span, "style", /*styles*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, ['default']);
    	let { styles = "" } = $$props;
    	const writable_props = ['styles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ styles });

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [styles, $$scope, slots];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { styles: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get styles() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const offX = 8, offY = 4;
    const LEFT_LIMIT = 0;

    function transformModal(open, modal, button) {
        if (open) {
            modal.style.zIndex = "-1";
            const buttonBoundingRect = button.getBoundingClientRect();
            const halfHeight = buttonBoundingRect.height / 2;
            modal.style.top = (buttonBoundingRect.top + halfHeight) + "px";
            modal.style.left = (buttonBoundingRect.left) + "px";
            modal.style.transform = `translate(0px, ${halfHeight + offY}px)`;

            const modalBoundingRect = modal.getBoundingClientRect();
            const body = document.body.getBoundingClientRect();

            let y = `${halfHeight + offY}px`;
            if (modalBoundingRect.y < 0)
                y = "calc(50% + " + ((-modalBoundingRect.y / 2 - offY + halfHeight) / 2) + "px)";
            if ((buttonBoundingRect.y + modalBoundingRect.height + buttonBoundingRect.height) > body.height)
                y = `calc(-100% - ${halfHeight + offY}px)`;


            let x = "0px";
            if (modalBoundingRect.x < LEFT_LIMIT)
                x = `calc(50% + ${offX}px)`;
            if ((modalBoundingRect.x + modalBoundingRect.width) > body.width)
                x = (body.width - (modalBoundingRect.x + modalBoundingRect.width) - offX) + "px";


            modal.style.transform = `translate(${x}, ${y})`;
            modal.style.zIndex = "9999";
            if(button.firstElementChild)
                button.firstElementChild.setAttribute("data-highlight", "true");
            return
        }
        if(button.firstElementChild)
            button.firstElementChild.setAttribute("data-highlight", "");
    }

    /* src/app/components/dropdown/Dropdown.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/app/components/dropdown/Dropdown.svelte";
    const get_button_slot_changes = dirty => ({});
    const get_button_slot_context = ctx => ({});

    // (55:8) {#if !hideArrow}
    function create_if_block$5(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				styles: `${!/*open*/ ctx[4] ? "transform: rotate(-90deg)" : ""}`,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*open*/ 16) icon_changes.styles = `${!/*open*/ ctx[4] ? "transform: rotate(-90deg)" : ""}`;

    			if (dirty & /*$$scope*/ 4096) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(55:8) {#if !hideArrow}",
    		ctx
    	});

    	return block;
    }

    // (56:12) <Icon styles={`${!open ? "transform: rotate(-90deg)" : ""}`}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("arrow_drop_down");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(56:12) <Icon styles={`${!open ? \\\"transform: rotate(-90deg)\\\" : \\\"\\\"}`}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let span;
    	let t0;
    	let span_style_value;
    	let t1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = !/*hideArrow*/ ctx[2] && create_if_block$5(ctx);
    	const button_slot_template = /*#slots*/ ctx[8].button;
    	const button_slot = create_slot(button_slot_template, ctx, /*$$scope*/ ctx[12], get_button_slot_context);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span = element("span");
    			if (if_block) if_block.c();
    			t0 = space();
    			if (button_slot) button_slot.c();
    			t1 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();

    			attr_dev(span, "style", span_style_value = (/*hideArrow*/ ctx[2]
    			? ""
    			: "display: flex; align-items: center; gap: 4px; ") + /*styles*/ ctx[0]);

    			attr_dev(span, "disabled", /*disabled*/ ctx[1]);
    			add_location(span, file$6, 42, 4, 1176);
    			attr_dev(div0, "class", "modal dropdown");
    			add_location(div0, file$6, 59, 4, 1695);
    			add_location(div1, file$6, 41, 0, 1166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t0);

    			if (button_slot) {
    				button_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[9](span);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[11](div0);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hideArrow*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideArrow*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (button_slot) {
    				if (button_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						button_slot,
    						button_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(button_slot_template, /*$$scope*/ ctx[12], dirty, get_button_slot_changes),
    						get_button_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*hideArrow, styles*/ 5 && span_style_value !== (span_style_value = (/*hideArrow*/ ctx[2]
    			? ""
    			: "display: flex; align-items: center; gap: 4px; ") + /*styles*/ ctx[0])) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				attr_dev(span, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(button_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(button_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (button_slot) button_slot.d(detaching);
    			/*span_binding*/ ctx[9](null);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[11](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['button','default']);
    	let { styles = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { hideArrow = false } = $$props;
    	let { onOpen = () => null } = $$props;
    	let { onClose = () => null } = $$props;
    	let open = false;
    	let modal;
    	let button;

    	function handler(event) {
    		const el = document.elementsFromPoint(event.clientX, event.clientY);
    		let bClicked = false, mClicked = false;

    		el.forEach(element => {
    			if (element === button) bClicked = true;
    			if (element === modal) mClicked = true;
    		});

    		if (!bClicked && !mClicked) {
    			if (onClose && open) onClose();
    			$$invalidate(4, open = false);
    			$$invalidate(5, modal.style.zIndex = "-1", modal);
    		}
    	}

    	onMount(() => {
    		document.addEventListener("mousedown", handler);
    	});

    	onDestroy(() => {
    		document.removeEventListener("mousedown", handler);
    	});

    	const writable_props = ['styles', 'disabled', 'hideArrow', 'onOpen', 'onClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(6, button);
    		});
    	}

    	const click_handler = () => {
    		if (!open) {
    			if (onOpen) onOpen();
    			$$invalidate(4, open = true);
    		}
    	};

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(5, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('hideArrow' in $$props) $$invalidate(2, hideArrow = $$props.hideArrow);
    		if ('onOpen' in $$props) $$invalidate(3, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(7, onClose = $$props.onClose);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		transformModal,
    		onDestroy,
    		onMount,
    		styles,
    		disabled,
    		hideArrow,
    		onOpen,
    		onClose,
    		open,
    		modal,
    		button,
    		handler
    	});

    	$$self.$inject_state = $$props => {
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ('hideArrow' in $$props) $$invalidate(2, hideArrow = $$props.hideArrow);
    		if ('onOpen' in $$props) $$invalidate(3, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(7, onClose = $$props.onClose);
    		if ('open' in $$props) $$invalidate(4, open = $$props.open);
    		if ('modal' in $$props) $$invalidate(5, modal = $$props.modal);
    		if ('button' in $$props) $$invalidate(6, button = $$props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*modal, button, open*/ 112) {
    			modal && button
    			? transformModal(open, modal, button)
    			: null;
    		}
    	};

    	return [
    		styles,
    		disabled,
    		hideArrow,
    		onOpen,
    		open,
    		modal,
    		button,
    		onClose,
    		slots,
    		span_binding,
    		click_handler,
    		div0_binding,
    		$$scope
    	];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			styles: 0,
    			disabled: 1,
    			hideArrow: 2,
    			onOpen: 3,
    			onClose: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get styles() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styles(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideArrow() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideArrow(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpen() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpen(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ROUTES =  {
        OPEN_NEW_WINDOW: "OPEN_NEW_WINDOW",
        CLOSE_NEW_WINDOW: "_CLOSE",
        ON_NEW_WINDOW: "_NEW_WINDOW_PROPS",
        PAGE_PROPS: "LOAD_PAGE_PROPS",
        LOAD_PROJECT: "_PROJECT",
        SWITCH_MAIN_WINDOW: "SWITCH_MAIN_WINDOW"
    };
    ROUTES.OPEN_NEW_WINDOW;
    ROUTES.CLOSE_NEW_WINDOW;
    ROUTES.ON_NEW_WINDOW;
    ROUTES.PAGE_PROPS;
    ROUTES.LOAD_PROJECT;
    ROUTES.SWITCH_MAIN_WINDOW;

    var img = "data:image/png;base64,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";

    /* src/app/components/window-frame/WindowFrame.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/app/components/window-frame/WindowFrame.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (26:8) {#if label}
    function create_if_block_8(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*label*/ ctx[2]);
    			attr_dev(span, "class", "" + (null_to_empty("title") + " svelte-1jfk00v"));
    			add_location(span, file$5, 26, 12, 795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) set_data_dev(t, /*label*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(26:8) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let t0;
    	let t1_value = /*option*/ ctx[9].label + "";
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*option*/ ctx[9].icon && create_if_block_7(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(button, "class", "" + (null_to_empty("button") + " svelte-1jfk00v"));
    			add_location(button, file$5, 55, 20, 2184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*option*/ ctx[9].onClick)) /*option*/ ctx[9].onClick.apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*option*/ ctx[9].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*options*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*options*/ 8) && t1_value !== (t1_value = /*option*/ ctx[9].label + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(55:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:16) {#if option.options}
    function create_if_block_4(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				class: "button",
    				style: "padding-right: 0",
    				$$slots: {
    					header: [create_header_slot],
    					default: [create_default_slot_3$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, options*/ 32776) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(33:16) {#if option.options}",
    		ctx
    	});

    	return block;
    }

    // (30:12) {#if option.divider}
    function create_if_block_3$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "" + (null_to_empty("divider") + " svelte-1jfk00v"));
    			add_location(div, file$5, 30, 16, 929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(30:12) {#if option.divider}",
    		ctx
    	});

    	return block;
    }

    // (57:24) {#if option.icon}
    function create_if_block_7(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				styles: { fontSize: "1.1rem" },
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope, options*/ 32776) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(57:24) {#if option.icon}",
    		ctx
    	});

    	return block;
    }

    // (58:28) <Icon styles={{fontSize: "1.1rem"}}>
    function create_default_slot_4$1(ctx) {
    	let t_value = /*option*/ ctx[9].icon + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 8 && t_value !== (t_value = /*option*/ ctx[9].icon + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(58:28) <Icon styles={{fontSize: \\\"1.1rem\\\"}}>",
    		ctx
    	});

    	return block;
    }

    // (39:28) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let div;
    	let t0;
    	let t1_value = /*option*/ ctx[9].label + "";
    	let t1;
    	let button_disabled_value;
    	let mounted;
    	let dispose;
    	let if_block = /*subOption*/ ctx[12].icon && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(div, "class", "" + (null_to_empty("icon-container") + " svelte-1jfk00v"));
    			add_location(div, file$5, 44, 36, 1710);
    			attr_dev(button, "class", "" + (null_to_empty("option-button") + " svelte-1jfk00v"));
    			button.disabled = button_disabled_value = /*subOption*/ ctx[12].disabled;
    			add_location(button, file$5, 39, 32, 1427);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			if (if_block) if_block.m(div, null);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*subOption*/ ctx[12].onClick)) /*subOption*/ ctx[12].onClick.apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*subOption*/ ctx[12].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*options*/ 8 && t1_value !== (t1_value = /*option*/ ctx[9].label + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*options*/ 8 && button_disabled_value !== (button_disabled_value = /*subOption*/ ctx[12].disabled)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(39:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:28) {#if subOption.divider}
    function create_if_block_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "" + (null_to_empty("vert-divider") + " svelte-1jfk00v"));
    			add_location(div, file$5, 37, 32, 1324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(37:28) {#if subOption.divider}",
    		ctx
    	});

    	return block;
    }

    // (46:40) {#if subOption.icon}
    function create_if_block_6(ctx) {
    	let t_value = /*option*/ ctx[9].icon + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 8 && t_value !== (t_value = /*option*/ ctx[9].icon + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(46:40) {#if subOption.icon}",
    		ctx
    	});

    	return block;
    }

    // (36:24) {#each option.options as subOption}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*subOption*/ ctx[12].divider) return create_if_block_5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(36:24) {#each option.options as subOption}",
    		ctx
    	});

    	return block;
    }

    // (34:20) <Dropdown class={"button"} style={"padding-right: 0"}>
    function create_default_slot_3$2(ctx) {
    	let t;
    	let each_value_1 = /*option*/ ctx[9].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 8) {
    				each_value_1 = /*option*/ ctx[9].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(34:20) <Dropdown class={\\\"button\\\"} style={\\\"padding-right: 0\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (35:24) <svelte:fragment slot="header">
    function create_header_slot(ctx) {
    	let t_value = /*option*/ ctx[9].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 8 && t_value !== (t_value = /*option*/ ctx[9].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(35:24) <svelte:fragment slot=\\\"header\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#each options as option}
    function create_each_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_if_block_4, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*option*/ ctx[9].divider) return 0;
    		if (/*option*/ ctx[9].options) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(29:8) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (68:8) {#if pageInfo.minimizeEvent}
    function create_if_block_2$1(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "" + (null_to_empty("action-button") + " svelte-1jfk00v"));
    			attr_dev(button, "style", "--pj-accent-color: #0095ff");
    			add_location(button, file$5, 68, 12, 2649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(68:8) {#if pageInfo.minimizeEvent}",
    		ctx
    	});

    	return block;
    }

    // (79:16) <Icon styles="font-size: 1.1rem">
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("minimize");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(79:16) <Icon styles=\\\"font-size: 1.1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (82:8) {#if pageInfo.maximizeEvent}
    function create_if_block_1$1(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 1rem",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "" + (null_to_empty("action-button") + " svelte-1jfk00v"));
    			attr_dev(button, "style", "--pj-accent-color: #0095ff");
    			add_location(button, file$5, 82, 12, 3184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(82:8) {#if pageInfo.maximizeEvent}",
    		ctx
    	});

    	return block;
    }

    // (93:16) <Icon styles="font-size: 1rem">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("check_box_outline_blank");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(93:16) <Icon styles=\\\"font-size: 1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#if pageInfo.closeEvent}
    function create_if_block$4(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "" + (null_to_empty("action-button") + " svelte-1jfk00v"));
    			attr_dev(button, "style", "--pj-accent-color: red");
    			add_location(button, file$5, 96, 12, 3729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(96:8) {#if pageInfo.closeEvent}",
    		ctx
    	});

    	return block;
    }

    // (107:16) <Icon styles="font-size: 1.1rem">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(107:16) <Icon styles=\\\"font-size: 1.1rem\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div4;
    	let div1;
    	let button;
    	let div0;
    	let img$1;
    	let img_src_value;
    	let t0;
    	let t1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let t4;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*label*/ ctx[2] && create_if_block_8(ctx);
    	let each_value = /*options*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block1 = /*pageInfo*/ ctx[1].minimizeEvent && create_if_block_2$1(ctx);
    	let if_block2 = /*pageInfo*/ ctx[1].maximizeEvent && create_if_block_1$1(ctx);
    	let if_block3 = /*pageInfo*/ ctx[1].closeEvent && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			button = element("button");
    			div0 = element("div");
    			img$1 = element("img");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			if (if_block3) if_block3.c();
    			if (!src_url_equal(img$1.src, img_src_value = img)) attr_dev(img$1, "src", img_src_value);
    			attr_dev(img$1, "alt", "LOGO");
    			attr_dev(img$1, "class", "" + (null_to_empty("logo") + " svelte-1jfk00v"));
    			add_location(img$1, file$5, 22, 16, 680);
    			attr_dev(div0, "class", "" + (null_to_empty("logo-wrapper") + " svelte-1jfk00v"));
    			add_location(div0, file$5, 21, 12, 635);
    			button.disabled = /*logoAction*/ ctx[0];
    			attr_dev(button, "class", "" + (null_to_empty("logo-button") + " svelte-1jfk00v"));
    			add_location(button, file$5, 16, 8, 459);
    			attr_dev(div1, "class", "" + (null_to_empty("options") + " svelte-1jfk00v"));
    			add_location(div1, file$5, 15, 4, 427);
    			attr_dev(div2, "class", "" + (null_to_empty("draggable") + " svelte-1jfk00v"));
    			add_location(div2, file$5, 65, 4, 2533);
    			attr_dev(div3, "class", "" + (null_to_empty("action-wrapper") + " svelte-1jfk00v"));
    			add_location(div3, file$5, 66, 4, 2569);
    			attr_dev(div4, "class", "" + (null_to_empty("wrapper") + " svelte-1jfk00v"));
    			add_location(div4, file$5, 14, 0, 399);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, button);
    			append_dev(button, div0);
    			append_dev(div0, img$1);
    			append_dev(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t4);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block3) if_block3.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*logoAction*/ 1) {
    				prop_dev(button, "disabled", /*logoAction*/ ctx[0]);
    			}

    			if (/*label*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*options*/ 8) {
    				each_value = /*options*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*pageInfo*/ ctx[1].minimizeEvent) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*pageInfo*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*pageInfo*/ ctx[1].maximizeEvent) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*pageInfo*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, t5);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*pageInfo*/ ctx[1].closeEvent) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*pageInfo*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$4(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WindowFrame', slots, []);
    	const { ipcRenderer } = window.require("electron");
    	let { logoAction = false } = $$props;
    	let { pageInfo = {} } = $$props;
    	let { label = "" } = $$props;
    	let { options = [] } = $$props;
    	const writable_props = ['logoAction', 'pageInfo', 'label', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WindowFrame> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW);

    	const click_handler_1 = () => {
    		if (typeof pageInfo.minimizeEvent === "function") pageInfo.minimizeEvent(); else ipcRenderer.send(pageInfo.minimizeEvent);
    	};

    	const click_handler_2 = () => {
    		if (typeof pageInfo.maximizeEvent === "function") pageInfo.maximizeEvent(); else ipcRenderer.send(pageInfo.maximizeEvent);
    	};

    	const click_handler_3 = () => {
    		if (typeof pageInfo.closeEvent === "function") pageInfo.closeEvent(); else ipcRenderer.send(pageInfo.closeEvent);
    	};

    	$$self.$$set = $$props => {
    		if ('logoAction' in $$props) $$invalidate(0, logoAction = $$props.logoAction);
    		if ('pageInfo' in $$props) $$invalidate(1, pageInfo = $$props.pageInfo);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		Dropdown,
    		Icon,
    		ROUTES,
    		ipcRenderer,
    		logo: img,
    		logoAction,
    		pageInfo,
    		label,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('logoAction' in $$props) $$invalidate(0, logoAction = $$props.logoAction);
    		if ('pageInfo' in $$props) $$invalidate(1, pageInfo = $$props.pageInfo);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		logoAction,
    		pageInfo,
    		label,
    		options,
    		ipcRenderer,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class WindowFrame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			logoAction: 0,
    			pageInfo: 1,
    			label: 2,
    			options: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WindowFrame",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get logoAction() {
    		throw new Error("<WindowFrame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logoAction(value) {
    		throw new Error("<WindowFrame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageInfo() {
    		throw new Error("<WindowFrame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageInfo(value) {
    		throw new Error("<WindowFrame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<WindowFrame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<WindowFrame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<WindowFrame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<WindowFrame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class EnglishLocalization {
        static HOME = {
            HOME: {
                DELETE: "Deleting project",
                RENAME: "Project renamed",
                RENAME_ERROR: "Error renaming project",
                LOADING: "Loading projects",
                TITLE: "Projection Engine",
                PROJECTS: "Your projects",
                CREATE: "New project",
                EMPTY: "No projects found",
                SEARCH: "Search",
                PROJECT_CREATED: "Project created"
            },

            CARD: {
                NEW_NAME: "New name",
                DELETE: "Delete",
                SHOW_IN_EXPLORER: "Show in explorer",
                NEVER: "Never",
                PROJECT: "Project",
                LAST_MODIFIED: "Last modified",
                CREATION: "Creation date",
                RECENT: "Recent"
            },

        }
        static HELP = {
            MAIN: {
                TITLE: "Projection Engine",
                CLOSE: "Close",
                BODY: `
            <strong>
            	v1.1.0 Alpha
			</strong>
			<br>
            <div>2022 | Gustavo Roque</div>
            `
            }
        }
        static SETTINGS = {
            MAIN: {
                TITLE: "Preferences"
            }
        }
        static PROJECT = {
            VIEWPORT: {
                CAMERA: "Camera",
                TITLE: "Viewport",
                ACTIVE_ENTITY: "Active Entity",
                DELETE_VIEW: "Delete view",
                NEW_TAB: "New Tab",
                POINT_LIGHT: "Point Light",
                DIRECTIONAL_LIGHT: "Directional Light",
                SPOT_LIGHT: "SpotLight",
                SPECULAR_PROBE: "Specular Probe",
                DIFFUSE_PROBE: "Diffuse Probe",
                UTILS: "Utils",
                AMBIENT: "Ambient",
                LIGHTS: "Lights",
                TOP: "Top",
                LEFT: "Left",
                RIGHT: "Right",
                BOTTOM: "Bottom",
                FRONT: "Front",
                BACK: "Back",
                SWITCH_PROJECTION: "Switch between last Ortho/Perspective",
                DRAG_X_ZOOM: "Drag X to zoom in/out",
                DRAG_X_DIR: "- Drag X to move forward/backwards",
                DRAG_Y_DIR: "- Drag Y to move up/down",
                DOUBLE_CLICK: "- Double click to center",
                VISIBLE: "Visible",
                GRID: "Grid",
                ICONS: "Icons",
                FPS: "Frames per second",
                CAM_ANIM: "Camera Animations",
                ICON_SIZE: "Icon size",
                SHADING_LIGHT: "Light only",
                SHADING_UNLIT: "Unlit",
                SHADING_NORMAL: "Normals",
                SHADING_DEPTH: "Scene Depth",
                SHADING_AO: "Ambient Occlusion",
                SHADING_DETAIL: "Details",
                SHADING_SWITCH: "Switching to details shading model",
                FAR: "Far",
                NEAR: "Near",
                FOV: "Field Of View",
                ZOOM: "Zoom",
                TRANSLATION_GRID: "Translation grid",
                SCALE_GRID: "Scale grid",
                ROTATION_GRID: "Rotation Grid",
                SELECTION: "Selection",
                CURSOR: "3D Cursor",
                T_GIZMO: "Translation gizmo",
                R_GIZMO: "Rotation gizmo",
                S_GIZMO: "Scale gizmo",
                BACKGROUND: "Background"
            },
            HIERARCHY: {
                TITLE: "Hierarchy",
                NEW_FOLDER: "New Folder"
            },
            CONSOLE: {
                TITLE: "Console",
                CLEAR: "Clear"
            },
            SHADER_EDITOR: {
                TITLE: "Shader Editor",
                SAVE: "Save",
                COMPILE: "Compile",
                SELECT: "Select",
                ALL: "All",
                NONE: "None",
                INVERT: "Invert",
                GRID: "Toggle movement grid",
                NAME: "Name",
                INFORMATION: "Information",
                NEEDS_COMPILATION: "Please compile the shader.",
                ERRORS: "Errors",
                NO_ERRORS: "No errors were found.",
                NODE: "Node",
                STATUS: "Status",
                SOURCE: "Source code"
            },
            COMPONENT_EDITOR: {
                ENABLED: "Enabled",
                RENDERING: "Rendering features",
                POST_PROCESSING: "Editor post-processing",
                TITLE: "Component editor",
                SCRIPTS: "Scripts",
                ORTHO_PROJECTION: "Orthographic projection",
                PROJECTION_SIZE: "Orthographic size",
                FOV: "Field Of View",
                VIEW_PLANES: "View Planes",
                FAR: "Far",
                NEAR: "Near",
                ENTITY_NAME: "Entity Name"
            },
            FILES: {
                TITLE: "Content Browser",
                EMPTY: "Empty folder",
                SELECT_ALL: "Select all",
                SELECT_NONE: "Select none",
                SELECT_INVERT: "Invert selection",
                BACK: "Back",
                DELETE: "Delete",

                CUT: "Cut",
                PASTE: "Paste",
                RENAME: "Rename",
                NEW_FOLDER: "New Folder",
                OPEN_WITH_EXPLORER: "Open with explorer",
                FORWARD: "Forward",
                REFRESH: "Refresh",
                REFRESHING: "Refreshing files",
                GO_TO_PARENT: "Go to parent",
                NEW_SCRIPT: "New Script",
                NEW_MATERIAL: "New Material",

                ASSETS: "Assets",
                BOOKMARKS: "Bookmarks",
                IMPORT: "Import",
                SIDE_BAR: "Sidebar",
                OPTIONS: "Navigation options",
                VIEW: "View",
                BACK_DIR: "Action: Go back",
                FORWARD_DIR: "Action: Go forward",
                PARENT_DIR: "Action: Go to parent",
                CREATE_FOLDER: "Create folder",
                ADD_BOOKMARK: "Add folder to bookmarks",
                FILTER_TYPE: "Filter by file type"
            }
        }
        static COMPONENTS = {
            COLOR_PICKER: {
                CANCEL: "Cancel",
                ACCEPT: "Ok"
            },
            SEARCH: {
                SEARCH: "Search"
            },
            SELECTOR: {
                EMPTY: "Empty",
                NOTHING: "Nothing found",
                DEFAULT_MATERIAL: "Default material",
                REMOVE_SCRIPT: "Remove script"
            },
            VIEWS: {
                CLOSE: "Close",
                HIERARCHY: "Hierarchy",
                COMP_EDITOR: "Component Editor",
                CONTENT_BROWSER: "Content Browser",
                SHADER_EDITOR: "Shader Editor",
                CONSOLE: "Console"
            }
        }

    }

    /* src/app/components/input/Input.svelte generated by Svelte v3.49.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src/app/components/input/Input.svelte";
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (37:4) {#if $$slots.icon}
    function create_if_block$3(ctx) {
    	let div;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[14].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[13], get_icon_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			attr_dev(div, "class", "icon-wrapper svelte-16gq4f2");
    			add_location(div, file$4, 37, 8, 989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[13], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(37:4) {#if $$slots.icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t;
    	let input_1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*$$slots*/ ctx[11].icon && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			input_1 = element("input");
    			attr_dev(input_1, "placeholder", /*placeholder*/ ctx[6]);
    			attr_dev(input_1, "class", "input svelte-16gq4f2");
    			add_location(input_1, file$4, 41, 4, 1077);
    			attr_dev(div, "class", "wrapper svelte-16gq4f2");
    			set_style(div, "width", /*width*/ ctx[0]);
    			set_style(div, "height", /*height*/ ctx[1]);
    			set_style(div, "padding", /*noPadding*/ ctx[3] ? 0 : "initial");
    			add_location(div, file$4, 32, 0, 848);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			append_dev(div, input_1);
    			/*input_1_binding*/ ctx[15](input_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_handler*/ ctx[16], false, false, false),
    					listen_dev(input_1, "blur", /*blur_handler*/ ctx[17], false, false, false),
    					listen_dev(input_1, "keydown", /*keydown_handler*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$$slots*/ ctx[11].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*placeholder*/ 64) {
    				attr_dev(input_1, "placeholder", /*placeholder*/ ctx[6]);
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1]);
    			}

    			if (!current || dirty & /*noPadding*/ 8) {
    				set_style(div, "padding", /*noPadding*/ ctx[3] ? 0 : "initial");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*input_1_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const DELAY = 250, ENTER = "Enter";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, ['icon']);
    	const $$slots = compute_slots(slots);
    	let { width = "initial" } = $$props;
    	let { height = "initial" } = $$props;
    	let { onBlur = () => null } = $$props;
    	let { noPadding = false } = $$props;
    	let { setSearchString = () => null } = $$props;
    	let { searchString = "" } = $$props;
    	let { noAutoSubmit = false } = $$props;
    	let { placeholder = "" } = $$props;
    	let { onEnter = () => null } = $$props;
    	let changed = false;
    	let timeout, input;

    	const onChange = input => {
    		clearTimeout(timeout);

    		timeout = setTimeout(
    			() => {
    				setSearchString(input.value);
    				$$invalidate(8, changed = false);
    			},
    			DELAY
    		);
    	};

    	const updateInput = (s = searchString) => {
    		if (s) $$invalidate(9, input.value = s, input);
    	};

    	onMount(updateInput);

    	const writable_props = [
    		'width',
    		'height',
    		'onBlur',
    		'noPadding',
    		'setSearchString',
    		'searchString',
    		'noAutoSubmit',
    		'placeholder',
    		'onEnter'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(9, input);
    		});
    	}

    	const input_handler = e => {
    		$$invalidate(8, changed = true);
    		if (!noAutoSubmit) onChange(e.target);
    	};

    	const blur_handler = e => {
    		console.log(changed);
    		if (onBlur) onBlur(changed, e.currentTarget.value);
    	};

    	const keydown_handler = e => {
    		if (e.code === ENTER) {
    			setSearchString(e.target.value);
    			onEnter(e.target.value);
    			$$invalidate(8, changed = false);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('onBlur' in $$props) $$invalidate(2, onBlur = $$props.onBlur);
    		if ('noPadding' in $$props) $$invalidate(3, noPadding = $$props.noPadding);
    		if ('setSearchString' in $$props) $$invalidate(4, setSearchString = $$props.setSearchString);
    		if ('searchString' in $$props) $$invalidate(12, searchString = $$props.searchString);
    		if ('noAutoSubmit' in $$props) $$invalidate(5, noAutoSubmit = $$props.noAutoSubmit);
    		if ('placeholder' in $$props) $$invalidate(6, placeholder = $$props.placeholder);
    		if ('onEnter' in $$props) $$invalidate(7, onEnter = $$props.onEnter);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		onMount,
    		DELAY,
    		ENTER,
    		width,
    		height,
    		onBlur,
    		noPadding,
    		setSearchString,
    		searchString,
    		noAutoSubmit,
    		placeholder,
    		onEnter,
    		changed,
    		timeout,
    		input,
    		onChange,
    		updateInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('onBlur' in $$props) $$invalidate(2, onBlur = $$props.onBlur);
    		if ('noPadding' in $$props) $$invalidate(3, noPadding = $$props.noPadding);
    		if ('setSearchString' in $$props) $$invalidate(4, setSearchString = $$props.setSearchString);
    		if ('searchString' in $$props) $$invalidate(12, searchString = $$props.searchString);
    		if ('noAutoSubmit' in $$props) $$invalidate(5, noAutoSubmit = $$props.noAutoSubmit);
    		if ('placeholder' in $$props) $$invalidate(6, placeholder = $$props.placeholder);
    		if ('onEnter' in $$props) $$invalidate(7, onEnter = $$props.onEnter);
    		if ('changed' in $$props) $$invalidate(8, changed = $$props.changed);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    		if ('input' in $$props) $$invalidate(9, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*searchString*/ 4096) {
    			updateInput(searchString);
    		}
    	};

    	return [
    		width,
    		height,
    		onBlur,
    		noPadding,
    		setSearchString,
    		noAutoSubmit,
    		placeholder,
    		onEnter,
    		changed,
    		input,
    		onChange,
    		$$slots,
    		searchString,
    		$$scope,
    		slots,
    		input_1_binding,
    		input_handler,
    		blur_handler,
    		keydown_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			width: 0,
    			height: 1,
    			onBlur: 2,
    			noPadding: 3,
    			setSearchString: 4,
    			searchString: 12,
    			noAutoSubmit: 5,
    			placeholder: 6,
    			onEnter: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get width() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onBlur() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onBlur(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noPadding() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noPadding(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setSearchString() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setSearchString(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchString() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchString(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noAutoSubmit() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noAutoSubmit(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const {ipcRenderer: ipcRenderer$1} = window.require("electron");

    function getCall(channel, data) {
        return new Promise(resolve => {
            const listenID = v4().toString();
            ipcRenderer$1.once(channel + "-" + listenID, (ev, data) => {
                resolve(data);
            });
            ipcRenderer$1.send(channel, {...data, listenID});
        })
    }

    class AsyncFS {

        static async read(path, options = {}) {
            return (await getCall("fs-read", {path, options}))
        }

        static async write(path, data) {
            return (await getCall("fs-write", {path, data}))
        }

        static async rm(path, options = {}) {
            return (await getCall("fs-rm", {path, options}))
        }

        static async mkdir(path) {
            return (await getCall("fs-mkdir", {path}))
        }

        static async stat(path, options = {}) {
            return (await getCall("fs-stat", {path, options}))
        }

        static async exists(path) {
            return (await getCall("fs-exists", {path}))
        }

        static async readdir(path, options) {
            return (await getCall("fs-readdir", {path, options}))
        }

        static async lstat(path, options) {
            return (await getCall("fs-lstat", {path, options}))
        }

        static async rename(oldPath, newPath) {
            return (await getCall("fs-rename", {oldPath, newPath}))
        }
    }

    var IMAGE_WORKER_ACTIONS = {
        IMAGE_BITMAP: "0",
        COLOR_TO_IMAGE: "1",
        RESIZE_IMAGE: "2",
        NOISE_DATA: "3",
        TARGET_ICON: "DEV"
    };

    const pathRequire = window.require("path");
    const {ipcRenderer} = window.require("electron");

    class FileSystem {
        static sep = pathRequire.sep
        static registry = []

        static fixPath(p){
            return pathRequire.resolve(p)
        }

        constructor(projectID) {
            this.path = (localStorage.getItem("basePath") + "projects" + FileSystem.sep + projectID);
            this.temp = localStorage.getItem("basePath") + "temp";

            new Promise(async resolve => {
                await AsyncFS.mkdir(this.temp);
                if (!await AsyncFS.exists(this.path + FileSystem.sep + "previews")) await AsyncFS.mkdir(this.path + FileSystem.sep + "previews");
                if (!await AsyncFS.exists(this.path + FileSystem.sep + "assets")) await AsyncFS.mkdir(this.path + FileSystem.sep + "assets");
                if (!await AsyncFS.exists(this.path + FileSystem.sep + "assetsRegistry")) await AsyncFS.mkdir(this.path + FileSystem.sep + "assetsRegistry");
                if (!await AsyncFS.exists(this.path + FileSystem.sep + "logic")) await AsyncFS.mkdir(this.path + FileSystem.sep + "logic");

                resolve();
            }).catch(err => console.error(err));
        }

        async writeFile(pathName, data, absolute) {
            const result = await AsyncFS.write(FileSystem.resolvePath(!absolute ? this.path + pathName : pathName), typeof data === "object" ? JSON.stringify(data) : data);

            if(result[0])
                throw Error(result[0])
        }

        async readFile(pathName, type) {
            return await new Promise(resolve => {
                const listenID = v4().toString();
                ipcRenderer.once("read-file-" + listenID, (ev, data) => resolve(data));
                ipcRenderer.send("read-file", {pathName, type, listenID});
            })
        }

        async findRegistry(p) {
            const [, res] = await AsyncFS.readdir(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry"));
            if (res) {
                const registryData = await Promise.all(res.map(data => this.readRegistryFile(data.replace(".reg", ""))));
                const parsedPath = pathRequire.resolve(p);
                return registryData.filter(f => f !== undefined).find(f => parsedPath.includes(f.path))
            }
        }

        async deleteFile(pathName, options) {
            const p = pathName.replaceAll(FileSystem.sep + FileSystem.sep, FileSystem.sep);
            const currentPath = this.path + FileSystem.sep + p;
            for(let i = 0; i < FileSystem.registry.length; i++){
                const r = FileSystem.registry[i];
                const rPath = "assets" +FileSystem.sep + r.path;
                if(rPath.includes(p))
                    await AsyncFS.rm(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + r.id + ".reg"));
            }
            await AsyncFS.rm(currentPath, options);
            
            const rs = await this.findRegistry(currentPath);
            if (rs) await AsyncFS.rm(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + rs.id + ".reg"));
        }

        async openDialog() {
            return await new Promise(resolve => {
                const listenID = v4().toString();
                ipcRenderer.once("dialog-response-" + listenID, (ev, data) => {
                    resolve(data);
                });
                ipcRenderer.send("open-file-dialog", {listenID});
            })
        }

        async importFile(targetDir, filesToLoad) {
            let result = [];
            for (let i = 0; i < filesToLoad.length; i++) {
                const filePath = filesToLoad[i];
                const name = filePath.split(pathRequire.sep).pop();

                const newRoot = targetDir + pathRequire.sep + name.split(".")[0];
                const fileID = v4();
                const type = filePath.split(/\.([a-zA-Z0-9]+)$/)[1];
                switch (type) {
                case "png":
                case "jpg":
                case "jpeg": {
                    if(!(await AsyncFS.exists(newRoot + ".pimg"))) {
                        const res = `data:image/${type};base64,` + (await this.readFile(filePath, "base64"));
                        if (res) {
                            await AsyncFS.write(newRoot + ".pimg", res);
                            const reduced = await window.imageWorker(IMAGE_WORKER_ACTIONS.RESIZE_IMAGE, {
                                image: res,
                                width: 256,
                                height: 256
                            });
                            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "previews" + FileSystem.sep + fileID + ".preview"), reduced);
                            await this.createRegistryEntry(fileID, newRoot.replace(this.path + FileSystem.sep + "assets" + FileSystem.sep, "") + ".pimg");
                        }
                        else
                            alert.pushAlert("Error importing image", "error");
                    }
                    else
                        alert.pushAlert("Image already exists", "error");
                    break
                }
                case "gltf":
                    result.push({
                        file: name.split(".")[0],
                        ids: await new Promise(resolve => {
                            const listenID = v4().toString();
                            ipcRenderer.once("import-gltf-" + listenID, (ev, data) => {
                                resolve(data);
                            });

                            ipcRenderer.send("import-gltf", {
                                filePath: filePath,
                                newRoot,
                                options: {},
                                projectPath: this.path,
                                listenID,
                                fileName: filePath.split(pathRequire.sep).pop()
                            });
                        })
                    });
                    break
                }
            }
            return result
        }

        async createRegistryEntry(fID = v4(), path) {
            const pathRe = FileSystem.resolvePath(this.path + FileSystem.sep + "assets");
            const p = FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path).replace(pathRe, "");
            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + fID + ".reg"), JSON.stringify({
                id: fID, path: p
            }));
        }

        async readRegistryFile(id) {
            try {
                return await this.readFile(FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry" + FileSystem.sep + id + ".reg"), "json")
            } catch (e) {
                return null
            }
        }

        async assetExists(path) {
            return await AsyncFS.exists(FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path))
        }

        async writeAsset(path, fileData, previewImage, registryID) {
            const fileID = registryID !== undefined ? registryID : v4();
            await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "assets" + FileSystem.sep + path), fileData);
            if (previewImage)
                await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + "previews" + FileSystem.sep + registryID + ".preview"), previewImage);
            await this.createRegistryEntry(fileID, path);
        }


        async updateAsset(registryID, fileData, previewImage) {
            const res = await this.readRegistryFile(registryID);
            if(res)
                await this.writeAsset(res.path, fileData, previewImage, registryID);
            else
                throw Error("Not found")
        }

        async deleteEntity(entityID) {
            await this.deleteFile("logic" + FileSystem.sep + entityID + ".entity");
        }

        async updateEntity(entity, id) {
            const p = FileSystem.resolvePath(this.path + FileSystem.sep + "logic");
            await AsyncFS.write(FileSystem.resolvePath(p + FileSystem.sep  +id + ".entity"), entity);
        }

        async updateProject(meta, settings) {
            if (meta) await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + ".meta"), JSON.stringify(meta));
            if (settings) {
                let sett = {...settings};
                delete sett.type;
                delete sett.data;
                await AsyncFS.write(FileSystem.resolvePath(this.path + FileSystem.sep + ".settings"), JSON.stringify(sett));
            }
        }

        async fromDirectory(startPath, extension) {
            if (!(await AsyncFS.exists(startPath))) return []
            let res = [];
            let files = (await AsyncFS.readdir(startPath))[1];
            for (let i = 0; i < files.length; i++) {
                const filename = pathRequire.join(startPath, files[i]);
                const stat = (await AsyncFS.lstat(filename))[1];
                if (stat.isDirectory) {
                    res.push(...(await this.fromDirectory(filename, extension)));
                } else if (filename.indexOf(extension) >= 0) res.push(files[i]);
            }
            return res
        }

        async foldersFromDirectory(startPath) {
            if (!(await AsyncFS.exists(startPath))) return []
            let res = [];
            let files = (await AsyncFS.readdir(startPath))[1];
            for (let i = 0; i < files.length; i++) {
                const filename = pathRequire.join(startPath, files[i]);
                const stat = (await AsyncFS.lstat(filename))[1];

                if (stat.isDirectory) res.push(filename);
            }
            return res
        }

        async rename(from, to) {
            const fromResolved = pathRequire.resolve(from);
            let newRegistry = await this.readRegistry();
            return new Promise(async rootResolve => {
                const stat = (await AsyncFS.lstat(fromResolved))[1];
                if (stat !== undefined && stat.isDirectory) {
                    await AsyncFS.mkdir(to);
                    const [error, res] = await AsyncFS.readdir(fromResolved);
                    if (res) {

                        for (let i in res) {
                            const file = res[i];
                            const oldPath = fromResolved + FileSystem.sep + `${file}`;
                            const newPath = to + FileSystem.sep + `${file}`;
                            if ((await AsyncFS.lstat(oldPath))[1].isDirectory) {
                                await this.rename(oldPath, newPath);
                            } else {
                                await AsyncFS.rename(oldPath, newPath);
                                await this.updateRegistry(oldPath, newPath, newRegistry);
                            }
                        }
                        await AsyncFS.rm(fromResolved, {recursive: true, force: true});
                        rootResolve();
                    } else rootResolve(error);
                } else if (stat !== undefined) {
                    await AsyncFS.rename(fromResolved, to);
                    await this.updateRegistry(from, to, newRegistry);
                    rootResolve();
                } else rootResolve();
            })

        }


        async readRegistry() {
            const promise = await new Promise(resolve => {
                const listenID = v4().toString();
                ipcRenderer.once("read-registry-" + listenID, (ev, data) => {
                    resolve(data);
                });
                ipcRenderer.send("read-registry", {pathName: FileSystem.resolvePath(this.path + FileSystem.sep + "assetsRegistry"), listenID});
            });
            FileSystem.registry = promise;
            return promise
        }

        async updateRegistry(from, to, registryData) {
            const assetsResolved = pathRequire.resolve(this.path + FileSystem.sep + "assets");
            const fromResolved = pathRequire.resolve(from).replace(assetsResolved, "");
            const toResolved = pathRequire.resolve(to);
            const registryFound = registryData.find(reg => {
                const regResolved = pathRequire.resolve(this.path + FileSystem.sep + "assets" + FileSystem.sep + reg.path).replace(assetsResolved, "");
                return regResolved === fromResolved
            });
            if (registryFound) await AsyncFS.write(registryFound.registryPath, JSON.stringify({
                id: registryFound.id, path: toResolved.replace(assetsResolved, "")
            }));
        }


        static async createProject(name) {

            const projectID = v4(),
                projectPath = localStorage.getItem("basePath") + "projects" + FileSystem.sep + projectID;
            if (!(await AsyncFS.exists(FileSystem.resolvePath(localStorage.getItem("basePath") + "projects")))) await AsyncFS.mkdir(FileSystem.resolvePath(localStorage.getItem("basePath") + "projects"));
            const [err] = await AsyncFS.mkdir(projectPath);
            if(!err) {
                await AsyncFS.write(FileSystem.resolvePath(projectPath + FileSystem.sep + ".meta"), JSON.stringify({
                    id: projectID, name: name, creationDate: new Date().toDateString()
                }));
            }
            return projectID
        }

        static resolvePath(path) {
            return pathRequire.resolve(path)
        }

    }

    /* src/app/windows/home/components/Card.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/app/windows/home/components/Card.svelte";

    // (48:8) {:else}
    function create_else_block$1(ctx) {
    	let strong;
    	let t;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			t = text(/*name*/ ctx[4]);
    			add_location(strong, file$3, 48, 12, 1450);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 16) set_data_dev(t, /*name*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(48:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if openForChange}
    function create_if_block$2(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				placeholder: /*data*/ ctx[1].meta.name,
    				value: /*name*/ ctx[4],
    				width: "200%",
    				setSearchString: /*func*/ ctx[8],
    				onBlur: /*func_1*/ ctx[9],
    				onEnter: /*func_2*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*data*/ 2) input_changes.placeholder = /*data*/ ctx[1].meta.name;
    			if (dirty & /*name*/ 16) input_changes.value = /*name*/ ctx[4];
    			if (dirty & /*name, onRename*/ 20) input_changes.setSearchString = /*func*/ ctx[8];
    			if (dirty & /*onRename, openForChange*/ 36) input_changes.onBlur = /*func_1*/ ctx[9];
    			if (dirty & /*name, openForChange, onRename*/ 52) input_changes.onEnter = /*func_2*/ ctx[10];
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(28:8) {#if openForChange}",
    		ctx
    	});

    	return block;
    }

    // (66:12) <Icon styles="font-size: 1rem">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("edit");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(66:12) <Icon styles=\\\"font-size: 1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (79:16) <Icon styles={"font-size: 1.1rem"}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("folder");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(79:16) <Icon styles={\\\"font-size: 1.1rem\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (85:16) <Icon styles={"font-size: 1.1rem"}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("delete_forever");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(85:16) <Icon styles={\\\"font-size: 1.1rem\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (69:8) <Dropdown hideArrow={true}>
    function create_default_slot_2$1(ctx) {
    	let button0;
    	let icon0;
    	let t0;
    	let t1_value = /*translate*/ ctx[7]("SHOW_IN_EXPLORER") + "";
    	let t1;
    	let t2;
    	let button1;
    	let icon1;
    	let t3;
    	let t4_value = /*translate*/ ctx[7]("DELETE") + "";
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t3 = space();
    			t4 = text(t4_value);
    			add_location(button0, file$3, 75, 12, 2318);
    			add_location(button1, file$3, 81, 12, 2621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			mount_component(icon0, button0, null);
    			append_dev(button0, t0);
    			append_dev(button0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			mount_component(icon1, button1, null);
    			append_dev(button1, t3);
    			append_dev(button1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				icon0_changes.$$scope = { dirty, ctx };
    			}

    			icon0.$set(icon0_changes);
    			const icon1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				icon1_changes.$$scope = { dirty, ctx };
    			}

    			icon1.$set(icon1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			destroy_component(icon0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(69:8) <Dropdown hideArrow={true}>",
    		ctx
    	});

    	return block;
    }

    // (71:16) <Icon>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("more_horiz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(71:16) <Icon>",
    		ctx
    	});

    	return block;
    }

    // (70:12) 
    function create_button_slot(ctx) {
    	let button;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "button card-home");
    			attr_dev(button, "slot", "button");
    			add_location(button, file$3, 69, 12, 2157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_button_slot.name,
    		type: "slot",
    		source: "(70:12) ",
    		ctx
    	});

    	return block;
    }

    // (94:12) <Icon styles={"font-size: 1rem"}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("open_in_new");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(94:12) <Icon styles={\\\"font-size: 1rem\\\"}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div7;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let strong0;

    	let t2_value = (/*data*/ ctx[1].meta.lastModification
    	? /*data*/ ctx[1].meta.lastModification
    	: /*translate*/ ctx[7]("NEVER")) + "";

    	let t2;
    	let t3;
    	let small0;
    	let t5;
    	let div3;
    	let t6;
    	let div4;
    	let strong1;
    	let t7_value = /*data*/ ctx[1].meta.creationDate + "";
    	let t7;
    	let t8;
    	let small1;
    	let t10;
    	let div5;
    	let t11;
    	let div6;
    	let button0;
    	let icon0;
    	let t12;
    	let dropdown;
    	let t13;
    	let button1;
    	let icon1;
    	let div7_data_card_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*openForChange*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	icon0 = new Icon({
    			props: {
    				styles: "font-size: 1rem",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown = new Dropdown({
    			props: {
    				hideArrow: true,
    				$$slots: {
    					button: [create_button_slot],
    					default: [create_default_slot_2$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				styles: "font-size: 1rem",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			strong0 = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			small0 = element("small");
    			small0.textContent = `${/*translate*/ ctx[7]("LAST_MODIFIED")}`;
    			t5 = space();
    			div3 = element("div");
    			t6 = space();
    			div4 = element("div");
    			strong1 = element("strong");
    			t7 = text(t7_value);
    			t8 = space();
    			small1 = element("small");
    			small1.textContent = `${/*translate*/ ctx[7]("CREATION")}`;
    			t10 = space();
    			div5 = element("div");
    			t11 = space();
    			div6 = element("div");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t12 = space();
    			create_component(dropdown.$$.fragment);
    			t13 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			attr_dev(div0, "class", "" + (null_to_empty("info") + " svelte-165j6vf"));
    			set_style(div0, "width", "200%");
    			add_location(div0, file$3, 26, 4, 772);
    			attr_dev(div1, "class", "" + (null_to_empty("divider") + " svelte-165j6vf"));
    			add_location(div1, file$3, 51, 4, 1503);
    			add_location(strong0, file$3, 53, 8, 1566);
    			add_location(small0, file$3, 54, 8, 1670);
    			attr_dev(div2, "class", "" + (null_to_empty("info") + " svelte-165j6vf"));
    			add_location(div2, file$3, 52, 4, 1537);
    			attr_dev(div3, "class", "" + (null_to_empty("divider") + " svelte-165j6vf"));
    			add_location(div3, file$3, 56, 4, 1729);
    			add_location(strong1, file$3, 58, 8, 1792);
    			add_location(small1, file$3, 59, 8, 1842);
    			attr_dev(div4, "class", "" + (null_to_empty("info") + " svelte-165j6vf"));
    			add_location(div4, file$3, 57, 4, 1763);
    			attr_dev(div5, "class", "" + (null_to_empty("divider") + " svelte-165j6vf"));
    			add_location(div5, file$3, 62, 4, 1897);
    			attr_dev(button0, "class", "button card-home");
    			add_location(button0, file$3, 64, 8, 1963);
    			attr_dev(button1, "class", "button card-home");
    			set_style(button1, "background", "var(--pj-border-primary)");
    			add_location(button1, file$3, 88, 8, 2852);
    			attr_dev(div6, "class", "" + (null_to_empty("section") + " svelte-165j6vf"));
    			add_location(div6, file$3, 63, 4, 1931);
    			attr_dev(div7, "class", "" + (null_to_empty("wrapper") + " svelte-165j6vf"));
    			attr_dev(div7, "data-card", div7_data_card_value = /*data*/ ctx[1].id);
    			add_location(div7, file$3, 22, 0, 707);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div7, t0);
    			append_dev(div7, div1);
    			append_dev(div7, t1);
    			append_dev(div7, div2);
    			append_dev(div2, strong0);
    			append_dev(strong0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, small0);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			append_dev(div7, t6);
    			append_dev(div7, div4);
    			append_dev(div4, strong1);
    			append_dev(strong1, t7);
    			append_dev(div4, t8);
    			append_dev(div4, small1);
    			append_dev(div7, t10);
    			append_dev(div7, div5);
    			append_dev(div7, t11);
    			append_dev(div7, div6);
    			append_dev(div6, button0);
    			mount_component(icon0, button0, null);
    			append_dev(div6, t12);
    			mount_component(dropdown, div6, null);
    			append_dev(div6, t13);
    			append_dev(div6, button1);
    			mount_component(icon1, button1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}

    			if ((!current || dirty & /*data*/ 2) && t2_value !== (t2_value = (/*data*/ ctx[1].meta.lastModification
    			? /*data*/ ctx[1].meta.lastModification
    			: /*translate*/ ctx[7]("NEVER")) + "")) set_data_dev(t2, t2_value);

    			if ((!current || dirty & /*data*/ 2) && t7_value !== (t7_value = /*data*/ ctx[1].meta.creationDate + "")) set_data_dev(t7, t7_value);
    			const icon0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				icon0_changes.$$scope = { dirty, ctx };
    			}

    			icon0.$set(icon0_changes);
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, onDelete, data*/ 65546) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    			const icon1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				icon1_changes.$$scope = { dirty, ctx };
    			}

    			icon1.$set(icon1_changes);

    			if (!current || dirty & /*data*/ 2 && div7_data_card_value !== (div7_data_card_value = /*data*/ ctx[1].id)) {
    				attr_dev(div7, "data-card", div7_data_card_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(dropdown.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(dropdown.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if_blocks[current_block_type_index].d();
    			destroy_component(icon0);
    			destroy_component(dropdown);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	const { ipcRenderer, shell } = window.require("electron");
    	const translate = key => EnglishLocalization.HOME.CARD[key];
    	let { open = () => null } = $$props;
    	let { data = { meta: {} } } = $$props;
    	let { onRename = () => null } = $$props;
    	let { onDelete = () => null } = $$props;
    	let name = data.meta.name;
    	let openForChange = false;
    	const writable_props = ['open', 'data', 'onRename', 'onDelete'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	const func = v => {
    		$$invalidate(4, name = v);
    		onRename(v);
    	};

    	const func_1 = (changed, v) => {
    		if (changed) onRename(v);
    		$$invalidate(5, openForChange = false);
    	};

    	const func_2 = v => {
    		$$invalidate(4, name = v);
    		$$invalidate(5, openForChange = false);
    		onRename(v);
    	};

    	const click_handler = () => $$invalidate(5, openForChange = true);
    	const click_handler_1 = () => shell.showItemInFolder(localStorage.getItem("basePath") + "projects" + FileSystem.sep + data.id);
    	const click_handler_2 = () => onDelete();
    	const click_handler_3 = () => open();

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('onRename' in $$props) $$invalidate(2, onRename = $$props.onRename);
    		if ('onDelete' in $$props) $$invalidate(3, onDelete = $$props.onDelete);
    	};

    	$$self.$capture_state = () => ({
    		EnglishLocalization,
    		Input,
    		Dropdown,
    		Icon,
    		FileSystem,
    		ipcRenderer,
    		shell,
    		translate,
    		open,
    		data,
    		onRename,
    		onDelete,
    		name,
    		openForChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('onRename' in $$props) $$invalidate(2, onRename = $$props.onRename);
    		if ('onDelete' in $$props) $$invalidate(3, onDelete = $$props.onDelete);
    		if ('name' in $$props) $$invalidate(4, name = $$props.name);
    		if ('openForChange' in $$props) $$invalidate(5, openForChange = $$props.openForChange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		data,
    		onRename,
    		onDelete,
    		name,
    		openForChange,
    		shell,
    		translate,
    		func,
    		func_1,
    		func_2,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			open: 0,
    			data: 1,
    			onRename: 2,
    			onDelete: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get open() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onRename() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onRename(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDelete() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDelete(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/app/windows/home/components/Recent.svelte generated by Svelte v3.49.0 */
    const file$2 = "src/app/windows/home/components/Recent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (20:0) {#if toShow && toShow.length > 0}
    function create_if_block$1(ctx) {
    	let div1;
    	let h4;
    	let t1;
    	let div0;
    	let each_value = /*toShow*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = `${/*translate*/ ctx[2]("RECENT")}`;
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(h4, "margin-bottom", "4px");
    			set_style(h4, "margin-top", "4px");
    			add_location(h4, file$2, 21, 4, 743);
    			attr_dev(div0, "class", "" + (null_to_empty("wrapper") + " svelte-1jmca36"));
    			add_location(div0, file$2, 22, 4, 822);
    			set_style(div1, "color", "var(--pj-color-secondary)");
    			add_location(div1, file$2, 20, 0, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*open, toShow, translate, logo*/ 7) {
    				each_value = /*toShow*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:0) {#if toShow && toShow.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#each toShow as project}
    function create_each_block$1(ctx) {
    	let div2;
    	let div0;
    	let img$1;
    	let img_src_value;
    	let t0;
    	let div1;
    	let strong;
    	let t1_value = /*project*/ ctx[5].meta.name + "";
    	let t1;
    	let t2;
    	let small;

    	let t3_value = (/*project*/ ctx[5].meta.lastModification
    	? /*project*/ ctx[5].meta.lastModification
    	: /*translate*/ ctx[2]("NEVER")) + "";

    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*project*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img$1 = element("img");
    			t0 = space();
    			div1 = element("div");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			small = element("small");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(img$1, "draggable", "false");

    			if (!src_url_equal(img$1.src, img_src_value = /*project*/ ctx[5].meta.preview
    			? /*project*/ ctx[5].meta.preview
    			: img)) attr_dev(img$1, "src", img_src_value);

    			attr_dev(img$1, "alt", /*translate*/ ctx[2]("PROJECT"));
    			attr_dev(img$1, "class", "svelte-1jmca36");
    			add_location(img$1, file$2, 26, 20, 1004);
    			attr_dev(div0, "class", "" + (null_to_empty("preview") + " svelte-1jmca36"));
    			add_location(div0, file$2, 25, 16, 960);
    			add_location(strong, file$2, 33, 20, 1289);
    			add_location(small, file$2, 34, 20, 1346);
    			attr_dev(div1, "class", "" + (null_to_empty("content") + " svelte-1jmca36"));
    			add_location(div1, file$2, 32, 16, 1245);
    			attr_dev(div2, "class", "" + (null_to_empty("card") + " svelte-1jmca36"));
    			add_location(div2, file$2, 24, 12, 892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img$1);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, strong);
    			append_dev(strong, t1);
    			append_dev(div1, t2);
    			append_dev(div1, small);
    			append_dev(small, t3);
    			append_dev(div2, t4);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*toShow*/ 2 && !src_url_equal(img$1.src, img_src_value = /*project*/ ctx[5].meta.preview
    			? /*project*/ ctx[5].meta.preview
    			: img)) {
    				attr_dev(img$1, "src", img_src_value);
    			}

    			if (dirty & /*toShow*/ 2 && t1_value !== (t1_value = /*project*/ ctx[5].meta.name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*toShow*/ 2 && t3_value !== (t3_value = (/*project*/ ctx[5].meta.lastModification
    			? /*project*/ ctx[5].meta.lastModification
    			: /*translate*/ ctx[2]("NEVER")) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(24:8) {#each toShow as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*toShow*/ ctx[1] && /*toShow*/ ctx[1].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*toShow*/ ctx[1] && /*toShow*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getRecent(projects) {
    	return projects.sort((a, b) => {
    		if (a.meta?.lastModification < b.meta?.lastModification) return -1;
    		if (a.meta?.lastModification > b.meta?.lastModification) return 1;
    		return 0;
    	}).slice(0, 5);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let toShow;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recent', slots, []);
    	let { open = () => null } = $$props;
    	let { projects = [] } = $$props;
    	const translate = key => EnglishLocalization.HOME.CARD[key];
    	const writable_props = ['open', 'projects'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = project => open(project);

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('projects' in $$props) $$invalidate(3, projects = $$props.projects);
    	};

    	$$self.$capture_state = () => ({
    		EnglishLocalization,
    		logo: img,
    		open,
    		projects,
    		getRecent,
    		translate,
    		toShow
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('projects' in $$props) $$invalidate(3, projects = $$props.projects);
    		if ('toShow' in $$props) $$invalidate(1, toShow = $$props.toShow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*projects*/ 8) {
    			$$invalidate(1, toShow = Array.isArray(projects) ? getRecent(projects) : []);
    		}
    	};

    	return [open, toShow, translate, projects, click_handler];
    }

    class Recent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { open: 0, projects: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recent",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get open() {
    		throw new Error("<Recent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Recent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get projects() {
    		throw new Error("<Recent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projects(value) {
    		throw new Error("<Recent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var FRAME_EVENTS =  {
        CLOSE_MAIN: "CLOSE",
        MINIMIZE_MAIN: "MINIMIZE",
        MAXIMIZE_MAIN: "MAXIMIZE",

        CLOSE_PROJECT: "CLOSE_PROJECT",
        MINIMIZE_PROJECT: "MINIMIZE_PROJECT",
        MAXIMIZE_PROJECT: "MAXIMIZE_PROJECT",
    };
    FRAME_EVENTS.CLOSE_MAIN;
    FRAME_EVENTS.MINIMIZE_MAIN;
    FRAME_EVENTS.MAXIMIZE_MAIN;
    FRAME_EVENTS.CLOSE_PROJECT;
    FRAME_EVENTS.MINIMIZE_PROJECT;
    FRAME_EVENTS.MAXIMIZE_PROJECT;

    function loadGlobalLocalization(localization) {
        window.localization = {
            localization,
            translate(window, component, strToTranslate) {
                return EnglishLocalization[window][component][strToTranslate]
            }
        };
    }

    async function refreshProjects(path) {
        const [e, res] = await AsyncFS.readdir(path);
        if (!(await AsyncFS.exists(path))) await AsyncFS.mkdir(path);

        if (!e) {
            const data = [];
            for (let i in res) {
                const f = res[i];
                let filename = path + f;
                const [, stat] = await AsyncFS.lstat(filename);
                if (stat && stat.isDirectory) {
                    const [, meta] = await AsyncFS.read(filename + "/.meta");
                    const [, settings] = await AsyncFS.read(filename + "/.settings");
                    const parts = filename.split(FileSystem.sep);
                    data.push({
                        id: parts.pop(),
                        meta: meta ? JSON.parse(meta) : undefined,
                        settings: settings ? JSON.parse(settings) : undefined
                    });
                }
            }
            return data.filter(e => e !== undefined).map(e => {
                let res = {...e};
                if (!res.meta) res.meta = {name: EnglishLocalization.HOME.HOME.CREATE};
                if (!res.settings) res.settings = {};
                if (!res.meta.name) res.meta.name = EnglishLocalization.HOME.HOME.CREATE;
                return res
            })
        }
        return []
    }

    /* src/app/components/alert/Alert.svelte generated by Svelte v3.49.0 */
    const file$1 = "src/app/components/alert/Alert.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "target svelte-18ajcee");
    			add_location(div, file$1, 57, 0, 1873);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[1](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, []);
    	let target;

    	const close = newElement => {
    		newElement.className = "outAnimation alert-modal";

    		newElement.addEventListener(
    			"animationend",
    			() => {
    				target.removeChild(newElement);
    			},
    			{ once: true }
    		);
    	};

    	const pushAlert = (message, type, delay = 3500) => {
    		const newElement = document.createElement("div");
    		target.appendChild(newElement);
    		$$invalidate(0, target.style.zIndex = "9999", target);
    		let variant;

    		switch (type) {
    			case "success":
    				variant = { color: "#00F400", icon: "done" };
    				break;
    			case "alert":
    				variant = { color: "#FFFF3E", icon: "warning" };
    				break;
    			case "info":
    				variant = { color: "#0095ff", icon: "info" };
    				break;
    			default:
    				variant = { color: "#ff5555", icon: "error" };
    				break;
    		}

    		setTimeout(() => close(newElement), delay);

    		newElement.innerHTML = `
        <div class="alertContainer alert-modal" style="--background: ${variant.color}">
            <div class="content alert-modal">
                <div class="icon alert-modal">
                    <span data-icon="-">${variant.icon}</span>
                </div>
                ${message}
            </div>
            <button class="button alert-modal" data-action="-">
                <span data-icon="-" style="height: 1.1rem; font-size: 1.1rem">close</span>
            </button>
        </div>
      `;

    		newElement.getElementsByTagName("button")[0].addEventListener("click", () => close(newElement), { once: true });
    	};

    	onMount(() => {
    		alert.pushAlert = pushAlert;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alert> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			target = $$value;
    			$$invalidate(0, target);
    		});
    	}

    	$$self.$capture_state = () => ({ onMount, target, close, pushAlert });

    	$$self.$inject_state = $$props => {
    		if ('target' in $$props) $$invalidate(0, target = $$props.target);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [target, div_binding];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/app/windows/home/Home.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file = "src/app/windows/home/Home.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (63:20) <Icon slot="icon" styles="font-size: 1rem">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("search");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(63:20) <Icon slot=\\\"icon\\\" styles=\\\"font-size: 1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (63:20) 
    function create_icon_slot(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				slot: "icon",
    				styles: "font-size: 1rem",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(63:20) ",
    		ctx
    	});

    	return block;
    }

    // (70:16) {#if openInput}
    function create_if_block_3(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				placeholder: /*translate*/ ctx[4]("CREATE"),
    				onEnter: /*func_1*/ ctx[7],
    				onBlur: /*func_2*/ ctx[8],
    				height: "25px"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*projectsToShow, openInput*/ 6) input_changes.onEnter = /*func_1*/ ctx[7];
    			if (dirty & /*openInput*/ 4) input_changes.onBlur = /*func_2*/ ctx[8];
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(70:16) {#if openInput}",
    		ctx
    	});

    	return block;
    }

    // (96:24) {:else}
    function create_else_block_1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(96:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:20) {#if !openInput}
    function create_if_block_2(ctx) {
    	let icon;
    	let t0;
    	let t1_value = /*translate*/ ctx[4]("CREATE") + "";
    	let t1;
    	let current;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 1.1rem",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:20) {#if !openInput}",
    		ctx
    	});

    	return block;
    }

    // (97:24) <Icon styles="font-size: 1.1rem">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("navigate_next");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(97:24) <Icon styles=\\\"font-size: 1.1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:24) <Icon styles="font-size: 1.1rem">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("add");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(94:24) <Icon styles=\\\"font-size: 1.1rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (103:8) {#if !searchString}
    function create_if_block_1(ctx) {
    	let recent;
    	let current;

    	recent = new Recent({
    			props: {
    				open: /*func_3*/ ctx[10],
    				projects: /*projectsToShow*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(recent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(recent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const recent_changes = {};
    			if (dirty & /*projectsToShow*/ 2) recent_changes.projects = /*projectsToShow*/ ctx[1];
    			recent.$set(recent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(recent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(103:8) {#if !searchString}",
    		ctx
    	});

    	return block;
    }

    // (111:8) {:else}
    function create_else_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*projectsToShow*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "" + (null_to_empty("content") + " svelte-z7gsdh"));
    			add_location(div, file, 111, 12, 4499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*openProject, projectsToShow, pathLib, localStorage, FileSystem, AsyncFS, JSON, console*/ 42) {
    				each_value = /*projectsToShow*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(111:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (106:8) {#if projectsToShow.length === 0}
    function create_if_block(ctx) {
    	let div;
    	let icon;
    	let t0;
    	let t1_value = /*translate*/ ctx[4]("EMPTY") + "";
    	let t1;
    	let current;

    	icon = new Icon({
    			props: {
    				styles: "font-size: 100px",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(div, "class", "" + (null_to_empty("emptyWrapper") + " svelte-z7gsdh"));
    			add_location(div, file, 106, 12, 4324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				icon_changes.$$scope = { dirty, ctx };
    			}

    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(106:8) {#if projectsToShow.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (113:16) {#each projectsToShow as p, index}
    function create_each_block(ctx) {
    	let card;
    	let current;

    	function func_4() {
    		return /*func_4*/ ctx[11](/*p*/ ctx[15]);
    	}

    	function func_5(...args) {
    		return /*func_5*/ ctx[12](/*p*/ ctx[15], ...args);
    	}

    	function func_6() {
    		return /*func_6*/ ctx[13](/*p*/ ctx[15]);
    	}

    	card = new Card({
    			props: {
    				open: func_4,
    				data: /*p*/ ctx[15],
    				index: /*index*/ ctx[17],
    				onRename: func_5,
    				onDelete: func_6
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const card_changes = {};
    			if (dirty & /*projectsToShow*/ 2) card_changes.open = func_4;
    			if (dirty & /*projectsToShow*/ 2) card_changes.data = /*p*/ ctx[15];
    			if (dirty & /*projectsToShow*/ 2) card_changes.onRename = func_5;
    			if (dirty & /*projectsToShow*/ 2) card_changes.onDelete = func_6;
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(113:16) {#each projectsToShow as p, index}",
    		ctx
    	});

    	return block;
    }

    // (108:16) <Icon styles="font-size: 100px">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("folder");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(108:16) <Icon styles=\\\"font-size: 100px\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let alert_1;
    	let t0;
    	let windowframe;
    	let t1;
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h2;
    	let t3;
    	let input;
    	let t4;
    	let div1;
    	let t5;
    	let button;
    	let current_block_type_index;
    	let if_block1;
    	let t6;
    	let t7;
    	let current_block_type_index_1;
    	let if_block3;
    	let current;
    	let mounted;
    	let dispose;
    	alert_1 = new Alert({ $$inline: true });

    	windowframe = new WindowFrame({
    			props: {
    				options: [],
    				label: /*translate*/ ctx[4]("TITLE"),
    				pageInfo: {
    					closeEvent: FRAME_EVENTS.CLOSE_MAIN,
    					minimizeEvent: FRAME_EVENTS.MINIMIZE_MAIN,
    					maximizeEvent: FRAME_EVENTS.MAXIMIZE_MAIN
    				}
    			},
    			$$inline: true
    		});

    	input = new Input({
    			props: {
    				placeholder: /*translate*/ ctx[4]("SEARCH"),
    				height: "25px",
    				setSearchString: /*func*/ ctx[6],
    				searchString: /*searchString*/ ctx[0],
    				$$slots: { icon: [create_icon_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*openInput*/ ctx[2] && create_if_block_3(ctx);
    	const if_block_creators = [create_if_block_2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*openInput*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = !/*searchString*/ ctx[0] && create_if_block_1(ctx);
    	const if_block_creators_1 = [create_if_block, create_else_block];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*projectsToShow*/ ctx[1].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);

    	const block = {
    		c: function create() {
    			create_component(alert_1.$$.fragment);
    			t0 = space();
    			create_component(windowframe.$$.fragment);
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = `${/*translate*/ ctx[4]("PROJECTS")}`;
    			t3 = space();
    			create_component(input.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			button = element("button");
    			if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			if_block3.c();
    			attr_dev(h2, "class", "svelte-z7gsdh");
    			add_location(h2, file, 59, 16, 2218);
    			attr_dev(div0, "class", "" + (null_to_empty("title") + " svelte-z7gsdh"));
    			add_location(div0, file, 58, 12, 2180);
    			attr_dev(button, "class", "button-create svelte-z7gsdh");
    			set_style(button, "width", /*openInput*/ ctx[2] ? "25px" : "initial");
    			set_style(button, "padding", /*openInput*/ ctx[2] ? "0px" : "4px 8px");
    			set_style(button, "justify-content", /*openInput*/ ctx[2] ? "center" : "initial");
    			add_location(button, file, 91, 16, 3589);
    			attr_dev(div1, "class", "input-creation svelte-z7gsdh");
    			add_location(div1, file, 68, 12, 2596);
    			attr_dev(div2, "class", "" + (null_to_empty("titleWrapper") + " svelte-z7gsdh"));
    			add_location(div2, file, 57, 8, 2139);
    			attr_dev(div3, "class", "" + (null_to_empty("wrapperProjects") + " svelte-z7gsdh"));
    			add_location(div3, file, 56, 4, 2099);
    			attr_dev(div4, "class", "" + (null_to_empty("wrapper") + " svelte-z7gsdh"));
    			add_location(div4, file, 55, 0, 2071);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(alert_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(windowframe, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			mount_component(input, div0, null);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			if_blocks[current_block_type_index].m(button, null);
    			append_dev(div3, t6);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t7);
    			if_blocks_1[current_block_type_index_1].m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input_changes = {};
    			if (dirty & /*searchString*/ 1) input_changes.setSearchString = /*func*/ ctx[6];
    			if (dirty & /*searchString*/ 1) input_changes.searchString = /*searchString*/ ctx[0];

    			if (dirty & /*$$scope*/ 262144) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			input.$set(input_changes);

    			if (/*openInput*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*openInput*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(button, null);
    			}

    			if (!current || dirty & /*openInput*/ 4) {
    				set_style(button, "width", /*openInput*/ ctx[2] ? "25px" : "initial");
    			}

    			if (!current || dirty & /*openInput*/ 4) {
    				set_style(button, "padding", /*openInput*/ ctx[2] ? "0px" : "4px 8px");
    			}

    			if (!current || dirty & /*openInput*/ 4) {
    				set_style(button, "justify-content", /*openInput*/ ctx[2] ? "center" : "initial");
    			}

    			if (!/*searchString*/ ctx[0]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*searchString*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, t7);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks_1[current_block_type_index_1];

    				if (!if_block3) {
    					if_block3 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block3.c();
    				} else {
    					if_block3.p(ctx, dirty);
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div3, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alert_1.$$.fragment, local);
    			transition_in(windowframe.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alert_1.$$.fragment, local);
    			transition_out(windowframe.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alert_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(windowframe, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div4);
    			destroy_component(input);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (if_block2) if_block2.d();
    			if_blocks_1[current_block_type_index_1].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const pathLib = window.require("path");
    	const { ipcRenderer } = window.require("electron");
    	let searchString = "";
    	let projectsToShow = [];
    	let openInput = false;
    	const translate = key => EnglishLocalization.HOME.HOME[key];

    	function openProject(p) {
    		ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW, { windowID: p.id, data: p, hasMain: false });
    	}

    	onMount(() => {
    		loadGlobalLocalization();
    		let b = localStorage.getItem("basePath");

    		if (localStorage.getItem("basePath") === null) {
    			b = window.require("os").homedir() + pathLib.sep + "ProjectionEngineProjects" + pathLib.sep;
    			localStorage.setItem("basePath", b);
    		}

    		AsyncFS.mkdir(b).catch();
    		refreshProjects(b + "projects" + FileSystem.sep).then(r => $$invalidate(1, projectsToShow = r)).catch();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const func = v => $$invalidate(0, searchString = v);

    	const func_1 = async name => {
    		const res = await FileSystem.createProject(name);
    		$$invalidate(1, projectsToShow = [...projectsToShow, { id: res, meta: { name } }]);
    		$$invalidate(2, openInput = false);
    		alert.pushAlert(translate("PROJECT_CREATED"), "success");
    	};

    	const func_2 = changed => {
    		if (!changed) $$invalidate(2, openInput = false);
    	};

    	const click_handler = () => $$invalidate(2, openInput = !openInput);
    	const func_3 = p => openProject(p);
    	const func_4 = p => openProject(p);

    	const func_5 = async (p, newName) => {
    		const pathName = pathLib.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id + FileSystem.sep + ".meta");
    		const [error, res] = await AsyncFS.read(pathName);
    		if (res && !error) await AsyncFS.write(pathName, JSON.stringify({ ...JSON.parse(res), name: newName }));
    	};

    	const func_6 = async p => {
    		console.log(p);
    		await AsyncFS.rm(pathLib.resolve(localStorage.getItem("basePath") + "projects" + FileSystem.sep + p.id), { recursive: true, force: true });
    		$$invalidate(1, projectsToShow = projectsToShow.filter(e => e.id !== p.id));
    	};

    	$$self.$capture_state = () => ({
    		WindowFrame,
    		Icon,
    		Card,
    		Dropdown,
    		Input,
    		Recent,
    		FRAME_EVENTS,
    		EnglishLocalization,
    		ROUTES,
    		onMount,
    		loadGlobalLocalization,
    		refreshProjects,
    		AsyncFS,
    		FileSystem,
    		Alert,
    		pathLib,
    		ipcRenderer,
    		searchString,
    		projectsToShow,
    		openInput,
    		translate,
    		openProject
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchString' in $$props) $$invalidate(0, searchString = $$props.searchString);
    		if ('projectsToShow' in $$props) $$invalidate(1, projectsToShow = $$props.projectsToShow);
    		if ('openInput' in $$props) $$invalidate(2, openInput = $$props.openInput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchString,
    		projectsToShow,
    		openInput,
    		pathLib,
    		translate,
    		openProject,
    		func,
    		func_1,
    		func_2,
    		click_handler,
    		func_3,
    		func_4,
    		func_5,
    		func_6
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var root = new Home({
    	target: document.body
    });

    return root;

})();
//# sourceMappingURL=home.js.map
