import { parentPort, workerData } from 'worker_threads';

const findLastIndex = (array, predicate) => {
    // Iterate from the end of the array to the beginning
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i], i, array)) {
            return i; // Return the index if the condition is met
        }
    }
    return -1; // Return -1 if no element satisfies the condition
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/utils/env.ts
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");

// src/utils/errors.ts
var errors = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (process.env.NODE_ENV !== "production") {
    const e = errors[error];
    const msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}

// src/utils/common.ts
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  var _a;
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
}
function each(obj, iter) {
  if (getArchtype(obj) === 0 /* Object */) {
    Reflect.ownKeys(obj).forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 /* Array */ : isMap(thing) ? 2 /* Map */ : isSet(thing) ? 3 /* Set */ : 0 /* Object */;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 /* Map */ ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t = getArchtype(thing);
  if (t === 2 /* Map */)
    thing.set(propOrOldValue, value);
  else if (t === 3 /* Set */) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = Object.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc.writable === false) {
        desc.writable = true;
        desc.configurable = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return __spreadValues({}, base);
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
  }
  Object.freeze(obj);
  if (deep)
    Object.entries(obj).forEach(([key, value]) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
function isFrozen(obj) {
  return Object.isFrozen(obj);
}

// src/utils/plugins.ts
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}

// src/core/scope.ts
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 /* Object */ || state.type_ === 1 /* Array */)
    state.revoke_();
  else
    state.revoked_ = true;
}

// src/core/finalize.ts
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3 /* Set */) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
    );
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (process.env.NODE_ENV !== "production" && childValue === targetObject)
    die(5);
  if (isDraft(childValue)) {
    const path = rootPath && parentState && parentState.type_ !== 3 /* Set */ && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !isFrozen(childValue)) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}

// src/core/proxy.ts
function createProxyProxy(base, parent) {
  const isArray = Array.isArray(base);
  const state = {
    type_: isArray ? 1 /* Array */ : 0 /* Object */,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 /* Array */ || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a;
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}

// src/core/immerClass.ts
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof (config == null ? void 0 : config.autoFreeze) === "boolean")
      this.setAutoFreeze(config.autoFreeze);
    if (typeof (config == null ? void 0 : config.useStrictShallowCopy) === "boolean")
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}

// src/core/current.ts
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
  } else {
    copy = shallowCopy(value, true);
  }
  each(copy, (key, childValue) => {
    set(copy, key, currentImpl(childValue));
  });
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}

// src/immer.ts
var immer = new Immer2();
var produce = immer.produce;
immer.produceWithPatches.bind(
  immer
);
immer.setAutoFreeze.bind(immer);
immer.setUseStrictShallowCopy.bind(immer);
immer.applyPatches.bind(immer);
immer.createDraft.bind(immer);
immer.finishDraft.bind(immer);

const createLockAndKey = (pairName, color, lock, key) => {
    return [
        {
            name: `${pairName}-lock`,
            pairName,
            symbol: lock,
            color,
            role: "lock"
        },
        {
            name: `${pairName}-key`,
            pairName,
            symbol: key,
            color,
            role: "key"
        }
    ];
};
const [ghost, flashlight] = createLockAndKey("ghost", "#333333", "👻", "🔦");
const [vampire, garlic] = createLockAndKey("vampire", "#666699", "🧛", "🧄");
const [dragon, sword] = createLockAndKey("dragon", "#ff0000", "🐉", "️🗡️");
const [fire, water] = createLockAndKey("fire", "#800080", "🔥", "💧");
const [dinosaur, comet] = createLockAndKey("dinosaur", "#008000", "🦖", "☄️");
const [lock, key] = createLockAndKey("locked", "#2a2627", "🔒", "️🗝️");
const [robot, lightning] = createLockAndKey("robot", "#a684ff", "🤖", "️️⚡️");
const locks = [
    lock,
    fire,
    ghost,
    vampire,
    robot,
    dinosaur,
    dragon
];
const keys = [
    key,
    water,
    flashlight,
    garlic,
    lightning,
    comet,
    sword
];
const lockNKeyPairs = [...locks, ...keys].reduce((result, { pairName }) => result.includes(pairName) ? result : result.concat(pairName), []);

const canPlaceAmount = (level, columnIndex, blocks) => {
    const column = level.columns[columnIndex];
    const spaceLeft = column.columnSize - column.blocks.length;
    if (isKey(blocks[0])) {
        if (column.type === "inventory") {
            return Math.min(spaceLeft, blocks.length);
        }
        if (column.blocks[0]) {
            const lock = matchingLockFor(blocks[0]);
            return column.blocks[0]?.blockType === lock ? 1 : 0;
        }
        return 0;
    }
    if (column.type === "inventory") {
        return 0;
    }
    if (column.type === "buffer" && column.limitColor === "rainbow") {
        return Math.min(spaceLeft, blocks.length);
    }
    const setColor = blocks[0].blockType;
    if (column.limitColor && column.limitColor !== setColor) {
        return 0;
    }
    if (column.blocks[0] && column.blocks[0].blockType !== setColor) {
        return 0;
    }
    return Math.min(spaceLeft, blocks.length);
};
const hasWon = (level) => level.columns.every((col) => (col.type === "placement" &&
    col.columnSize === col.blocks.length &&
    col.blocks.every((b) => b.blockType === col.blocks[0].blockType)) ||
    col.blocks.length === 0);
const createSignature = (level) => level.columns.map((c) => {
    const block = c.blocks[0];
    if (c.type === "inventory")
        return "inventory";
    if (block && isKey(block))
        return "inventory";
    return block ? block.blockType : c.limitColor;
});
const countHidden = (level) => level.columns.reduce((r, c) => r + c.blocks.filter((b) => b.revealed === true).length, 0);
const blockedByPlacement = (level) => {
    const bufferSeries = [];
    level.columns.forEach((col, index) => {
        if (col.blocks.length === 0)
            return;
        if (col.type !== "buffer")
            return;
        const countSame = selectFromColumn(level, index).length;
        bufferSeries.push([col.blocks[0].blockType, countSame, index]);
    });
    const placementSpaceForColor = (blockColor, index) => level.columns.reduce((acc, col, i) => {
        if (i === index)
            return acc;
        if (col.type === "placement" &&
            (col.limitColor === blockColor ||
                col.blocks[0]?.blockType === blockColor ||
                (col.limitColor === undefined && col.blocks.length === 0))) {
            return acc + col.columnSize - col.blocks.length;
        }
        if (col.type === "buffer" && col.limitColor === "rainbow") {
            return acc + col.columnSize - col.blocks.length;
        }
        if (col.type === "buffer" &&
            (col.limitColor === blockColor ||
                col.blocks[0]?.blockType === blockColor)) {
            return acc + col.columnSize - col.blocks.length;
        }
        return acc;
    }, 0);
    const hasPlacementSpace = bufferSeries.some(([color, _amount, index]) => {
        const largestFreeBufferSpace = placementSpaceForColor(color, index);
        return largestFreeBufferSpace > 0;
    });
    if (!hasPlacementSpace)
        return true;
    const canFit = bufferSeries.some(([color, amount, index]) => {
        const largestFreeBufferSpace = placementSpaceForColor(color, index);
        return amount <= largestFreeBufferSpace;
    });
    return !canFit;
};
const blockedByBuffer = (level) => {
    const placementSeries = [];
    level.columns.forEach((col, index) => {
        if (col.blocks.length === 0 || col.type !== "placement" || col.locked)
            return;
        const countSame = selectFromColumn(level, index).length;
        if (countSame > 0) {
            placementSeries.push([col.blocks[0].blockType, countSame, index]);
        }
    });
    const bufferSpaceForColor = (blockColor, index) => level.columns.reduce((acc, col, i) => {
        if (i === index)
            return acc;
        if (col.type === "buffer" &&
            col.limitColor === undefined &&
            col.blocks.length === 0) {
            return acc + col.columnSize;
        }
        if (col.type === "buffer" && col.limitColor === "rainbow") {
            return acc + col.columnSize - col.blocks.length;
        }
        if (col.type === "buffer" &&
            (col.limitColor === blockColor ||
                col.blocks[0]?.blockType === blockColor)) {
            return acc + col.columnSize - col.blocks.length;
        }
        if (col.type === "placement" &&
            (col.limitColor === blockColor ||
                col.blocks[0]?.blockType === blockColor ||
                (col.limitColor === undefined && col.blocks.length === 0))) {
            return acc + col.columnSize - col.blocks.length;
        }
        return acc;
    }, 0);
    const hasBufferSpace = placementSeries.some(([color, _amount, index]) => {
        const largestFreeBufferSpace = bufferSpaceForColor(color, index);
        return largestFreeBufferSpace > 0;
    });
    if (!hasBufferSpace)
        return true;
    const canFit = placementSeries.some(([color, amount, index]) => {
        const largestFreeBufferSpace = bufferSpaceForColor(color, index);
        return amount <= largestFreeBufferSpace;
    });
    return !canFit;
};
const countCompleted = (level) => level.columns.filter((col) => col.type === "placement" &&
    col.columnSize === col.blocks.length &&
    col.blocks.every((b) => b.blockType === col.blocks[0].blockType)).length;
const countLocks = (level) => level.columns.reduce((c, col) => c + col.blocks.filter((b) => isLock(b)).length, 0);
const keyLockSolves = (level) => {
    const locks = level.columns.filter((col) => isLock(col.blocks[0]));
    const keys = level.columns.filter((col) => isKey(col.blocks[0]));
    return locks.some((lock) => keys.some((key) => isMatch(key.blocks[0], lock.blocks[0])));
};
const keyStores = (level) => {
    const chests = level.columns.filter((col) => col.type === "inventory" && col.columnSize > col.blocks.length);
    const keys = level.columns.filter((col) => col.type !== "inventory" && isKey(col.blocks[0]));
    return keys.length > 0 && chests.length > 0;
};
const isStuck = (level) => {
    const topSignature = createSignature(level);
    const originalHidden = countHidden(level);
    const originalCompleted = countCompleted(level);
    const originalLocks = countLocks(level);
    const hasBuffers = level.columns.some((c) => c.type === "buffer" || c.type === "inventory");
    const initialBlocked = hasBuffers &&
        blockedByBuffer(level) &&
        blockedByPlacement(level) &&
        !keyLockSolves(level) &&
        !keyStores(level);
    if (initialBlocked)
        return true;
    return level.columns.every((_source, sourceIndex) => {
        let playLevel = level;
        const didChange = level.columns.some((_dest, destIndex) => {
            if (sourceIndex === destIndex)
                return false;
            playLevel = moveBlocks(playLevel, { from: sourceIndex, to: destIndex });
            const resultSig = createSignature(playLevel);
            const resultHidden = countHidden(playLevel);
            const resultCompleted = countCompleted(playLevel);
            const resultLocks = countLocks(playLevel);
            if (resultHidden !== originalHidden ||
                resultCompleted !== originalCompleted ||
                resultLocks !== originalLocks ||
                resultSig.some((c, i) => c !== topSignature[i]) ||
                hasWon(playLevel)) {
                return true;
            }
            return false;
        });
        return !didChange;
    });
};
const isLock = (block) => !!block?.blockType?.endsWith("-lock");
const isKey = (block) => !!block?.blockType?.endsWith("-key");
const matchingLockFor = (block) => isKey(block) && block.blockType.split("-")[0] + "-lock";
const isMatch = (keyBlock, lockBlock) => isKey(keyBlock) &&
    isLock(lockBlock) &&
    lockBlock.blockType === matchingLockFor(keyBlock);
const isLockSolvable = (level) => level.columns.every((col) => !isLock(col.blocks.at(-1)) &&
    col.blocks.every((b, i) => {
        if (isKey(b)) {
            const lock = col.blocks[i + 1];
            return !lock || lock.blockType !== matchingLockFor(b);
        }
        return true;
    })) && isKeysReachable(level);
const isKeysReachable = (level) => {
    // Check if locks could all be opened
    // by keys in different columns, and that between keys and conditional locks are no circular dependencies
    const keyDependencies = new Map();
    level.columns.forEach((col, x) => {
        col.blocks.forEach((block, y) => {
            if (isKey(block)) {
                const dependencies = new Set();
                for (let i = y - 1; i >= 0; i--) {
                    const aboveBlock = col.blocks[i];
                    if (isLock(aboveBlock)) {
                        dependencies.add(`${aboveBlock.blockType}-${x}-${i}`);
                    }
                }
                keyDependencies.set(`${block.blockType}-${x}-${y}`, dependencies);
            }
            if (isLock(block)) {
                const dependencies = new Set();
                level.columns.forEach((col, x) => {
                    col.blocks.forEach((key, y) => {
                        if (isMatch(key, block)) {
                            dependencies.add(`${key.blockType}-${x}-${y}`);
                        }
                    });
                });
                keyDependencies.set(`${block.blockType}-${x}-${y}`, dependencies);
            }
        });
    });
    const canUnlock = (lock, visited) => {
        if (visited.has(lock))
            return false;
        visited.add(lock);
        const keys = keyDependencies.get(lock);
        if (!keys || keys.size === 0)
            return false;
        return Array.from(keys).some((key) => {
            const blockLocks = keyDependencies.get(key);
            if (!blockLocks || blockLocks.size === 0)
                return true;
            return false;
        });
    };
    for (const [block] of keyDependencies) {
        const lockOrKey = block.split("-")[1];
        if (lockOrKey === "lock") {
            const visited = new Set();
            if (!canUnlock(block, visited)) {
                return false;
            }
        }
    }
    return true;
};
const allShuffled = (level) => level.columns.every((c) => c.blocks.length < c.columnSize ||
    c.blocks.map((b) => b.blockType).filter((b, i, l) => l.indexOf(b) === i)
        .length > 1);

const selectFromColumn = (level, columnIndex) => {
    const result = [];
    if (level.columns[columnIndex].locked) {
        return result;
    }
    let color = null;
    let index = 0;
    let topBlock = level.columns[columnIndex].blocks[index];
    if (isLock(topBlock)) {
        return result;
    }
    if (isKey(topBlock)) {
        return [topBlock];
    }
    while ((topBlock?.blockType === color || color === null) &&
        topBlock?.revealed !== false &&
        topBlock !== undefined) {
        result.push(topBlock);
        color = topBlock.blockType;
        index++;
        topBlock = level.columns[columnIndex].blocks[index];
    }
    return result;
};
const moveBlocks = (level, move) => produce((draft) => {
    if (move.from === move.to) {
        return;
    }
    const blocks = selectFromColumn(draft, move.from);
    if (blocks.length === 0)
        return;
    const amountToMove = canPlaceAmount(draft, move.to, blocks);
    const moving = draft.columns[move.from].blocks.splice(0, amountToMove);
    if (moving.length === 0 || amountToMove === 0)
        return;
    if (moving.length === 1 && isKey(blocks[0])) {
        const lock = matchingLockFor(blocks[0]);
        if (draft.columns[move.to].blocks[0]?.blockType === lock) {
            draft.columns[move.to].blocks.shift();
            const topBlockTarget = draft.columns[move.to].blocks[0];
            if (topBlockTarget?.revealed === false) {
                topBlockTarget.revealed = true;
            }
            const topBlockOrigin = draft.columns[move.from].blocks[0];
            if (topBlockOrigin?.revealed === false) {
                topBlockOrigin.revealed = true;
            }
            return;
        }
    }
    const topBlockOrigin = draft.columns[move.from].blocks[0];
    if (topBlockOrigin?.revealed === false) {
        topBlockOrigin.revealed = true;
        let index = 1;
        let nextBlockOrigin = draft.columns[move.from].blocks[index];
        while (nextBlockOrigin?.blockType === topBlockOrigin.blockType) {
            nextBlockOrigin.revealed = true;
            index++;
            nextBlockOrigin = draft.columns[move.from].blocks[index];
        }
    }
    const endCol = draft.columns[move.to];
    endCol.blocks.unshift(...moving);
    const moveColor = moving[0].blockType;
    if (endCol.type === "placement" &&
        endCol.blocks.length === endCol.columnSize &&
        endCol.blocks.every((b) => b.blockType === moveColor)) {
        endCol.blocks.forEach((b) => {
            b.revealed = true;
        });
        endCol.locked = true;
    }
    if (endCol.type === "placement" &&
        endCol.blocks.length < endCol.columnSize &&
        endCol.blocks.every((b) => b.blockType === moveColor) &&
        draft.columns.every((c) => c === endCol || c.blocks.every((b) => b.blockType !== moveColor))) {
        while (endCol.blocks.length < endCol.columnSize) {
            endCol.blocks.push({ blockType: moveColor, revealed: true });
        }
        endCol.blocks.forEach((b) => {
            b.revealed = true;
        });
        endCol.locked = true;
    }
})(level);

const optimizeMoves = (level) => {
    let levelClone = JSON.parse(JSON.stringify(level));
    const movesWithHash = level.moves.map((move) => {
        levelClone = moveBlocks(levelClone, move);
        return {
            from: move.from,
            to: move.to,
            hash: JSON.stringify(levelClone.columns)
        };
    });
    for (let i = 0; i < movesWithHash.length; i++) {
        const hash = movesWithHash[i].hash;
        const highestIndex = findLastIndex(movesWithHash, (move) => move.hash === hash);
        if (highestIndex !== i) {
            movesWithHash.splice(i + 1, highestIndex - i);
        }
    }
    const optimizedMoves = movesWithHash.map((move) => ({
        from: move.from,
        to: move.to
    }));
    return { ...level, moves: optimizedMoves };
};

const removeLock = (level, _random = Math.random) => {
    const keyBlocks = level.columns
        .map((c, i) => {
        const topBlock = c.blocks[0];
        if (!topBlock)
            return undefined;
        if (c.locked)
            return undefined;
        if (!isKey(topBlock))
            return undefined;
        return {
            index: i,
            pairName: locks.find((l) => l.name === topBlock.blockType)?.pairName ??
                "unknown",
            color: topBlock.blockType,
            columnType: c.type
        };
    })
        .filter((c) => c !== undefined);
    const lockBlocks = level.columns
        .map((c, i) => {
        const topBlock = c.blocks[0];
        if (!topBlock)
            return undefined;
        if (c.locked)
            return undefined;
        if (!isLock(topBlock))
            return undefined;
        return {
            index: i,
            pairName: keys.find((l) => l.name === topBlock.blockType)?.pairName ??
                "unknown",
            color: topBlock.blockType,
            columnType: c.type
        };
    })
        .filter((c) => c !== undefined);
    return keyBlocks.reduce((r, source) => {
        const targets = lockBlocks.filter((source) => source && source.pairName === source?.pairName);
        if (targets.length === 0)
            return r;
        return r.concat(targets.map((target) => {
            return {
                name: "removeLock",
                move: { from: source.index, to: target.index },
                weight: 20 + (source.columnType !== "inventory" ? 10 : 0)
            };
        }));
    }, []);
};
const storeKey = (level, _random = Math.random) => {
    const keyBlocks = level.columns
        .map((c, i) => {
        const topBlock = c.blocks[0];
        if (!topBlock)
            return undefined;
        if (c.locked)
            return undefined;
        if (!isKey(topBlock))
            return undefined;
        return {
            index: i,
            pairName: locks.find((l) => l.name === topBlock.blockType)?.pairName ??
                "unknown",
            color: topBlock.blockType,
            columnType: c.type
        };
    })
        .filter((c) => c !== undefined);
    const inventoryColumns = level.columns
        .map((c, i) => {
        const hasSpace = c.blocks.length < c.columnSize;
        if (c.type !== "inventory" || !hasSpace)
            return undefined;
        return {
            index: i,
            columnType: c.type
        };
    })
        .filter((c) => c !== undefined);
    return keyBlocks.reduce((r, source) => {
        if (inventoryColumns.length === 0)
            return r;
        return r.concat(inventoryColumns.map((target) => {
            return {
                name: "storeKey",
                move: { from: source.index, to: target.index },
                weight: 15
            };
        }));
    }, []);
};

// https://stackoverflow.com/a/47593316/2076990
const mulberry32 = (seed) => () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// https://stackoverflow.com/a/2450976
const shuffle = (array, random = Math.random) => {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }
};
const pick = (list, random = Math.random) => list[Math.floor(random() * list.length)];

const timesMap = (amount, func) => Array.from({ length: amount }).map((_, i, l) => func(i, l.length));

const hasSpace = (column) => column.columnSize > column.blocks.length;
const canPlaceBlock = (column, block) => {
    const destBlock = column.blocks[0];
    if (!hasSpace(column)) {
        return false;
    }
    if (isLock(block)) {
        return false;
    }
    if (column.limitColor === "rainbow" && !isKey(block)) {
        return true;
    }
    if (destBlock?.blockType === block.blockType && !isKey(block)) {
        return true;
    }
    if (column.type === "inventory" && isKey(block)) {
        return true;
    }
    if (isKey(block) &&
        destBlock &&
        matchingLockFor(block) === destBlock.blockType) {
        return true;
    }
    if (destBlock === undefined &&
        (column.limitColor === undefined || column.limitColor === block.blockType)) {
        return true;
    }
    return false;
};
const isColumnCorrectlySorted = (column) => {
    if (column.blocks.length === 0)
        return false;
    const firstColor = column.blocks[0].blockType;
    return (column.blocks.every((block) => block.blockType === firstColor) &&
        column.type === "placement");
};

const randomMove = (level, random = Math.random) => {
    const sourceOptions = level.columns.reduce((r, c, source) => {
        if (c.locked) {
            return r;
        }
        const block = c.blocks[0];
        if (block === undefined) {
            return r;
        }
        if (isColumnCorrectlySorted(c)) {
            return r;
        }
        const destinations = level.columns.reduce((res, d, destination) => {
            if (destination === source)
                return res;
            if (canPlaceBlock(d, block)) {
                return res.concat(destination);
            }
            return res;
        }, []);
        if (destinations.length === 0) {
            return r;
        }
        return r.concat({ source, destinations });
    }, []);
    if (sourceOptions.length === 0) {
        return [];
    }
    return timesMap(2, () => {
        const source = pick(sourceOptions, random);
        const pickDestination = pick(source.destinations, random);
        return {
            name: "randomMove",
            move: { from: source.source, to: pickDestination },
            weight: 1
        };
    });
};

const stackColumn = (level, _random = Math.random) => {
    // collect color, seriesLength and space above
    const data = level.columns.map((c, i) => {
        const topBlock = c.blocks[0];
        if (!topBlock)
            return undefined;
        if (c.locked)
            return undefined;
        const seriesLength = selectFromColumn(level, i).length;
        return {
            index: i,
            color: topBlock.blockType,
            seriesLength,
            spaceAvailable: c.columnSize - c.blocks.length,
            bottomStacked: c.blocks.length === seriesLength,
            columnType: c.type
        };
    });
    const potentialTargets = data
        .filter((d) => d !== undefined && d.spaceAvailable > 0)
        .map((d) => {
        return {
            ...d,
            sources: data.filter((s) => s !== undefined &&
                s.color === d.color &&
                d.index !== s.index &&
                (s.seriesLength <= d.spaceAvailable || d.bottomStacked))
        };
    });
    return potentialTargets.reduce((r, t) => r.concat(t.sources.map((source) => {
        const revealedColor = level.columns[source.index].blocks[source.seriesLength]?.blockType;
        const hasServiceColor = level.columns.some((column, index) => column.blocks[0]?.blockType === revealedColor &&
            index !== source.index);
        let bonusPoints = 0;
        const targetData = data[t.index];
        if (targetData !== undefined && targetData.spaceAvailable < 2) {
            bonusPoints += 5; // prefer filling up columns
        }
        if (targetData !== undefined && targetData.bottomStacked) {
            bonusPoints += 10; // single color column should have top priority
        }
        if (targetData !== undefined &&
            targetData.bottomStacked &&
            level.columns[t.index].type === "placement") {
            bonusPoints += level.columns[t.index].blocks.length * 4; // single color column should have top priority
        }
        if (revealedColor === undefined) {
            // stack became empty!
            bonusPoints += 10;
        }
        if (hasServiceColor) {
            bonusPoints += 10;
        }
        return {
            name: "stackColumn",
            move: { from: source.index, to: t.index },
            weight: 20 + bonusPoints
        };
    })), []);
};

const startColumn = (level, random = Math.random) => {
    const canStack = stackColumn(level, random);
    if (canStack.length > 0)
        return canStack;
    const emptyColumns = level.columns.reduce((r, c, i) => c.blocks.length === 0 && c.type !== "inventory"
        ? r.concat({
            index: i,
            type: c.type,
            limitColor: c.limitColor
        })
        : r, []);
    if (emptyColumns.length === 0)
        return [];
    // count colors
    const colorCount = level.columns.reduce((r, c, i) => {
        const block = c.blocks[0];
        if (c.locked)
            return r;
        if (block) {
            r[block.blockType] = (r[block.blockType] ?? []).concat(i);
        }
        return r;
    }, {});
    return Object.entries(colorCount)
        .reduce((r, [, positions]) => positions.length > 1
        ? positions.reduce((r, pos) => emptyColumns.reduce((r, emptyCol) => r.concat({
            name: "startColumn",
            move: {
                from: pos,
                to: emptyCol.index
            },
            weight: emptyCol.limitColor !== undefined &&
                level.columns[pos].blocks[0]?.blockType !==
                    emptyCol.limitColor &&
                emptyCol.limitColor !== "rainbow"
                ? -2e3
                : positions.length * 4 +
                    // Prefer placement columns
                    (level.columns[pos].type === "buffer" ? 2 : 0) +
                    (emptyCol.type === "buffer" ? -3 : 1) +
                    // Prefer columns with the same color as the limit color
                    (emptyCol.limitColor ===
                        level.columns[pos].blocks[0]?.blockType
                        ? 4
                        : 0)
        }), r), r)
        : r, [])
        .filter((m) => m.weight > 0);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_LEVEL_MOVES = 2_000; // The dumb moves get filtered out, so this is a safe upper limit
const FAIL_STATE = [
    false,
    [],
    0
];
const configureSolver = (tactics, scoreState, scoreStateWithMove, lookAheadCount) => async (level, random = Math.random, displayState) => {
    let playLevel = level;
    const moves = [];
    while (!isStuck(playLevel)) {
        const nextMove = evaluateBestMove(playLevel, tactics, scoreStateWithMove, scoreState, lookAheadCount, random);
        if (!nextMove) {
            break;
        }
        else {
            if (moves.length > MAX_LEVEL_MOVES) {
                break;
            }
            moves.push({
                from: nextMove.move.from,
                to: nextMove.move.to,
                tactic: nextMove.name
            });
            playLevel = moveBlocks(playLevel, nextMove.move);
            if (displayState) {
                const keepSolving = await displayState(playLevel, nextMove.move, nextMove.name ?? "unknown", moves.length);
                if (!keepSolving) {
                    return FAIL_STATE;
                }
            }
            if (moves.length % 30 === 0) {
                await delay(2);
            }
        }
        if (hasWon(playLevel)) {
            return [true, moves, moves.length + MAX_LEVEL_MOVES];
        }
    }
    return FAIL_STATE;
};
const lookahead = (state, move, depth, tactics, scoreStateWithMove, scoreState, random = Math.random) => {
    if (depth === 0) {
        return scoreStateWithMove(state, move); // Base case: return the score of the current state
    }
    const nextState = moveBlocks(state, move);
    const moves = generatePossibleMoves(state, tactics, random);
    if (moves.length === 0) {
        return scoreState(state); // No more moves available, return score
    }
    let bestScore = -Infinity;
    for (const move of moves) {
        const score = lookahead(nextState, move.move, depth - 1, tactics, scoreStateWithMove, scoreState, random); // Recursive lookahead
        bestScore = Math.max(bestScore, score); // Track the best score
    }
    return bestScore;
};
const removeDoubleMoves = (move, index, list) => list.findIndex((m2) => m2.move.from === move.move.from && m2.move.to === move.move.to) === index;
const generatePossibleMoves = (state, tactics, random = Math.random) => tactics
    .reduce((r, tactic) => r.concat(tactic(state, random)
    .sort((a, b) => a.weight - b.weight)
    .slice(0, 3)), [])
    .filter(removeDoubleMoves);
const evaluateBestMove = (initialState, tactics, scoreStateWithMove, scoreState, lookAheadCount, random = Math.random) => {
    const possibleMoves = generatePossibleMoves(initialState, tactics, random);
    let bestMove = null;
    let bestScore = -Infinity;
    for (const move of possibleMoves) {
        const moveScore = lookahead(initialState, move.move, lookAheadCount, tactics, scoreStateWithMove, scoreState, random);
        if (moveScore > bestScore) {
            bestScore = moveScore;
            bestMove = move;
        }
    }
    return bestMove;
};

const columnCompletionScore = (state) => state.columns.reduce((score, col) => {
    if (col.blocks.length === 0)
        return score; // Empty column, neutral
    const max = col.type === "placement" ? 10 : 5;
    const firstColor = col.blocks[0].blockType;
    const sameColorBlocks = col.blocks.filter((b) => b.blockType === firstColor).length;
    const completion = sameColorBlocks / col.blocks.length;
    return (score + (completion === 1 ? max * 2 * sameColorBlocks : completion * max)); // Bonus for completed columns
}, 0);
const bufferPenalty = (state) => {
    return state.columns.reduce((penalty, col) => {
        if (col.type === "buffer") {
            return penalty - col.blocks.length * 2; // Penalty for each block in buffer
        }
        return penalty;
    }, 0);
};
const blockingPenalty = (state) => state.columns.reduce((penalty, col) => {
    for (let i = 1; i < col.blocks.length; i++) {
        if (col.blocks[i].blockType !== col.blocks[i - 1].blockType) {
            penalty -= 5; // Penalty for each block that is blocked by a different color
        }
    }
    return penalty;
}, 0);
const isValidMove = (from, to) => {
    if (from.blocks.length === 0)
        return false;
    return canPlaceBlock(to, from.blocks[0]);
};
const futureMovePotential = (state) => {
    let potentialMoves = 0;
    for (let i = 0; i < state.columns.length; i++) {
        for (let j = 0; j < state.columns.length; j++) {
            if (i !== j && isValidMove(state.columns[i], state.columns[j])) {
                potentialMoves++;
            }
        }
    }
    return potentialMoves * 2; // Higher score for more valid moves
};
const lockedColumnReward = (state) => {
    return state.columns.reduce((score, col) => {
        if (col.locked && col.blocks.every((b) => b.blockType === col.limitColor)) {
            return score + 15; // Bonus for fully locked and sorted columns
        }
        return score;
    }, 0);
};
const balanceScore = (state) => {
    const maxBlocks = Math.max(...state.columns
        .filter((c) => c.type === "placement")
        .map((col) => col.blocks.length));
    const minBlocks = Math.min(...state.columns
        .filter((c) => c.type === "placement")
        .map((col) => col.blocks.length));
    return (maxBlocks - minBlocks) * -1; // Negative score for imbalance
};
const lockScore = (state) => -state.columns.reduce((score, col) => score + col.blocks.filter((b) => isLock(b)).length * 5, 0);
const splittingPenalty = (state, move) => {
    const fromColumn = state.columns[move.from];
    if (isColumnCorrectlySorted(fromColumn)) {
        return -10; // Arbitrary penalty value for breaking a sorted column
    }
    return 0;
};
const isBufferMove = (state, move) => {
    const fromColumn = state.columns[move.from];
    const toColumn = state.columns[move.to];
    return ((fromColumn.type === "buffer" || fromColumn.type === "inventory") &&
        toColumn.type === fromColumn.type &&
        fromColumn.columnSize === toColumn.columnSize &&
        toColumn.blocks.length === 0);
};
const isPartialMove = (state, move) => {
    const fromColumn = state.columns[move.from];
    return (fromColumn.blocks.length > 0 &&
        fromColumn.blocks.some((block, index) => index < fromColumn.blocks.length - 1 &&
            block.blockType !== fromColumn.blocks[0].blockType));
};
const scoreState = (state) => {
    const columnCompletion = columnCompletionScore(state);
    const bufferUsage = bufferPenalty(state);
    const blockedPenalty = blockingPenalty(state);
    const movePotential = futureMovePotential(state);
    const lockedReward = lockedColumnReward(state);
    const balance = balanceScore(state);
    const removedLocksScore = lockScore(state);
    return (columnCompletion +
        bufferUsage +
        blockedPenalty +
        movePotential +
        lockedReward +
        balance +
        removedLocksScore);
};
const scoreStateWithMove = (state, move) => {
    const newState = moveBlocks(state, move);
    let score = scoreState(newState);
    if (isBufferMove(state, move)) {
        score -= 10;
    }
    if (isPartialMove(state, move)) {
        score -= 5;
    }
    score += splittingPenalty(state, move);
    return score;
};

const defaultSolver = configureSolver([randomMove, startColumn, stackColumn, removeLock, storeKey], scoreState, scoreStateWithMove, 2);
const solvers = {
    default: defaultSolver
};

const BLOCK_COLORS = [
    "white", // square
    "red", // cross
    "yellow", // circle
    "blue", // moon
    "purple", // star
    "black", // music note?
    "green", // diamond
    "aqua", // lightning bolt
    "darkgreen", // clover
    "darkblue", // star
    "brown", // toadstool
    "pink", // animal footprint
    "turquoise", // triangle
    "orange", // butterfly
    "lightyellow", // sun
    "gray" // fish
];

const createLevelState = (columns, solver = "default") => {
    const blockTypes = columns.reduce((r, c) => c.blocks.reduce((r, b) => (r.includes(b.blockType) ? r : r.concat(b.blockType)), r), []);
    blockTypes.sort();
    const state = {
        blockTypes,
        columns,
        moves: []
    };
    if (solver !== "default") {
        state.solver = solver;
    }
    return state;
};
const createPlacementColumn = (size, blocks = [], limitColor, locked = false) => ({
    type: "placement",
    locked,
    columnSize: size,
    blocks,
    limitColor
});
const createBufferColumn = (size, limitColor, blocks = [], type = "buffer") => ({
    type,
    locked: false,
    columnSize: size,
    blocks,
    limitColor
});
const createBlock = (blockType, hidden) => ({
    blockType,
    revealed: hidden !== true
});

const generateRandomLevel = ({ amountColors = 2, stackSize = 4, extraPlacementStacks = 2, extraPlacementLimits = 0, buffers = 0, bufferSizes = 1, bufferPlacementLimits = 0, extraBuffers = [], blockColorPick = "start", hideBlockTypes = "none", stacksPerColor = 1, solver = "default", amountLockTypes = 0, amountLocks = 0, lockOffset = 0, layoutMap }, random) => {
    // This results in gradually reveal new colors as you progress
    const colorPool = Math.ceil(amountColors / 4) * 4;
    // Generate level, this should be extracted
    const availableColors = blockColorPick === "end"
        ? BLOCK_COLORS.slice(-colorPool)
        : BLOCK_COLORS.slice(0, colorPool);
    shuffle(availableColors, random);
    // This simulates having 12 colors for the first few levels,
    // resulting in a better level design
    timesMap(Math.max(12 - colorPool, 0), () => random());
    const bufferList = [
        {
            amount: buffers,
            size: bufferSizes,
            limit: bufferPlacementLimits,
            bufferType: "normal"
        }
    ].concat(extraBuffers);
    const blockColors = availableColors.slice(0, amountColors);
    let stackLimit = blockColors.length - extraPlacementLimits;
    // 1. select lock type
    const lockKeyBlocks = [];
    if (amountLockTypes > 0) {
        const lockKeyPairs = lockNKeyPairs.slice();
        const start = Math.min(lockOffset, lockKeyPairs.length - amountLockTypes);
        const lockTypes = lockKeyPairs.slice(start, start + amountLockTypes);
        const lockAndKeys = new Array(amountLocks).fill(0).flatMap((_v, i) => {
            const lockType = lockTypes[i % lockTypes.length];
            return [`${lockType}-lock`, `${lockType}-key`];
        });
        lockKeyBlocks.push(...lockAndKeys);
    }
    const amountBars = amountColors * stacksPerColor;
    const blocks = [];
    const amountPerColor = Math.ceil(lockKeyBlocks.length / blockColors.length);
    for (const color of blockColors) {
        const newColor = new Array(stackSize * stacksPerColor).fill(color);
        // Evenly distribute locks and keys over the colors
        const locksOrKeys = lockKeyBlocks.splice(0, amountPerColor);
        newColor.splice(0, locksOrKeys.length, ...locksOrKeys);
        blocks.push(...newColor);
    }
    shuffle(blocks, random);
    const columns = timesMap(amountBars, (ci) => createPlacementColumn(stackSize, new Array(stackSize)
        .fill(0)
        .map((_, i) => createBlock(blocks.shift(), (hideBlockTypes === "all" ||
        (hideBlockTypes === "checker" && (i + (ci % 2)) % 2 === 0)) &&
        i !== 0))))
        .concat(timesMap(extraPlacementStacks, (i) => createPlacementColumn(stackSize, [], i < extraPlacementLimits ? blockColors[stackLimit + i] : undefined)))
        .concat(bufferList.flatMap(({ amount, size, limit, bufferType = "normal" }) => {
        stackLimit -= limit;
        return timesMap(amount, (i) => createBufferColumn(size, bufferType === "unlimited"
            ? "rainbow"
            : i < limit
                ? blockColors[stackLimit + i]
                : undefined, [], bufferType === "inventory" ? "inventory" : "buffer"));
    }));
    const levelState = createLevelState(columns, solver);
    return applyLayoutMap(levelState, layoutMap);
};
const applyLayoutMap = (levelState, layoutMap) => {
    if (!layoutMap)
        return levelState;
    const offsetPos = (fromColumn) => {
        if (fromColumn > -1)
            return fromColumn;
        return levelState.columns.length + fromColumn;
    };
    const matchColumn = (fromColumn, index) => {
        if (offsetPos(fromColumn) === index)
            return true;
        return false;
    };
    const unaffectedColumns = levelState.columns.filter((_c, i) => !layoutMap.columns.some((l) => matchColumn(l.fromColumn, i)));
    const reorderedColumns = Array.from({
        length: levelState.columns.length
    }).fill(null);
    layoutMap.columns.forEach((c) => {
        const column = levelState.columns.find((_, i) => matchColumn(c.fromColumn, i));
        if (!column) {
            throw new Error("Column not found");
        }
        reorderedColumns[c.toColumn !== undefined ? offsetPos(c.toColumn) : c.fromColumn] = {
            ...column,
            paddingTop: c.paddingTop
        };
    });
    const newColumns = reorderedColumns.map((c) => c ?? unaffectedColumns.shift());
    return { ...levelState, columns: newColumns, width: layoutMap.width };
};
const hasMinimalLevelQuality = (level) => !isStuck(level) && allShuffled(level) && isLockSolvable(level);

const MAX_GENERATE_COST = 2_000;
const generatePlayableLevel = async (settings, { random = Math.random, seed = null, attempts = 1, afterAttempt } = {}, solver = defaultSolver) => {
    // Start logging level seeds for faster reproduction
    const startSeed = seed ?? Math.floor(random() * 1e9);
    let attempt = 0;
    while (attempt < attempts) {
        const seed = startSeed + attempt;
        const generationRandom = mulberry32(seed);
        attempt++;
        const level = generateRandomLevel(settings, generationRandom);
        if (!hasMinimalLevelQuality(level)) {
            continue;
        }
        const [beatable, solveMoves, cost] = await solver(level, generationRandom);
        if (afterAttempt) {
            await afterAttempt();
        }
        const generationCost = cost + attempt * MAX_GENERATE_COST;
        // Scrub name from moves
        const moves = solveMoves.map(({ from, to }) => ({ from, to }));
        if (beatable) {
            if (settings.playMoves !== undefined) {
                const [minMoves, maxMovesPercentage] = settings.playMoves;
                const movesToPlay = Math.min(minMoves, Math.floor(maxMovesPercentage * moves.length));
                const playedLevel = moves
                    .slice(0, movesToPlay)
                    .reduce((state, move) => moveBlocks(state, move), level);
                return {
                    ...playedLevel,
                    moves: moves.slice(movesToPlay),
                    generationInformation: {
                        cost: generationCost,
                        attempts: attempt,
                        seed
                    }
                };
            }
            return {
                ...level,
                moves,
                generationInformation: {
                    cost: generationCost,
                    attempts: attempt,
                    seed
                }
            };
        }
    }
    throw new Error("Can't generate playable level");
};

const MAX_GENERATE_ATTEMPTS = 5_000;
if (parentPort) {
    const startSeed = workerData.startSeed;
    const settings = workerData.settings;
    const amount = workerData.amount;
    for (let i = 0; i < amount; i++) {
        const seed = startSeed + i;
        const random = mulberry32(seed);
        const solver = solvers[settings.solver ?? "default"];
        try {
            const level = await generatePlayableLevel(settings, {
                random,
                attempts: MAX_GENERATE_ATTEMPTS,
                afterAttempt: async () => {
                    if (parentPort) {
                        // notify of attempt
                        parentPort.postMessage({
                            seed: null,
                            moves: null
                        });
                    }
                }
            }, solver);
            const optimizedLevel = optimizeMoves(level);
            parentPort.postMessage({
                seed: optimizedLevel.generationInformation?.seed,
                moves: optimizedLevel.moves.length
            });
        }
        catch (e) {
            console.error(e);
            process.exit(2);
        }
    }
}
