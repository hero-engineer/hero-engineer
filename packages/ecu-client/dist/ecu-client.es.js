(function(){"use strict";try{if(typeof document!="undefined"){var e=document.createElement("style");e.appendChild(document.createTextNode('@import"https://fonts.googleapis.com/css2?family=Cormorant&family=Inter:wght@400;600&display=swap";.ecu-selected{outline:1px solid lightblue}.ecu-drag{opacity:.5}.ecu-drop{outline:1px solid deepskyblue}')),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import * as z from "react";
import qn, { createContext as Ct, useRef as $e, useState as ye, useCallback as Ne, useEffect as we, useMemo as De, useContext as tt, memo as cn, useLayoutEffect as Rn, isValidElement as pf, cloneElement as At, forwardRef as ke, createElement as Nt, Fragment as La, Children as zt, lazy as hf, Suspense as gf } from "react";
import * as mf from "react-dom";
import Zr, { createPortal as yf } from "react-dom";
function ro(e, t) {
  if (!Boolean(e))
    throw new Error(t);
}
function bf(e) {
  return typeof e == "object" && e !== null;
}
function vf(e, t) {
  if (!Boolean(e))
    throw new Error(
      t != null ? t : "Unexpected invariant triggered."
    );
}
const xf = /\r\n|[\n\r]/g;
function ra(e, t) {
  let n = 0, r = 1;
  for (const o of e.body.matchAll(xf)) {
    if (typeof o.index == "number" || vf(!1), o.index >= t)
      break;
    n = o.index + o[0].length, r += 1;
  }
  return {
    line: r,
    column: t + 1 - n
  };
}
function Of(e) {
  return sl(
    e.source,
    ra(e.source, e.start)
  );
}
function sl(e, t) {
  const n = e.locationOffset.column - 1, r = "".padStart(n) + e.body, o = t.line - 1, i = e.locationOffset.line - 1, a = t.line + i, s = t.line === 1 ? n : 0, l = t.column + s, u = `${e.name}:${a}:${l}
`, d = r.split(/\r\n|[\n\r]/g), p = d[o];
  if (p.length > 120) {
    const h = Math.floor(l / 80), b = l % 80, v = [];
    for (let g = 0; g < p.length; g += 80)
      v.push(p.slice(g, g + 80));
    return u + Os([
      [`${a} |`, v[0]],
      ...v.slice(1, h + 1).map((g) => ["|", g]),
      ["|", "^".padStart(b)],
      ["|", v[h + 1]]
    ]);
  }
  return u + Os([
    [`${a - 1} |`, d[o - 1]],
    [`${a} |`, p],
    ["|", "^".padStart(l)],
    [`${a + 1} |`, d[o + 1]]
  ]);
}
function Os(e) {
  const t = e.filter(([r, o]) => o !== void 0), n = Math.max(...t.map(([r]) => r.length));
  return t.map(([r, o]) => r.padStart(n) + (o ? " " + o : "")).join(`
`);
}
function Ef(e) {
  const t = e[0];
  return t == null || "kind" in t || "length" in t ? {
    nodes: t,
    source: e[1],
    positions: e[2],
    path: e[3],
    originalError: e[4],
    extensions: e[5]
  } : t;
}
class Ar extends Error {
  constructor(t, ...n) {
    var r, o, i;
    const { nodes: a, source: s, positions: l, path: u, originalError: d, extensions: p } = Ef(n);
    super(t), this.name = "GraphQLError", this.path = u != null ? u : void 0, this.originalError = d != null ? d : void 0, this.nodes = Es(
      Array.isArray(a) ? a : a ? [a] : void 0
    );
    const h = Es(
      (r = this.nodes) === null || r === void 0 ? void 0 : r.map((v) => v.loc).filter((v) => v != null)
    );
    this.source = s != null ? s : h == null || (o = h[0]) === null || o === void 0 ? void 0 : o.source, this.positions = l != null ? l : h == null ? void 0 : h.map((v) => v.start), this.locations = l && s ? l.map((v) => ra(s, v)) : h == null ? void 0 : h.map((v) => ra(v.source, v.start));
    const b = bf(
      d == null ? void 0 : d.extensions
    ) ? d == null ? void 0 : d.extensions : void 0;
    this.extensions = (i = p != null ? p : b) !== null && i !== void 0 ? i : /* @__PURE__ */ Object.create(null), Object.defineProperties(this, {
      message: {
        writable: !0,
        enumerable: !0
      },
      name: {
        enumerable: !1
      },
      nodes: {
        enumerable: !1
      },
      source: {
        enumerable: !1
      },
      positions: {
        enumerable: !1
      },
      originalError: {
        enumerable: !1
      }
    }), d != null && d.stack ? Object.defineProperty(this, "stack", {
      value: d.stack,
      writable: !0,
      configurable: !0
    }) : Error.captureStackTrace ? Error.captureStackTrace(this, Ar) : Object.defineProperty(this, "stack", {
      value: Error().stack,
      writable: !0,
      configurable: !0
    });
  }
  get [Symbol.toStringTag]() {
    return "GraphQLError";
  }
  toString() {
    let t = this.message;
    if (this.nodes)
      for (const n of this.nodes)
        n.loc && (t += `

` + Of(n.loc));
    else if (this.source && this.locations)
      for (const n of this.locations)
        t += `

` + sl(this.source, n);
    return t;
  }
  toJSON() {
    const t = {
      message: this.message
    };
    return this.locations != null && (t.locations = this.locations), this.path != null && (t.path = this.path), this.extensions != null && Object.keys(this.extensions).length > 0 && (t.extensions = this.extensions), t;
  }
}
function Es(e) {
  return e === void 0 || e.length === 0 ? void 0 : e;
}
function Ke(e, t, n) {
  return new Ar(`Syntax Error: ${n}`, {
    source: e,
    positions: [t]
  });
}
class wf {
  constructor(t, n, r) {
    this.start = t.start, this.end = n.end, this.startToken = t, this.endToken = n, this.source = r;
  }
  get [Symbol.toStringTag]() {
    return "Location";
  }
  toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  }
}
class cl {
  constructor(t, n, r, o, i, a) {
    this.kind = t, this.start = n, this.end = r, this.line = o, this.column = i, this.value = a, this.prev = null, this.next = null;
  }
  get [Symbol.toStringTag]() {
    return "Token";
  }
  toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  }
}
const ll = {
  Name: [],
  Document: ["definitions"],
  OperationDefinition: [
    "name",
    "variableDefinitions",
    "directives",
    "selectionSet"
  ],
  VariableDefinition: ["variable", "type", "defaultValue", "directives"],
  Variable: ["name"],
  SelectionSet: ["selections"],
  Field: ["alias", "name", "arguments", "directives", "selectionSet"],
  Argument: ["name", "value"],
  FragmentSpread: ["name", "directives"],
  InlineFragment: ["typeCondition", "directives", "selectionSet"],
  FragmentDefinition: [
    "name",
    "variableDefinitions",
    "typeCondition",
    "directives",
    "selectionSet"
  ],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ["values"],
  ObjectValue: ["fields"],
  ObjectField: ["name", "value"],
  Directive: ["name", "arguments"],
  NamedType: ["name"],
  ListType: ["type"],
  NonNullType: ["type"],
  SchemaDefinition: ["description", "directives", "operationTypes"],
  OperationTypeDefinition: ["type"],
  ScalarTypeDefinition: ["description", "name", "directives"],
  ObjectTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  FieldDefinition: ["description", "name", "arguments", "type", "directives"],
  InputValueDefinition: [
    "description",
    "name",
    "type",
    "defaultValue",
    "directives"
  ],
  InterfaceTypeDefinition: [
    "description",
    "name",
    "interfaces",
    "directives",
    "fields"
  ],
  UnionTypeDefinition: ["description", "name", "directives", "types"],
  EnumTypeDefinition: ["description", "name", "directives", "values"],
  EnumValueDefinition: ["description", "name", "directives"],
  InputObjectTypeDefinition: ["description", "name", "directives", "fields"],
  DirectiveDefinition: ["description", "name", "arguments", "locations"],
  SchemaExtension: ["directives", "operationTypes"],
  ScalarTypeExtension: ["name", "directives"],
  ObjectTypeExtension: ["name", "interfaces", "directives", "fields"],
  InterfaceTypeExtension: ["name", "interfaces", "directives", "fields"],
  UnionTypeExtension: ["name", "directives", "types"],
  EnumTypeExtension: ["name", "directives", "values"],
  InputObjectTypeExtension: ["name", "directives", "fields"]
}, Sf = new Set(Object.keys(ll));
function ws(e) {
  const t = e == null ? void 0 : e.kind;
  return typeof t == "string" && Sf.has(t);
}
var Wn;
(function(e) {
  e.QUERY = "query", e.MUTATION = "mutation", e.SUBSCRIPTION = "subscription";
})(Wn || (Wn = {}));
var oa;
(function(e) {
  e.QUERY = "QUERY", e.MUTATION = "MUTATION", e.SUBSCRIPTION = "SUBSCRIPTION", e.FIELD = "FIELD", e.FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION", e.FRAGMENT_SPREAD = "FRAGMENT_SPREAD", e.INLINE_FRAGMENT = "INLINE_FRAGMENT", e.VARIABLE_DEFINITION = "VARIABLE_DEFINITION", e.SCHEMA = "SCHEMA", e.SCALAR = "SCALAR", e.OBJECT = "OBJECT", e.FIELD_DEFINITION = "FIELD_DEFINITION", e.ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION", e.INTERFACE = "INTERFACE", e.UNION = "UNION", e.ENUM = "ENUM", e.ENUM_VALUE = "ENUM_VALUE", e.INPUT_OBJECT = "INPUT_OBJECT", e.INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION";
})(oa || (oa = {}));
var Q;
(function(e) {
  e.NAME = "Name", e.DOCUMENT = "Document", e.OPERATION_DEFINITION = "OperationDefinition", e.VARIABLE_DEFINITION = "VariableDefinition", e.SELECTION_SET = "SelectionSet", e.FIELD = "Field", e.ARGUMENT = "Argument", e.FRAGMENT_SPREAD = "FragmentSpread", e.INLINE_FRAGMENT = "InlineFragment", e.FRAGMENT_DEFINITION = "FragmentDefinition", e.VARIABLE = "Variable", e.INT = "IntValue", e.FLOAT = "FloatValue", e.STRING = "StringValue", e.BOOLEAN = "BooleanValue", e.NULL = "NullValue", e.ENUM = "EnumValue", e.LIST = "ListValue", e.OBJECT = "ObjectValue", e.OBJECT_FIELD = "ObjectField", e.DIRECTIVE = "Directive", e.NAMED_TYPE = "NamedType", e.LIST_TYPE = "ListType", e.NON_NULL_TYPE = "NonNullType", e.SCHEMA_DEFINITION = "SchemaDefinition", e.OPERATION_TYPE_DEFINITION = "OperationTypeDefinition", e.SCALAR_TYPE_DEFINITION = "ScalarTypeDefinition", e.OBJECT_TYPE_DEFINITION = "ObjectTypeDefinition", e.FIELD_DEFINITION = "FieldDefinition", e.INPUT_VALUE_DEFINITION = "InputValueDefinition", e.INTERFACE_TYPE_DEFINITION = "InterfaceTypeDefinition", e.UNION_TYPE_DEFINITION = "UnionTypeDefinition", e.ENUM_TYPE_DEFINITION = "EnumTypeDefinition", e.ENUM_VALUE_DEFINITION = "EnumValueDefinition", e.INPUT_OBJECT_TYPE_DEFINITION = "InputObjectTypeDefinition", e.DIRECTIVE_DEFINITION = "DirectiveDefinition", e.SCHEMA_EXTENSION = "SchemaExtension", e.SCALAR_TYPE_EXTENSION = "ScalarTypeExtension", e.OBJECT_TYPE_EXTENSION = "ObjectTypeExtension", e.INTERFACE_TYPE_EXTENSION = "InterfaceTypeExtension", e.UNION_TYPE_EXTENSION = "UnionTypeExtension", e.ENUM_TYPE_EXTENSION = "EnumTypeExtension", e.INPUT_OBJECT_TYPE_EXTENSION = "InputObjectTypeExtension";
})(Q || (Q = {}));
function ia(e) {
  return e === 9 || e === 32;
}
function jr(e) {
  return e >= 48 && e <= 57;
}
function ul(e) {
  return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function fl(e) {
  return ul(e) || e === 95;
}
function Tf(e) {
  return ul(e) || jr(e) || e === 95;
}
function Cf(e) {
  var t;
  let n = Number.MAX_SAFE_INTEGER, r = null, o = -1;
  for (let a = 0; a < e.length; ++a) {
    var i;
    const s = e[a], l = If(s);
    l !== s.length && (r = (i = r) !== null && i !== void 0 ? i : a, o = a, a !== 0 && l < n && (n = l));
  }
  return e.map((a, s) => s === 0 ? a : a.slice(n)).slice(
    (t = r) !== null && t !== void 0 ? t : 0,
    o + 1
  );
}
function If(e) {
  let t = 0;
  for (; t < e.length && ia(e.charCodeAt(t)); )
    ++t;
  return t;
}
function kf(e, t) {
  const n = e.replace(/"""/g, '\\"""'), r = n.split(/\r\n|[\n\r]/g), o = r.length === 1, i = r.length > 1 && r.slice(1).every((b) => b.length === 0 || ia(b.charCodeAt(0))), a = n.endsWith('\\"""'), s = e.endsWith('"') && !a, l = e.endsWith("\\"), u = s || l, d = !(t != null && t.minimize) && (!o || e.length > 70 || u || i || a);
  let p = "";
  const h = o && ia(e.charCodeAt(0));
  return (d && !h || i) && (p += `
`), p += n, (d || u) && (p += `
`), '"""' + p + '"""';
}
var R;
(function(e) {
  e.SOF = "<SOF>", e.EOF = "<EOF>", e.BANG = "!", e.DOLLAR = "$", e.AMP = "&", e.PAREN_L = "(", e.PAREN_R = ")", e.SPREAD = "...", e.COLON = ":", e.EQUALS = "=", e.AT = "@", e.BRACKET_L = "[", e.BRACKET_R = "]", e.BRACE_L = "{", e.PIPE = "|", e.BRACE_R = "}", e.NAME = "Name", e.INT = "Int", e.FLOAT = "Float", e.STRING = "String", e.BLOCK_STRING = "BlockString", e.COMMENT = "Comment";
})(R || (R = {}));
class _f {
  constructor(t) {
    const n = new cl(R.SOF, 0, 0, 0, 0);
    this.source = t, this.lastToken = n, this.token = n, this.line = 1, this.lineStart = 0;
  }
  get [Symbol.toStringTag]() {
    return "Lexer";
  }
  advance() {
    return this.lastToken = this.token, this.token = this.lookahead();
  }
  lookahead() {
    let t = this.token;
    if (t.kind !== R.EOF)
      do
        if (t.next)
          t = t.next;
        else {
          const n = Rf(this, t.end);
          t.next = n, n.prev = t, t = n;
        }
      while (t.kind === R.COMMENT);
    return t;
  }
}
function Df(e) {
  return e === R.BANG || e === R.DOLLAR || e === R.AMP || e === R.PAREN_L || e === R.PAREN_R || e === R.SPREAD || e === R.COLON || e === R.EQUALS || e === R.AT || e === R.BRACKET_L || e === R.BRACKET_R || e === R.BRACE_L || e === R.PIPE || e === R.BRACE_R;
}
function Xn(e) {
  return e >= 0 && e <= 55295 || e >= 57344 && e <= 1114111;
}
function Io(e, t) {
  return dl(e.charCodeAt(t)) && pl(e.charCodeAt(t + 1));
}
function dl(e) {
  return e >= 55296 && e <= 56319;
}
function pl(e) {
  return e >= 56320 && e <= 57343;
}
function Tn(e, t) {
  const n = e.source.body.codePointAt(t);
  if (n === void 0)
    return R.EOF;
  if (n >= 32 && n <= 126) {
    const r = String.fromCodePoint(n);
    return r === '"' ? `'"'` : `"${r}"`;
  }
  return "U+" + n.toString(16).toUpperCase().padStart(4, "0");
}
function He(e, t, n, r, o) {
  const i = e.line, a = 1 + n - e.lineStart;
  return new cl(t, n, r, i, a, o);
}
function Rf(e, t) {
  const n = e.source.body, r = n.length;
  let o = t;
  for (; o < r; ) {
    const i = n.charCodeAt(o);
    switch (i) {
      case 65279:
      case 9:
      case 32:
      case 44:
        ++o;
        continue;
      case 10:
        ++o, ++e.line, e.lineStart = o;
        continue;
      case 13:
        n.charCodeAt(o + 1) === 10 ? o += 2 : ++o, ++e.line, e.lineStart = o;
        continue;
      case 35:
        return Nf(e, o);
      case 33:
        return He(e, R.BANG, o, o + 1);
      case 36:
        return He(e, R.DOLLAR, o, o + 1);
      case 38:
        return He(e, R.AMP, o, o + 1);
      case 40:
        return He(e, R.PAREN_L, o, o + 1);
      case 41:
        return He(e, R.PAREN_R, o, o + 1);
      case 46:
        if (n.charCodeAt(o + 1) === 46 && n.charCodeAt(o + 2) === 46)
          return He(e, R.SPREAD, o, o + 3);
        break;
      case 58:
        return He(e, R.COLON, o, o + 1);
      case 61:
        return He(e, R.EQUALS, o, o + 1);
      case 64:
        return He(e, R.AT, o, o + 1);
      case 91:
        return He(e, R.BRACKET_L, o, o + 1);
      case 93:
        return He(e, R.BRACKET_R, o, o + 1);
      case 123:
        return He(e, R.BRACE_L, o, o + 1);
      case 124:
        return He(e, R.PIPE, o, o + 1);
      case 125:
        return He(e, R.BRACE_R, o, o + 1);
      case 34:
        return n.charCodeAt(o + 1) === 34 && n.charCodeAt(o + 2) === 34 ? Ff(e, o) : Af(e, o);
    }
    if (jr(i) || i === 45)
      return Pf(e, o, i);
    if (fl(i))
      return Bf(e, o);
    throw Ke(
      e.source,
      o,
      i === 39 ? `Unexpected single quote character ('), did you mean to use a double quote (")?` : Xn(i) || Io(n, o) ? `Unexpected character: ${Tn(e, o)}.` : `Invalid character: ${Tn(e, o)}.`
    );
  }
  return He(e, R.EOF, r, r);
}
function Nf(e, t) {
  const n = e.source.body, r = n.length;
  let o = t + 1;
  for (; o < r; ) {
    const i = n.charCodeAt(o);
    if (i === 10 || i === 13)
      break;
    if (Xn(i))
      ++o;
    else if (Io(n, o))
      o += 2;
    else
      break;
  }
  return He(
    e,
    R.COMMENT,
    t,
    o,
    n.slice(t + 1, o)
  );
}
function Pf(e, t, n) {
  const r = e.source.body;
  let o = t, i = n, a = !1;
  if (i === 45 && (i = r.charCodeAt(++o)), i === 48) {
    if (i = r.charCodeAt(++o), jr(i))
      throw Ke(
        e.source,
        o,
        `Invalid number, unexpected digit after 0: ${Tn(
          e,
          o
        )}.`
      );
  } else
    o = Ri(e, o, i), i = r.charCodeAt(o);
  if (i === 46 && (a = !0, i = r.charCodeAt(++o), o = Ri(e, o, i), i = r.charCodeAt(o)), (i === 69 || i === 101) && (a = !0, i = r.charCodeAt(++o), (i === 43 || i === 45) && (i = r.charCodeAt(++o)), o = Ri(e, o, i), i = r.charCodeAt(o)), i === 46 || fl(i))
    throw Ke(
      e.source,
      o,
      `Invalid number, expected digit but got: ${Tn(
        e,
        o
      )}.`
    );
  return He(
    e,
    a ? R.FLOAT : R.INT,
    t,
    o,
    r.slice(t, o)
  );
}
function Ri(e, t, n) {
  if (!jr(n))
    throw Ke(
      e.source,
      t,
      `Invalid number, expected digit but got: ${Tn(
        e,
        t
      )}.`
    );
  const r = e.source.body;
  let o = t + 1;
  for (; jr(r.charCodeAt(o)); )
    ++o;
  return o;
}
function Af(e, t) {
  const n = e.source.body, r = n.length;
  let o = t + 1, i = o, a = "";
  for (; o < r; ) {
    const s = n.charCodeAt(o);
    if (s === 34)
      return a += n.slice(i, o), He(e, R.STRING, t, o + 1, a);
    if (s === 92) {
      a += n.slice(i, o);
      const l = n.charCodeAt(o + 1) === 117 ? n.charCodeAt(o + 2) === 123 ? jf(e, o) : Mf(e, o) : Lf(e, o);
      a += l.value, o += l.size, i = o;
      continue;
    }
    if (s === 10 || s === 13)
      break;
    if (Xn(s))
      ++o;
    else if (Io(n, o))
      o += 2;
    else
      throw Ke(
        e.source,
        o,
        `Invalid character within String: ${Tn(
          e,
          o
        )}.`
      );
  }
  throw Ke(e.source, o, "Unterminated string.");
}
function jf(e, t) {
  const n = e.source.body;
  let r = 0, o = 3;
  for (; o < 12; ) {
    const i = n.charCodeAt(t + o++);
    if (i === 125) {
      if (o < 5 || !Xn(r))
        break;
      return {
        value: String.fromCodePoint(r),
        size: o
      };
    }
    if (r = r << 4 | Cr(i), r < 0)
      break;
  }
  throw Ke(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(
      t,
      t + o
    )}".`
  );
}
function Mf(e, t) {
  const n = e.source.body, r = Ss(n, t + 2);
  if (Xn(r))
    return {
      value: String.fromCodePoint(r),
      size: 6
    };
  if (dl(r) && n.charCodeAt(t + 6) === 92 && n.charCodeAt(t + 7) === 117) {
    const o = Ss(n, t + 8);
    if (pl(o))
      return {
        value: String.fromCodePoint(r, o),
        size: 12
      };
  }
  throw Ke(
    e.source,
    t,
    `Invalid Unicode escape sequence: "${n.slice(t, t + 6)}".`
  );
}
function Ss(e, t) {
  return Cr(e.charCodeAt(t)) << 12 | Cr(e.charCodeAt(t + 1)) << 8 | Cr(e.charCodeAt(t + 2)) << 4 | Cr(e.charCodeAt(t + 3));
}
function Cr(e) {
  return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : -1;
}
function Lf(e, t) {
  const n = e.source.body;
  switch (n.charCodeAt(t + 1)) {
    case 34:
      return {
        value: '"',
        size: 2
      };
    case 92:
      return {
        value: "\\",
        size: 2
      };
    case 47:
      return {
        value: "/",
        size: 2
      };
    case 98:
      return {
        value: "\b",
        size: 2
      };
    case 102:
      return {
        value: "\f",
        size: 2
      };
    case 110:
      return {
        value: `
`,
        size: 2
      };
    case 114:
      return {
        value: "\r",
        size: 2
      };
    case 116:
      return {
        value: "	",
        size: 2
      };
  }
  throw Ke(
    e.source,
    t,
    `Invalid character escape sequence: "${n.slice(
      t,
      t + 2
    )}".`
  );
}
function Ff(e, t) {
  const n = e.source.body, r = n.length;
  let o = e.lineStart, i = t + 3, a = i, s = "";
  const l = [];
  for (; i < r; ) {
    const u = n.charCodeAt(i);
    if (u === 34 && n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34) {
      s += n.slice(a, i), l.push(s);
      const d = He(
        e,
        R.BLOCK_STRING,
        t,
        i + 3,
        Cf(l).join(`
`)
      );
      return e.line += l.length - 1, e.lineStart = o, d;
    }
    if (u === 92 && n.charCodeAt(i + 1) === 34 && n.charCodeAt(i + 2) === 34 && n.charCodeAt(i + 3) === 34) {
      s += n.slice(a, i), a = i + 1, i += 4;
      continue;
    }
    if (u === 10 || u === 13) {
      s += n.slice(a, i), l.push(s), u === 13 && n.charCodeAt(i + 1) === 10 ? i += 2 : ++i, s = "", a = i, o = i;
      continue;
    }
    if (Xn(u))
      ++i;
    else if (Io(n, i))
      i += 2;
    else
      throw Ke(
        e.source,
        i,
        `Invalid character within String: ${Tn(
          e,
          i
        )}.`
      );
  }
  throw Ke(e.source, i, "Unterminated string.");
}
function Bf(e, t) {
  const n = e.source.body, r = n.length;
  let o = t + 1;
  for (; o < r; ) {
    const i = n.charCodeAt(o);
    if (Tf(i))
      ++o;
    else
      break;
  }
  return He(
    e,
    R.NAME,
    t,
    o,
    n.slice(t, o)
  );
}
const $f = 10, hl = 2;
function Fa(e) {
  return ko(e, []);
}
function ko(e, t) {
  switch (typeof e) {
    case "string":
      return JSON.stringify(e);
    case "function":
      return e.name ? `[function ${e.name}]` : "[function]";
    case "object":
      return Vf(e, t);
    default:
      return String(e);
  }
}
function Vf(e, t) {
  if (e === null)
    return "null";
  if (t.includes(e))
    return "[Circular]";
  const n = [...t, e];
  if (Uf(e)) {
    const r = e.toJSON();
    if (r !== e)
      return typeof r == "string" ? r : ko(r, n);
  } else if (Array.isArray(e))
    return Hf(e, n);
  return zf(e, n);
}
function Uf(e) {
  return typeof e.toJSON == "function";
}
function zf(e, t) {
  const n = Object.entries(e);
  return n.length === 0 ? "{}" : t.length > hl ? "[" + Wf(e) + "]" : "{ " + n.map(
    ([o, i]) => o + ": " + ko(i, t)
  ).join(", ") + " }";
}
function Hf(e, t) {
  if (e.length === 0)
    return "[]";
  if (t.length > hl)
    return "[Array]";
  const n = Math.min($f, e.length), r = e.length - n, o = [];
  for (let i = 0; i < n; ++i)
    o.push(ko(e[i], t));
  return r === 1 ? o.push("... 1 more item") : r > 1 && o.push(`... ${r} more items`), "[" + o.join(", ") + "]";
}
function Wf(e) {
  const t = Object.prototype.toString.call(e).replace(/^\[object /, "").replace(/]$/, "");
  if (t === "Object" && typeof e.constructor == "function") {
    const n = e.constructor.name;
    if (typeof n == "string" && n !== "")
      return n;
  }
  return t;
}
const qf = process.env.NODE_ENV === "production" ? function(t, n) {
  return t instanceof n;
} : function(t, n) {
  if (t instanceof n)
    return !0;
  if (typeof t == "object" && t !== null) {
    var r;
    const o = n.prototype[Symbol.toStringTag], i = Symbol.toStringTag in t ? t[Symbol.toStringTag] : (r = t.constructor) === null || r === void 0 ? void 0 : r.name;
    if (o === i) {
      const a = Fa(t);
      throw new Error(`Cannot use ${o} "${a}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`);
    }
  }
  return !1;
};
class gl {
  constructor(t, n = "GraphQL request", r = {
    line: 1,
    column: 1
  }) {
    typeof t == "string" || ro(!1, `Body must be a string. Received: ${Fa(t)}.`), this.body = t, this.name = n, this.locationOffset = r, this.locationOffset.line > 0 || ro(
      !1,
      "line in locationOffset is 1-indexed and must be positive."
    ), this.locationOffset.column > 0 || ro(
      !1,
      "column in locationOffset is 1-indexed and must be positive."
    );
  }
  get [Symbol.toStringTag]() {
    return "Source";
  }
}
function Yf(e) {
  return qf(e, gl);
}
function Gf(e, t) {
  return new Kf(e, t).parseDocument();
}
class Kf {
  constructor(t, n = {}) {
    const r = Yf(t) ? t : new gl(t);
    this._lexer = new _f(r), this._options = n, this._tokenCounter = 0;
  }
  parseName() {
    const t = this.expectToken(R.NAME);
    return this.node(t, {
      kind: Q.NAME,
      value: t.value
    });
  }
  parseDocument() {
    return this.node(this._lexer.token, {
      kind: Q.DOCUMENT,
      definitions: this.many(
        R.SOF,
        this.parseDefinition,
        R.EOF
      )
    });
  }
  parseDefinition() {
    if (this.peek(R.BRACE_L))
      return this.parseOperationDefinition();
    const t = this.peekDescription(), n = t ? this._lexer.lookahead() : this._lexer.token;
    if (n.kind === R.NAME) {
      switch (n.value) {
        case "schema":
          return this.parseSchemaDefinition();
        case "scalar":
          return this.parseScalarTypeDefinition();
        case "type":
          return this.parseObjectTypeDefinition();
        case "interface":
          return this.parseInterfaceTypeDefinition();
        case "union":
          return this.parseUnionTypeDefinition();
        case "enum":
          return this.parseEnumTypeDefinition();
        case "input":
          return this.parseInputObjectTypeDefinition();
        case "directive":
          return this.parseDirectiveDefinition();
      }
      if (t)
        throw Ke(
          this._lexer.source,
          this._lexer.token.start,
          "Unexpected description, descriptions are supported only on type definitions."
        );
      switch (n.value) {
        case "query":
        case "mutation":
        case "subscription":
          return this.parseOperationDefinition();
        case "fragment":
          return this.parseFragmentDefinition();
        case "extend":
          return this.parseTypeSystemExtension();
      }
    }
    throw this.unexpected(n);
  }
  parseOperationDefinition() {
    const t = this._lexer.token;
    if (this.peek(R.BRACE_L))
      return this.node(t, {
        kind: Q.OPERATION_DEFINITION,
        operation: Wn.QUERY,
        name: void 0,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet()
      });
    const n = this.parseOperationType();
    let r;
    return this.peek(R.NAME) && (r = this.parseName()), this.node(t, {
      kind: Q.OPERATION_DEFINITION,
      operation: n,
      name: r,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseOperationType() {
    const t = this.expectToken(R.NAME);
    switch (t.value) {
      case "query":
        return Wn.QUERY;
      case "mutation":
        return Wn.MUTATION;
      case "subscription":
        return Wn.SUBSCRIPTION;
    }
    throw this.unexpected(t);
  }
  parseVariableDefinitions() {
    return this.optionalMany(
      R.PAREN_L,
      this.parseVariableDefinition,
      R.PAREN_R
    );
  }
  parseVariableDefinition() {
    return this.node(this._lexer.token, {
      kind: Q.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(R.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(R.EQUALS) ? this.parseConstValueLiteral() : void 0,
      directives: this.parseConstDirectives()
    });
  }
  parseVariable() {
    const t = this._lexer.token;
    return this.expectToken(R.DOLLAR), this.node(t, {
      kind: Q.VARIABLE,
      name: this.parseName()
    });
  }
  parseSelectionSet() {
    return this.node(this._lexer.token, {
      kind: Q.SELECTION_SET,
      selections: this.many(
        R.BRACE_L,
        this.parseSelection,
        R.BRACE_R
      )
    });
  }
  parseSelection() {
    return this.peek(R.SPREAD) ? this.parseFragment() : this.parseField();
  }
  parseField() {
    const t = this._lexer.token, n = this.parseName();
    let r, o;
    return this.expectOptionalToken(R.COLON) ? (r = n, o = this.parseName()) : o = n, this.node(t, {
      kind: Q.FIELD,
      alias: r,
      name: o,
      arguments: this.parseArguments(!1),
      directives: this.parseDirectives(!1),
      selectionSet: this.peek(R.BRACE_L) ? this.parseSelectionSet() : void 0
    });
  }
  parseArguments(t) {
    const n = t ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(R.PAREN_L, n, R.PAREN_R);
  }
  parseArgument(t = !1) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(R.COLON), this.node(n, {
      kind: Q.ARGUMENT,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  parseConstArgument() {
    return this.parseArgument(!0);
  }
  parseFragment() {
    const t = this._lexer.token;
    this.expectToken(R.SPREAD);
    const n = this.expectOptionalKeyword("on");
    return !n && this.peek(R.NAME) ? this.node(t, {
      kind: Q.FRAGMENT_SPREAD,
      name: this.parseFragmentName(),
      directives: this.parseDirectives(!1)
    }) : this.node(t, {
      kind: Q.INLINE_FRAGMENT,
      typeCondition: n ? this.parseNamedType() : void 0,
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentDefinition() {
    const t = this._lexer.token;
    return this.expectKeyword("fragment"), this._options.allowLegacyFragmentVariables === !0 ? this.node(t, {
      kind: Q.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      variableDefinitions: this.parseVariableDefinitions(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    }) : this.node(t, {
      kind: Q.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword("on"), this.parseNamedType()),
      directives: this.parseDirectives(!1),
      selectionSet: this.parseSelectionSet()
    });
  }
  parseFragmentName() {
    if (this._lexer.token.value === "on")
      throw this.unexpected();
    return this.parseName();
  }
  parseValueLiteral(t) {
    const n = this._lexer.token;
    switch (n.kind) {
      case R.BRACKET_L:
        return this.parseList(t);
      case R.BRACE_L:
        return this.parseObject(t);
      case R.INT:
        return this.advanceLexer(), this.node(n, {
          kind: Q.INT,
          value: n.value
        });
      case R.FLOAT:
        return this.advanceLexer(), this.node(n, {
          kind: Q.FLOAT,
          value: n.value
        });
      case R.STRING:
      case R.BLOCK_STRING:
        return this.parseStringLiteral();
      case R.NAME:
        switch (this.advanceLexer(), n.value) {
          case "true":
            return this.node(n, {
              kind: Q.BOOLEAN,
              value: !0
            });
          case "false":
            return this.node(n, {
              kind: Q.BOOLEAN,
              value: !1
            });
          case "null":
            return this.node(n, {
              kind: Q.NULL
            });
          default:
            return this.node(n, {
              kind: Q.ENUM,
              value: n.value
            });
        }
      case R.DOLLAR:
        if (t)
          if (this.expectToken(R.DOLLAR), this._lexer.token.kind === R.NAME) {
            const r = this._lexer.token.value;
            throw Ke(
              this._lexer.source,
              n.start,
              `Unexpected variable "$${r}" in constant value.`
            );
          } else
            throw this.unexpected(n);
        return this.parseVariable();
      default:
        throw this.unexpected();
    }
  }
  parseConstValueLiteral() {
    return this.parseValueLiteral(!0);
  }
  parseStringLiteral() {
    const t = this._lexer.token;
    return this.advanceLexer(), this.node(t, {
      kind: Q.STRING,
      value: t.value,
      block: t.kind === R.BLOCK_STRING
    });
  }
  parseList(t) {
    const n = () => this.parseValueLiteral(t);
    return this.node(this._lexer.token, {
      kind: Q.LIST,
      values: this.any(R.BRACKET_L, n, R.BRACKET_R)
    });
  }
  parseObject(t) {
    const n = () => this.parseObjectField(t);
    return this.node(this._lexer.token, {
      kind: Q.OBJECT,
      fields: this.any(R.BRACE_L, n, R.BRACE_R)
    });
  }
  parseObjectField(t) {
    const n = this._lexer.token, r = this.parseName();
    return this.expectToken(R.COLON), this.node(n, {
      kind: Q.OBJECT_FIELD,
      name: r,
      value: this.parseValueLiteral(t)
    });
  }
  parseDirectives(t) {
    const n = [];
    for (; this.peek(R.AT); )
      n.push(this.parseDirective(t));
    return n;
  }
  parseConstDirectives() {
    return this.parseDirectives(!0);
  }
  parseDirective(t) {
    const n = this._lexer.token;
    return this.expectToken(R.AT), this.node(n, {
      kind: Q.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(t)
    });
  }
  parseTypeReference() {
    const t = this._lexer.token;
    let n;
    if (this.expectOptionalToken(R.BRACKET_L)) {
      const r = this.parseTypeReference();
      this.expectToken(R.BRACKET_R), n = this.node(t, {
        kind: Q.LIST_TYPE,
        type: r
      });
    } else
      n = this.parseNamedType();
    return this.expectOptionalToken(R.BANG) ? this.node(t, {
      kind: Q.NON_NULL_TYPE,
      type: n
    }) : n;
  }
  parseNamedType() {
    return this.node(this._lexer.token, {
      kind: Q.NAMED_TYPE,
      name: this.parseName()
    });
  }
  peekDescription() {
    return this.peek(R.STRING) || this.peek(R.BLOCK_STRING);
  }
  parseDescription() {
    if (this.peekDescription())
      return this.parseStringLiteral();
  }
  parseSchemaDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("schema");
    const r = this.parseConstDirectives(), o = this.many(
      R.BRACE_L,
      this.parseOperationTypeDefinition,
      R.BRACE_R
    );
    return this.node(t, {
      kind: Q.SCHEMA_DEFINITION,
      description: n,
      directives: r,
      operationTypes: o
    });
  }
  parseOperationTypeDefinition() {
    const t = this._lexer.token, n = this.parseOperationType();
    this.expectToken(R.COLON);
    const r = this.parseNamedType();
    return this.node(t, {
      kind: Q.OPERATION_TYPE_DEFINITION,
      operation: n,
      type: r
    });
  }
  parseScalarTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("scalar");
    const r = this.parseName(), o = this.parseConstDirectives();
    return this.node(t, {
      kind: Q.SCALAR_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: o
    });
  }
  parseObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("type");
    const r = this.parseName(), o = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: Q.OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: o,
      directives: i,
      fields: a
    });
  }
  parseImplementsInterfaces() {
    return this.expectOptionalKeyword("implements") ? this.delimitedMany(R.AMP, this.parseNamedType) : [];
  }
  parseFieldsDefinition() {
    return this.optionalMany(
      R.BRACE_L,
      this.parseFieldDefinition,
      R.BRACE_R
    );
  }
  parseFieldDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName(), o = this.parseArgumentDefs();
    this.expectToken(R.COLON);
    const i = this.parseTypeReference(), a = this.parseConstDirectives();
    return this.node(t, {
      kind: Q.FIELD_DEFINITION,
      description: n,
      name: r,
      arguments: o,
      type: i,
      directives: a
    });
  }
  parseArgumentDefs() {
    return this.optionalMany(
      R.PAREN_L,
      this.parseInputValueDef,
      R.PAREN_R
    );
  }
  parseInputValueDef() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseName();
    this.expectToken(R.COLON);
    const o = this.parseTypeReference();
    let i;
    this.expectOptionalToken(R.EQUALS) && (i = this.parseConstValueLiteral());
    const a = this.parseConstDirectives();
    return this.node(t, {
      kind: Q.INPUT_VALUE_DEFINITION,
      description: n,
      name: r,
      type: o,
      defaultValue: i,
      directives: a
    });
  }
  parseInterfaceTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("interface");
    const r = this.parseName(), o = this.parseImplementsInterfaces(), i = this.parseConstDirectives(), a = this.parseFieldsDefinition();
    return this.node(t, {
      kind: Q.INTERFACE_TYPE_DEFINITION,
      description: n,
      name: r,
      interfaces: o,
      directives: i,
      fields: a
    });
  }
  parseUnionTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("union");
    const r = this.parseName(), o = this.parseConstDirectives(), i = this.parseUnionMemberTypes();
    return this.node(t, {
      kind: Q.UNION_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: o,
      types: i
    });
  }
  parseUnionMemberTypes() {
    return this.expectOptionalToken(R.EQUALS) ? this.delimitedMany(R.PIPE, this.parseNamedType) : [];
  }
  parseEnumTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("enum");
    const r = this.parseName(), o = this.parseConstDirectives(), i = this.parseEnumValuesDefinition();
    return this.node(t, {
      kind: Q.ENUM_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: o,
      values: i
    });
  }
  parseEnumValuesDefinition() {
    return this.optionalMany(
      R.BRACE_L,
      this.parseEnumValueDefinition,
      R.BRACE_R
    );
  }
  parseEnumValueDefinition() {
    const t = this._lexer.token, n = this.parseDescription(), r = this.parseEnumValueName(), o = this.parseConstDirectives();
    return this.node(t, {
      kind: Q.ENUM_VALUE_DEFINITION,
      description: n,
      name: r,
      directives: o
    });
  }
  parseEnumValueName() {
    if (this._lexer.token.value === "true" || this._lexer.token.value === "false" || this._lexer.token.value === "null")
      throw Ke(
        this._lexer.source,
        this._lexer.token.start,
        `${eo(
          this._lexer.token
        )} is reserved and cannot be used for an enum value.`
      );
    return this.parseName();
  }
  parseInputObjectTypeDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("input");
    const r = this.parseName(), o = this.parseConstDirectives(), i = this.parseInputFieldsDefinition();
    return this.node(t, {
      kind: Q.INPUT_OBJECT_TYPE_DEFINITION,
      description: n,
      name: r,
      directives: o,
      fields: i
    });
  }
  parseInputFieldsDefinition() {
    return this.optionalMany(
      R.BRACE_L,
      this.parseInputValueDef,
      R.BRACE_R
    );
  }
  parseTypeSystemExtension() {
    const t = this._lexer.lookahead();
    if (t.kind === R.NAME)
      switch (t.value) {
        case "schema":
          return this.parseSchemaExtension();
        case "scalar":
          return this.parseScalarTypeExtension();
        case "type":
          return this.parseObjectTypeExtension();
        case "interface":
          return this.parseInterfaceTypeExtension();
        case "union":
          return this.parseUnionTypeExtension();
        case "enum":
          return this.parseEnumTypeExtension();
        case "input":
          return this.parseInputObjectTypeExtension();
      }
    throw this.unexpected(t);
  }
  parseSchemaExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("schema");
    const n = this.parseConstDirectives(), r = this.optionalMany(
      R.BRACE_L,
      this.parseOperationTypeDefinition,
      R.BRACE_R
    );
    if (n.length === 0 && r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.SCHEMA_EXTENSION,
      directives: n,
      operationTypes: r
    });
  }
  parseScalarTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("scalar");
    const n = this.parseName(), r = this.parseConstDirectives();
    if (r.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.SCALAR_TYPE_EXTENSION,
      name: n,
      directives: r
    });
  }
  parseObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("type");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), o = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    if (r.length === 0 && o.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.OBJECT_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: o,
      fields: i
    });
  }
  parseInterfaceTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("interface");
    const n = this.parseName(), r = this.parseImplementsInterfaces(), o = this.parseConstDirectives(), i = this.parseFieldsDefinition();
    if (r.length === 0 && o.length === 0 && i.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.INTERFACE_TYPE_EXTENSION,
      name: n,
      interfaces: r,
      directives: o,
      fields: i
    });
  }
  parseUnionTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("union");
    const n = this.parseName(), r = this.parseConstDirectives(), o = this.parseUnionMemberTypes();
    if (r.length === 0 && o.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.UNION_TYPE_EXTENSION,
      name: n,
      directives: r,
      types: o
    });
  }
  parseEnumTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("enum");
    const n = this.parseName(), r = this.parseConstDirectives(), o = this.parseEnumValuesDefinition();
    if (r.length === 0 && o.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.ENUM_TYPE_EXTENSION,
      name: n,
      directives: r,
      values: o
    });
  }
  parseInputObjectTypeExtension() {
    const t = this._lexer.token;
    this.expectKeyword("extend"), this.expectKeyword("input");
    const n = this.parseName(), r = this.parseConstDirectives(), o = this.parseInputFieldsDefinition();
    if (r.length === 0 && o.length === 0)
      throw this.unexpected();
    return this.node(t, {
      kind: Q.INPUT_OBJECT_TYPE_EXTENSION,
      name: n,
      directives: r,
      fields: o
    });
  }
  parseDirectiveDefinition() {
    const t = this._lexer.token, n = this.parseDescription();
    this.expectKeyword("directive"), this.expectToken(R.AT);
    const r = this.parseName(), o = this.parseArgumentDefs(), i = this.expectOptionalKeyword("repeatable");
    this.expectKeyword("on");
    const a = this.parseDirectiveLocations();
    return this.node(t, {
      kind: Q.DIRECTIVE_DEFINITION,
      description: n,
      name: r,
      arguments: o,
      repeatable: i,
      locations: a
    });
  }
  parseDirectiveLocations() {
    return this.delimitedMany(R.PIPE, this.parseDirectiveLocation);
  }
  parseDirectiveLocation() {
    const t = this._lexer.token, n = this.parseName();
    if (Object.prototype.hasOwnProperty.call(oa, n.value))
      return n;
    throw this.unexpected(t);
  }
  node(t, n) {
    return this._options.noLocation !== !0 && (n.loc = new wf(
      t,
      this._lexer.lastToken,
      this._lexer.source
    )), n;
  }
  peek(t) {
    return this._lexer.token.kind === t;
  }
  expectToken(t) {
    const n = this._lexer.token;
    if (n.kind === t)
      return this.advanceLexer(), n;
    throw Ke(
      this._lexer.source,
      n.start,
      `Expected ${ml(t)}, found ${eo(n)}.`
    );
  }
  expectOptionalToken(t) {
    return this._lexer.token.kind === t ? (this.advanceLexer(), !0) : !1;
  }
  expectKeyword(t) {
    const n = this._lexer.token;
    if (n.kind === R.NAME && n.value === t)
      this.advanceLexer();
    else
      throw Ke(
        this._lexer.source,
        n.start,
        `Expected "${t}", found ${eo(n)}.`
      );
  }
  expectOptionalKeyword(t) {
    const n = this._lexer.token;
    return n.kind === R.NAME && n.value === t ? (this.advanceLexer(), !0) : !1;
  }
  unexpected(t) {
    const n = t != null ? t : this._lexer.token;
    return Ke(
      this._lexer.source,
      n.start,
      `Unexpected ${eo(n)}.`
    );
  }
  any(t, n, r) {
    this.expectToken(t);
    const o = [];
    for (; !this.expectOptionalToken(r); )
      o.push(n.call(this));
    return o;
  }
  optionalMany(t, n, r) {
    if (this.expectOptionalToken(t)) {
      const o = [];
      do
        o.push(n.call(this));
      while (!this.expectOptionalToken(r));
      return o;
    }
    return [];
  }
  many(t, n, r) {
    this.expectToken(t);
    const o = [];
    do
      o.push(n.call(this));
    while (!this.expectOptionalToken(r));
    return o;
  }
  delimitedMany(t, n) {
    this.expectOptionalToken(t);
    const r = [];
    do
      r.push(n.call(this));
    while (this.expectOptionalToken(t));
    return r;
  }
  advanceLexer() {
    const { maxTokens: t } = this._options, n = this._lexer.advance();
    if (t !== void 0 && n.kind !== R.EOF && (++this._tokenCounter, this._tokenCounter > t))
      throw Ke(
        this._lexer.source,
        n.start,
        `Document contains more that ${t} tokens. Parsing aborted.`
      );
  }
}
function eo(e) {
  const t = e.value;
  return ml(e.kind) + (t != null ? ` "${t}"` : "");
}
function ml(e) {
  return Df(e) ? `"${e}"` : e;
}
function Xf(e) {
  return `"${e.replace(Jf, Qf)}"`;
}
const Jf = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function Qf(e) {
  return Zf[e.charCodeAt(0)];
}
const Zf = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
], ed = Object.freeze({});
function yl(e, t, n = ll) {
  const r = /* @__PURE__ */ new Map();
  for (const S of Object.values(Q))
    r.set(S, td(t, S));
  let o, i = Array.isArray(e), a = [e], s = -1, l = [], u = e, d, p;
  const h = [], b = [];
  do {
    s++;
    const S = s === a.length, y = S && l.length !== 0;
    if (S) {
      if (d = b.length === 0 ? void 0 : h[h.length - 1], u = p, p = b.pop(), y)
        if (i) {
          u = u.slice();
          let O = 0;
          for (const [C, _] of l) {
            const F = C - O;
            _ === null ? (u.splice(F, 1), O++) : u[F] = _;
          }
        } else {
          u = Object.defineProperties(
            {},
            Object.getOwnPropertyDescriptors(u)
          );
          for (const [O, C] of l)
            u[O] = C;
        }
      s = o.index, a = o.keys, l = o.edits, i = o.inArray, o = o.prev;
    } else if (p) {
      if (d = i ? s : a[s], u = p[d], u == null)
        continue;
      h.push(d);
    }
    let T;
    if (!Array.isArray(u)) {
      var v, g;
      ws(u) || ro(!1, `Invalid AST Node: ${Fa(u)}.`);
      const O = S ? (v = r.get(u.kind)) === null || v === void 0 ? void 0 : v.leave : (g = r.get(u.kind)) === null || g === void 0 ? void 0 : g.enter;
      if (T = O == null ? void 0 : O.call(t, u, d, p, h, b), T === ed)
        break;
      if (T === !1) {
        if (!S) {
          h.pop();
          continue;
        }
      } else if (T !== void 0 && (l.push([d, T]), !S))
        if (ws(T))
          u = T;
        else {
          h.pop();
          continue;
        }
    }
    if (T === void 0 && y && l.push([d, u]), S)
      h.pop();
    else {
      var w;
      o = {
        inArray: i,
        index: s,
        keys: a,
        edits: l,
        prev: o
      }, i = Array.isArray(u), a = i ? u : (w = n[u.kind]) !== null && w !== void 0 ? w : [], s = -1, l = [], p && b.push(p), p = u;
    }
  } while (o !== void 0);
  return l.length !== 0 ? l[l.length - 1][1] : e;
}
function td(e, t) {
  const n = e[t];
  return typeof n == "object" ? n : typeof n == "function" ? {
    enter: n,
    leave: void 0
  } : {
    enter: e.enter,
    leave: e.leave
  };
}
function bl(e) {
  return yl(e, rd);
}
const nd = 80, rd = {
  Name: {
    leave: (e) => e.value
  },
  Variable: {
    leave: (e) => "$" + e.name
  },
  Document: {
    leave: (e) => Y(e.definitions, `

`)
  },
  OperationDefinition: {
    leave(e) {
      const t = xe("(", Y(e.variableDefinitions, ", "), ")"), n = Y(
        [
          e.operation,
          Y([e.name, t]),
          Y(e.directives, " ")
        ],
        " "
      );
      return (n === "query" ? "" : n + " ") + e.selectionSet;
    }
  },
  VariableDefinition: {
    leave: ({ variable: e, type: t, defaultValue: n, directives: r }) => e + ": " + t + xe(" = ", n) + xe(" ", Y(r, " "))
  },
  SelectionSet: {
    leave: ({ selections: e }) => wt(e)
  },
  Field: {
    leave({ alias: e, name: t, arguments: n, directives: r, selectionSet: o }) {
      const i = xe("", e, ": ") + t;
      let a = i + xe("(", Y(n, ", "), ")");
      return a.length > nd && (a = i + xe(`(
`, oo(Y(n, `
`)), `
)`)), Y([a, Y(r, " "), o], " ");
    }
  },
  Argument: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  FragmentSpread: {
    leave: ({ name: e, directives: t }) => "..." + e + xe(" ", Y(t, " "))
  },
  InlineFragment: {
    leave: ({ typeCondition: e, directives: t, selectionSet: n }) => Y(
      [
        "...",
        xe("on ", e),
        Y(t, " "),
        n
      ],
      " "
    )
  },
  FragmentDefinition: {
    leave: ({ name: e, typeCondition: t, variableDefinitions: n, directives: r, selectionSet: o }) => `fragment ${e}${xe("(", Y(n, ", "), ")")} on ${t} ${xe("", Y(r, " "), " ")}` + o
  },
  IntValue: {
    leave: ({ value: e }) => e
  },
  FloatValue: {
    leave: ({ value: e }) => e
  },
  StringValue: {
    leave: ({ value: e, block: t }) => t ? kf(e) : Xf(e)
  },
  BooleanValue: {
    leave: ({ value: e }) => e ? "true" : "false"
  },
  NullValue: {
    leave: () => "null"
  },
  EnumValue: {
    leave: ({ value: e }) => e
  },
  ListValue: {
    leave: ({ values: e }) => "[" + Y(e, ", ") + "]"
  },
  ObjectValue: {
    leave: ({ fields: e }) => "{" + Y(e, ", ") + "}"
  },
  ObjectField: {
    leave: ({ name: e, value: t }) => e + ": " + t
  },
  Directive: {
    leave: ({ name: e, arguments: t }) => "@" + e + xe("(", Y(t, ", "), ")")
  },
  NamedType: {
    leave: ({ name: e }) => e
  },
  ListType: {
    leave: ({ type: e }) => "[" + e + "]"
  },
  NonNullType: {
    leave: ({ type: e }) => e + "!"
  },
  SchemaDefinition: {
    leave: ({ description: e, directives: t, operationTypes: n }) => xe("", e, `
`) + Y(["schema", Y(t, " "), wt(n)], " ")
  },
  OperationTypeDefinition: {
    leave: ({ operation: e, type: t }) => e + ": " + t
  },
  ScalarTypeDefinition: {
    leave: ({ description: e, name: t, directives: n }) => xe("", e, `
`) + Y(["scalar", t, Y(n, " ")], " ")
  },
  ObjectTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: o }) => xe("", e, `
`) + Y(
      [
        "type",
        t,
        xe("implements ", Y(n, " & ")),
        Y(r, " "),
        wt(o)
      ],
      " "
    )
  },
  FieldDefinition: {
    leave: ({ description: e, name: t, arguments: n, type: r, directives: o }) => xe("", e, `
`) + t + (Ts(n) ? xe(`(
`, oo(Y(n, `
`)), `
)`) : xe("(", Y(n, ", "), ")")) + ": " + r + xe(" ", Y(o, " "))
  },
  InputValueDefinition: {
    leave: ({ description: e, name: t, type: n, defaultValue: r, directives: o }) => xe("", e, `
`) + Y(
      [t + ": " + n, xe("= ", r), Y(o, " ")],
      " "
    )
  },
  InterfaceTypeDefinition: {
    leave: ({ description: e, name: t, interfaces: n, directives: r, fields: o }) => xe("", e, `
`) + Y(
      [
        "interface",
        t,
        xe("implements ", Y(n, " & ")),
        Y(r, " "),
        wt(o)
      ],
      " "
    )
  },
  UnionTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, types: r }) => xe("", e, `
`) + Y(
      ["union", t, Y(n, " "), xe("= ", Y(r, " | "))],
      " "
    )
  },
  EnumTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, values: r }) => xe("", e, `
`) + Y(["enum", t, Y(n, " "), wt(r)], " ")
  },
  EnumValueDefinition: {
    leave: ({ description: e, name: t, directives: n }) => xe("", e, `
`) + Y([t, Y(n, " ")], " ")
  },
  InputObjectTypeDefinition: {
    leave: ({ description: e, name: t, directives: n, fields: r }) => xe("", e, `
`) + Y(["input", t, Y(n, " "), wt(r)], " ")
  },
  DirectiveDefinition: {
    leave: ({ description: e, name: t, arguments: n, repeatable: r, locations: o }) => xe("", e, `
`) + "directive @" + t + (Ts(n) ? xe(`(
`, oo(Y(n, `
`)), `
)`) : xe("(", Y(n, ", "), ")")) + (r ? " repeatable" : "") + " on " + Y(o, " | ")
  },
  SchemaExtension: {
    leave: ({ directives: e, operationTypes: t }) => Y(
      ["extend schema", Y(e, " "), wt(t)],
      " "
    )
  },
  ScalarTypeExtension: {
    leave: ({ name: e, directives: t }) => Y(["extend scalar", e, Y(t, " ")], " ")
  },
  ObjectTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => Y(
      [
        "extend type",
        e,
        xe("implements ", Y(t, " & ")),
        Y(n, " "),
        wt(r)
      ],
      " "
    )
  },
  InterfaceTypeExtension: {
    leave: ({ name: e, interfaces: t, directives: n, fields: r }) => Y(
      [
        "extend interface",
        e,
        xe("implements ", Y(t, " & ")),
        Y(n, " "),
        wt(r)
      ],
      " "
    )
  },
  UnionTypeExtension: {
    leave: ({ name: e, directives: t, types: n }) => Y(
      [
        "extend union",
        e,
        Y(t, " "),
        xe("= ", Y(n, " | "))
      ],
      " "
    )
  },
  EnumTypeExtension: {
    leave: ({ name: e, directives: t, values: n }) => Y(["extend enum", e, Y(t, " "), wt(n)], " ")
  },
  InputObjectTypeExtension: {
    leave: ({ name: e, directives: t, fields: n }) => Y(["extend input", e, Y(t, " "), wt(n)], " ")
  }
};
function Y(e, t = "") {
  var n;
  return (n = e == null ? void 0 : e.filter((r) => r).join(t)) !== null && n !== void 0 ? n : "";
}
function wt(e) {
  return xe(`{
`, oo(Y(e, `
`)), `
}`);
}
function xe(e, t, n = "") {
  return t != null && t !== "" ? e + t + n : "";
}
function oo(e) {
  return xe("  ", e.replace(/\n/g, `
  `));
}
function Ts(e) {
  var t;
  return (t = e == null ? void 0 : e.some((n) => n.includes(`
`))) !== null && t !== void 0 ? t : !1;
}
var vl = () => {
}, ut = vl;
function It(e) {
  var t = [e];
  return t.tag = 0, t;
}
function Wr(e) {
  var t = [e];
  return t.tag = 1, t;
}
var od = (e) => e;
function gt(e) {
  return (t) => (n) => {
    var r = ut;
    t((o) => {
      o === 0 ? n(0) : o.tag === 0 ? (r = o[0], n(o)) : e(o[0]) ? n(o) : r(0);
    });
  };
}
function Dr(e) {
  return (t) => (n) => t((r) => {
    r === 0 || r.tag === 0 ? n(r) : n(Wr(e(r[0])));
  });
}
function xl(e) {
  return (t) => (n) => {
    var r = [], o = ut, i = !1, a = !1;
    t((s) => {
      a || (s === 0 ? (a = !0, r.length || n(0)) : s.tag === 0 ? o = s[0] : (i = !1, function(u) {
        var d = ut;
        u((p) => {
          if (p === 0) {
            if (r.length) {
              var h = r.indexOf(d);
              h > -1 && (r = r.slice()).splice(h, 1), r.length || (a ? n(0) : i || (i = !0, o(0)));
            }
          } else
            p.tag === 0 ? (r.push(d = p[0]), d(0)) : r.length && (n(p), d(0));
        });
      }(e(s[0])), i || (i = !0, o(0))));
    }), n(It((s) => {
      if (s === 1) {
        a || (a = !0, o(1));
        for (var l = 0, u = r, d = r.length; l < d; l++)
          u[l](1);
        r.length = 0;
      } else {
        !a && !i ? (i = !0, o(0)) : i = !1;
        for (var p = 0, h = r, b = r.length; p < b; p++)
          h[p](0);
      }
    }));
  };
}
function id(e) {
  return xl(od)(e);
}
function po(e) {
  return id(ud(e));
}
function aa(e) {
  return (t) => (n) => {
    var r = !1;
    t((o) => {
      if (!r)
        if (o === 0)
          r = !0, n(0), e();
        else if (o.tag === 0) {
          var i = o[0];
          n(It((a) => {
            a === 1 ? (r = !0, i(1), e()) : i(a);
          }));
        } else
          n(o);
    });
  };
}
function Cn(e) {
  return (t) => (n) => {
    var r = !1;
    t((o) => {
      if (!r)
        if (o === 0)
          r = !0, n(0);
        else if (o.tag === 0) {
          var i = o[0];
          n(It((a) => {
            a === 1 && (r = !0), i(a);
          }));
        } else
          e(o[0]), n(o);
    });
  };
}
function Cs(e) {
  return (t) => (n) => t((r) => {
    r === 0 ? n(0) : r.tag === 0 ? (n(r), e()) : n(r);
  });
}
function Mr(e) {
  var t = [], n = ut, r = !1;
  return (o) => {
    t.push(o), t.length === 1 && e((i) => {
      if (i === 0) {
        for (var a = 0, s = t, l = t.length; a < l; a++)
          s[a](0);
        t.length = 0;
      } else if (i.tag === 0)
        n = i[0];
      else {
        r = !1;
        for (var u = 0, d = t, p = t.length; u < p; u++)
          d[u](i);
      }
    }), o(It((i) => {
      if (i === 1) {
        var a = t.indexOf(o);
        a > -1 && (t = t.slice()).splice(a, 1), t.length || n(1);
      } else
        r || (r = !0, n(0));
    }));
  };
}
function ad(e) {
  return (t) => (n) => {
    var r = ut, o = ut, i = !1, a = !1, s = !1, l = !1;
    t((u) => {
      l || (u === 0 ? (l = !0, s || n(0)) : u.tag === 0 ? r = u[0] : (s && (o(1), o = ut), i ? i = !1 : (i = !0, r(0)), function(p) {
        s = !0, p((h) => {
          s && (h === 0 ? (s = !1, l ? n(0) : i || (i = !0, r(0))) : h.tag === 0 ? (a = !1, (o = h[0])(0)) : (n(h), a ? a = !1 : o(0)));
        });
      }(e(u[0]))));
    }), n(It((u) => {
      u === 1 ? (l || (l = !0, r(1)), s && (s = !1, o(1))) : (!l && !i && (i = !0, r(0)), s && !a && (a = !0, o(0)));
    }));
  };
}
function Is(e) {
  return (t) => (n) => {
    var r = ut, o = !1, i = 0;
    t((a) => {
      o || (a === 0 ? (o = !0, n(0)) : a.tag === 0 ? e <= 0 ? (o = !0, n(0), a[0](1)) : r = a[0] : i++ < e ? (n(a), !o && i >= e && (o = !0, n(0), r(1))) : n(a));
    }), n(It((a) => {
      a === 1 && !o ? (o = !0, r(1)) : a === 0 && !o && i < e && r(0);
    }));
  };
}
function Ol(e) {
  return (t) => (n) => {
    var r = ut, o = ut, i = !1;
    t((a) => {
      i || (a === 0 ? (i = !0, o(1), n(0)) : a.tag === 0 ? (r = a[0], e((s) => {
        s === 0 || (s.tag === 0 ? (o = s[0])(0) : (i = !0, r(1), n(0)));
      })) : n(a));
    }), n(It((a) => {
      a === 1 && !i ? (i = !0, r(1), o(1)) : i || r(0);
    }));
  };
}
function sd(e) {
  return (t) => (n) => {
    var r = ut, o = !1;
    t((i) => {
      o || (i === 0 ? (o = !0, n(0)) : i.tag === 0 ? (r = i[0], n(i)) : e(i[0]) ? n(i) : (o = !0, n(0), r(1)));
    });
  };
}
function cd(e) {
  return (t) => {
    var n = e[Symbol.asyncIterator](), r = !1, o = !1, i = !1, a;
    t(It(async (s) => {
      if (s === 1)
        r = !0, n.return && n.return();
      else if (o)
        i = !0;
      else {
        for (i = o = !0; i && !r; )
          if ((a = await n.next()).done)
            r = !0, n.return && await n.return(), t(0);
          else
            try {
              i = !1, t(Wr(a.value));
            } catch (l) {
              if (n.throw)
                (r = !!(await n.throw(l)).done) && t(0);
              else
                throw l;
            }
        o = !1;
      }
    }));
  };
}
function ld(e) {
  return e[Symbol.asyncIterator] ? cd(e) : (t) => {
    var n = e[Symbol.iterator](), r = !1, o = !1, i = !1, a;
    t(It((s) => {
      if (s === 1)
        r = !0, n.return && n.return();
      else if (o)
        i = !0;
      else {
        for (i = o = !0; i && !r; )
          if ((a = n.next()).done)
            r = !0, n.return && n.return(), t(0);
          else
            try {
              i = !1, t(Wr(a.value));
            } catch (l) {
              if (n.throw)
                (r = !!n.throw(l).done) && t(0);
              else
                throw l;
            }
        o = !1;
      }
    }));
  };
}
var ud = ld;
function ks(e) {
  return (t) => {
    var n = !1;
    t(It((r) => {
      r === 1 ? n = !0 : n || (n = !0, t(Wr(e)), t(0));
    }));
  };
}
function Ba(e) {
  return (t) => {
    var n = !1, r = e({
      next(o) {
        n || t(Wr(o));
      },
      complete() {
        n || (n = !0, t(0));
      }
    });
    t(It((o) => {
      o === 1 && !n && (n = !0, r());
    }));
  };
}
function _s() {
  var e, t;
  return {
    source: Mr(Ba((n) => (e = n.next, t = n.complete, vl))),
    next(n) {
      e && e(n);
    },
    complete() {
      t && t();
    }
  };
}
function rn(e) {
  return (t) => {
    var n = ut, r = !1;
    return t((o) => {
      o === 0 ? r = !0 : o.tag === 0 ? (n = o[0])(0) : r || (e(o[0]), n(0));
    }), {
      unsubscribe() {
        r || (r = !0, n(1));
      }
    };
  };
}
function fd(e) {
  rn((t) => {
  })(e);
}
function dd(e) {
  return new Promise((t) => {
    var n = ut, r;
    e((o) => {
      o === 0 ? t(r) : o.tag === 0 ? (n = o[0])(0) : (r = o[0], n(0));
    });
  });
}
var pd = (e) => typeof e == "string" ? new Ar(e) : typeof e == "object" && e.message ? new Ar(e.message, e.nodes, e.source, e.positions, e.path, e, e.extensions || {}) : e;
class $a extends Error {
  constructor(t) {
    var n = (t.graphQLErrors || []).map(pd), r = ((o, i) => {
      var a = "";
      if (o)
        return `[Network] ${o.message}`;
      if (i)
        for (var s of i)
          a && (a += `
`), a += `[GraphQL] ${s.message}`;
      return a;
    })(t.networkError, n);
    super(r), this.name = "CombinedError", this.message = r, this.graphQLErrors = n, this.networkError = t.networkError, this.response = t.response;
  }
  toString() {
    return this.message;
  }
}
var El = (e, t) => {
  for (var n = 0, r = 0 | t.length; n < r; n++)
    e = (e << 5) + e + t.charCodeAt(n);
  return 0 | e;
}, Ds = (e) => El(5381, e) >>> 0, io = /* @__PURE__ */ new Set(), Rs = /* @__PURE__ */ new WeakMap(), Ir = (e) => {
  if (e === null || io.has(e))
    return "null";
  if (typeof e != "object")
    return JSON.stringify(e) || "";
  if (e.toJSON)
    return Ir(e.toJSON());
  if (Array.isArray(e)) {
    var t = "[";
    for (var n of e)
      t !== "[" && (t += ","), t += (n = Ir(n)).length > 0 ? n : "null";
    return t += "]";
  }
  var r = Object.keys(e).sort();
  if (!r.length && e.constructor && e.constructor !== Object) {
    var o = Rs.get(e) || Math.random().toString(36).slice(2);
    return Rs.set(e, o), `{"__key":"${o}"}`;
  }
  io.add(e);
  var i = "{";
  for (var a of r) {
    var s = Ir(e[a]);
    s && (i.length > 1 && (i += ","), i += Ir(a) + ":" + s);
  }
  return io.delete(e), i += "}";
}, sa = (e) => (io.clear(), Ir(e)), hd = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g, gd = /([\s,]|#[^\n\r]+)+/g, md = (e, t) => t % 2 == 0 ? e.replace(gd, " ").trim() : e, Ni = (e) => {
  var t = (typeof e != "string" ? e.loc && e.loc.source.body || bl(e) : e).split(hd).map(md).join("");
  if (typeof e != "string") {
    var n = "definitions" in e && Sl(e);
    n && (t = `# ${n}
${t}`), e.loc || (e.loc = {
      start: 0,
      end: t.length,
      source: {
        body: t,
        name: "gql",
        locationOffset: {
          line: 1,
          column: 1
        }
      }
    });
  }
  return t;
}, Pi = /* @__PURE__ */ new Map(), wl = (e) => {
  var t, n;
  return typeof e == "string" ? (t = Ds(Ni(e)), n = Pi.get(t) || Gf(e, {
    noLocation: !0
  })) : (t = e.__key || Ds(Ni(e)), n = Pi.get(t) || e), n.loc || Ni(n), n.__key = t, Pi.set(t, n), n;
}, Rr = (e, t) => {
  t || (t = {});
  var n = wl(e);
  return {
    key: El(n.__key, sa(t)) >>> 0,
    query: n,
    variables: t
  };
}, Sl = (e) => {
  for (var t of e.definitions)
    if (t.kind === Q.OPERATION_DEFINITION && t.name)
      return t.name.value;
}, yd = (e) => {
  for (var t of e.definitions)
    if (t.kind === Q.OPERATION_DEFINITION)
      return t.operation;
}, Ai = (e, t, n) => {
  if (!("data" in t) && !("errors" in t) || "path" in t)
    throw new Error("No Content");
  return {
    operation: e,
    data: t.data,
    error: Array.isArray(t.errors) ? new $a({
      graphQLErrors: t.errors,
      response: n
    }) : void 0,
    extensions: typeof t.extensions == "object" && t.extensions || void 0,
    hasNext: !!t.hasNext
  };
}, bd = (e, t, n) => {
  var r = {
    ...e
  };
  if (r.hasNext = !!t.hasNext, !("path" in t))
    return "data" in t && (r.data = t.data), r;
  Array.isArray(t.errors) && (r.error = new $a({
    graphQLErrors: r.error ? [...r.error.graphQLErrors, ...t.errors] : t.errors,
    response: n
  }));
  for (var o = r.data = {
    ...r.data
  }, i = 0, a; i < t.path.length; )
    o = o[a = t.path[i++]] = Array.isArray(o[a]) ? [...o[a]] : {
      ...o[a]
    };
  return Object.assign(o, t.data), r;
}, Ns = (e, t, n) => ({
  operation: e,
  data: void 0,
  error: new $a({
    networkError: t,
    response: n
  }),
  extensions: void 0
});
function vd(e) {
  return {
    query: bl(e.query),
    operationName: Sl(e.query),
    variables: e.variables || void 0,
    extensions: void 0
  };
}
var xd = (e, t) => {
  if (!(e.kind === "query" && !!e.context.preferGetMethod) || !t)
    return e.context.url;
  var n = new URL(e.context.url), r = n.searchParams;
  t.operationName && r.set("operationName", t.operationName), t.query && r.set("query", t.query.replace(/#[^\n\r]+/g, " ").trim()), t.variables && r.set("variables", sa(t.variables)), t.extensions && r.set("extensions", sa(t.extensions));
  var o = n.toString();
  return o.length > 2047 ? (e.context.preferGetMethod = !1, e.context.url) : o;
}, Od = (e, t) => {
  var n = e.kind === "query" && !!e.context.preferGetMethod, r = {
    accept: "application/graphql+json, application/json"
  };
  n || (r["content-type"] = "application/json");
  var o = (typeof e.context.fetchOptions == "function" ? e.context.fetchOptions() : e.context.fetchOptions) || {};
  if (o.headers)
    for (var i in o.headers)
      r[i.toLowerCase()] = o.headers[i];
  return {
    ...o,
    body: !n && t ? JSON.stringify(t) : void 0,
    method: n ? "GET" : "POST",
    headers: r
  };
}, Ed = typeof TextDecoder < "u" ? new TextDecoder() : null, wd = /content-type:[^\r\n]*application\/json/i, Sd = /boundary="?([^=";]+)"?/i, Td = (e, t, n) => {
  var r = n.redirect === "manual" ? 400 : 300, o = e.context.fetch;
  return Ba(({ next: i, complete: a }) => {
    var s = typeof AbortController < "u" ? new AbortController() : null;
    s && (n.signal = s.signal);
    var l = !1, u = (b, v, g) => {
      var w = g.headers && g.headers.get("Content-Type") || "";
      if (/text\//i.test(w))
        return g.text().then((H) => {
          b(Ns(v, new Error(H), g));
        });
      if (!/multipart\/mixed/i.test(w))
        return g.text().then((H) => {
          b(Ai(v, JSON.parse(H), g));
        });
      var S = "---", y = w.match(Sd);
      y && (S = "--" + y[1]);
      var T, O = () => {
      };
      if (g[Symbol.asyncIterator]) {
        var C = g[Symbol.asyncIterator]();
        T = C.next.bind(C);
      } else if ("body" in g && g.body) {
        var _ = g.body.getReader();
        O = () => _.cancel(), T = () => _.read();
      } else
        throw new TypeError("Streaming requests unsupported");
      var F = "", ee = !0, J = null, pe = null;
      return T().then(function H(L) {
        if (L.done)
          l = !0;
        else {
          var j = (D = L.value).constructor.name === "Buffer" ? D.toString() : Ed.decode(D), ae = j.indexOf(S);
          for (ae > -1 ? ae += F.length : ae = F.indexOf(S), F += j; ae > -1; ) {
            var ge = F.slice(0, ae), fe = F.slice(ae + S.length);
            if (ee)
              ee = !1;
            else {
              var Ee = ge.indexOf(`\r
\r
`) + 4, Le = ge.slice(0, Ee), ze = ge.slice(Ee, ge.lastIndexOf(`\r
`)), P = void 0;
              if (wd.test(Le))
                try {
                  P = JSON.parse(ze), J = pe = pe ? bd(pe, P, g) : Ai(v, P, g);
                } catch {
                }
              if (fe.slice(0, 2) === "--" || P && !P.hasNext) {
                if (!pe)
                  return b(Ai(v, {}, g));
                break;
              }
            }
            ae = (F = fe).indexOf(S);
          }
        }
        var D;
        if (J && (b(J), J = null), !L.done && (!pe || pe.hasNext))
          return T().then(H);
      }).finally(O);
    }, d = !1, p = !1, h;
    return Promise.resolve().then(() => {
      if (!d)
        return (o || fetch)(t, n);
    }).then((b) => {
      if (!!b)
        return p = (h = b).status < 200 || h.status >= r, u(i, e, h);
    }).then(a).catch((b) => {
      if (l)
        throw b;
      var v = Ns(e, p && h.statusText ? new Error(h.statusText) : b, h);
      i(v), a();
    }), () => {
      d = !0, s && s.abort();
    };
  });
}, ca = (e, t) => {
  if (Array.isArray(e))
    for (var n of e)
      ca(n, t);
  else if (typeof e == "object" && e !== null)
    for (var r in e)
      r === "__typename" && typeof e[r] == "string" ? t.add(e[r]) : ca(e[r], t);
  return t;
}, Ps = (e) => {
  if (!e.selectionSet)
    return e;
  for (var t of e.selectionSet.selections)
    if (t.kind === Q.FIELD && t.name.value === "__typename" && !t.alias)
      return e;
  return {
    ...e,
    selectionSet: {
      ...e.selectionSet,
      selections: [...e.selectionSet.selections, {
        kind: Q.FIELD,
        name: {
          kind: Q.NAME,
          value: "__typename"
        }
      }]
    }
  };
}, As = /* @__PURE__ */ new Map(), Cd = (e) => {
  var t = wl(e), n = As.get(t.__key);
  return n || (n = yl(t, {
    Field: Ps,
    InlineFragment: Ps
  }), Object.defineProperty(n, "__key", {
    value: t.__key,
    enumerable: !1
  }), As.set(t.__key, n)), n;
}, la = (e, t) => {
  if (!e || typeof e != "object")
    return e;
  if (Array.isArray(e))
    return e.map((o) => la(o));
  if (e && typeof e == "object" && (t || "__typename" in e)) {
    var n = {};
    for (var r in e)
      r === "__typename" ? Object.defineProperty(n, "__typename", {
        enumerable: !1,
        value: e.__typename
      }) : n[r] = la(e[r]);
    return n;
  } else
    return e;
};
function js(e) {
  return e.toPromise = () => new Promise((t) => {
    var n = rn((r) => {
      !r.stale && !r.hasNext && Promise.resolve().then(() => {
        n.unsubscribe(), t(r);
      });
    })(e);
  }), e;
}
function Lr(e, t, n) {
  return n || (n = t.context), {
    key: t.key,
    query: t.query,
    variables: t.variables,
    kind: e,
    context: n
  };
}
var Ms = (e, t) => Lr(e.kind, e, {
  ...e.context,
  meta: {
    ...e.context.meta,
    ...t
  }
}), Id = () => {
}, ji = ({ kind: e }) => e !== "mutation" && e !== "query", kd = ({ forward: e, client: t, dispatchDebug: n }) => {
  var r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i = (s) => {
    var l = Lr(s.kind, s);
    return l.query = Cd(s.query), l;
  }, a = (s) => {
    var { key: l, kind: u, context: { requestPolicy: d } } = s;
    return u === "query" && d !== "network-only" && (d === "cache-only" || r.has(l));
  };
  return (s) => {
    var l = Mr(s), u = Dr((p) => {
      var h = r.get(p.key);
      process.env.NODE_ENV !== "production" && n({
        operation: p,
        ...h ? {
          type: "cacheHit",
          message: "The result was successfully retried from the cache"
        } : {
          type: "cacheMiss",
          message: "The result could not be retrieved from the cache"
        },
        source: "cacheExchange"
      });
      var b = {
        ...h,
        operation: Ms(p, {
          cacheOutcome: h ? "hit" : "miss"
        })
      };
      return p.context.requestPolicy === "cache-and-network" && (b.stale = !0, Ls(t, p)), b;
    })(gt((p) => !ji(p) && a(p))(l)), d = Cn((p) => {
      var { operation: h } = p;
      if (!!h) {
        var b = ((F) => [...ca(F, /* @__PURE__ */ new Set())])(p.data).concat(h.context.additionalTypenames || []);
        if (p.operation.kind === "mutation") {
          var v = /* @__PURE__ */ new Set();
          process.env.NODE_ENV !== "production" && n({
            type: "cacheInvalidation",
            message: `The following typenames have been invalidated: ${b}`,
            operation: h,
            data: {
              typenames: b,
              response: p
            },
            source: "cacheExchange"
          });
          for (var g = 0; g < b.length; g++) {
            var w = b[g], S = o.get(w);
            S || o.set(w, S = /* @__PURE__ */ new Set());
            for (var y of S.values())
              v.add(y);
            S.clear();
          }
          for (var T of v.values())
            r.has(T) && (h = r.get(T).operation, r.delete(T), Ls(t, h));
        } else if (h.kind === "query" && p.data) {
          r.set(h.key, p);
          for (var O = 0; O < b.length; O++) {
            var C = b[O], _ = o.get(C);
            _ || o.set(C, _ = /* @__PURE__ */ new Set()), _.add(h.key);
          }
        }
      }
    })(e(gt((p) => p.kind !== "query" || p.context.requestPolicy !== "cache-only")(Dr((p) => Ms(p, {
      cacheOutcome: "miss"
    }))(po([Dr(i)(gt((p) => !ji(p) && !a(p))(l)), gt((p) => ji(p))(l)])))));
    return po([u, d]);
  };
}, Ls = (e, t) => e.reexecuteOperation(Lr(t.kind, t, {
  ...t.context,
  requestPolicy: "network-only"
})), _d = ({ forward: e, dispatchDebug: t }) => {
  var n = /* @__PURE__ */ new Set(), r = (i) => {
    var { key: a, kind: s } = i;
    if (s === "teardown" || s === "mutation")
      return n.delete(a), !0;
    var l = n.has(a);
    return n.add(a), l && process.env.NODE_ENV !== "production" && t({
      type: "dedup",
      message: "An operation has been deduped.",
      operation: i,
      source: "dedupExchange"
    }), !l;
  }, o = ({ operation: i, hasNext: a }) => {
    a || n.delete(i.key);
  };
  return (i) => {
    var a = gt(r)(i);
    return Cn(o)(e(a));
  };
}, Dd = ({ forward: e, dispatchDebug: t }) => (n) => {
  var r = Mr(n), o = xl((a) => {
    var { key: s } = a, l = vd(a), u = xd(a, l), d = Od(a, l);
    process.env.NODE_ENV !== "production" && t({
      type: "fetchRequest",
      message: "A fetch request is being executed.",
      operation: a,
      data: {
        url: u,
        fetchOptions: d
      },
      source: "fetchExchange"
    });
    var p = Ol(gt((h) => h.kind === "teardown" && h.key === s)(r))(Td(a, u, d));
    return process.env.NODE_ENV !== "production" ? Cn((h) => {
      var b = h.data ? void 0 : h.error;
      process.env.NODE_ENV !== "production" && t({
        type: b ? "fetchError" : "fetchSuccess",
        message: `A ${b ? "failed" : "successful"} fetch response has been returned.`,
        operation: a,
        data: {
          url: u,
          fetchOptions: d,
          value: b || h
        },
        source: "fetchExchange"
      });
    })(p) : p;
  })(gt((a) => a.kind === "query" || a.kind === "mutation")(r)), i = e(gt((a) => a.kind !== "query" && a.kind !== "mutation")(r));
  return po([o, i]);
}, Rd = ({ dispatchDebug: e }) => (t) => gt(() => !1)(Cn((n) => {
  if (n.kind !== "teardown" && process.env.NODE_ENV !== "production") {
    var r = `No exchange has handled operations of kind "${n.kind}". Check whether you've added an exchange responsible for these operations.`;
    process.env.NODE_ENV !== "production" && e({
      type: "fallbackCatch",
      message: r,
      operation: n,
      source: "fallbackExchange"
    }), console.warn(r);
  }
})(t)), Nd = (e) => ({ client: t, forward: n, dispatchDebug: r }) => e.reduceRight((o, i) => i({
  client: t,
  forward: o,
  dispatchDebug(a) {
    process.env.NODE_ENV !== "production" && r({
      timestamp: Date.now(),
      source: i.name,
      ...a,
      source: "fetchExchange"
    });
  }
}), n), Pd = [_d, kd, Dd], Ad = function e(t) {
  if (process.env.NODE_ENV !== "production" && !t.url)
    throw new Error("You are creating an urql-client without a url.");
  var n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), o = [], i = {
    url: t.url,
    fetchOptions: t.fetchOptions,
    fetch: t.fetch,
    preferGetMethod: !!t.preferGetMethod,
    requestPolicy: t.requestPolicy || "cache-first"
  }, { source: a, next: s } = _s(), l = !1;
  function u(y) {
    if (y && s(y), !l) {
      for (l = !0; l && (y = o.shift()); )
        s(y);
      l = !1;
    }
  }
  var d = (y) => {
    var T = gt((O) => O.operation.kind === y.kind && O.operation.key === y.key && (!O.operation.context._instance || O.operation.context._instance === y.context._instance))(S);
    return t.maskTypename && (T = Dr((O) => ({
      ...O,
      data: la(O.data, !0)
    }))(T)), y.kind === "mutation" ? Is(1)(Cs(() => s(y))(T)) : Mr(aa(() => {
      n.delete(y.key), r.delete(y.key);
      for (var O = o.length - 1; O >= 0; O--)
        o[O].key === y.key && o.splice(O, 1);
      s(Lr("teardown", y, y.context));
    })(Cn((O) => {
      n.set(y.key, O);
    })(ad((O) => y.kind !== "query" || O.stale ? ks(O) : po([ks(O), Dr(() => ({
      ...O,
      stale: !0
    }))(Is(1)(gt((C) => C.kind === "query" && C.key === y.key && C.context.requestPolicy !== "cache-only")(a)))]))(Ol(gt((O) => O.kind === "teardown" && O.key === y.key)(a))(T)))));
  }, p = this instanceof e ? this : Object.create(e.prototype), h = Object.assign(p, {
    suspense: !!t.suspense,
    operations$: a,
    reexecuteOperation(y) {
      (y.kind === "mutation" || r.has(y.key)) && (o.push(y), Promise.resolve().then(u));
    },
    createRequestOperation(y, T, O) {
      O || (O = {});
      var C = yd(T.query);
      if (process.env.NODE_ENV !== "production" && y !== "teardown" && C !== y)
        throw new Error(`Expected operation of type "${y}" but found "${C}"`);
      return Lr(y, T, {
        _instance: y === "mutation" ? [] : void 0,
        ...i,
        ...O,
        requestPolicy: O.requestPolicy || i.requestPolicy,
        suspense: O.suspense || O.suspense !== !1 && h.suspense
      });
    },
    executeRequestOperation(y) {
      return y.kind === "mutation" ? d(y) : Ba((T) => {
        var O = r.get(y.key);
        O || r.set(y.key, O = d(y));
        var C = y.context.requestPolicy === "cache-and-network" || y.context.requestPolicy === "network-only";
        return rn(T.next)(aa(() => {
          l = !1, T.complete();
        })(Cs(() => {
          var _ = n.get(y.key);
          if (y.kind === "subscription")
            return u(y);
          C && u(y), _ != null && _ === n.get(y.key) ? T.next(C ? {
            ..._,
            stale: !0
          } : _) : C || u(y);
        })(O))).unsubscribe;
      });
    },
    executeQuery(y, T) {
      var O = h.createRequestOperation("query", y, T);
      return h.executeRequestOperation(O);
    },
    executeSubscription(y, T) {
      var O = h.createRequestOperation("subscription", y, T);
      return h.executeRequestOperation(O);
    },
    executeMutation(y, T) {
      var O = h.createRequestOperation("mutation", y, T);
      return h.executeRequestOperation(O);
    },
    query(y, T, O) {
      return (!O || typeof O.suspense != "boolean") && (O = {
        ...O,
        suspense: !1
      }), js(h.executeQuery(Rr(y, T), O));
    },
    readQuery(y, T, O) {
      var C = null;
      return rn((_) => {
        C = _;
      })(h.query(y, T, O)).unsubscribe(), C;
    },
    subscription: (y, T, O) => h.executeSubscription(Rr(y, T), O),
    mutation: (y, T, O) => js(h.executeMutation(Rr(y, T), O))
  }), b = Id;
  if (process.env.NODE_ENV !== "production") {
    var { next: v, source: g } = _s();
    h.subscribeToDebugTarget = (y) => rn(y)(g), b = v;
  }
  var w = Nd(t.exchanges !== void 0 ? t.exchanges : Pd), S = Mr(w({
    client: h,
    dispatchDebug: b,
    forward: Rd({
      dispatchDebug: b
    })
  })(a));
  return fd(S), h;
}, Tl = Ad, Cl = Tl({
  url: "/graphql"
}), _o = Ct(Cl), jd = _o.Provider;
_o.Consumer;
_o.displayName = "UrqlContext";
var Fs = !1, Il = () => {
  var e = tt(_o);
  return process.env.NODE_ENV !== "production" && e === Cl && !Fs && (Fs = !0, console.warn("Default Client: No client has been specified using urql's Provider.This means that urql will be falling back to defaults including making requests to `/graphql`.\nIf that's not what you want, please create a client and add a Provider.")), e;
}, ua = {
  fetching: !1,
  stale: !1,
  error: void 0,
  data: void 0,
  extensions: void 0,
  operation: void 0
}, Mi = (e, t) => {
  var n = {
    ...e,
    ...t,
    data: t.data !== void 0 || t.error ? t.data : e.data,
    fetching: !!t.fetching,
    stale: !!t.stale
  };
  return ((r, o) => {
    if (typeof r != "object" || typeof o != "object")
      return r !== o;
    for (var i in r)
      if (!(i in o))
        return !0;
    for (var a in o)
      if (r[a] !== o[a])
        return !0;
    return !1;
  })(e, n) ? n : e;
}, Md = (e, t) => {
  for (var n = 0, r = t.length; n < r; n++)
    if (e[n] !== t[n])
      return !0;
  return !1;
};
function Va(e) {
  var t = $e(!0), n = Il(), [r, o] = ye(ua), i = Ne((a, s) => (o({
    ...ua,
    fetching: !0
  }), dd(n.executeMutation(Rr(e, a), s || {})).then((l) => (t.current && o({
    fetching: !1,
    stale: !!l.stale,
    data: l.data,
    error: l.error,
    extensions: l.extensions,
    operation: l.operation
  }), l))), [n, e, o]);
  return we(() => (t.current = !0, () => {
    t.current = !1;
  }), []), [r, i];
}
function Ld(e, t) {
  var n = $e(void 0);
  return De(() => {
    var r = Rr(e, t);
    return n.current !== void 0 && n.current.key === r.key ? n.current : (n.current = r, r);
  }, [e, t]);
}
function Ua(e) {
  var t = Il(), n = ((h) => {
    if (!h._react) {
      var b = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map();
      h.operations$ && rn((g) => {
        g.kind === "teardown" && b.has(g.key) && (b.delete(g.key), v.delete(g.key));
      })(h.operations$), h._react = {
        get: (g) => v.get(g),
        set(g, w) {
          b.delete(g), v.set(g, w);
        },
        dispose(g) {
          b.add(g);
        }
      };
    }
    return h._react;
  })(t), r = ((h, b) => h.suspense && (!b || b.suspense !== !1))(t, e.context), o = Ld(e.query, e.variables), i = De(() => {
    if (e.pause)
      return null;
    var h = t.executeQuery(o, {
      requestPolicy: e.requestPolicy,
      ...e.context
    });
    return r ? Cn((b) => {
      n.set(o.key, b);
    })(h) : h;
  }, [n, t, o, r, e.pause, e.requestPolicy, e.context]), a = Ne((h, b) => {
    if (!h)
      return {
        fetching: !1
      };
    var v = n.get(o.key);
    if (v) {
      if (b && v != null && "then" in v)
        throw v;
    } else {
      var g, w = rn((y) => {
        v = y, g && g(v);
      })(sd(() => b && !g || !v)(h));
      if (v == null && b) {
        var S = new Promise((y) => {
          g = y;
        });
        throw n.set(o.key, S), S;
      } else
        w.unsubscribe();
    }
    return v || {
      fetching: !0
    };
  }, [n, o]), s = [t, o, e.requestPolicy, e.context, e.pause], [l, u] = ye(() => [i, Mi(ua, a(i, r)), s]), d = l[1];
  i !== l[0] && Md(l[2], s) && u([i, d = Mi(l[1], a(i, r)), s]), we(() => {
    var h = l[0], b = l[2][1], v = !1, g = (S) => {
      v = !0, u((y) => {
        var T = Mi(y[1], S);
        return y[1] !== T ? [y[0], T, y[2]] : y;
      });
    };
    if (h) {
      var w = rn(g)(aa(() => {
        g({
          fetching: !1
        });
      })(h));
      return v || g({
        fetching: !0
      }), () => {
        n.dispose(b.key), w.unsubscribe();
      };
    } else
      g({
        fetching: !1
      });
  }, [n, l[0], l[2][1]]);
  var p = Ne((h) => {
    var b = {
      requestPolicy: e.requestPolicy,
      ...e.context,
      ...h
    };
    u((v) => [r ? Cn((g) => {
      n.set(o.key, g);
    })(t.executeQuery(o, b)) : t.executeQuery(o, b), v[1], s]);
  }, [t, n, o, r, a, e.requestPolicy, e.context]);
  return [d, p];
}
const kl = Ct({
  dragDropManager: void 0
});
var tn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Do = { exports: {} }, wr = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bs;
function Fd() {
  if (Bs)
    return wr;
  Bs = 1;
  var e = qn, t = Symbol.for("react.element"), n = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, i = { key: !0, ref: !0, __self: !0, __source: !0 };
  function a(s, l, u) {
    var d, p = {}, h = null, b = null;
    u !== void 0 && (h = "" + u), l.key !== void 0 && (h = "" + l.key), l.ref !== void 0 && (b = l.ref);
    for (d in l)
      r.call(l, d) && !i.hasOwnProperty(d) && (p[d] = l[d]);
    if (s && s.defaultProps)
      for (d in l = s.defaultProps, l)
        p[d] === void 0 && (p[d] = l[d]);
    return { $$typeof: t, type: s, key: h, ref: b, props: p, _owner: o.current };
  }
  return wr.Fragment = n, wr.jsx = a, wr.jsxs = a, wr;
}
var Sr = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $s;
function Bd() {
  return $s || ($s = 1, process.env.NODE_ENV !== "production" && function() {
    var e = qn, t = Symbol.for("react.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), s = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), b = Symbol.for("react.offscreen"), v = Symbol.iterator, g = "@@iterator";
    function w(x) {
      if (x === null || typeof x != "object")
        return null;
      var A = v && x[v] || x[g];
      return typeof A == "function" ? A : null;
    }
    var S = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function y(x) {
      {
        for (var A = arguments.length, $ = new Array(A > 1 ? A - 1 : 0), te = 1; te < A; te++)
          $[te - 1] = arguments[te];
        T("error", x, $);
      }
    }
    function T(x, A, $) {
      {
        var te = S.ReactDebugCurrentFrame, Oe = te.getStackAddendum();
        Oe !== "" && (A += "%s", $ = $.concat([Oe]));
        var de = $.map(function(ve) {
          return String(ve);
        });
        de.unshift("Warning: " + A), Function.prototype.apply.call(console[x], console, de);
      }
    }
    var O = !1, C = !1, _ = !1, F = !1, ee = !1, J;
    J = Symbol.for("react.module.reference");
    function pe(x) {
      return !!(typeof x == "string" || typeof x == "function" || x === r || x === i || ee || x === o || x === u || x === d || F || x === b || O || C || _ || typeof x == "object" && x !== null && (x.$$typeof === h || x.$$typeof === p || x.$$typeof === a || x.$$typeof === s || x.$$typeof === l || x.$$typeof === J || x.getModuleId !== void 0));
    }
    function H(x, A, $) {
      var te = x.displayName;
      if (te)
        return te;
      var Oe = A.displayName || A.name || "";
      return Oe !== "" ? $ + "(" + Oe + ")" : $;
    }
    function L(x) {
      return x.displayName || "Context";
    }
    function j(x) {
      if (x == null)
        return null;
      if (typeof x.tag == "number" && y("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof x == "function")
        return x.displayName || x.name || null;
      if (typeof x == "string")
        return x;
      switch (x) {
        case r:
          return "Fragment";
        case n:
          return "Portal";
        case i:
          return "Profiler";
        case o:
          return "StrictMode";
        case u:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof x == "object")
        switch (x.$$typeof) {
          case s:
            var A = x;
            return L(A) + ".Consumer";
          case a:
            var $ = x;
            return L($._context) + ".Provider";
          case l:
            return H(x, x.render, "ForwardRef");
          case p:
            var te = x.displayName || null;
            return te !== null ? te : j(x.type) || "Memo";
          case h: {
            var Oe = x, de = Oe._payload, ve = Oe._init;
            try {
              return j(ve(de));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var ae = Object.assign, ge = 0, fe, Ee, Le, ze, P, D, V;
    function k() {
    }
    k.__reactDisabledLog = !0;
    function G() {
      {
        if (ge === 0) {
          fe = console.log, Ee = console.info, Le = console.warn, ze = console.error, P = console.group, D = console.groupCollapsed, V = console.groupEnd;
          var x = {
            configurable: !0,
            enumerable: !0,
            value: k,
            writable: !0
          };
          Object.defineProperties(console, {
            info: x,
            log: x,
            warn: x,
            error: x,
            group: x,
            groupCollapsed: x,
            groupEnd: x
          });
        }
        ge++;
      }
    }
    function le() {
      {
        if (ge--, ge === 0) {
          var x = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ae({}, x, {
              value: fe
            }),
            info: ae({}, x, {
              value: Ee
            }),
            warn: ae({}, x, {
              value: Le
            }),
            error: ae({}, x, {
              value: ze
            }),
            group: ae({}, x, {
              value: P
            }),
            groupCollapsed: ae({}, x, {
              value: D
            }),
            groupEnd: ae({}, x, {
              value: V
            })
          });
        }
        ge < 0 && y("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var K = S.ReactCurrentDispatcher, ie;
    function ne(x, A, $) {
      {
        if (ie === void 0)
          try {
            throw Error();
          } catch (Oe) {
            var te = Oe.stack.trim().match(/\n( *(at )?)/);
            ie = te && te[1] || "";
          }
        return `
` + ie + x;
      }
    }
    var me = !1, se;
    {
      var Fe = typeof WeakMap == "function" ? WeakMap : Map;
      se = new Fe();
    }
    function B(x, A) {
      if (!x || me)
        return "";
      {
        var $ = se.get(x);
        if ($ !== void 0)
          return $;
      }
      var te;
      me = !0;
      var Oe = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var de;
      de = K.current, K.current = null, G();
      try {
        if (A) {
          var ve = function() {
            throw Error();
          };
          if (Object.defineProperty(ve.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(ve, []);
            } catch (Ye) {
              te = Ye;
            }
            Reflect.construct(x, [], ve);
          } else {
            try {
              ve.call();
            } catch (Ye) {
              te = Ye;
            }
            x.call(ve.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Ye) {
            te = Ye;
          }
          x();
        }
      } catch (Ye) {
        if (Ye && te && typeof Ye.stack == "string") {
          for (var he = Ye.stack.split(`
`), qe = te.stack.split(`
`), Ae = he.length - 1, Me = qe.length - 1; Ae >= 1 && Me >= 0 && he[Ae] !== qe[Me]; )
            Me--;
          for (; Ae >= 1 && Me >= 0; Ae--, Me--)
            if (he[Ae] !== qe[Me]) {
              if (Ae !== 1 || Me !== 1)
                do
                  if (Ae--, Me--, Me < 0 || he[Ae] !== qe[Me]) {
                    var Ze = `
` + he[Ae].replace(" at new ", " at ");
                    return x.displayName && Ze.includes("<anonymous>") && (Ze = Ze.replace("<anonymous>", x.displayName)), typeof x == "function" && se.set(x, Ze), Ze;
                  }
                while (Ae >= 1 && Me >= 0);
              break;
            }
        }
      } finally {
        me = !1, K.current = de, le(), Error.prepareStackTrace = Oe;
      }
      var it = x ? x.displayName || x.name : "", $n = it ? ne(it) : "";
      return typeof x == "function" && se.set(x, $n), $n;
    }
    function Qe(x, A, $) {
      return B(x, !1);
    }
    function kt(x) {
      var A = x.prototype;
      return !!(A && A.isReactComponent);
    }
    function yt(x, A, $) {
      if (x == null)
        return "";
      if (typeof x == "function")
        return B(x, kt(x));
      if (typeof x == "string")
        return ne(x);
      switch (x) {
        case u:
          return ne("Suspense");
        case d:
          return ne("SuspenseList");
      }
      if (typeof x == "object")
        switch (x.$$typeof) {
          case l:
            return Qe(x.render);
          case p:
            return yt(x.type, A, $);
          case h: {
            var te = x, Oe = te._payload, de = te._init;
            try {
              return yt(de(Oe), A, $);
            } catch {
            }
          }
        }
      return "";
    }
    var Xt = Object.prototype.hasOwnProperty, Nn = {}, Pn = S.ReactDebugCurrentFrame;
    function Jt(x) {
      if (x) {
        var A = x._owner, $ = yt(x.type, x._source, A ? A.type : null);
        Pn.setExtraStackFrame($);
      } else
        Pn.setExtraStackFrame(null);
    }
    function bt(x, A, $, te, Oe) {
      {
        var de = Function.call.bind(Xt);
        for (var ve in x)
          if (de(x, ve)) {
            var he = void 0;
            try {
              if (typeof x[ve] != "function") {
                var qe = Error((te || "React class") + ": " + $ + " type `" + ve + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof x[ve] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw qe.name = "Invariant Violation", qe;
              }
              he = x[ve](A, ve, te, $, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Ae) {
              he = Ae;
            }
            he && !(he instanceof Error) && (Jt(Oe), y("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", te || "React class", $, ve, typeof he), Jt(null)), he instanceof Error && !(he.message in Nn) && (Nn[he.message] = !0, Jt(Oe), y("Failed %s type: %s", $, he.message), Jt(null));
          }
      }
    }
    var jt = Array.isArray;
    function ct(x) {
      return jt(x);
    }
    function Ve(x) {
      {
        var A = typeof Symbol == "function" && Symbol.toStringTag, $ = A && x[Symbol.toStringTag] || x.constructor.name || "Object";
        return $;
      }
    }
    function un(x) {
      try {
        return Qt(x), !1;
      } catch {
        return !0;
      }
    }
    function Qt(x) {
      return "" + x;
    }
    function An(x) {
      if (un(x))
        return y("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ve(x)), Qt(x);
    }
    var Mt = S.ReactCurrentOwner, vt = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Zt, en, Lt;
    Lt = {};
    function fn(x) {
      if (Xt.call(x, "ref")) {
        var A = Object.getOwnPropertyDescriptor(x, "ref").get;
        if (A && A.isReactWarning)
          return !1;
      }
      return x.ref !== void 0;
    }
    function dn(x) {
      if (Xt.call(x, "key")) {
        var A = Object.getOwnPropertyDescriptor(x, "key").get;
        if (A && A.isReactWarning)
          return !1;
      }
      return x.key !== void 0;
    }
    function or(x, A) {
      if (typeof x.ref == "string" && Mt.current && A && Mt.current.stateNode !== A) {
        var $ = j(Mt.current.type);
        Lt[$] || (y('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', j(Mt.current.type), x.ref), Lt[$] = !0);
      }
    }
    function ir(x, A) {
      {
        var $ = function() {
          Zt || (Zt = !0, y("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", A));
        };
        $.isReactWarning = !0, Object.defineProperty(x, "key", {
          get: $,
          configurable: !0
        });
      }
    }
    function Xe(x, A) {
      {
        var $ = function() {
          en || (en = !0, y("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", A));
        };
        $.isReactWarning = !0, Object.defineProperty(x, "ref", {
          get: $,
          configurable: !0
        });
      }
    }
    var xt = function(x, A, $, te, Oe, de, ve) {
      var he = {
        $$typeof: t,
        type: x,
        key: A,
        ref: $,
        props: ve,
        _owner: de
      };
      return he._store = {}, Object.defineProperty(he._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(he, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: te
      }), Object.defineProperty(he, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Oe
      }), Object.freeze && (Object.freeze(he.props), Object.freeze(he)), he;
    };
    function ar(x, A, $, te, Oe) {
      {
        var de, ve = {}, he = null, qe = null;
        $ !== void 0 && (An($), he = "" + $), dn(A) && (An(A.key), he = "" + A.key), fn(A) && (qe = A.ref, or(A, Oe));
        for (de in A)
          Xt.call(A, de) && !vt.hasOwnProperty(de) && (ve[de] = A[de]);
        if (x && x.defaultProps) {
          var Ae = x.defaultProps;
          for (de in Ae)
            ve[de] === void 0 && (ve[de] = Ae[de]);
        }
        if (he || qe) {
          var Me = typeof x == "function" ? x.displayName || x.name || "Unknown" : x;
          he && ir(ve, Me), qe && Xe(ve, Me);
        }
        return xt(x, he, qe, Oe, te, Mt.current, ve);
      }
    }
    var Ft = S.ReactCurrentOwner, jn = S.ReactDebugCurrentFrame;
    function dt(x) {
      if (x) {
        var A = x._owner, $ = yt(x.type, x._source, A ? A.type : null);
        jn.setExtraStackFrame($);
      } else
        jn.setExtraStackFrame(null);
    }
    var nt;
    nt = !1;
    function pn(x) {
      return typeof x == "object" && x !== null && x.$$typeof === t;
    }
    function Ge() {
      {
        if (Ft.current) {
          var x = j(Ft.current.type);
          if (x)
            return `

Check the render method of \`` + x + "`.";
        }
        return "";
      }
    }
    function sr(x) {
      {
        if (x !== void 0) {
          var A = x.fileName.replace(/^.*[\\\/]/, ""), $ = x.lineNumber;
          return `

Check your code at ` + A + ":" + $ + ".";
        }
        return "";
      }
    }
    var Mn = {};
    function cr(x) {
      {
        var A = Ge();
        if (!A) {
          var $ = typeof x == "string" ? x : x.displayName || x.name;
          $ && (A = `

Check the top-level render call using <` + $ + ">.");
        }
        return A;
      }
    }
    function Ln(x, A) {
      {
        if (!x._store || x._store.validated || x.key != null)
          return;
        x._store.validated = !0;
        var $ = cr(A);
        if (Mn[$])
          return;
        Mn[$] = !0;
        var te = "";
        x && x._owner && x._owner !== Ft.current && (te = " It was passed a child from " + j(x._owner.type) + "."), dt(x), y('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', $, te), dt(null);
      }
    }
    function Fn(x, A) {
      {
        if (typeof x != "object")
          return;
        if (ct(x))
          for (var $ = 0; $ < x.length; $++) {
            var te = x[$];
            pn(te) && Ln(te, A);
          }
        else if (pn(x))
          x._store && (x._store.validated = !0);
        else if (x) {
          var Oe = w(x);
          if (typeof Oe == "function" && Oe !== x.entries)
            for (var de = Oe.call(x), ve; !(ve = de.next()).done; )
              pn(ve.value) && Ln(ve.value, A);
        }
      }
    }
    function Ue(x) {
      {
        var A = x.type;
        if (A == null || typeof A == "string")
          return;
        var $;
        if (typeof A == "function")
          $ = A.propTypes;
        else if (typeof A == "object" && (A.$$typeof === l || A.$$typeof === p))
          $ = A.propTypes;
        else
          return;
        if ($) {
          var te = j(A);
          bt($, x.props, "prop", te, x);
        } else if (A.PropTypes !== void 0 && !nt) {
          nt = !0;
          var Oe = j(A);
          y("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Oe || "Unknown");
        }
        typeof A.getDefaultProps == "function" && !A.getDefaultProps.isReactClassApproved && y("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function lr(x) {
      {
        for (var A = Object.keys(x.props), $ = 0; $ < A.length; $++) {
          var te = A[$];
          if (te !== "children" && te !== "key") {
            dt(x), y("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", te), dt(null);
            break;
          }
        }
        x.ref !== null && (dt(x), y("Invalid attribute `ref` supplied to `React.Fragment`."), dt(null));
      }
    }
    function Bn(x, A, $, te, Oe, de) {
      {
        var ve = pe(x);
        if (!ve) {
          var he = "";
          (x === void 0 || typeof x == "object" && x !== null && Object.keys(x).length === 0) && (he += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var qe = sr(Oe);
          qe ? he += qe : he += Ge();
          var Ae;
          x === null ? Ae = "null" : ct(x) ? Ae = "array" : x !== void 0 && x.$$typeof === t ? (Ae = "<" + (j(x.type) || "Unknown") + " />", he = " Did you accidentally export a JSX literal instead of a component?") : Ae = typeof x, y("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Ae, he);
        }
        var Me = ar(x, A, $, Oe, de);
        if (Me == null)
          return Me;
        if (ve) {
          var Ze = A.children;
          if (Ze !== void 0)
            if (te)
              if (ct(Ze)) {
                for (var it = 0; it < Ze.length; it++)
                  Fn(Ze[it], x);
                Object.freeze && Object.freeze(Ze);
              } else
                y("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Fn(Ze, x);
        }
        return x === r ? lr(Me) : Ue(Me), Me;
      }
    }
    function ur(x, A, $) {
      return Bn(x, A, $, !0);
    }
    function fr(x, A, $) {
      return Bn(x, A, $, !1);
    }
    var dr = fr, rt = ur;
    Sr.Fragment = r, Sr.jsx = dr, Sr.jsxs = rt;
  }()), Sr;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = Fd() : e.exports = Bd();
})(Do);
const qr = Do.exports.Fragment, q = Do.exports.jsx, at = Do.exports.jsxs;
function pt(e) {
  return "Minified Redux error #" + e + "; visit https://redux.js.org/Errors?code=" + e + " for the full message or use the non-minified dev environment for full errors. ";
}
var Vs = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}(), Li = function() {
  return Math.random().toString(36).substring(7).split("").join(".");
}, Us = {
  INIT: "@@redux/INIT" + Li(),
  REPLACE: "@@redux/REPLACE" + Li(),
  PROBE_UNKNOWN_ACTION: function() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + Li();
  }
};
function $d(e) {
  if (typeof e != "object" || e === null)
    return !1;
  for (var t = e; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
function Vd(e) {
  if (e === void 0)
    return "undefined";
  if (e === null)
    return "null";
  var t = typeof e;
  switch (t) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function":
      return t;
  }
  if (Array.isArray(e))
    return "array";
  if (Hd(e))
    return "date";
  if (zd(e))
    return "error";
  var n = Ud(e);
  switch (n) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return n;
  }
  return t.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function Ud(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function zd(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function Hd(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function Vn(e) {
  var t = typeof e;
  return process.env.NODE_ENV !== "production" && (t = Vd(e)), t;
}
function _l(e, t, n) {
  var r;
  if (typeof t == "function" && typeof n == "function" || typeof n == "function" && typeof arguments[3] == "function")
    throw new Error(process.env.NODE_ENV === "production" ? pt(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  if (typeof t == "function" && typeof n > "u" && (n = t, t = void 0), typeof n < "u") {
    if (typeof n != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pt(1) : "Expected the enhancer to be a function. Instead, received: '" + Vn(n) + "'");
    return n(_l)(e, t);
  }
  if (typeof e != "function")
    throw new Error(process.env.NODE_ENV === "production" ? pt(2) : "Expected the root reducer to be a function. Instead, received: '" + Vn(e) + "'");
  var o = e, i = t, a = [], s = a, l = !1;
  function u() {
    s === a && (s = a.slice());
  }
  function d() {
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? pt(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    return i;
  }
  function p(g) {
    if (typeof g != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pt(4) : "Expected the listener to be a function. Instead, received: '" + Vn(g) + "'");
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? pt(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    var w = !0;
    return u(), s.push(g), function() {
      if (!!w) {
        if (l)
          throw new Error(process.env.NODE_ENV === "production" ? pt(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
        w = !1, u();
        var y = s.indexOf(g);
        s.splice(y, 1), a = null;
      }
    };
  }
  function h(g) {
    if (!$d(g))
      throw new Error(process.env.NODE_ENV === "production" ? pt(7) : "Actions must be plain objects. Instead, the actual type was: '" + Vn(g) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    if (typeof g.type > "u")
      throw new Error(process.env.NODE_ENV === "production" ? pt(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? pt(9) : "Reducers may not dispatch actions.");
    try {
      l = !0, i = o(i, g);
    } finally {
      l = !1;
    }
    for (var w = a = s, S = 0; S < w.length; S++) {
      var y = w[S];
      y();
    }
    return g;
  }
  function b(g) {
    if (typeof g != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pt(10) : "Expected the nextReducer to be a function. Instead, received: '" + Vn(g));
    o = g, h({
      type: Us.REPLACE
    });
  }
  function v() {
    var g, w = p;
    return g = {
      subscribe: function(y) {
        if (typeof y != "object" || y === null)
          throw new Error(process.env.NODE_ENV === "production" ? pt(11) : "Expected the observer to be an object. Instead, received: '" + Vn(y) + "'");
        function T() {
          y.next && y.next(d());
        }
        T();
        var O = w(T);
        return {
          unsubscribe: O
        };
      }
    }, g[Vs] = function() {
      return this;
    }, g;
  }
  return h({
    type: Us.INIT
  }), r = {
    dispatch: h,
    subscribe: p,
    getState: d,
    replaceReducer: b
  }, r[Vs] = v, r;
}
function Wd(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function zs() {
}
process.env.NODE_ENV !== "production" && typeof zs.name == "string" && zs.name !== "isCrushed" && Wd('You are currently using minified code outside of NODE_ENV === "production". This means that you are running a slower development build of Redux. You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) to ensure you have the correct code for your production build.');
function ue(e, t, ...n) {
  if (qd() && t === void 0)
    throw new Error("invariant requires an error message argument");
  if (!e) {
    let r;
    if (t === void 0)
      r = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      let o = 0;
      r = new Error(t.replace(/%s/g, function() {
        return n[o++];
      })), r.name = "Invariant Violation";
    }
    throw r.framesToPop = 1, r;
  }
}
function qd() {
  return typeof process < "u" && process.env.NODE_ENV === "production";
}
function Yd(e, t, n) {
  return t.split(".").reduce(
    (r, o) => r && r[o] ? r[o] : n || null,
    e
  );
}
function Gd(e, t) {
  return e.filter(
    (n) => n !== t
  );
}
function Dl(e) {
  return typeof e == "object";
}
function Kd(e, t) {
  const n = /* @__PURE__ */ new Map(), r = (i) => {
    n.set(i, n.has(i) ? n.get(i) + 1 : 1);
  };
  e.forEach(r), t.forEach(r);
  const o = [];
  return n.forEach((i, a) => {
    i === 1 && o.push(a);
  }), o;
}
function Xd(e, t) {
  return e.filter(
    (n) => t.indexOf(n) > -1
  );
}
const za = "dnd-core/INIT_COORDS", Ro = "dnd-core/BEGIN_DRAG", Ha = "dnd-core/PUBLISH_DRAG_SOURCE", No = "dnd-core/HOVER", Po = "dnd-core/DROP", Ao = "dnd-core/END_DRAG";
function Hs(e, t) {
  return {
    type: za,
    payload: {
      sourceClientOffset: t || null,
      clientOffset: e || null
    }
  };
}
const Jd = {
  type: za,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};
function Qd(e) {
  return function(n = [], r = {
    publishSource: !0
  }) {
    const { publishSource: o = !0, clientOffset: i, getSourceClientOffset: a } = r, s = e.getMonitor(), l = e.getRegistry();
    e.dispatch(Hs(i)), Zd(n, s, l);
    const u = np(n, s);
    if (u == null) {
      e.dispatch(Jd);
      return;
    }
    let d = null;
    if (i) {
      if (!a)
        throw new Error("getSourceClientOffset must be defined");
      ep(a), d = a(u);
    }
    e.dispatch(Hs(i, d));
    const h = l.getSource(u).beginDrag(s, u);
    if (h == null)
      return;
    tp(h), l.pinSource(u);
    const b = l.getSourceType(u);
    return {
      type: Ro,
      payload: {
        itemType: b,
        item: h,
        sourceId: u,
        clientOffset: i || null,
        sourceClientOffset: d || null,
        isSourcePublic: !!o
      }
    };
  };
}
function Zd(e, t, n) {
  ue(!t.isDragging(), "Cannot call beginDrag while dragging."), e.forEach(function(r) {
    ue(n.getSource(r), "Expected sourceIds to be registered.");
  });
}
function ep(e) {
  ue(typeof e == "function", "When clientOffset is provided, getSourceClientOffset must be a function.");
}
function tp(e) {
  ue(Dl(e), "Item must be an object.");
}
function np(e, t) {
  let n = null;
  for (let r = e.length - 1; r >= 0; r--)
    if (t.canDragSource(e[r])) {
      n = e[r];
      break;
    }
  return n;
}
function rp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function op(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}, r = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function(o) {
      return Object.getOwnPropertyDescriptor(n, o).enumerable;
    }))), r.forEach(function(o) {
      rp(e, o, n[o]);
    });
  }
  return e;
}
function ip(e) {
  return function(n = {}) {
    const r = e.getMonitor(), o = e.getRegistry();
    ap(r), lp(r).forEach((a, s) => {
      const l = sp(a, s, o, r), u = {
        type: Po,
        payload: {
          dropResult: op({}, n, l)
        }
      };
      e.dispatch(u);
    });
  };
}
function ap(e) {
  ue(e.isDragging(), "Cannot call drop while not dragging."), ue(!e.didDrop(), "Cannot call drop twice during one drag operation.");
}
function sp(e, t, n, r) {
  const o = n.getTarget(e);
  let i = o ? o.drop(r, e) : void 0;
  return cp(i), typeof i > "u" && (i = t === 0 ? {} : r.getDropResult()), i;
}
function cp(e) {
  ue(typeof e > "u" || Dl(e), "Drop result must either be an object or undefined.");
}
function lp(e) {
  const t = e.getTargetIds().filter(e.canDropOnTarget, e);
  return t.reverse(), t;
}
function up(e) {
  return function() {
    const n = e.getMonitor(), r = e.getRegistry();
    fp(n);
    const o = n.getSourceId();
    return o != null && (r.getSource(o, !0).endDrag(n, o), r.unpinSource()), {
      type: Ao
    };
  };
}
function fp(e) {
  ue(e.isDragging(), "Cannot call endDrag while not dragging.");
}
function fa(e, t) {
  return t === null ? e === null : Array.isArray(e) ? e.some(
    (n) => n === t
  ) : e === t;
}
function dp(e) {
  return function(n, { clientOffset: r } = {}) {
    pp(n);
    const o = n.slice(0), i = e.getMonitor(), a = e.getRegistry(), s = i.getItemType();
    return gp(o, a, s), hp(o, i, a), mp(o, i, a), {
      type: No,
      payload: {
        targetIds: o,
        clientOffset: r || null
      }
    };
  };
}
function pp(e) {
  ue(Array.isArray(e), "Expected targetIds to be an array.");
}
function hp(e, t, n) {
  ue(t.isDragging(), "Cannot call hover while not dragging."), ue(!t.didDrop(), "Cannot call hover after drop.");
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    ue(e.lastIndexOf(o) === r, "Expected targetIds to be unique in the passed array.");
    const i = n.getTarget(o);
    ue(i, "Expected targetIds to be registered.");
  }
}
function gp(e, t, n) {
  for (let r = e.length - 1; r >= 0; r--) {
    const o = e[r], i = t.getTargetType(o);
    fa(i, n) || e.splice(r, 1);
  }
}
function mp(e, t, n) {
  e.forEach(function(r) {
    n.getTarget(r).hover(t, r);
  });
}
function yp(e) {
  return function() {
    if (e.getMonitor().isDragging())
      return {
        type: Ha
      };
  };
}
function bp(e) {
  return {
    beginDrag: Qd(e),
    publishDragSource: yp(e),
    hover: dp(e),
    drop: ip(e),
    endDrag: up(e)
  };
}
class vp {
  receiveBackend(t) {
    this.backend = t;
  }
  getMonitor() {
    return this.monitor;
  }
  getBackend() {
    return this.backend;
  }
  getRegistry() {
    return this.monitor.registry;
  }
  getActions() {
    const t = this, { dispatch: n } = this.store;
    function r(i) {
      return (...a) => {
        const s = i.apply(t, a);
        typeof s < "u" && n(s);
      };
    }
    const o = bp(this);
    return Object.keys(o).reduce((i, a) => {
      const s = o[a];
      return i[a] = r(s), i;
    }, {});
  }
  dispatch(t) {
    this.store.dispatch(t);
  }
  constructor(t, n) {
    this.isSetUp = !1, this.handleRefCountChange = () => {
      const r = this.store.getState().refCount > 0;
      this.backend && (r && !this.isSetUp ? (this.backend.setup(), this.isSetUp = !0) : !r && this.isSetUp && (this.backend.teardown(), this.isSetUp = !1));
    }, this.store = t, this.monitor = n, t.subscribe(this.handleRefCountChange);
  }
}
function xp(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}
function Rl(e, t) {
  return {
    x: e.x - t.x,
    y: e.y - t.y
  };
}
function Op(e) {
  const { clientOffset: t, initialClientOffset: n, initialSourceClientOffset: r } = e;
  return !t || !n || !r ? null : Rl(xp(t, r), n);
}
function Ep(e) {
  const { clientOffset: t, initialClientOffset: n } = e;
  return !t || !n ? null : Rl(t, n);
}
const Nr = [], Wa = [];
Nr.__IS_NONE__ = !0;
Wa.__IS_ALL__ = !0;
function wp(e, t) {
  return e === Nr ? !1 : e === Wa || typeof t > "u" ? !0 : Xd(t, e).length > 0;
}
class Sp {
  subscribeToStateChange(t, n = {}) {
    const { handlerIds: r } = n;
    ue(typeof t == "function", "listener must be a function."), ue(typeof r > "u" || Array.isArray(r), "handlerIds, when specified, must be an array of strings.");
    let o = this.store.getState().stateId;
    const i = () => {
      const a = this.store.getState(), s = a.stateId;
      try {
        s === o || s === o + 1 && !wp(a.dirtyHandlerIds, r) || t();
      } finally {
        o = s;
      }
    };
    return this.store.subscribe(i);
  }
  subscribeToOffsetChange(t) {
    ue(typeof t == "function", "listener must be a function.");
    let n = this.store.getState().dragOffset;
    const r = () => {
      const o = this.store.getState().dragOffset;
      o !== n && (n = o, t());
    };
    return this.store.subscribe(r);
  }
  canDragSource(t) {
    if (!t)
      return !1;
    const n = this.registry.getSource(t);
    return ue(n, `Expected to find a valid source. sourceId=${t}`), this.isDragging() ? !1 : n.canDrag(this, t);
  }
  canDropOnTarget(t) {
    if (!t)
      return !1;
    const n = this.registry.getTarget(t);
    if (ue(n, `Expected to find a valid target. targetId=${t}`), !this.isDragging() || this.didDrop())
      return !1;
    const r = this.registry.getTargetType(t), o = this.getItemType();
    return fa(r, o) && n.canDrop(this, t);
  }
  isDragging() {
    return Boolean(this.getItemType());
  }
  isDraggingSource(t) {
    if (!t)
      return !1;
    const n = this.registry.getSource(t, !0);
    if (ue(n, `Expected to find a valid source. sourceId=${t}`), !this.isDragging() || !this.isSourcePublic())
      return !1;
    const r = this.registry.getSourceType(t), o = this.getItemType();
    return r !== o ? !1 : n.isDragging(this, t);
  }
  isOverTarget(t, n = {
    shallow: !1
  }) {
    if (!t)
      return !1;
    const { shallow: r } = n;
    if (!this.isDragging())
      return !1;
    const o = this.registry.getTargetType(t), i = this.getItemType();
    if (i && !fa(o, i))
      return !1;
    const a = this.getTargetIds();
    if (!a.length)
      return !1;
    const s = a.indexOf(t);
    return r ? s === a.length - 1 : s > -1;
  }
  getItemType() {
    return this.store.getState().dragOperation.itemType;
  }
  getItem() {
    return this.store.getState().dragOperation.item;
  }
  getSourceId() {
    return this.store.getState().dragOperation.sourceId;
  }
  getTargetIds() {
    return this.store.getState().dragOperation.targetIds;
  }
  getDropResult() {
    return this.store.getState().dragOperation.dropResult;
  }
  didDrop() {
    return this.store.getState().dragOperation.didDrop;
  }
  isSourcePublic() {
    return Boolean(this.store.getState().dragOperation.isSourcePublic);
  }
  getInitialClientOffset() {
    return this.store.getState().dragOffset.initialClientOffset;
  }
  getInitialSourceClientOffset() {
    return this.store.getState().dragOffset.initialSourceClientOffset;
  }
  getClientOffset() {
    return this.store.getState().dragOffset.clientOffset;
  }
  getSourceClientOffset() {
    return Op(this.store.getState().dragOffset);
  }
  getDifferenceFromInitialOffset() {
    return Ep(this.store.getState().dragOffset);
  }
  constructor(t, n) {
    this.store = t, this.registry = n;
  }
}
const Ws = typeof global < "u" ? global : self, Nl = Ws.MutationObserver || Ws.WebKitMutationObserver;
function Pl(e) {
  return function() {
    const n = setTimeout(o, 0), r = setInterval(o, 50);
    function o() {
      clearTimeout(n), clearInterval(r), e();
    }
  };
}
function Tp(e) {
  let t = 1;
  const n = new Nl(e), r = document.createTextNode("");
  return n.observe(r, {
    characterData: !0
  }), function() {
    t = -t, r.data = t;
  };
}
const Cp = typeof Nl == "function" ? Tp : Pl;
class Ip {
  enqueueTask(t) {
    const { queue: n, requestFlush: r } = this;
    n.length || (r(), this.flushing = !0), n[n.length] = t;
  }
  constructor() {
    this.queue = [], this.pendingErrors = [], this.flushing = !1, this.index = 0, this.capacity = 1024, this.flush = () => {
      const { queue: t } = this;
      for (; this.index < t.length; ) {
        const n = this.index;
        if (this.index++, t[n].call(), this.index > this.capacity) {
          for (let r = 0, o = t.length - this.index; r < o; r++)
            t[r] = t[r + this.index];
          t.length -= this.index, this.index = 0;
        }
      }
      t.length = 0, this.index = 0, this.flushing = !1;
    }, this.registerPendingError = (t) => {
      this.pendingErrors.push(t), this.requestErrorThrow();
    }, this.requestFlush = Cp(this.flush), this.requestErrorThrow = Pl(() => {
      if (this.pendingErrors.length)
        throw this.pendingErrors.shift();
    });
  }
}
class kp {
  call() {
    try {
      this.task && this.task();
    } catch (t) {
      this.onError(t);
    } finally {
      this.task = null, this.release(this);
    }
  }
  constructor(t, n) {
    this.onError = t, this.release = n, this.task = null;
  }
}
class _p {
  create(t) {
    const n = this.freeTasks, r = n.length ? n.pop() : new kp(
      this.onError,
      (o) => n[n.length] = o
    );
    return r.task = t, r;
  }
  constructor(t) {
    this.onError = t, this.freeTasks = [];
  }
}
const Al = new Ip(), Dp = new _p(Al.registerPendingError);
function Rp(e) {
  Al.enqueueTask(Dp.create(e));
}
const qa = "dnd-core/ADD_SOURCE", Ya = "dnd-core/ADD_TARGET", Ga = "dnd-core/REMOVE_SOURCE", jo = "dnd-core/REMOVE_TARGET";
function Np(e) {
  return {
    type: qa,
    payload: {
      sourceId: e
    }
  };
}
function Pp(e) {
  return {
    type: Ya,
    payload: {
      targetId: e
    }
  };
}
function Ap(e) {
  return {
    type: Ga,
    payload: {
      sourceId: e
    }
  };
}
function jp(e) {
  return {
    type: jo,
    payload: {
      targetId: e
    }
  };
}
function Mp(e) {
  ue(typeof e.canDrag == "function", "Expected canDrag to be a function."), ue(typeof e.beginDrag == "function", "Expected beginDrag to be a function."), ue(typeof e.endDrag == "function", "Expected endDrag to be a function.");
}
function Lp(e) {
  ue(typeof e.canDrop == "function", "Expected canDrop to be a function."), ue(typeof e.hover == "function", "Expected hover to be a function."), ue(typeof e.drop == "function", "Expected beginDrag to be a function.");
}
function da(e, t) {
  if (t && Array.isArray(e)) {
    e.forEach(
      (n) => da(n, !1)
    );
    return;
  }
  ue(typeof e == "string" || typeof e == "symbol", t ? "Type can only be a string, a symbol, or an array of either." : "Type can only be a string or a symbol.");
}
var ht;
(function(e) {
  e.SOURCE = "SOURCE", e.TARGET = "TARGET";
})(ht || (ht = {}));
let Fp = 0;
function Bp() {
  return Fp++;
}
function $p(e) {
  const t = Bp().toString();
  switch (e) {
    case ht.SOURCE:
      return `S${t}`;
    case ht.TARGET:
      return `T${t}`;
    default:
      throw new Error(`Unknown Handler Role: ${e}`);
  }
}
function qs(e) {
  switch (e[0]) {
    case "S":
      return ht.SOURCE;
    case "T":
      return ht.TARGET;
    default:
      throw new Error(`Cannot parse handler ID: ${e}`);
  }
}
function Ys(e, t) {
  const n = e.entries();
  let r = !1;
  do {
    const { done: o, value: [, i] } = n.next();
    if (i === t)
      return !0;
    r = !!o;
  } while (!r);
  return !1;
}
class Vp {
  addSource(t, n) {
    da(t), Mp(n);
    const r = this.addHandler(ht.SOURCE, t, n);
    return this.store.dispatch(Np(r)), r;
  }
  addTarget(t, n) {
    da(t, !0), Lp(n);
    const r = this.addHandler(ht.TARGET, t, n);
    return this.store.dispatch(Pp(r)), r;
  }
  containsHandler(t) {
    return Ys(this.dragSources, t) || Ys(this.dropTargets, t);
  }
  getSource(t, n = !1) {
    return ue(this.isSourceId(t), "Expected a valid source ID."), n && t === this.pinnedSourceId ? this.pinnedSource : this.dragSources.get(t);
  }
  getTarget(t) {
    return ue(this.isTargetId(t), "Expected a valid target ID."), this.dropTargets.get(t);
  }
  getSourceType(t) {
    return ue(this.isSourceId(t), "Expected a valid source ID."), this.types.get(t);
  }
  getTargetType(t) {
    return ue(this.isTargetId(t), "Expected a valid target ID."), this.types.get(t);
  }
  isSourceId(t) {
    return qs(t) === ht.SOURCE;
  }
  isTargetId(t) {
    return qs(t) === ht.TARGET;
  }
  removeSource(t) {
    ue(this.getSource(t), "Expected an existing source."), this.store.dispatch(Ap(t)), Rp(() => {
      this.dragSources.delete(t), this.types.delete(t);
    });
  }
  removeTarget(t) {
    ue(this.getTarget(t), "Expected an existing target."), this.store.dispatch(jp(t)), this.dropTargets.delete(t), this.types.delete(t);
  }
  pinSource(t) {
    const n = this.getSource(t);
    ue(n, "Expected an existing source."), this.pinnedSourceId = t, this.pinnedSource = n;
  }
  unpinSource() {
    ue(this.pinnedSource, "No source is pinned at the time."), this.pinnedSourceId = null, this.pinnedSource = null;
  }
  addHandler(t, n, r) {
    const o = $p(t);
    return this.types.set(o, n), t === ht.SOURCE ? this.dragSources.set(o, r) : t === ht.TARGET && this.dropTargets.set(o, r), o;
  }
  constructor(t) {
    this.types = /* @__PURE__ */ new Map(), this.dragSources = /* @__PURE__ */ new Map(), this.dropTargets = /* @__PURE__ */ new Map(), this.pinnedSourceId = null, this.pinnedSource = null, this.store = t;
  }
}
const Up = (e, t) => e === t;
function zp(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.x === t.x && e.y === t.y;
}
function Hp(e, t, n = Up) {
  if (e.length !== t.length)
    return !1;
  for (let r = 0; r < e.length; ++r)
    if (!n(e[r], t[r]))
      return !1;
  return !0;
}
function Wp(e = Nr, t) {
  switch (t.type) {
    case No:
      break;
    case qa:
    case Ya:
    case jo:
    case Ga:
      return Nr;
    case Ro:
    case Ha:
    case Ao:
    case Po:
    default:
      return Wa;
  }
  const { targetIds: n = [], prevTargetIds: r = [] } = t.payload, o = Kd(n, r);
  if (!(o.length > 0 || !Hp(n, r)))
    return Nr;
  const a = r[r.length - 1], s = n[n.length - 1];
  return a !== s && (a && o.push(a), s && o.push(s)), o;
}
function qp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function Yp(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}, r = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function(o) {
      return Object.getOwnPropertyDescriptor(n, o).enumerable;
    }))), r.forEach(function(o) {
      qp(e, o, n[o]);
    });
  }
  return e;
}
const Gs = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};
function Gp(e = Gs, t) {
  const { payload: n } = t;
  switch (t.type) {
    case za:
    case Ro:
      return {
        initialSourceClientOffset: n.sourceClientOffset,
        initialClientOffset: n.clientOffset,
        clientOffset: n.clientOffset
      };
    case No:
      return zp(e.clientOffset, n.clientOffset) ? e : Yp({}, e, {
        clientOffset: n.clientOffset
      });
    case Ao:
    case Po:
      return Gs;
    default:
      return e;
  }
}
function Kp(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function Un(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}, r = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function(o) {
      return Object.getOwnPropertyDescriptor(n, o).enumerable;
    }))), r.forEach(function(o) {
      Kp(e, o, n[o]);
    });
  }
  return e;
}
const Xp = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: !1,
  isSourcePublic: null
};
function Jp(e = Xp, t) {
  const { payload: n } = t;
  switch (t.type) {
    case Ro:
      return Un({}, e, {
        itemType: n.itemType,
        item: n.item,
        sourceId: n.sourceId,
        isSourcePublic: n.isSourcePublic,
        dropResult: null,
        didDrop: !1
      });
    case Ha:
      return Un({}, e, {
        isSourcePublic: !0
      });
    case No:
      return Un({}, e, {
        targetIds: n.targetIds
      });
    case jo:
      return e.targetIds.indexOf(n.targetId) === -1 ? e : Un({}, e, {
        targetIds: Gd(e.targetIds, n.targetId)
      });
    case Po:
      return Un({}, e, {
        dropResult: n.dropResult,
        didDrop: !0,
        targetIds: []
      });
    case Ao:
      return Un({}, e, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: !1,
        isSourcePublic: null,
        targetIds: []
      });
    default:
      return e;
  }
}
function Qp(e = 0, t) {
  switch (t.type) {
    case qa:
    case Ya:
      return e + 1;
    case Ga:
    case jo:
      return e - 1;
    default:
      return e;
  }
}
function Zp(e = 0) {
  return e + 1;
}
function eh(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function th(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}, r = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function(o) {
      return Object.getOwnPropertyDescriptor(n, o).enumerable;
    }))), r.forEach(function(o) {
      eh(e, o, n[o]);
    });
  }
  return e;
}
function nh(e = {}, t) {
  return {
    dirtyHandlerIds: Wp(e.dirtyHandlerIds, {
      type: t.type,
      payload: th({}, t.payload, {
        prevTargetIds: Yd(e, "dragOperation.targetIds", [])
      })
    }),
    dragOffset: Gp(e.dragOffset, t),
    refCount: Qp(e.refCount, t),
    dragOperation: Jp(e.dragOperation, t),
    stateId: Zp(e.stateId)
  };
}
function rh(e, t = void 0, n = {}, r = !1) {
  const o = oh(r), i = new Sp(o, new Vp(o)), a = new vp(o, i), s = e(a, t, n);
  return a.receiveBackend(s), a;
}
function oh(e) {
  const t = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION__;
  return _l(nh, e && t && t({
    name: "dnd-core",
    instanceId: "dnd-core"
  }));
}
function ih(e, t) {
  if (e == null)
    return {};
  var n = ah(e, t), r, o;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (o = 0; o < i.length; o++)
      r = i[o], !(t.indexOf(r) >= 0) && (!Object.prototype.propertyIsEnumerable.call(e, r) || (n[r] = e[r]));
  }
  return n;
}
function ah(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), o, i;
  for (i = 0; i < r.length; i++)
    o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
let Ks = 0;
const ao = Symbol.for("__REACT_DND_CONTEXT_INSTANCE__");
var sh = /* @__PURE__ */ cn(function(t) {
  var { children: n } = t, r = ih(t, [
    "children"
  ]);
  const [o, i] = ch(r);
  return we(() => {
    if (i) {
      const a = jl();
      return ++Ks, () => {
        --Ks === 0 && (a[ao] = null);
      };
    }
  }, []), /* @__PURE__ */ q(kl.Provider, {
    value: o,
    children: n
  });
});
function ch(e) {
  if ("manager" in e)
    return [
      {
        dragDropManager: e.manager
      },
      !1
    ];
  const t = lh(e.backend, e.context, e.options, e.debugMode), n = !e.context;
  return [
    t,
    n
  ];
}
function lh(e, t = jl(), n, r) {
  const o = t;
  return o[ao] || (o[ao] = {
    dragDropManager: rh(e, t, n, r)
  }), o[ao];
}
function jl() {
  return typeof global < "u" ? global : window;
}
var uh = function e(t, n) {
  if (t === n)
    return !0;
  if (t && n && typeof t == "object" && typeof n == "object") {
    if (t.constructor !== n.constructor)
      return !1;
    var r, o, i;
    if (Array.isArray(t)) {
      if (r = t.length, r != n.length)
        return !1;
      for (o = r; o-- !== 0; )
        if (!e(t[o], n[o]))
          return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === n.source && t.flags === n.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === n.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === n.toString();
    if (i = Object.keys(t), r = i.length, r !== Object.keys(n).length)
      return !1;
    for (o = r; o-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(n, i[o]))
        return !1;
    for (o = r; o-- !== 0; ) {
      var a = i[o];
      if (!e(t[a], n[a]))
        return !1;
    }
    return !0;
  }
  return t !== t && n !== n;
};
const In = typeof window < "u" ? Rn : we;
function fh(e, t, n) {
  const [r, o] = ye(
    () => t(e)
  ), i = Ne(() => {
    const a = t(e);
    uh(r, a) || (o(a), n && n());
  }, [
    r,
    e,
    n
  ]);
  return In(i), [
    r,
    i
  ];
}
function dh(e, t, n) {
  const [r, o] = fh(e, t, n);
  return In(function() {
    const a = e.getHandlerId();
    if (a != null)
      return e.subscribeToStateChange(o, {
        handlerIds: [
          a
        ]
      });
  }, [
    e,
    o
  ]), r;
}
function Ml(e, t, n) {
  return dh(
    t,
    e || (() => ({})),
    () => n.reconnect()
  );
}
function Ll(e, t) {
  const n = [
    ...t || []
  ];
  return t == null && typeof e != "function" && n.push(e), De(() => typeof e == "function" ? e() : e, n);
}
function ph(e) {
  return De(
    () => e.hooks.dragSource(),
    [
      e
    ]
  );
}
function hh(e) {
  return De(
    () => e.hooks.dragPreview(),
    [
      e
    ]
  );
}
let Fi = !1, Bi = !1;
class gh {
  receiveHandlerId(t) {
    this.sourceId = t;
  }
  getHandlerId() {
    return this.sourceId;
  }
  canDrag() {
    ue(!Fi, "You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
    try {
      return Fi = !0, this.internalMonitor.canDragSource(this.sourceId);
    } finally {
      Fi = !1;
    }
  }
  isDragging() {
    if (!this.sourceId)
      return !1;
    ue(!Bi, "You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
    try {
      return Bi = !0, this.internalMonitor.isDraggingSource(this.sourceId);
    } finally {
      Bi = !1;
    }
  }
  subscribeToStateChange(t, n) {
    return this.internalMonitor.subscribeToStateChange(t, n);
  }
  isDraggingSource(t) {
    return this.internalMonitor.isDraggingSource(t);
  }
  isOverTarget(t, n) {
    return this.internalMonitor.isOverTarget(t, n);
  }
  getTargetIds() {
    return this.internalMonitor.getTargetIds();
  }
  isSourcePublic() {
    return this.internalMonitor.isSourcePublic();
  }
  getSourceId() {
    return this.internalMonitor.getSourceId();
  }
  subscribeToOffsetChange(t) {
    return this.internalMonitor.subscribeToOffsetChange(t);
  }
  canDragSource(t) {
    return this.internalMonitor.canDragSource(t);
  }
  canDropOnTarget(t) {
    return this.internalMonitor.canDropOnTarget(t);
  }
  getItemType() {
    return this.internalMonitor.getItemType();
  }
  getItem() {
    return this.internalMonitor.getItem();
  }
  getDropResult() {
    return this.internalMonitor.getDropResult();
  }
  didDrop() {
    return this.internalMonitor.didDrop();
  }
  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }
  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }
  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }
  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }
  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }
  constructor(t) {
    this.sourceId = null, this.internalMonitor = t.getMonitor();
  }
}
let $i = !1;
class mh {
  receiveHandlerId(t) {
    this.targetId = t;
  }
  getHandlerId() {
    return this.targetId;
  }
  subscribeToStateChange(t, n) {
    return this.internalMonitor.subscribeToStateChange(t, n);
  }
  canDrop() {
    if (!this.targetId)
      return !1;
    ue(!$i, "You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor");
    try {
      return $i = !0, this.internalMonitor.canDropOnTarget(this.targetId);
    } finally {
      $i = !1;
    }
  }
  isOver(t) {
    return this.targetId ? this.internalMonitor.isOverTarget(this.targetId, t) : !1;
  }
  getItemType() {
    return this.internalMonitor.getItemType();
  }
  getItem() {
    return this.internalMonitor.getItem();
  }
  getDropResult() {
    return this.internalMonitor.getDropResult();
  }
  didDrop() {
    return this.internalMonitor.didDrop();
  }
  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }
  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }
  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }
  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }
  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }
  constructor(t) {
    this.targetId = null, this.internalMonitor = t.getMonitor();
  }
}
function yh(e, t, n) {
  const r = n.getRegistry(), o = r.addTarget(e, t);
  return [
    o,
    () => r.removeTarget(o)
  ];
}
function bh(e, t, n) {
  const r = n.getRegistry(), o = r.addSource(e, t);
  return [
    o,
    () => r.removeSource(o)
  ];
}
function pa(e, t, n, r) {
  let o = n ? n.call(r, e, t) : void 0;
  if (o !== void 0)
    return !!o;
  if (e === t)
    return !0;
  if (typeof e != "object" || !e || typeof t != "object" || !t)
    return !1;
  const i = Object.keys(e), a = Object.keys(t);
  if (i.length !== a.length)
    return !1;
  const s = Object.prototype.hasOwnProperty.bind(t);
  for (let l = 0; l < i.length; l++) {
    const u = i[l];
    if (!s(u))
      return !1;
    const d = e[u], p = t[u];
    if (o = n ? n.call(r, d, p, u) : void 0, o === !1 || o === void 0 && d !== p)
      return !1;
  }
  return !0;
}
function ha(e) {
  return e !== null && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function vh(e) {
  if (typeof e.type == "string")
    return;
  const t = e.type.displayName || e.type.name || "the component";
  throw new Error(`Only native element nodes can now be passed to React DnD connectors.You can either wrap ${t} into a <div>, or turn it into a drag source or a drop target itself.`);
}
function xh(e) {
  return (t = null, n = null) => {
    if (!pf(t)) {
      const i = t;
      return e(i, n), i;
    }
    const r = t;
    return vh(r), Oh(r, n ? (i) => e(i, n) : e);
  };
}
function Fl(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    const r = e[n];
    if (n.endsWith("Ref"))
      t[n] = e[n];
    else {
      const o = xh(r);
      t[n] = () => o;
    }
  }), t;
}
function Xs(e, t) {
  typeof e == "function" ? e(t) : e.current = t;
}
function Oh(e, t) {
  const n = e.ref;
  return ue(typeof n != "string", "Cannot connect React DnD to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs"), n ? At(e, {
    ref: (r) => {
      Xs(n, r), Xs(t, r);
    }
  }) : At(e, {
    ref: t
  });
}
class Eh {
  receiveHandlerId(t) {
    this.handlerId !== t && (this.handlerId = t, this.reconnect());
  }
  get connectTarget() {
    return this.dragSource;
  }
  get dragSourceOptions() {
    return this.dragSourceOptionsInternal;
  }
  set dragSourceOptions(t) {
    this.dragSourceOptionsInternal = t;
  }
  get dragPreviewOptions() {
    return this.dragPreviewOptionsInternal;
  }
  set dragPreviewOptions(t) {
    this.dragPreviewOptionsInternal = t;
  }
  reconnect() {
    const t = this.reconnectDragSource();
    this.reconnectDragPreview(t);
  }
  reconnectDragSource() {
    const t = this.dragSource, n = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();
    return n && this.disconnectDragSource(), this.handlerId ? t ? (n && (this.lastConnectedHandlerId = this.handlerId, this.lastConnectedDragSource = t, this.lastConnectedDragSourceOptions = this.dragSourceOptions, this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, t, this.dragSourceOptions)), n) : (this.lastConnectedDragSource = t, n) : n;
  }
  reconnectDragPreview(t = !1) {
    const n = this.dragPreview, r = t || this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();
    if (r && this.disconnectDragPreview(), !!this.handlerId) {
      if (!n) {
        this.lastConnectedDragPreview = n;
        return;
      }
      r && (this.lastConnectedHandlerId = this.handlerId, this.lastConnectedDragPreview = n, this.lastConnectedDragPreviewOptions = this.dragPreviewOptions, this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, n, this.dragPreviewOptions));
    }
  }
  didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  }
  didConnectedDragSourceChange() {
    return this.lastConnectedDragSource !== this.dragSource;
  }
  didConnectedDragPreviewChange() {
    return this.lastConnectedDragPreview !== this.dragPreview;
  }
  didDragSourceOptionsChange() {
    return !pa(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
  }
  didDragPreviewOptionsChange() {
    return !pa(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
  }
  disconnectDragSource() {
    this.dragSourceUnsubscribe && (this.dragSourceUnsubscribe(), this.dragSourceUnsubscribe = void 0);
  }
  disconnectDragPreview() {
    this.dragPreviewUnsubscribe && (this.dragPreviewUnsubscribe(), this.dragPreviewUnsubscribe = void 0, this.dragPreviewNode = null, this.dragPreviewRef = null);
  }
  get dragSource() {
    return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
  }
  get dragPreview() {
    return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
  }
  clearDragSource() {
    this.dragSourceNode = null, this.dragSourceRef = null;
  }
  clearDragPreview() {
    this.dragPreviewNode = null, this.dragPreviewRef = null;
  }
  constructor(t) {
    this.hooks = Fl({
      dragSource: (n, r) => {
        this.clearDragSource(), this.dragSourceOptions = r || null, ha(n) ? this.dragSourceRef = n : this.dragSourceNode = n, this.reconnectDragSource();
      },
      dragPreview: (n, r) => {
        this.clearDragPreview(), this.dragPreviewOptions = r || null, ha(n) ? this.dragPreviewRef = n : this.dragPreviewNode = n, this.reconnectDragPreview();
      }
    }), this.handlerId = null, this.dragSourceRef = null, this.dragSourceOptionsInternal = null, this.dragPreviewRef = null, this.dragPreviewOptionsInternal = null, this.lastConnectedHandlerId = null, this.lastConnectedDragSource = null, this.lastConnectedDragSourceOptions = null, this.lastConnectedDragPreview = null, this.lastConnectedDragPreviewOptions = null, this.backend = t;
  }
}
class wh {
  get connectTarget() {
    return this.dropTarget;
  }
  reconnect() {
    const t = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();
    t && this.disconnectDropTarget();
    const n = this.dropTarget;
    if (!!this.handlerId) {
      if (!n) {
        this.lastConnectedDropTarget = n;
        return;
      }
      t && (this.lastConnectedHandlerId = this.handlerId, this.lastConnectedDropTarget = n, this.lastConnectedDropTargetOptions = this.dropTargetOptions, this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, n, this.dropTargetOptions));
    }
  }
  receiveHandlerId(t) {
    t !== this.handlerId && (this.handlerId = t, this.reconnect());
  }
  get dropTargetOptions() {
    return this.dropTargetOptionsInternal;
  }
  set dropTargetOptions(t) {
    this.dropTargetOptionsInternal = t;
  }
  didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  }
  didDropTargetChange() {
    return this.lastConnectedDropTarget !== this.dropTarget;
  }
  didOptionsChange() {
    return !pa(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
  }
  disconnectDropTarget() {
    this.unsubscribeDropTarget && (this.unsubscribeDropTarget(), this.unsubscribeDropTarget = void 0);
  }
  get dropTarget() {
    return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
  }
  clearDropTarget() {
    this.dropTargetRef = null, this.dropTargetNode = null;
  }
  constructor(t) {
    this.hooks = Fl({
      dropTarget: (n, r) => {
        this.clearDropTarget(), this.dropTargetOptions = r, ha(n) ? this.dropTargetRef = n : this.dropTargetNode = n, this.reconnect();
      }
    }), this.handlerId = null, this.dropTargetRef = null, this.dropTargetOptionsInternal = null, this.lastConnectedHandlerId = null, this.lastConnectedDropTarget = null, this.lastConnectedDropTargetOptions = null, this.backend = t;
  }
}
function Jn() {
  const { dragDropManager: e } = tt(kl);
  return ue(e != null, "Expected drag drop context"), e;
}
function Sh(e, t) {
  const n = Jn(), r = De(
    () => new Eh(n.getBackend()),
    [
      n
    ]
  );
  return In(() => (r.dragSourceOptions = e || null, r.reconnect(), () => r.disconnectDragSource()), [
    r,
    e
  ]), In(() => (r.dragPreviewOptions = t || null, r.reconnect(), () => r.disconnectDragPreview()), [
    r,
    t
  ]), r;
}
function Th() {
  const e = Jn();
  return De(
    () => new gh(e),
    [
      e
    ]
  );
}
class Ch {
  beginDrag() {
    const t = this.spec, n = this.monitor;
    let r = null;
    return typeof t.item == "object" ? r = t.item : typeof t.item == "function" ? r = t.item(n) : r = {}, r != null ? r : null;
  }
  canDrag() {
    const t = this.spec, n = this.monitor;
    return typeof t.canDrag == "boolean" ? t.canDrag : typeof t.canDrag == "function" ? t.canDrag(n) : !0;
  }
  isDragging(t, n) {
    const r = this.spec, o = this.monitor, { isDragging: i } = r;
    return i ? i(o) : n === t.getSourceId();
  }
  endDrag() {
    const t = this.spec, n = this.monitor, r = this.connector, { end: o } = t;
    o && o(n.getItem(), n), r.reconnect();
  }
  constructor(t, n, r) {
    this.spec = t, this.monitor = n, this.connector = r;
  }
}
function Ih(e, t, n) {
  const r = De(
    () => new Ch(e, t, n),
    [
      t,
      n
    ]
  );
  return we(() => {
    r.spec = e;
  }, [
    e
  ]), r;
}
function kh(e) {
  return De(() => {
    const t = e.type;
    return ue(t != null, "spec.type must be defined"), t;
  }, [
    e
  ]);
}
function _h(e, t, n) {
  const r = Jn(), o = Ih(e, t, n), i = kh(e);
  In(function() {
    if (i != null) {
      const [s, l] = bh(i, o, r);
      return t.receiveHandlerId(s), n.receiveHandlerId(s), l;
    }
  }, [
    r,
    t,
    n,
    o,
    i
  ]);
}
function Dh(e, t) {
  const n = Ll(e, t);
  ue(!n.begin, "useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)");
  const r = Th(), o = Sh(n.options, n.previewOptions);
  return _h(n, r, o), [
    Ml(n.collect, r, o),
    ph(o),
    hh(o)
  ];
}
function Rh(e) {
  return De(
    () => e.hooks.dropTarget(),
    [
      e
    ]
  );
}
function Nh(e) {
  const t = Jn(), n = De(
    () => new wh(t.getBackend()),
    [
      t
    ]
  );
  return In(() => (n.dropTargetOptions = e || null, n.reconnect(), () => n.disconnectDropTarget()), [
    e
  ]), n;
}
function Ph() {
  const e = Jn();
  return De(
    () => new mh(e),
    [
      e
    ]
  );
}
function Ah(e) {
  const { accept: t } = e;
  return De(() => (ue(e.accept != null, "accept must be defined"), Array.isArray(t) ? t : [
    t
  ]), [
    t
  ]);
}
class jh {
  canDrop() {
    const t = this.spec, n = this.monitor;
    return t.canDrop ? t.canDrop(n.getItem(), n) : !0;
  }
  hover() {
    const t = this.spec, n = this.monitor;
    t.hover && t.hover(n.getItem(), n);
  }
  drop() {
    const t = this.spec, n = this.monitor;
    if (t.drop)
      return t.drop(n.getItem(), n);
  }
  constructor(t, n) {
    this.spec = t, this.monitor = n;
  }
}
function Mh(e, t) {
  const n = De(
    () => new jh(e, t),
    [
      t
    ]
  );
  return we(() => {
    n.spec = e;
  }, [
    e
  ]), n;
}
function Lh(e, t, n) {
  const r = Jn(), o = Mh(e, t), i = Ah(e);
  In(function() {
    const [s, l] = yh(i, o, r);
    return t.receiveHandlerId(s), n.receiveHandlerId(s), l;
  }, [
    r,
    t,
    o,
    n,
    i.map(
      (a) => a.toString()
    ).join("|")
  ]);
}
function Fh(e, t) {
  const n = Ll(e, t), r = Ph(), o = Nh(n.options);
  return Lh(n, r, o), [
    Ml(n.collect, r, o),
    Rh(o)
  ];
}
function Bl(e) {
  let t = null;
  return () => (t == null && (t = e()), t);
}
function Bh(e, t) {
  return e.filter(
    (n) => n !== t
  );
}
function $h(e, t) {
  const n = /* @__PURE__ */ new Set(), r = (i) => n.add(i);
  e.forEach(r), t.forEach(r);
  const o = [];
  return n.forEach(
    (i) => o.push(i)
  ), o;
}
class Vh {
  enter(t) {
    const n = this.entered.length, r = (o) => this.isNodeInDocument(o) && (!o.contains || o.contains(t));
    return this.entered = $h(this.entered.filter(r), [
      t
    ]), n === 0 && this.entered.length > 0;
  }
  leave(t) {
    const n = this.entered.length;
    return this.entered = Bh(this.entered.filter(this.isNodeInDocument), t), n > 0 && this.entered.length === 0;
  }
  reset() {
    this.entered = [];
  }
  constructor(t) {
    this.entered = [], this.isNodeInDocument = t;
  }
}
class Uh {
  initializeExposedProperties() {
    Object.keys(this.config.exposeProperties).forEach((t) => {
      Object.defineProperty(this.item, t, {
        configurable: !0,
        enumerable: !0,
        get() {
          return console.warn(`Browser doesn't allow reading "${t}" until the drop event.`), null;
        }
      });
    });
  }
  loadDataTransfer(t) {
    if (t) {
      const n = {};
      Object.keys(this.config.exposeProperties).forEach((r) => {
        const o = this.config.exposeProperties[r];
        o != null && (n[r] = {
          value: o(t, this.config.matchesTypes),
          configurable: !0,
          enumerable: !0
        });
      }), Object.defineProperties(this.item, n);
    }
  }
  canDrag() {
    return !0;
  }
  beginDrag() {
    return this.item;
  }
  isDragging(t, n) {
    return n === t.getSourceId();
  }
  endDrag() {
  }
  constructor(t) {
    this.config = t, this.item = {}, this.initializeExposedProperties();
  }
}
const $l = "__NATIVE_FILE__", Vl = "__NATIVE_URL__", Ul = "__NATIVE_TEXT__", zl = "__NATIVE_HTML__", Js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FILE: $l,
  URL: Vl,
  TEXT: Ul,
  HTML: zl
}, Symbol.toStringTag, { value: "Module" }));
function Vi(e, t, n) {
  const r = t.reduce(
    (o, i) => o || e.getData(i),
    ""
  );
  return r != null ? r : n;
}
const ga = {
  [$l]: {
    exposeProperties: {
      files: (e) => Array.prototype.slice.call(e.files),
      items: (e) => e.items,
      dataTransfer: (e) => e
    },
    matchesTypes: [
      "Files"
    ]
  },
  [zl]: {
    exposeProperties: {
      html: (e, t) => Vi(e, t, ""),
      dataTransfer: (e) => e
    },
    matchesTypes: [
      "Html",
      "text/html"
    ]
  },
  [Vl]: {
    exposeProperties: {
      urls: (e, t) => Vi(e, t, "").split(`
`),
      dataTransfer: (e) => e
    },
    matchesTypes: [
      "Url",
      "text/uri-list"
    ]
  },
  [Ul]: {
    exposeProperties: {
      text: (e, t) => Vi(e, t, ""),
      dataTransfer: (e) => e
    },
    matchesTypes: [
      "Text",
      "text/plain"
    ]
  }
};
function zh(e, t) {
  const n = ga[e];
  if (!n)
    throw new Error(`native type ${e} has no configuration`);
  const r = new Uh(n);
  return r.loadDataTransfer(t), r;
}
function Ui(e) {
  if (!e)
    return null;
  const t = Array.prototype.slice.call(e.types || []);
  return Object.keys(ga).filter((n) => {
    const r = ga[n];
    return r != null && r.matchesTypes ? r.matchesTypes.some(
      (o) => t.indexOf(o) > -1
    ) : !1;
  })[0] || null;
}
const Hh = Bl(
  () => /firefox/i.test(navigator.userAgent)
), Hl = Bl(
  () => Boolean(window.safari)
);
class Qs {
  interpolate(t) {
    const { xs: n, ys: r, c1s: o, c2s: i, c3s: a } = this;
    let s = n.length - 1;
    if (t === n[s])
      return r[s];
    let l = 0, u = a.length - 1, d;
    for (; l <= u; ) {
      d = Math.floor(0.5 * (l + u));
      const b = n[d];
      if (b < t)
        l = d + 1;
      else if (b > t)
        u = d - 1;
      else
        return r[d];
    }
    s = Math.max(0, u);
    const p = t - n[s], h = p * p;
    return r[s] + o[s] * p + i[s] * h + a[s] * p * h;
  }
  constructor(t, n) {
    const { length: r } = t, o = [];
    for (let b = 0; b < r; b++)
      o.push(b);
    o.sort(
      (b, v) => t[b] < t[v] ? -1 : 1
    );
    const i = [], a = [];
    let s, l;
    for (let b = 0; b < r - 1; b++)
      s = t[b + 1] - t[b], l = n[b + 1] - n[b], i.push(s), a.push(l / s);
    const u = [
      a[0]
    ];
    for (let b = 0; b < i.length - 1; b++) {
      const v = a[b], g = a[b + 1];
      if (v * g <= 0)
        u.push(0);
      else {
        s = i[b];
        const w = i[b + 1], S = s + w;
        u.push(3 * S / ((S + w) / v + (S + s) / g));
      }
    }
    u.push(a[a.length - 1]);
    const d = [], p = [];
    let h;
    for (let b = 0; b < u.length - 1; b++) {
      h = a[b];
      const v = u[b], g = 1 / i[b], w = v + u[b + 1] - h - h;
      d.push((h - v - w) * g), p.push(w * g * g);
    }
    this.xs = t, this.ys = n, this.c1s = u, this.c2s = d, this.c3s = p;
  }
}
const Wh = 1;
function Wl(e) {
  const t = e.nodeType === Wh ? e : e.parentElement;
  if (!t)
    return null;
  const { top: n, left: r } = t.getBoundingClientRect();
  return {
    x: r,
    y: n
  };
}
function to(e) {
  return {
    x: e.clientX,
    y: e.clientY
  };
}
function qh(e) {
  var t;
  return e.nodeName === "IMG" && (Hh() || !(!((t = document.documentElement) === null || t === void 0) && t.contains(e)));
}
function Yh(e, t, n, r) {
  let o = e ? t.width : n, i = e ? t.height : r;
  return Hl() && e && (i /= window.devicePixelRatio, o /= window.devicePixelRatio), {
    dragPreviewWidth: o,
    dragPreviewHeight: i
  };
}
function Gh(e, t, n, r, o) {
  const i = qh(t), s = Wl(i ? e : t), l = {
    x: n.x - s.x,
    y: n.y - s.y
  }, { offsetWidth: u, offsetHeight: d } = e, { anchorX: p, anchorY: h } = r, { dragPreviewWidth: b, dragPreviewHeight: v } = Yh(i, t, u, d), g = () => {
    let _ = new Qs([
      0,
      0.5,
      1
    ], [
      l.y,
      l.y / d * v,
      l.y + v - d
    ]).interpolate(h);
    return Hl() && i && (_ += (window.devicePixelRatio - 1) * v), _;
  }, w = () => new Qs([
    0,
    0.5,
    1
  ], [
    l.x,
    l.x / u * b,
    l.x + b - u
  ]).interpolate(p), { offsetX: S, offsetY: y } = o, T = S === 0 || S, O = y === 0 || y;
  return {
    x: T ? S : w(),
    y: O ? y : g()
  };
}
class Kh {
  get window() {
    if (this.globalContext)
      return this.globalContext;
    if (typeof window < "u")
      return window;
  }
  get document() {
    var t;
    return !((t = this.globalContext) === null || t === void 0) && t.document ? this.globalContext.document : this.window ? this.window.document : void 0;
  }
  get rootElement() {
    var t;
    return ((t = this.optionsArgs) === null || t === void 0 ? void 0 : t.rootElement) || this.window;
  }
  constructor(t, n) {
    this.ownerDocument = null, this.globalContext = t, this.optionsArgs = n;
  }
}
function Xh(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function Zs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}, r = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (r = r.concat(Object.getOwnPropertySymbols(n).filter(function(o) {
      return Object.getOwnPropertyDescriptor(n, o).enumerable;
    }))), r.forEach(function(o) {
      Xh(e, o, n[o]);
    });
  }
  return e;
}
class Jh {
  profile() {
    var t, n;
    return {
      sourcePreviewNodes: this.sourcePreviewNodes.size,
      sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
      sourceNodeOptions: this.sourceNodeOptions.size,
      sourceNodes: this.sourceNodes.size,
      dragStartSourceIds: ((t = this.dragStartSourceIds) === null || t === void 0 ? void 0 : t.length) || 0,
      dropTargetIds: this.dropTargetIds.length,
      dragEnterTargetIds: this.dragEnterTargetIds.length,
      dragOverTargetIds: ((n = this.dragOverTargetIds) === null || n === void 0 ? void 0 : n.length) || 0
    };
  }
  get window() {
    return this.options.window;
  }
  get document() {
    return this.options.document;
  }
  get rootElement() {
    return this.options.rootElement;
  }
  setup() {
    const t = this.rootElement;
    if (t !== void 0) {
      if (t.__isReactDndBackendSetUp)
        throw new Error("Cannot have two HTML5 backends at the same time.");
      t.__isReactDndBackendSetUp = !0, this.addEventListeners(t);
    }
  }
  teardown() {
    const t = this.rootElement;
    if (t !== void 0 && (t.__isReactDndBackendSetUp = !1, this.removeEventListeners(this.rootElement), this.clearCurrentDragSourceNode(), this.asyncEndDragFrameId)) {
      var n;
      (n = this.window) === null || n === void 0 || n.cancelAnimationFrame(this.asyncEndDragFrameId);
    }
  }
  connectDragPreview(t, n, r) {
    return this.sourcePreviewNodeOptions.set(t, r), this.sourcePreviewNodes.set(t, n), () => {
      this.sourcePreviewNodes.delete(t), this.sourcePreviewNodeOptions.delete(t);
    };
  }
  connectDragSource(t, n, r) {
    this.sourceNodes.set(t, n), this.sourceNodeOptions.set(t, r);
    const o = (a) => this.handleDragStart(a, t), i = (a) => this.handleSelectStart(a);
    return n.setAttribute("draggable", "true"), n.addEventListener("dragstart", o), n.addEventListener("selectstart", i), () => {
      this.sourceNodes.delete(t), this.sourceNodeOptions.delete(t), n.removeEventListener("dragstart", o), n.removeEventListener("selectstart", i), n.setAttribute("draggable", "false");
    };
  }
  connectDropTarget(t, n) {
    const r = (a) => this.handleDragEnter(a, t), o = (a) => this.handleDragOver(a, t), i = (a) => this.handleDrop(a, t);
    return n.addEventListener("dragenter", r), n.addEventListener("dragover", o), n.addEventListener("drop", i), () => {
      n.removeEventListener("dragenter", r), n.removeEventListener("dragover", o), n.removeEventListener("drop", i);
    };
  }
  addEventListeners(t) {
    !t.addEventListener || (t.addEventListener("dragstart", this.handleTopDragStart), t.addEventListener("dragstart", this.handleTopDragStartCapture, !0), t.addEventListener("dragend", this.handleTopDragEndCapture, !0), t.addEventListener("dragenter", this.handleTopDragEnter), t.addEventListener("dragenter", this.handleTopDragEnterCapture, !0), t.addEventListener("dragleave", this.handleTopDragLeaveCapture, !0), t.addEventListener("dragover", this.handleTopDragOver), t.addEventListener("dragover", this.handleTopDragOverCapture, !0), t.addEventListener("drop", this.handleTopDrop), t.addEventListener("drop", this.handleTopDropCapture, !0));
  }
  removeEventListeners(t) {
    !t.removeEventListener || (t.removeEventListener("dragstart", this.handleTopDragStart), t.removeEventListener("dragstart", this.handleTopDragStartCapture, !0), t.removeEventListener("dragend", this.handleTopDragEndCapture, !0), t.removeEventListener("dragenter", this.handleTopDragEnter), t.removeEventListener("dragenter", this.handleTopDragEnterCapture, !0), t.removeEventListener("dragleave", this.handleTopDragLeaveCapture, !0), t.removeEventListener("dragover", this.handleTopDragOver), t.removeEventListener("dragover", this.handleTopDragOverCapture, !0), t.removeEventListener("drop", this.handleTopDrop), t.removeEventListener("drop", this.handleTopDropCapture, !0));
  }
  getCurrentSourceNodeOptions() {
    const t = this.monitor.getSourceId(), n = this.sourceNodeOptions.get(t);
    return Zs({
      dropEffect: this.altKeyPressed ? "copy" : "move"
    }, n || {});
  }
  getCurrentDropEffect() {
    return this.isDraggingNativeItem() ? "copy" : this.getCurrentSourceNodeOptions().dropEffect;
  }
  getCurrentSourcePreviewNodeOptions() {
    const t = this.monitor.getSourceId(), n = this.sourcePreviewNodeOptions.get(t);
    return Zs({
      anchorX: 0.5,
      anchorY: 0.5,
      captureDraggingState: !1
    }, n || {});
  }
  isDraggingNativeItem() {
    const t = this.monitor.getItemType();
    return Object.keys(Js).some(
      (n) => Js[n] === t
    );
  }
  beginDragNativeItem(t, n) {
    this.clearCurrentDragSourceNode(), this.currentNativeSource = zh(t, n), this.currentNativeHandle = this.registry.addSource(t, this.currentNativeSource), this.actions.beginDrag([
      this.currentNativeHandle
    ]);
  }
  setCurrentDragSourceNode(t) {
    this.clearCurrentDragSourceNode(), this.currentDragSourceNode = t;
    const n = 1e3;
    this.mouseMoveTimeoutTimer = setTimeout(() => {
      var r;
      return (r = this.rootElement) === null || r === void 0 ? void 0 : r.addEventListener("mousemove", this.endDragIfSourceWasRemovedFromDOM, !0);
    }, n);
  }
  clearCurrentDragSourceNode() {
    if (this.currentDragSourceNode) {
      if (this.currentDragSourceNode = null, this.rootElement) {
        var t;
        (t = this.window) === null || t === void 0 || t.clearTimeout(this.mouseMoveTimeoutTimer || void 0), this.rootElement.removeEventListener("mousemove", this.endDragIfSourceWasRemovedFromDOM, !0);
      }
      return this.mouseMoveTimeoutTimer = null, !0;
    }
    return !1;
  }
  handleDragStart(t, n) {
    t.defaultPrevented || (this.dragStartSourceIds || (this.dragStartSourceIds = []), this.dragStartSourceIds.unshift(n));
  }
  handleDragEnter(t, n) {
    this.dragEnterTargetIds.unshift(n);
  }
  handleDragOver(t, n) {
    this.dragOverTargetIds === null && (this.dragOverTargetIds = []), this.dragOverTargetIds.unshift(n);
  }
  handleDrop(t, n) {
    this.dropTargetIds.unshift(n);
  }
  constructor(t, n, r) {
    this.sourcePreviewNodes = /* @__PURE__ */ new Map(), this.sourcePreviewNodeOptions = /* @__PURE__ */ new Map(), this.sourceNodes = /* @__PURE__ */ new Map(), this.sourceNodeOptions = /* @__PURE__ */ new Map(), this.dragStartSourceIds = null, this.dropTargetIds = [], this.dragEnterTargetIds = [], this.currentNativeSource = null, this.currentNativeHandle = null, this.currentDragSourceNode = null, this.altKeyPressed = !1, this.mouseMoveTimeoutTimer = null, this.asyncEndDragFrameId = null, this.dragOverTargetIds = null, this.lastClientOffset = null, this.hoverRafId = null, this.getSourceClientOffset = (o) => {
      const i = this.sourceNodes.get(o);
      return i && Wl(i) || null;
    }, this.endDragNativeItem = () => {
      !this.isDraggingNativeItem() || (this.actions.endDrag(), this.currentNativeHandle && this.registry.removeSource(this.currentNativeHandle), this.currentNativeHandle = null, this.currentNativeSource = null);
    }, this.isNodeInDocument = (o) => Boolean(o && this.document && this.document.body && this.document.body.contains(o)), this.endDragIfSourceWasRemovedFromDOM = () => {
      const o = this.currentDragSourceNode;
      o == null || this.isNodeInDocument(o) || (this.clearCurrentDragSourceNode() && this.monitor.isDragging() && this.actions.endDrag(), this.cancelHover());
    }, this.scheduleHover = (o) => {
      this.hoverRafId === null && typeof requestAnimationFrame < "u" && (this.hoverRafId = requestAnimationFrame(() => {
        this.monitor.isDragging() && this.actions.hover(o || [], {
          clientOffset: this.lastClientOffset
        }), this.hoverRafId = null;
      }));
    }, this.cancelHover = () => {
      this.hoverRafId !== null && typeof cancelAnimationFrame < "u" && (cancelAnimationFrame(this.hoverRafId), this.hoverRafId = null);
    }, this.handleTopDragStartCapture = () => {
      this.clearCurrentDragSourceNode(), this.dragStartSourceIds = [];
    }, this.handleTopDragStart = (o) => {
      if (o.defaultPrevented)
        return;
      const { dragStartSourceIds: i } = this;
      this.dragStartSourceIds = null;
      const a = to(o);
      this.monitor.isDragging() && (this.actions.endDrag(), this.cancelHover()), this.actions.beginDrag(i || [], {
        publishSource: !1,
        getSourceClientOffset: this.getSourceClientOffset,
        clientOffset: a
      });
      const { dataTransfer: s } = o, l = Ui(s);
      if (this.monitor.isDragging()) {
        if (s && typeof s.setDragImage == "function") {
          const d = this.monitor.getSourceId(), p = this.sourceNodes.get(d), h = this.sourcePreviewNodes.get(d) || p;
          if (h) {
            const { anchorX: b, anchorY: v, offsetX: g, offsetY: w } = this.getCurrentSourcePreviewNodeOptions(), T = Gh(p, h, a, {
              anchorX: b,
              anchorY: v
            }, {
              offsetX: g,
              offsetY: w
            });
            s.setDragImage(h, T.x, T.y);
          }
        }
        try {
          s == null || s.setData("application/json", {});
        } catch {
        }
        this.setCurrentDragSourceNode(o.target);
        const { captureDraggingState: u } = this.getCurrentSourcePreviewNodeOptions();
        u ? this.actions.publishDragSource() : setTimeout(
          () => this.actions.publishDragSource(),
          0
        );
      } else if (l)
        this.beginDragNativeItem(l);
      else {
        if (s && !s.types && (o.target && !o.target.hasAttribute || !o.target.hasAttribute("draggable")))
          return;
        o.preventDefault();
      }
    }, this.handleTopDragEndCapture = () => {
      this.clearCurrentDragSourceNode() && this.monitor.isDragging() && this.actions.endDrag(), this.cancelHover();
    }, this.handleTopDragEnterCapture = (o) => {
      if (this.dragEnterTargetIds = [], this.isDraggingNativeItem()) {
        var i;
        (i = this.currentNativeSource) === null || i === void 0 || i.loadDataTransfer(o.dataTransfer);
      }
      if (!this.enterLeaveCounter.enter(o.target) || this.monitor.isDragging())
        return;
      const { dataTransfer: s } = o, l = Ui(s);
      l && this.beginDragNativeItem(l, s);
    }, this.handleTopDragEnter = (o) => {
      const { dragEnterTargetIds: i } = this;
      if (this.dragEnterTargetIds = [], !this.monitor.isDragging())
        return;
      this.altKeyPressed = o.altKey, i.length > 0 && this.actions.hover(i, {
        clientOffset: to(o)
      }), i.some(
        (s) => this.monitor.canDropOnTarget(s)
      ) && (o.preventDefault(), o.dataTransfer && (o.dataTransfer.dropEffect = this.getCurrentDropEffect()));
    }, this.handleTopDragOverCapture = (o) => {
      if (this.dragOverTargetIds = [], this.isDraggingNativeItem()) {
        var i;
        (i = this.currentNativeSource) === null || i === void 0 || i.loadDataTransfer(o.dataTransfer);
      }
    }, this.handleTopDragOver = (o) => {
      const { dragOverTargetIds: i } = this;
      if (this.dragOverTargetIds = [], !this.monitor.isDragging()) {
        o.preventDefault(), o.dataTransfer && (o.dataTransfer.dropEffect = "none");
        return;
      }
      this.altKeyPressed = o.altKey, this.lastClientOffset = to(o), this.scheduleHover(i), (i || []).some(
        (s) => this.monitor.canDropOnTarget(s)
      ) ? (o.preventDefault(), o.dataTransfer && (o.dataTransfer.dropEffect = this.getCurrentDropEffect())) : this.isDraggingNativeItem() ? o.preventDefault() : (o.preventDefault(), o.dataTransfer && (o.dataTransfer.dropEffect = "none"));
    }, this.handleTopDragLeaveCapture = (o) => {
      this.isDraggingNativeItem() && o.preventDefault(), this.enterLeaveCounter.leave(o.target) && (this.isDraggingNativeItem() && setTimeout(
        () => this.endDragNativeItem(),
        0
      ), this.cancelHover());
    }, this.handleTopDropCapture = (o) => {
      if (this.dropTargetIds = [], this.isDraggingNativeItem()) {
        var i;
        o.preventDefault(), (i = this.currentNativeSource) === null || i === void 0 || i.loadDataTransfer(o.dataTransfer);
      } else
        Ui(o.dataTransfer) && o.preventDefault();
      this.enterLeaveCounter.reset();
    }, this.handleTopDrop = (o) => {
      const { dropTargetIds: i } = this;
      this.dropTargetIds = [], this.actions.hover(i, {
        clientOffset: to(o)
      }), this.actions.drop({
        dropEffect: this.getCurrentDropEffect()
      }), this.isDraggingNativeItem() ? this.endDragNativeItem() : this.monitor.isDragging() && this.actions.endDrag(), this.cancelHover();
    }, this.handleSelectStart = (o) => {
      const i = o.target;
      typeof i.dragDrop == "function" && (i.tagName === "INPUT" || i.tagName === "SELECT" || i.tagName === "TEXTAREA" || i.isContentEditable || (o.preventDefault(), i.dragDrop()));
    }, this.options = new Kh(n, r), this.actions = t.getActions(), this.monitor = t.getMonitor(), this.registry = t.getRegistry(), this.enterLeaveCounter = new Vh(this.isNodeInDocument);
  }
}
const Qh = function(t, n, r) {
  return new Jh(t, n, r);
};
function Zh(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function eg(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var tg = /* @__PURE__ */ function() {
  function e(n) {
    var r = this;
    this._insertTag = function(o) {
      var i;
      r.tags.length === 0 ? r.insertionPoint ? i = r.insertionPoint.nextSibling : r.prepend ? i = r.container.firstChild : i = r.before : i = r.tags[r.tags.length - 1].nextSibling, r.container.insertBefore(o, i), r.tags.push(o);
    }, this.isSpeedy = n.speedy === void 0 ? process.env.NODE_ENV === "production" : n.speedy, this.tags = [], this.ctr = 0, this.nonce = n.nonce, this.key = n.key, this.container = n.container, this.prepend = n.prepend, this.insertionPoint = n.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(r) {
    r.forEach(this._insertTag);
  }, t.insert = function(r) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(eg(this));
    var o = this.tags[this.tags.length - 1];
    if (process.env.NODE_ENV !== "production") {
      var i = r.charCodeAt(0) === 64 && r.charCodeAt(1) === 105;
      i && this._alreadyInsertedOrderInsensitiveRule && console.error(`You're attempting to insert the following rule:
` + r + "\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules."), this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !i;
    }
    if (this.isSpeedy) {
      var a = Zh(o);
      try {
        a.insertRule(r, a.cssRules.length);
      } catch (s) {
        process.env.NODE_ENV !== "production" && !/:(-moz-placeholder|-moz-focus-inner|-moz-focusring|-ms-input-placeholder|-moz-read-write|-moz-read-only|-ms-clear|-ms-expand|-ms-reveal){/.test(r) && console.error('There was a problem inserting the following rule: "' + r + '"', s);
      }
    } else
      o.appendChild(document.createTextNode(r));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(r) {
      return r.parentNode && r.parentNode.removeChild(r);
    }), this.tags = [], this.ctr = 0, process.env.NODE_ENV !== "production" && (this._alreadyInsertedOrderInsensitiveRule = !1);
  }, e;
}(), et = "-ms-", ho = "-moz-", Se = "-webkit-", Ka = "comm", Xa = "rule", Ja = "decl", ng = "@import", ql = "@keyframes", rg = Math.abs, Mo = String.fromCharCode, og = Object.assign;
function ig(e, t) {
  return Je(e, 0) ^ 45 ? (((t << 2 ^ Je(e, 0)) << 2 ^ Je(e, 1)) << 2 ^ Je(e, 2)) << 2 ^ Je(e, 3) : 0;
}
function Yl(e) {
  return e.trim();
}
function ag(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function Ie(e, t, n) {
  return e.replace(t, n);
}
function ma(e, t) {
  return e.indexOf(t);
}
function Je(e, t) {
  return e.charCodeAt(t) | 0;
}
function Fr(e, t, n) {
  return e.slice(t, n);
}
function Dt(e) {
  return e.length;
}
function Qa(e) {
  return e.length;
}
function no(e, t) {
  return t.push(e), e;
}
function sg(e, t) {
  return e.map(t).join("");
}
var Lo = 1, Gn = 1, Gl = 0, st = 0, We = 0, Qn = "";
function Fo(e, t, n, r, o, i, a) {
  return { value: e, root: t, parent: n, type: r, props: o, children: i, line: Lo, column: Gn, length: a, return: "" };
}
function Tr(e, t) {
  return og(Fo("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function cg() {
  return We;
}
function lg() {
  return We = st > 0 ? Je(Qn, --st) : 0, Gn--, We === 10 && (Gn = 1, Lo--), We;
}
function ft() {
  return We = st < Gl ? Je(Qn, st++) : 0, Gn++, We === 10 && (Gn = 1, Lo++), We;
}
function Pt() {
  return Je(Qn, st);
}
function so() {
  return st;
}
function Yr(e, t) {
  return Fr(Qn, e, t);
}
function Br(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function Kl(e) {
  return Lo = Gn = 1, Gl = Dt(Qn = e), st = 0, [];
}
function Xl(e) {
  return Qn = "", e;
}
function co(e) {
  return Yl(Yr(st - 1, ya(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function ug(e) {
  for (; (We = Pt()) && We < 33; )
    ft();
  return Br(e) > 2 || Br(We) > 3 ? "" : " ";
}
function fg(e, t) {
  for (; --t && ft() && !(We < 48 || We > 102 || We > 57 && We < 65 || We > 70 && We < 97); )
    ;
  return Yr(e, so() + (t < 6 && Pt() == 32 && ft() == 32));
}
function ya(e) {
  for (; ft(); )
    switch (We) {
      case e:
        return st;
      case 34:
      case 39:
        e !== 34 && e !== 39 && ya(We);
        break;
      case 40:
        e === 41 && ya(e);
        break;
      case 92:
        ft();
        break;
    }
  return st;
}
function dg(e, t) {
  for (; ft() && e + We !== 47 + 10; )
    if (e + We === 42 + 42 && Pt() === 47)
      break;
  return "/*" + Yr(t, st - 1) + "*" + Mo(e === 47 ? e : ft());
}
function pg(e) {
  for (; !Br(Pt()); )
    ft();
  return Yr(e, st);
}
function hg(e) {
  return Xl(lo("", null, null, null, [""], e = Kl(e), 0, [0], e));
}
function lo(e, t, n, r, o, i, a, s, l) {
  for (var u = 0, d = 0, p = a, h = 0, b = 0, v = 0, g = 1, w = 1, S = 1, y = 0, T = "", O = o, C = i, _ = r, F = T; w; )
    switch (v = y, y = ft()) {
      case 40:
        if (v != 108 && Je(F, p - 1) == 58) {
          ma(F += Ie(co(y), "&", "&\f"), "&\f") != -1 && (S = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        F += co(y);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        F += ug(v);
        break;
      case 92:
        F += fg(so() - 1, 7);
        continue;
      case 47:
        switch (Pt()) {
          case 42:
          case 47:
            no(gg(dg(ft(), so()), t, n), l);
            break;
          default:
            F += "/";
        }
        break;
      case 123 * g:
        s[u++] = Dt(F) * S;
      case 125 * g:
      case 59:
      case 0:
        switch (y) {
          case 0:
          case 125:
            w = 0;
          case 59 + d:
            b > 0 && Dt(F) - p && no(b > 32 ? tc(F + ";", r, n, p - 1) : tc(Ie(F, " ", "") + ";", r, n, p - 2), l);
            break;
          case 59:
            F += ";";
          default:
            if (no(_ = ec(F, t, n, u, d, o, s, T, O = [], C = [], p), i), y === 123)
              if (d === 0)
                lo(F, t, _, _, O, i, p, s, C);
              else
                switch (h === 99 && Je(F, 3) === 110 ? 100 : h) {
                  case 100:
                  case 109:
                  case 115:
                    lo(e, _, _, r && no(ec(e, _, _, 0, 0, o, s, T, o, O = [], p), C), o, C, p, s, r ? O : C);
                    break;
                  default:
                    lo(F, _, _, _, [""], C, 0, s, C);
                }
        }
        u = d = b = 0, g = S = 1, T = F = "", p = a;
        break;
      case 58:
        p = 1 + Dt(F), b = v;
      default:
        if (g < 1) {
          if (y == 123)
            --g;
          else if (y == 125 && g++ == 0 && lg() == 125)
            continue;
        }
        switch (F += Mo(y), y * g) {
          case 38:
            S = d > 0 ? 1 : (F += "\f", -1);
            break;
          case 44:
            s[u++] = (Dt(F) - 1) * S, S = 1;
            break;
          case 64:
            Pt() === 45 && (F += co(ft())), h = Pt(), d = p = Dt(T = F += pg(so())), y++;
            break;
          case 45:
            v === 45 && Dt(F) == 2 && (g = 0);
        }
    }
  return i;
}
function ec(e, t, n, r, o, i, a, s, l, u, d) {
  for (var p = o - 1, h = o === 0 ? i : [""], b = Qa(h), v = 0, g = 0, w = 0; v < r; ++v)
    for (var S = 0, y = Fr(e, p + 1, p = rg(g = a[v])), T = e; S < b; ++S)
      (T = Yl(g > 0 ? h[S] + " " + y : Ie(y, /&\f/g, h[S]))) && (l[w++] = T);
  return Fo(e, t, n, o === 0 ? Xa : s, l, u, d);
}
function gg(e, t, n) {
  return Fo(e, t, n, Ka, Mo(cg()), Fr(e, 2, -2), 0);
}
function tc(e, t, n, r) {
  return Fo(e, t, n, Ja, Fr(e, 0, r), Fr(e, r + 1, -1), r);
}
function Yn(e, t) {
  for (var n = "", r = Qa(e), o = 0; o < r; o++)
    n += t(e[o], o, e, t) || "";
  return n;
}
function mg(e, t, n, r) {
  switch (e.type) {
    case ng:
    case Ja:
      return e.return = e.return || e.value;
    case Ka:
      return "";
    case ql:
      return e.return = e.value + "{" + Yn(e.children, r) + "}";
    case Xa:
      e.value = e.props.join(",");
  }
  return Dt(n = Yn(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
function yg(e) {
  var t = Qa(e);
  return function(n, r, o, i) {
    for (var a = "", s = 0; s < t; s++)
      a += e[s](n, r, o, i) || "";
    return a;
  };
}
function bg(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
var nc = function(t) {
  var n = /* @__PURE__ */ new WeakMap();
  return function(r) {
    if (n.has(r))
      return n.get(r);
    var o = t(r);
    return n.set(r, o), o;
  };
};
function Jl(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(n) {
    return t[n] === void 0 && (t[n] = e(n)), t[n];
  };
}
var vg = function(t, n, r) {
  for (var o = 0, i = 0; o = i, i = Pt(), o === 38 && i === 12 && (n[r] = 1), !Br(i); )
    ft();
  return Yr(t, st);
}, xg = function(t, n) {
  var r = -1, o = 44;
  do
    switch (Br(o)) {
      case 0:
        o === 38 && Pt() === 12 && (n[r] = 1), t[r] += vg(st - 1, n, r);
        break;
      case 2:
        t[r] += co(o);
        break;
      case 4:
        if (o === 44) {
          t[++r] = Pt() === 58 ? "&\f" : "", n[r] = t[r].length;
          break;
        }
      default:
        t[r] += Mo(o);
    }
  while (o = ft());
  return t;
}, Og = function(t, n) {
  return Xl(xg(Kl(t), n));
}, rc = /* @__PURE__ */ new WeakMap(), Eg = function(t) {
  if (!(t.type !== "rule" || !t.parent || t.length < 1)) {
    for (var n = t.value, r = t.parent, o = t.column === r.column && t.line === r.line; r.type !== "rule"; )
      if (r = r.parent, !r)
        return;
    if (!(t.props.length === 1 && n.charCodeAt(0) !== 58 && !rc.get(r)) && !o) {
      rc.set(t, !0);
      for (var i = [], a = Og(n, i), s = r.props, l = 0, u = 0; l < a.length; l++)
        for (var d = 0; d < s.length; d++, u++)
          t.props[u] = i[l] ? a[l].replace(/&\f/g, s[d]) : s[d] + " " + a[l];
    }
  }
}, wg = function(t) {
  if (t.type === "decl") {
    var n = t.value;
    n.charCodeAt(0) === 108 && n.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
}, Sg = "emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason", Tg = function(t) {
  return t.type === "comm" && t.children.indexOf(Sg) > -1;
}, Cg = function(t) {
  return function(n, r, o) {
    if (!(n.type !== "rule" || t.compat)) {
      var i = n.value.match(/(:first|:nth|:nth-last)-child/g);
      if (i) {
        for (var a = n.parent === o[0], s = a ? o[0].children : o, l = s.length - 1; l >= 0; l--) {
          var u = s[l];
          if (u.line < n.line)
            break;
          if (u.column < n.column) {
            if (Tg(u))
              return;
            break;
          }
        }
        i.forEach(function(d) {
          console.error('The pseudo class "' + d + '" is potentially unsafe when doing server-side rendering. Try changing it to "' + d.split("-child")[0] + '-of-type".');
        });
      }
    }
  };
}, Ql = function(t) {
  return t.type.charCodeAt(1) === 105 && t.type.charCodeAt(0) === 64;
}, Ig = function(t, n) {
  for (var r = t - 1; r >= 0; r--)
    if (!Ql(n[r]))
      return !0;
  return !1;
}, oc = function(t) {
  t.type = "", t.value = "", t.return = "", t.children = "", t.props = "";
}, kg = function(t, n, r) {
  !Ql(t) || (t.parent ? (console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles."), oc(t)) : Ig(n, r) && (console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules."), oc(t)));
};
function Zl(e, t) {
  switch (ig(e, t)) {
    case 5103:
      return Se + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return Se + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return Se + e + ho + e + et + e + e;
    case 6828:
    case 4268:
      return Se + e + et + e + e;
    case 6165:
      return Se + e + et + "flex-" + e + e;
    case 5187:
      return Se + e + Ie(e, /(\w+).+(:[^]+)/, Se + "box-$1$2" + et + "flex-$1$2") + e;
    case 5443:
      return Se + e + et + "flex-item-" + Ie(e, /flex-|-self/, "") + e;
    case 4675:
      return Se + e + et + "flex-line-pack" + Ie(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return Se + e + et + Ie(e, "shrink", "negative") + e;
    case 5292:
      return Se + e + et + Ie(e, "basis", "preferred-size") + e;
    case 6060:
      return Se + "box-" + Ie(e, "-grow", "") + Se + e + et + Ie(e, "grow", "positive") + e;
    case 4554:
      return Se + Ie(e, /([^-])(transform)/g, "$1" + Se + "$2") + e;
    case 6187:
      return Ie(Ie(Ie(e, /(zoom-|grab)/, Se + "$1"), /(image-set)/, Se + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return Ie(e, /(image-set\([^]*)/, Se + "$1$`$1");
    case 4968:
      return Ie(Ie(e, /(.+:)(flex-)?(.*)/, Se + "box-pack:$3" + et + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + Se + e + e;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return Ie(e, /(.+)-inline(.+)/, Se + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (Dt(e) - 1 - t > 6)
        switch (Je(e, t + 1)) {
          case 109:
            if (Je(e, t + 4) !== 45)
              break;
          case 102:
            return Ie(e, /(.+:)(.+)-([^]+)/, "$1" + Se + "$2-$3$1" + ho + (Je(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
          case 115:
            return ~ma(e, "stretch") ? Zl(Ie(e, "stretch", "fill-available"), t) + e : e;
        }
      break;
    case 4949:
      if (Je(e, t + 1) !== 115)
        break;
    case 6444:
      switch (Je(e, Dt(e) - 3 - (~ma(e, "!important") && 10))) {
        case 107:
          return Ie(e, ":", ":" + Se) + e;
        case 101:
          return Ie(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + Se + (Je(e, 14) === 45 ? "inline-" : "") + "box$3$1" + Se + "$2$3$1" + et + "$2box$3") + e;
      }
      break;
    case 5936:
      switch (Je(e, t + 11)) {
        case 114:
          return Se + e + et + Ie(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return Se + e + et + Ie(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return Se + e + et + Ie(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return Se + e + et + e + e;
  }
  return e;
}
var _g = function(t, n, r, o) {
  if (t.length > -1 && !t.return)
    switch (t.type) {
      case Ja:
        t.return = Zl(t.value, t.length);
        break;
      case ql:
        return Yn([Tr(t, {
          value: Ie(t.value, "@", "@" + Se)
        })], o);
      case Xa:
        if (t.length)
          return sg(t.props, function(i) {
            switch (ag(i, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return Yn([Tr(t, {
                  props: [Ie(i, /:(read-\w+)/, ":" + ho + "$1")]
                })], o);
              case "::placeholder":
                return Yn([Tr(t, {
                  props: [Ie(i, /:(plac\w+)/, ":" + Se + "input-$1")]
                }), Tr(t, {
                  props: [Ie(i, /:(plac\w+)/, ":" + ho + "$1")]
                }), Tr(t, {
                  props: [Ie(i, /:(plac\w+)/, et + "input-$1")]
                })], o);
            }
            return "";
          });
    }
}, Dg = [_g], Rg = function(t) {
  var n = t.key;
  if (process.env.NODE_ENV !== "production" && !n)
    throw new Error(`You have to configure \`key\` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.
If multiple caches share the same key they might "fight" for each other's style elements.`);
  if (n === "css") {
    var r = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(r, function(g) {
      var w = g.getAttribute("data-emotion");
      w.indexOf(" ") !== -1 && (document.head.appendChild(g), g.setAttribute("data-s", ""));
    });
  }
  var o = t.stylisPlugins || Dg;
  if (process.env.NODE_ENV !== "production" && /[^a-z-]/.test(n))
    throw new Error('Emotion key must only contain lower case alphabetical characters and - but "' + n + '" was passed');
  var i = {}, a, s = [];
  a = t.container || document.head, Array.prototype.forEach.call(
    document.querySelectorAll('style[data-emotion^="' + n + ' "]'),
    function(g) {
      for (var w = g.getAttribute("data-emotion").split(" "), S = 1; S < w.length; S++)
        i[w[S]] = !0;
      s.push(g);
    }
  );
  var l, u = [Eg, wg];
  process.env.NODE_ENV !== "production" && u.push(Cg({
    get compat() {
      return v.compat;
    }
  }), kg);
  {
    var d, p = [mg, process.env.NODE_ENV !== "production" ? function(g) {
      g.root || (g.return ? d.insert(g.return) : g.value && g.type !== Ka && d.insert(g.value + "{}"));
    } : bg(function(g) {
      d.insert(g);
    })], h = yg(u.concat(o, p)), b = function(w) {
      return Yn(hg(w), h);
    };
    l = function(w, S, y, T) {
      d = y, process.env.NODE_ENV !== "production" && S.map !== void 0 && (d = {
        insert: function(C) {
          y.insert(C + S.map);
        }
      }), b(w ? w + "{" + S.styles + "}" : S.styles), T && (v.inserted[S.name] = !0);
    };
  }
  var v = {
    key: n,
    sheet: new tg({
      key: n,
      container: a,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: i,
    registered: {},
    insert: l
  };
  return v.sheet.hydrate(s), v;
};
function $r() {
  return $r = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, $r.apply(this, arguments);
}
var Bo = { exports: {} }, Te = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ic;
function Ng() {
  if (ic)
    return Te;
  ic = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, u = e ? Symbol.for("react.concurrent_mode") : 60111, d = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, h = e ? Symbol.for("react.suspense_list") : 60120, b = e ? Symbol.for("react.memo") : 60115, v = e ? Symbol.for("react.lazy") : 60116, g = e ? Symbol.for("react.block") : 60121, w = e ? Symbol.for("react.fundamental") : 60117, S = e ? Symbol.for("react.responder") : 60118, y = e ? Symbol.for("react.scope") : 60119;
  function T(C) {
    if (typeof C == "object" && C !== null) {
      var _ = C.$$typeof;
      switch (_) {
        case t:
          switch (C = C.type, C) {
            case l:
            case u:
            case r:
            case i:
            case o:
            case p:
              return C;
            default:
              switch (C = C && C.$$typeof, C) {
                case s:
                case d:
                case v:
                case b:
                case a:
                  return C;
                default:
                  return _;
              }
          }
        case n:
          return _;
      }
    }
  }
  function O(C) {
    return T(C) === u;
  }
  return Te.AsyncMode = l, Te.ConcurrentMode = u, Te.ContextConsumer = s, Te.ContextProvider = a, Te.Element = t, Te.ForwardRef = d, Te.Fragment = r, Te.Lazy = v, Te.Memo = b, Te.Portal = n, Te.Profiler = i, Te.StrictMode = o, Te.Suspense = p, Te.isAsyncMode = function(C) {
    return O(C) || T(C) === l;
  }, Te.isConcurrentMode = O, Te.isContextConsumer = function(C) {
    return T(C) === s;
  }, Te.isContextProvider = function(C) {
    return T(C) === a;
  }, Te.isElement = function(C) {
    return typeof C == "object" && C !== null && C.$$typeof === t;
  }, Te.isForwardRef = function(C) {
    return T(C) === d;
  }, Te.isFragment = function(C) {
    return T(C) === r;
  }, Te.isLazy = function(C) {
    return T(C) === v;
  }, Te.isMemo = function(C) {
    return T(C) === b;
  }, Te.isPortal = function(C) {
    return T(C) === n;
  }, Te.isProfiler = function(C) {
    return T(C) === i;
  }, Te.isStrictMode = function(C) {
    return T(C) === o;
  }, Te.isSuspense = function(C) {
    return T(C) === p;
  }, Te.isValidElementType = function(C) {
    return typeof C == "string" || typeof C == "function" || C === r || C === u || C === i || C === o || C === p || C === h || typeof C == "object" && C !== null && (C.$$typeof === v || C.$$typeof === b || C.$$typeof === a || C.$$typeof === s || C.$$typeof === d || C.$$typeof === w || C.$$typeof === S || C.$$typeof === y || C.$$typeof === g);
  }, Te.typeOf = T, Te;
}
var Ce = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ac;
function Pg() {
  return ac || (ac = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, a = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, u = e ? Symbol.for("react.concurrent_mode") : 60111, d = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, h = e ? Symbol.for("react.suspense_list") : 60120, b = e ? Symbol.for("react.memo") : 60115, v = e ? Symbol.for("react.lazy") : 60116, g = e ? Symbol.for("react.block") : 60121, w = e ? Symbol.for("react.fundamental") : 60117, S = e ? Symbol.for("react.responder") : 60118, y = e ? Symbol.for("react.scope") : 60119;
    function T(B) {
      return typeof B == "string" || typeof B == "function" || B === r || B === u || B === i || B === o || B === p || B === h || typeof B == "object" && B !== null && (B.$$typeof === v || B.$$typeof === b || B.$$typeof === a || B.$$typeof === s || B.$$typeof === d || B.$$typeof === w || B.$$typeof === S || B.$$typeof === y || B.$$typeof === g);
    }
    function O(B) {
      if (typeof B == "object" && B !== null) {
        var Qe = B.$$typeof;
        switch (Qe) {
          case t:
            var kt = B.type;
            switch (kt) {
              case l:
              case u:
              case r:
              case i:
              case o:
              case p:
                return kt;
              default:
                var yt = kt && kt.$$typeof;
                switch (yt) {
                  case s:
                  case d:
                  case v:
                  case b:
                  case a:
                    return yt;
                  default:
                    return Qe;
                }
            }
          case n:
            return Qe;
        }
      }
    }
    var C = l, _ = u, F = s, ee = a, J = t, pe = d, H = r, L = v, j = b, ae = n, ge = i, fe = o, Ee = p, Le = !1;
    function ze(B) {
      return Le || (Le = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), P(B) || O(B) === l;
    }
    function P(B) {
      return O(B) === u;
    }
    function D(B) {
      return O(B) === s;
    }
    function V(B) {
      return O(B) === a;
    }
    function k(B) {
      return typeof B == "object" && B !== null && B.$$typeof === t;
    }
    function G(B) {
      return O(B) === d;
    }
    function le(B) {
      return O(B) === r;
    }
    function K(B) {
      return O(B) === v;
    }
    function ie(B) {
      return O(B) === b;
    }
    function ne(B) {
      return O(B) === n;
    }
    function me(B) {
      return O(B) === i;
    }
    function se(B) {
      return O(B) === o;
    }
    function Fe(B) {
      return O(B) === p;
    }
    Ce.AsyncMode = C, Ce.ConcurrentMode = _, Ce.ContextConsumer = F, Ce.ContextProvider = ee, Ce.Element = J, Ce.ForwardRef = pe, Ce.Fragment = H, Ce.Lazy = L, Ce.Memo = j, Ce.Portal = ae, Ce.Profiler = ge, Ce.StrictMode = fe, Ce.Suspense = Ee, Ce.isAsyncMode = ze, Ce.isConcurrentMode = P, Ce.isContextConsumer = D, Ce.isContextProvider = V, Ce.isElement = k, Ce.isForwardRef = G, Ce.isFragment = le, Ce.isLazy = K, Ce.isMemo = ie, Ce.isPortal = ne, Ce.isProfiler = me, Ce.isStrictMode = se, Ce.isSuspense = Fe, Ce.isValidElementType = T, Ce.typeOf = O;
  }()), Ce;
}
(function(e) {
  process.env.NODE_ENV === "production" ? e.exports = Ng() : e.exports = Pg();
})(Bo);
var eu = Bo.exports, Ag = {
  $$typeof: !0,
  render: !0,
  defaultProps: !0,
  displayName: !0,
  propTypes: !0
}, jg = {
  $$typeof: !0,
  compare: !0,
  defaultProps: !0,
  displayName: !0,
  propTypes: !0,
  type: !0
}, tu = {};
tu[eu.ForwardRef] = Ag;
tu[eu.Memo] = jg;
var Mg = !0;
function Za(e, t, n) {
  var r = "";
  return n.split(" ").forEach(function(o) {
    e[o] !== void 0 ? t.push(e[o] + ";") : r += o + " ";
  }), r;
}
var $o = function(t, n, r) {
  var o = t.key + "-" + n.name;
  (r === !1 || Mg === !1) && t.registered[o] === void 0 && (t.registered[o] = n.styles);
}, Vo = function(t, n, r) {
  $o(t, n, r);
  var o = t.key + "-" + n.name;
  if (t.inserted[n.name] === void 0) {
    var i = n;
    do
      t.insert(n === i ? "." + o : "", i, t.sheet, !0), i = i.next;
    while (i !== void 0);
  }
};
function Lg(e) {
  for (var t = 0, n, r = 0, o = e.length; o >= 4; ++r, o -= 4)
    n = e.charCodeAt(r) & 255 | (e.charCodeAt(++r) & 255) << 8 | (e.charCodeAt(++r) & 255) << 16 | (e.charCodeAt(++r) & 255) << 24, n = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16), n ^= n >>> 24, t = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16) ^ (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (o) {
    case 3:
      t ^= (e.charCodeAt(r + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(r + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(r) & 255, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
var Fg = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}, sc = `You have illegal escape sequence in your template literal, most likely inside content's property value.
Because you write your CSS inside a JavaScript string you actually have to do double escaping, so for example "content: '\\00d7';" should become "content: '\\\\00d7';".
You can read more about this here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences`, Bg = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).", $g = /[A-Z]|^ms/g, nu = /_EMO_([^_]+?)_([^]*?)_EMO_/g, es = function(t) {
  return t.charCodeAt(1) === 45;
}, cc = function(t) {
  return t != null && typeof t != "boolean";
}, zi = /* @__PURE__ */ Jl(function(e) {
  return es(e) ? e : e.replace($g, "-$&").toLowerCase();
}), go = function(t, n) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof n == "string")
        return n.replace(nu, function(r, o, i) {
          return St = {
            name: o,
            styles: i,
            next: St
          }, o;
        });
  }
  return Fg[t] !== 1 && !es(t) && typeof n == "number" && n !== 0 ? n + "px" : n;
};
if (process.env.NODE_ENV !== "production") {
  var Vg = /(var|attr|counters?|url|element|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/, Ug = ["normal", "none", "initial", "inherit", "unset"], zg = go, Hg = /^-ms-/, Wg = /-(.)/g, lc = {};
  go = function(t, n) {
    if (t === "content" && (typeof n != "string" || Ug.indexOf(n) === -1 && !Vg.test(n) && (n.charAt(0) !== n.charAt(n.length - 1) || n.charAt(0) !== '"' && n.charAt(0) !== "'")))
      throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + n + "\"'`");
    var r = zg(t, n);
    return r !== "" && !es(t) && t.indexOf("-") !== -1 && lc[t] === void 0 && (lc[t] = !0, console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + t.replace(Hg, "ms-").replace(Wg, function(o, i) {
      return i.toUpperCase();
    }) + "?")), r;
  };
}
var ru = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
function Vr(e, t, n) {
  if (n == null)
    return "";
  if (n.__emotion_styles !== void 0) {
    if (process.env.NODE_ENV !== "production" && n.toString() === "NO_COMPONENT_SELECTOR")
      throw new Error(ru);
    return n;
  }
  switch (typeof n) {
    case "boolean":
      return "";
    case "object": {
      if (n.anim === 1)
        return St = {
          name: n.name,
          styles: n.styles,
          next: St
        }, n.name;
      if (n.styles !== void 0) {
        var r = n.next;
        if (r !== void 0)
          for (; r !== void 0; )
            St = {
              name: r.name,
              styles: r.styles,
              next: St
            }, r = r.next;
        var o = n.styles + ";";
        return process.env.NODE_ENV !== "production" && n.map !== void 0 && (o += n.map), o;
      }
      return qg(e, t, n);
    }
    case "function": {
      if (e !== void 0) {
        var i = St, a = n(e);
        return St = i, Vr(e, t, a);
      } else
        process.env.NODE_ENV !== "production" && console.error("Functions that are interpolated in css calls will be stringified.\nIf you want to have a css call based on props, create a function that returns a css call like this\nlet dynamicStyle = (props) => css`color: ${props.color}`\nIt can be called directly with props or interpolated in a styled call like this\nlet SomeComponent = styled('div')`${dynamicStyle}`");
      break;
    }
    case "string":
      if (process.env.NODE_ENV !== "production") {
        var s = [], l = n.replace(nu, function(d, p, h) {
          var b = "animation" + s.length;
          return s.push("const " + b + " = keyframes`" + h.replace(/^@keyframes animation-\w+/, "") + "`"), "${" + b + "}";
        });
        s.length && console.error("`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\nInstead of doing this:\n\n" + [].concat(s, ["`" + l + "`"]).join(`
`) + `

You should wrap it with \`css\` like this:

` + ("css`" + l + "`"));
      }
      break;
  }
  if (t == null)
    return n;
  var u = t[n];
  return u !== void 0 ? u : n;
}
function qg(e, t, n) {
  var r = "";
  if (Array.isArray(n))
    for (var o = 0; o < n.length; o++)
      r += Vr(e, t, n[o]) + ";";
  else
    for (var i in n) {
      var a = n[i];
      if (typeof a != "object")
        t != null && t[a] !== void 0 ? r += i + "{" + t[a] + "}" : cc(a) && (r += zi(i) + ":" + go(i, a) + ";");
      else {
        if (i === "NO_COMPONENT_SELECTOR" && process.env.NODE_ENV !== "production")
          throw new Error(ru);
        if (Array.isArray(a) && typeof a[0] == "string" && (t == null || t[a[0]] === void 0))
          for (var s = 0; s < a.length; s++)
            cc(a[s]) && (r += zi(i) + ":" + go(i, a[s]) + ";");
        else {
          var l = Vr(e, t, a);
          switch (i) {
            case "animation":
            case "animationName": {
              r += zi(i) + ":" + l + ";";
              break;
            }
            default:
              process.env.NODE_ENV !== "production" && i === "undefined" && console.error(Bg), r += i + "{" + l + "}";
          }
        }
      }
    }
  return r;
}
var uc = /label:\s*([^\s;\n{]+)\s*(;|$)/g, ou;
process.env.NODE_ENV !== "production" && (ou = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g);
var St, Kn = function(t, n, r) {
  if (t.length === 1 && typeof t[0] == "object" && t[0] !== null && t[0].styles !== void 0)
    return t[0];
  var o = !0, i = "";
  St = void 0;
  var a = t[0];
  a == null || a.raw === void 0 ? (o = !1, i += Vr(r, n, a)) : (process.env.NODE_ENV !== "production" && a[0] === void 0 && console.error(sc), i += a[0]);
  for (var s = 1; s < t.length; s++)
    i += Vr(r, n, t[s]), o && (process.env.NODE_ENV !== "production" && a[s] === void 0 && console.error(sc), i += a[s]);
  var l;
  process.env.NODE_ENV !== "production" && (i = i.replace(ou, function(h) {
    return l = h, "";
  })), uc.lastIndex = 0;
  for (var u = "", d; (d = uc.exec(i)) !== null; )
    u += "-" + d[1];
  var p = Lg(i) + u;
  return process.env.NODE_ENV !== "production" ? {
    name: p,
    styles: i,
    map: l,
    next: St,
    toString: function() {
      return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
    }
  } : {
    name: p,
    styles: i,
    next: St
  };
}, Yg = function(t) {
  return t();
}, iu = z["useInsertionEffect"] ? z["useInsertionEffect"] : !1, ts = iu || Yg, fc = iu || Rn, Uo = {}.hasOwnProperty, ns = /* @__PURE__ */ Ct(
  typeof HTMLElement < "u" ? /* @__PURE__ */ Rg({
    key: "css"
  }) : null
);
process.env.NODE_ENV !== "production" && (ns.displayName = "EmotionCacheContext");
ns.Provider;
var zo = function(t) {
  return /* @__PURE__ */ ke(function(n, r) {
    var o = tt(ns);
    return t(n, o, r);
  });
}, kn = /* @__PURE__ */ Ct({});
process.env.NODE_ENV !== "production" && (kn.displayName = "EmotionThemeContext");
var Gg = function(t, n) {
  if (typeof n == "function") {
    var r = n(t);
    if (process.env.NODE_ENV !== "production" && (r == null || typeof r != "object" || Array.isArray(r)))
      throw new Error("[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!");
    return r;
  }
  if (process.env.NODE_ENV !== "production" && (n == null || typeof n != "object" || Array.isArray(n)))
    throw new Error("[ThemeProvider] Please make your theme prop a plain object");
  return $r({}, t, n);
}, Kg = /* @__PURE__ */ nc(function(e) {
  return nc(function(t) {
    return Gg(e, t);
  });
}), Xg = function(t) {
  var n = tt(kn);
  return t.theme !== n && (n = Kg(n)(t.theme)), /* @__PURE__ */ Nt(kn.Provider, {
    value: n
  }, t.children);
}, dc = function(t) {
  var n = t.split(".");
  return n[n.length - 1];
}, Jg = function(t) {
  var n = /^\s+at\s+([A-Za-z0-9$.]+)\s/.exec(t);
  if (n || (n = /^([A-Za-z0-9$.]+)@/.exec(t), n))
    return dc(n[1]);
}, Qg = /* @__PURE__ */ new Set(["renderWithHooks", "processChild", "finishClassComponent", "renderToString"]), Zg = function(t) {
  return t.replace(/\$/g, "-");
}, em = function(t) {
  if (!!t)
    for (var n = t.split(`
`), r = 0; r < n.length; r++) {
      var o = Jg(n[r]);
      if (!!o) {
        if (Qg.has(o))
          break;
        if (/^[A-Z]/.test(o))
          return Zg(o);
      }
    }
}, ba = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", va = "__EMOTION_LABEL_PLEASE_DO_NOT_USE__", au = function(t, n) {
  if (process.env.NODE_ENV !== "production" && typeof n.css == "string" && n.css.indexOf(":") !== -1)
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/react' like this: css`" + n.css + "`");
  var r = {};
  for (var o in n)
    Uo.call(n, o) && (r[o] = n[o]);
  if (r[ba] = t, process.env.NODE_ENV !== "production" && !!n.css && (typeof n.css != "object" || typeof n.css.name != "string" || n.css.name.indexOf("-") === -1)) {
    var i = em(new Error().stack);
    i && (r[va] = i);
  }
  return r;
}, tm = function(t) {
  var n = t.cache, r = t.serialized, o = t.isStringTag;
  return $o(n, r, o), ts(function() {
    return Vo(n, r, o);
  }), null;
}, rs = /* @__PURE__ */ zo(function(e, t, n) {
  var r = e.css;
  typeof r == "string" && t.registered[r] !== void 0 && (r = t.registered[r]);
  var o = e[ba], i = [r], a = "";
  typeof e.className == "string" ? a = Za(t.registered, i, e.className) : e.className != null && (a = e.className + " ");
  var s = Kn(i, void 0, tt(kn));
  if (process.env.NODE_ENV !== "production" && s.name.indexOf("-") === -1) {
    var l = e[va];
    l && (s = Kn([s, "label:" + l + ";"]));
  }
  a += t.key + "-" + s.name;
  var u = {};
  for (var d in e)
    Uo.call(e, d) && d !== "css" && d !== ba && (process.env.NODE_ENV === "production" || d !== va) && (u[d] = e[d]);
  return u.ref = n, u.className = a, /* @__PURE__ */ Nt(La, null, /* @__PURE__ */ Nt(tm, {
    cache: t,
    serialized: s,
    isStringTag: typeof o == "string"
  }), /* @__PURE__ */ Nt(o, u));
});
process.env.NODE_ENV !== "production" && (rs.displayName = "EmotionCssPropInternal");
var mo = qr;
function M(e, t, n) {
  return Uo.call(t, "css") ? q(rs, au(e, t), n) : q(e, t, n);
}
function Be(e, t, n) {
  return Uo.call(t, "css") ? at(rs, au(e, t), n) : at(e, t, n);
}
var nm = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/, su = /* @__PURE__ */ Jl(
  function(e) {
    return nm.test(e) || e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) < 91;
  }
), rm = {
  name: "@emotion/react",
  version: "11.10.5",
  main: "dist/emotion-react.cjs.js",
  module: "dist/emotion-react.esm.js",
  browser: {
    "./dist/emotion-react.esm.js": "./dist/emotion-react.browser.esm.js"
  },
  exports: {
    ".": {
      module: {
        worker: "./dist/emotion-react.worker.esm.js",
        browser: "./dist/emotion-react.browser.esm.js",
        default: "./dist/emotion-react.esm.js"
      },
      default: "./dist/emotion-react.cjs.js"
    },
    "./jsx-runtime": {
      module: {
        worker: "./jsx-runtime/dist/emotion-react-jsx-runtime.worker.esm.js",
        browser: "./jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js",
        default: "./jsx-runtime/dist/emotion-react-jsx-runtime.esm.js"
      },
      default: "./jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js"
    },
    "./_isolated-hnrs": {
      module: {
        worker: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.worker.esm.js",
        browser: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.browser.esm.js",
        default: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.esm.js"
      },
      default: "./_isolated-hnrs/dist/emotion-react-_isolated-hnrs.cjs.js"
    },
    "./jsx-dev-runtime": {
      module: {
        worker: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.worker.esm.js",
        browser: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.browser.esm.js",
        default: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.esm.js"
      },
      default: "./jsx-dev-runtime/dist/emotion-react-jsx-dev-runtime.cjs.js"
    },
    "./package.json": "./package.json",
    "./types/css-prop": "./types/css-prop.d.ts",
    "./macro": "./macro.js"
  },
  types: "types/index.d.ts",
  files: [
    "src",
    "dist",
    "jsx-runtime",
    "jsx-dev-runtime",
    "_isolated-hnrs",
    "types/*.d.ts",
    "macro.js",
    "macro.d.ts",
    "macro.js.flow"
  ],
  sideEffects: !1,
  author: "Emotion Contributors",
  license: "MIT",
  scripts: {
    "test:typescript": "dtslint types"
  },
  dependencies: {
    "@babel/runtime": "^7.18.3",
    "@emotion/babel-plugin": "^11.10.5",
    "@emotion/cache": "^11.10.5",
    "@emotion/serialize": "^1.1.1",
    "@emotion/use-insertion-effect-with-fallbacks": "^1.0.0",
    "@emotion/utils": "^1.2.0",
    "@emotion/weak-memoize": "^0.3.0",
    "hoist-non-react-statics": "^3.3.1"
  },
  peerDependencies: {
    "@babel/core": "^7.0.0",
    react: ">=16.8.0"
  },
  peerDependenciesMeta: {
    "@babel/core": {
      optional: !0
    },
    "@types/react": {
      optional: !0
    }
  },
  devDependencies: {
    "@babel/core": "^7.18.5",
    "@definitelytyped/dtslint": "0.0.112",
    "@emotion/css": "11.10.5",
    "@emotion/css-prettifier": "1.1.1",
    "@emotion/server": "11.10.0",
    "@emotion/styled": "11.10.5",
    "html-tag-names": "^1.1.2",
    react: "16.14.0",
    "svg-tag-names": "^1.1.1",
    typescript: "^4.5.5"
  },
  repository: "https://github.com/emotion-js/emotion/tree/main/packages/react",
  publishConfig: {
    access: "public"
  },
  "umd:main": "dist/emotion-react.umd.min.js",
  preconstruct: {
    entrypoints: [
      "./index.js",
      "./jsx-runtime.js",
      "./jsx-dev-runtime.js",
      "./_isolated-hnrs.js"
    ],
    umdName: "emotionReact",
    exports: {
      envConditions: [
        "browser",
        "worker"
      ],
      extra: {
        "./types/css-prop": "./types/css-prop.d.ts",
        "./macro": "./macro.js"
      }
    }
  }
}, pc = !1, kr = /* @__PURE__ */ zo(function(e, t) {
  process.env.NODE_ENV !== "production" && !pc && (e.className || e.css) && (console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?"), pc = !0);
  var n = e.styles, r = Kn([n], void 0, tt(kn)), o = $e();
  return fc(function() {
    var i = t.key + "-global", a = new t.sheet.constructor({
      key: i,
      nonce: t.sheet.nonce,
      container: t.sheet.container,
      speedy: t.sheet.isSpeedy
    }), s = !1, l = document.querySelector('style[data-emotion="' + i + " " + r.name + '"]');
    return t.sheet.tags.length && (a.before = t.sheet.tags[0]), l !== null && (s = !0, l.setAttribute("data-emotion", i), a.hydrate([l])), o.current = [a, s], function() {
      a.flush();
    };
  }, [t]), fc(function() {
    var i = o.current, a = i[0], s = i[1];
    if (s) {
      i[1] = !1;
      return;
    }
    if (r.next !== void 0 && Vo(t, r.next, !0), a.tags.length) {
      var l = a.tags[a.tags.length - 1].nextElementSibling;
      a.before = l, a.flush();
    }
    t.insert("", r, a, !1);
  }, [t, r.name]), null;
});
process.env.NODE_ENV !== "production" && (kr.displayName = "EmotionGlobal");
function yo() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return Kn(t);
}
var os = function() {
  var t = yo.apply(void 0, arguments), n = "animation-" + t.name;
  return {
    name: n,
    styles: "@keyframes " + n + "{" + t.styles + "}",
    anim: 1,
    toString: function() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
}, om = function e(t) {
  for (var n = t.length, r = 0, o = ""; r < n; r++) {
    var i = t[r];
    if (i != null) {
      var a = void 0;
      switch (typeof i) {
        case "boolean":
          break;
        case "object": {
          if (Array.isArray(i))
            a = e(i);
          else {
            process.env.NODE_ENV !== "production" && i.styles !== void 0 && i.name !== void 0 && console.error("You have passed styles created with `css` from `@emotion/react` package to the `cx`.\n`cx` is meant to compose class names (strings) so you should convert those styles to a class name by passing them to the `css` received from <ClassNames/> component."), a = "";
            for (var s in i)
              i[s] && s && (a && (a += " "), a += s);
          }
          break;
        }
        default:
          a = i;
      }
      a && (o && (o += " "), o += a);
    }
  }
  return o;
};
function im(e, t, n) {
  var r = [], o = Za(e, r, n);
  return r.length < 2 ? n : o + t(r);
}
var am = function(t) {
  var n = t.cache, r = t.serializedArr;
  return ts(function() {
    for (var o = 0; o < r.length; o++)
      Vo(n, r[o], !1);
  }), null;
}, sm = /* @__PURE__ */ zo(function(e, t) {
  var n = !1, r = [], o = function() {
    if (n && process.env.NODE_ENV !== "production")
      throw new Error("css can only be used during render");
    for (var u = arguments.length, d = new Array(u), p = 0; p < u; p++)
      d[p] = arguments[p];
    var h = Kn(d, t.registered);
    return r.push(h), $o(t, h, !1), t.key + "-" + h.name;
  }, i = function() {
    if (n && process.env.NODE_ENV !== "production")
      throw new Error("cx can only be used during render");
    for (var u = arguments.length, d = new Array(u), p = 0; p < u; p++)
      d[p] = arguments[p];
    return im(t.registered, o, om(d));
  }, a = {
    css: o,
    cx: i,
    theme: tt(kn)
  }, s = e.children(a);
  return n = !0, /* @__PURE__ */ Nt(La, null, /* @__PURE__ */ Nt(am, {
    cache: t,
    serializedArr: r
  }), s);
});
process.env.NODE_ENV !== "production" && (sm.displayName = "EmotionClassNames");
if (process.env.NODE_ENV !== "production") {
  var hc = !0, cm = typeof jest < "u" || typeof vi < "u";
  if (hc && !cm) {
    var gc = typeof globalThis < "u" ? globalThis : hc ? window : global, mc = "__EMOTION_REACT_" + rm.version.split(".")[0] + "__";
    gc[mc] && console.warn("You are loading @emotion/react when it is already loaded. Running multiple instances may cause problems. This can happen if multiple versions are used, or if multiple builds of the same version are used."), gc[mc] = !0;
  }
}
var lm = su, um = function(t) {
  return t !== "theme";
}, yc = function(t) {
  return typeof t == "string" && t.charCodeAt(0) > 96 ? lm : um;
}, bc = function(t, n, r) {
  var o;
  if (n) {
    var i = n.shouldForwardProp;
    o = t.__emotion_forwardProp && i ? function(a) {
      return t.__emotion_forwardProp(a) && i(a);
    } : i;
  }
  return typeof o != "function" && r && (o = t.__emotion_forwardProp), o;
}, vc = `You have illegal escape sequence in your template literal, most likely inside content's property value.
Because you write your CSS inside a JavaScript string you actually have to do double escaping, so for example "content: '\\00d7';" should become "content: '\\\\00d7';".
You can read more about this here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences`, fm = function(t) {
  var n = t.cache, r = t.serialized, o = t.isStringTag;
  return $o(n, r, o), ts(function() {
    return Vo(n, r, o);
  }), null;
}, dm = function e(t, n) {
  if (process.env.NODE_ENV !== "production" && t === void 0)
    throw new Error(`You are trying to create a styled element with an undefined component.
You may have forgotten to import it.`);
  var r = t.__emotion_real === t, o = r && t.__emotion_base || t, i, a;
  n !== void 0 && (i = n.label, a = n.target);
  var s = bc(t, n, r), l = s || yc(o), u = !l("as");
  return function() {
    var d = arguments, p = r && t.__emotion_styles !== void 0 ? t.__emotion_styles.slice(0) : [];
    if (i !== void 0 && p.push("label:" + i + ";"), d[0] == null || d[0].raw === void 0)
      p.push.apply(p, d);
    else {
      process.env.NODE_ENV !== "production" && d[0][0] === void 0 && console.error(vc), p.push(d[0][0]);
      for (var h = d.length, b = 1; b < h; b++)
        process.env.NODE_ENV !== "production" && d[0][b] === void 0 && console.error(vc), p.push(d[b], d[0][b]);
    }
    var v = zo(function(g, w, S) {
      var y = u && g.as || o, T = "", O = [], C = g;
      if (g.theme == null) {
        C = {};
        for (var _ in g)
          C[_] = g[_];
        C.theme = tt(kn);
      }
      typeof g.className == "string" ? T = Za(w.registered, O, g.className) : g.className != null && (T = g.className + " ");
      var F = Kn(p.concat(O), w.registered, C);
      T += w.key + "-" + F.name, a !== void 0 && (T += " " + a);
      var ee = u && s === void 0 ? yc(y) : l, J = {};
      for (var pe in g)
        u && pe === "as" || ee(pe) && (J[pe] = g[pe]);
      return J.className = T, J.ref = S, /* @__PURE__ */ Nt(La, null, /* @__PURE__ */ Nt(fm, {
        cache: w,
        serialized: F,
        isStringTag: typeof y == "string"
      }), /* @__PURE__ */ Nt(y, J));
    });
    return v.displayName = i !== void 0 ? i : "Styled(" + (typeof o == "string" ? o : o.displayName || o.name || "Component") + ")", v.defaultProps = t.defaultProps, v.__emotion_real = v, v.__emotion_base = o, v.__emotion_styles = p, v.__emotion_forwardProp = s, Object.defineProperty(v, "toString", {
      value: function() {
        return a === void 0 && process.env.NODE_ENV !== "production" ? "NO_COMPONENT_SELECTOR" : "." + a;
      }
    }), v.withComponent = function(g, w) {
      return e(g, $r({}, n, w, {
        shouldForwardProp: bc(v, w, !0)
      })).apply(void 0, p);
    }, v;
  };
}, pm = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
], xa = dm.bind();
pm.forEach(function(e) {
  xa[e] = xa(e);
});
const cu = Ct({});
function _e() {
  return tt(cu);
}
var Oa = { exports: {} };
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 800, i = 16, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", u = "[object AsyncFunction]", d = "[object Boolean]", p = "[object Date]", h = "[object Error]", b = "[object Function]", v = "[object GeneratorFunction]", g = "[object Map]", w = "[object Number]", S = "[object Null]", y = "[object Object]", T = "[object Proxy]", O = "[object RegExp]", C = "[object Set]", _ = "[object String]", F = "[object Undefined]", ee = "[object WeakMap]", J = "[object ArrayBuffer]", pe = "[object DataView]", H = "[object Float32Array]", L = "[object Float64Array]", j = "[object Int8Array]", ae = "[object Int16Array]", ge = "[object Int32Array]", fe = "[object Uint8Array]", Ee = "[object Uint8ClampedArray]", Le = "[object Uint16Array]", ze = "[object Uint32Array]", P = /[\\^$.*+?()[\]{}|]/g, D = /^\[object .+?Constructor\]$/, V = /^(?:0|[1-9]\d*)$/, k = {};
  k[H] = k[L] = k[j] = k[ae] = k[ge] = k[fe] = k[Ee] = k[Le] = k[ze] = !0, k[s] = k[l] = k[J] = k[d] = k[pe] = k[p] = k[h] = k[b] = k[g] = k[w] = k[y] = k[O] = k[C] = k[_] = k[ee] = !1;
  var G = typeof tn == "object" && tn && tn.Object === Object && tn, le = typeof self == "object" && self && self.Object === Object && self, K = G || le || Function("return this")(), ie = t && !t.nodeType && t, ne = ie && !0 && e && !e.nodeType && e, me = ne && ne.exports === ie, se = me && G.process, Fe = function() {
    try {
      var c = ne && ne.require && ne.require("util").types;
      return c || se && se.binding && se.binding("util");
    } catch {
    }
  }(), B = Fe && Fe.isTypedArray;
  function Qe(c, f, m) {
    switch (m.length) {
      case 0:
        return c.call(f);
      case 1:
        return c.call(f, m[0]);
      case 2:
        return c.call(f, m[0], m[1]);
      case 3:
        return c.call(f, m[0], m[1], m[2]);
    }
    return c.apply(f, m);
  }
  function kt(c, f) {
    for (var m = -1, I = Array(c); ++m < c; )
      I[m] = f(m);
    return I;
  }
  function yt(c) {
    return function(f) {
      return c(f);
    };
  }
  function Xt(c, f) {
    return c == null ? void 0 : c[f];
  }
  function Nn(c, f) {
    return function(m) {
      return c(f(m));
    };
  }
  var Pn = Array.prototype, Jt = Function.prototype, bt = Object.prototype, jt = K["__core-js_shared__"], ct = Jt.toString, Ve = bt.hasOwnProperty, un = function() {
    var c = /[^.]+$/.exec(jt && jt.keys && jt.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), Qt = bt.toString, An = ct.call(Object), Mt = RegExp(
    "^" + ct.call(Ve).replace(P, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), vt = me ? K.Buffer : void 0, Zt = K.Symbol, en = K.Uint8Array, Lt = vt ? vt.allocUnsafe : void 0, fn = Nn(Object.getPrototypeOf, Object), dn = Object.create, or = bt.propertyIsEnumerable, ir = Pn.splice, Xe = Zt ? Zt.toStringTag : void 0, xt = function() {
    try {
      var c = gn(Object, "defineProperty");
      return c({}, "", {}), c;
    } catch {
    }
  }(), ar = vt ? vt.isBuffer : void 0, Ft = Math.max, jn = Date.now, dt = gn(K, "Map"), nt = gn(Object, "create"), pn = function() {
    function c() {
    }
    return function(f) {
      if (!ot(f))
        return {};
      if (dn)
        return dn(f);
      c.prototype = f;
      var m = new c();
      return c.prototype = void 0, m;
    };
  }();
  function Ge(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function sr() {
    this.__data__ = nt ? nt(null) : {}, this.size = 0;
  }
  function Mn(c) {
    var f = this.has(c) && delete this.__data__[c];
    return this.size -= f ? 1 : 0, f;
  }
  function cr(c) {
    var f = this.__data__;
    if (nt) {
      var m = f[c];
      return m === r ? void 0 : m;
    }
    return Ve.call(f, c) ? f[c] : void 0;
  }
  function Ln(c) {
    var f = this.__data__;
    return nt ? f[c] !== void 0 : Ve.call(f, c);
  }
  function Fn(c, f) {
    var m = this.__data__;
    return this.size += this.has(c) ? 0 : 1, m[c] = nt && f === void 0 ? r : f, this;
  }
  Ge.prototype.clear = sr, Ge.prototype.delete = Mn, Ge.prototype.get = cr, Ge.prototype.has = Ln, Ge.prototype.set = Fn;
  function Ue(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function lr() {
    this.__data__ = [], this.size = 0;
  }
  function Bn(c) {
    var f = this.__data__, m = Ye(f, c);
    if (m < 0)
      return !1;
    var I = f.length - 1;
    return m == I ? f.pop() : ir.call(f, m, 1), --this.size, !0;
  }
  function ur(c) {
    var f = this.__data__, m = Ye(f, c);
    return m < 0 ? void 0 : f[m][1];
  }
  function fr(c) {
    return Ye(this.__data__, c) > -1;
  }
  function dr(c, f) {
    var m = this.__data__, I = Ye(m, c);
    return I < 0 ? (++this.size, m.push([c, f])) : m[I][1] = f, this;
  }
  Ue.prototype.clear = lr, Ue.prototype.delete = Bn, Ue.prototype.get = ur, Ue.prototype.has = fr, Ue.prototype.set = dr;
  function rt(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function x() {
    this.size = 0, this.__data__ = {
      hash: new Ge(),
      map: new (dt || Ue)(),
      string: new Ge()
    };
  }
  function A(c) {
    var f = $t(this, c).delete(c);
    return this.size -= f ? 1 : 0, f;
  }
  function $(c) {
    return $t(this, c).get(c);
  }
  function te(c) {
    return $t(this, c).has(c);
  }
  function Oe(c, f) {
    var m = $t(this, c), I = m.size;
    return m.set(c, f), this.size += m.size == I ? 0 : 1, this;
  }
  rt.prototype.clear = x, rt.prototype.delete = A, rt.prototype.get = $, rt.prototype.has = te, rt.prototype.set = Oe;
  function de(c) {
    var f = this.__data__ = new Ue(c);
    this.size = f.size;
  }
  function ve() {
    this.__data__ = new Ue(), this.size = 0;
  }
  function he(c) {
    var f = this.__data__, m = f.delete(c);
    return this.size = f.size, m;
  }
  function qe(c) {
    return this.__data__.get(c);
  }
  function Ae(c) {
    return this.__data__.has(c);
  }
  function Me(c, f) {
    var m = this.__data__;
    if (m instanceof Ue) {
      var I = m.__data__;
      if (!dt || I.length < n - 1)
        return I.push([c, f]), this.size = ++m.size, this;
      m = this.__data__ = new rt(I);
    }
    return m.set(c, f), this.size = m.size, this;
  }
  de.prototype.clear = ve, de.prototype.delete = he, de.prototype.get = qe, de.prototype.has = Ae, de.prototype.set = Me;
  function Ze(c, f) {
    var m = bn(c), I = !m && yn(c), W = !m && !I && yr(c), X = !m && !I && !W && vr(c), re = m || I || W || X, U = re ? kt(c.length, String) : [], oe = U.length;
    for (var je in c)
      (f || Ve.call(c, je)) && !(re && (je == "length" || W && (je == "offset" || je == "parent") || X && (je == "buffer" || je == "byteLength" || je == "byteOffset") || gr(je, oe))) && U.push(je);
    return U;
  }
  function it(c, f, m) {
    (m !== void 0 && !Vt(c[f], m) || m === void 0 && !(f in c)) && hn(c, f, m);
  }
  function $n(c, f, m) {
    var I = c[f];
    (!(Ve.call(c, f) && Vt(I, m)) || m === void 0 && !(f in c)) && hn(c, f, m);
  }
  function Ye(c, f) {
    for (var m = c.length; m--; )
      if (Vt(c[m][0], f))
        return m;
    return -1;
  }
  function hn(c, f, m) {
    f == "__proto__" && xt ? xt(c, f, {
      configurable: !0,
      enumerable: !0,
      value: m,
      writable: !0
    }) : c[f] = m;
  }
  var Zo = di();
  function Bt(c) {
    return c == null ? c === void 0 ? F : S : Xe && Xe in Object(c) ? pi(c) : xi(c);
  }
  function pr(c) {
    return Ot(c) && Bt(c) == s;
  }
  function ei(c) {
    if (!ot(c) || yi(c))
      return !1;
    var f = xn(c) ? Mt : D;
    return f.test(Si(c));
  }
  function ti(c) {
    return Ot(c) && br(c.length) && !!k[Bt(c)];
  }
  function ni(c) {
    if (!ot(c))
      return bi(c);
    var f = mr(c), m = [];
    for (var I in c)
      I == "constructor" && (f || !Ve.call(c, I)) || m.push(I);
    return m;
  }
  function hr(c, f, m, I, W) {
    c !== f && Zo(f, function(X, re) {
      if (W || (W = new de()), ot(X))
        ri(c, f, re, m, hr, I, W);
      else {
        var U = I ? I(mn(c, re), X, re + "", c, f, W) : void 0;
        U === void 0 && (U = X), it(c, re, U);
      }
    }, xr);
  }
  function ri(c, f, m, I, W, X, re) {
    var U = mn(c, m), oe = mn(f, m), je = re.get(oe);
    if (je) {
      it(c, m, je);
      return;
    }
    var Re = X ? X(U, oe, m + "", c, f, re) : void 0, Et = Re === void 0;
    if (Et) {
      var On = bn(oe), En = !On && yr(oe), Er = !On && !En && vr(oe);
      Re = oe, On || En || Er ? bn(U) ? Re = U : Ti(U) ? Re = li(U) : En ? (Et = !1, Re = ai(oe, !0)) : Er ? (Et = !1, Re = ci(oe, !0)) : Re = [] : Ci(oe) || yn(oe) ? (Re = U, yn(U) ? Re = Ii(U) : (!ot(U) || xn(U)) && (Re = hi(oe))) : Et = !1;
    }
    Et && (re.set(oe, Re), W(Re, oe, I, X, re), re.delete(oe)), it(c, m, Re);
  }
  function oi(c, f) {
    return Ei(Oi(c, f, Or), c + "");
  }
  var ii = xt ? function(c, f) {
    return xt(c, "toString", {
      configurable: !0,
      enumerable: !1,
      value: _i(f),
      writable: !0
    });
  } : Or;
  function ai(c, f) {
    if (f)
      return c.slice();
    var m = c.length, I = Lt ? Lt(m) : new c.constructor(m);
    return c.copy(I), I;
  }
  function si(c) {
    var f = new c.constructor(c.byteLength);
    return new en(f).set(new en(c)), f;
  }
  function ci(c, f) {
    var m = f ? si(c.buffer) : c.buffer;
    return new c.constructor(m, c.byteOffset, c.length);
  }
  function li(c, f) {
    var m = -1, I = c.length;
    for (f || (f = Array(I)); ++m < I; )
      f[m] = c[m];
    return f;
  }
  function ui(c, f, m, I) {
    var W = !m;
    m || (m = {});
    for (var X = -1, re = f.length; ++X < re; ) {
      var U = f[X], oe = I ? I(m[U], c[U], U, m, c) : void 0;
      oe === void 0 && (oe = c[U]), W ? hn(m, U, oe) : $n(m, U, oe);
    }
    return m;
  }
  function fi(c) {
    return oi(function(f, m) {
      var I = -1, W = m.length, X = W > 1 ? m[W - 1] : void 0, re = W > 2 ? m[2] : void 0;
      for (X = c.length > 3 && typeof X == "function" ? (W--, X) : void 0, re && gi(m[0], m[1], re) && (X = W < 3 ? void 0 : X, W = 1), f = Object(f); ++I < W; ) {
        var U = m[I];
        U && c(f, U, I, X);
      }
      return f;
    });
  }
  function di(c) {
    return function(f, m, I) {
      for (var W = -1, X = Object(f), re = I(f), U = re.length; U--; ) {
        var oe = re[c ? U : ++W];
        if (m(X[oe], oe, X) === !1)
          break;
      }
      return f;
    };
  }
  function $t(c, f) {
    var m = c.__data__;
    return mi(f) ? m[typeof f == "string" ? "string" : "hash"] : m.map;
  }
  function gn(c, f) {
    var m = Xt(c, f);
    return ei(m) ? m : void 0;
  }
  function pi(c) {
    var f = Ve.call(c, Xe), m = c[Xe];
    try {
      c[Xe] = void 0;
      var I = !0;
    } catch {
    }
    var W = Qt.call(c);
    return I && (f ? c[Xe] = m : delete c[Xe]), W;
  }
  function hi(c) {
    return typeof c.constructor == "function" && !mr(c) ? pn(fn(c)) : {};
  }
  function gr(c, f) {
    var m = typeof c;
    return f = f == null ? a : f, !!f && (m == "number" || m != "symbol" && V.test(c)) && c > -1 && c % 1 == 0 && c < f;
  }
  function gi(c, f, m) {
    if (!ot(m))
      return !1;
    var I = typeof f;
    return (I == "number" ? vn(m) && gr(f, m.length) : I == "string" && f in m) ? Vt(m[f], c) : !1;
  }
  function mi(c) {
    var f = typeof c;
    return f == "string" || f == "number" || f == "symbol" || f == "boolean" ? c !== "__proto__" : c === null;
  }
  function yi(c) {
    return !!un && un in c;
  }
  function mr(c) {
    var f = c && c.constructor, m = typeof f == "function" && f.prototype || bt;
    return c === m;
  }
  function bi(c) {
    var f = [];
    if (c != null)
      for (var m in Object(c))
        f.push(m);
    return f;
  }
  function xi(c) {
    return Qt.call(c);
  }
  function Oi(c, f, m) {
    return f = Ft(f === void 0 ? c.length - 1 : f, 0), function() {
      for (var I = arguments, W = -1, X = Ft(I.length - f, 0), re = Array(X); ++W < X; )
        re[W] = I[f + W];
      W = -1;
      for (var U = Array(f + 1); ++W < f; )
        U[W] = I[W];
      return U[f] = m(re), Qe(c, this, U);
    };
  }
  function mn(c, f) {
    if (!(f === "constructor" && typeof c[f] == "function") && f != "__proto__")
      return c[f];
  }
  var Ei = wi(ii);
  function wi(c) {
    var f = 0, m = 0;
    return function() {
      var I = jn(), W = i - (I - m);
      if (m = I, W > 0) {
        if (++f >= o)
          return arguments[0];
      } else
        f = 0;
      return c.apply(void 0, arguments);
    };
  }
  function Si(c) {
    if (c != null) {
      try {
        return ct.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function Vt(c, f) {
    return c === f || c !== c && f !== f;
  }
  var yn = pr(function() {
    return arguments;
  }()) ? pr : function(c) {
    return Ot(c) && Ve.call(c, "callee") && !or.call(c, "callee");
  }, bn = Array.isArray;
  function vn(c) {
    return c != null && br(c.length) && !xn(c);
  }
  function Ti(c) {
    return Ot(c) && vn(c);
  }
  var yr = ar || Di;
  function xn(c) {
    if (!ot(c))
      return !1;
    var f = Bt(c);
    return f == b || f == v || f == u || f == T;
  }
  function br(c) {
    return typeof c == "number" && c > -1 && c % 1 == 0 && c <= a;
  }
  function ot(c) {
    var f = typeof c;
    return c != null && (f == "object" || f == "function");
  }
  function Ot(c) {
    return c != null && typeof c == "object";
  }
  function Ci(c) {
    if (!Ot(c) || Bt(c) != y)
      return !1;
    var f = fn(c);
    if (f === null)
      return !0;
    var m = Ve.call(f, "constructor") && f.constructor;
    return typeof m == "function" && m instanceof m && ct.call(m) == An;
  }
  var vr = B ? yt(B) : ti;
  function Ii(c) {
    return ui(c, xr(c));
  }
  function xr(c) {
    return vn(c) ? Ze(c, !0) : ni(c);
  }
  var ki = fi(function(c, f, m) {
    hr(c, f, m);
  });
  function _i(c) {
    return function() {
      return c;
    };
  }
  function Or(c) {
    return c;
  }
  function Di() {
    return !1;
  }
  e.exports = ki;
})(Oa, Oa.exports);
const Ho = Oa.exports, lu = [
  "accentColor",
  "additiveSymbols",
  "alignContent",
  "alignItems",
  "alignSelf",
  "alignmentBaseline",
  "all",
  "animation",
  "animationDelay",
  "animationDirection",
  "animationDuration",
  "animationFillMode",
  "animationIterationCount",
  "animationName",
  "animationPlayState",
  "animationTimingFunction",
  "appRegion",
  "appearance",
  "ascentOverride",
  "aspectRatio",
  "backdropFilter",
  "backfaceVisibility",
  "background",
  "backgroundAttachment",
  "backgroundBlendMode",
  "backgroundClip",
  "backgroundColor",
  "backgroundImage",
  "backgroundOrigin",
  "backgroundPosition",
  "backgroundPositionX",
  "backgroundPositionY",
  "backgroundRepeat",
  "backgroundRepeatX",
  "backgroundRepeatY",
  "backgroundSize",
  "baselineShift",
  "blockSize",
  "border",
  "borderBlock",
  "borderBlockColor",
  "borderBlockEnd",
  "borderBlockEndColor",
  "borderBlockEndStyle",
  "borderBlockEndWidth",
  "borderBlockStart",
  "borderBlockStartColor",
  "borderBlockStartStyle",
  "borderBlockStartWidth",
  "borderBlockStyle",
  "borderBlockWidth",
  "borderBottom",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStyle",
  "borderBottomWidth",
  "borderCollapse",
  "borderColor",
  "borderEndEndRadius",
  "borderEndStartRadius",
  "borderImage",
  "borderImageOutset",
  "borderImageRepeat",
  "borderImageSlice",
  "borderImageSource",
  "borderImageWidth",
  "borderInline",
  "borderInlineColor",
  "borderInlineEnd",
  "borderInlineEndColor",
  "borderInlineEndStyle",
  "borderInlineEndWidth",
  "borderInlineStart",
  "borderInlineStartColor",
  "borderInlineStartStyle",
  "borderInlineStartWidth",
  "borderInlineStyle",
  "borderInlineWidth",
  "borderLeft",
  "borderLeftColor",
  "borderLeftStyle",
  "borderLeftWidth",
  "borderRadius",
  "borderRight",
  "borderRightColor",
  "borderRightStyle",
  "borderRightWidth",
  "borderSpacing",
  "borderStartEndRadius",
  "borderStartStartRadius",
  "borderStyle",
  "borderTop",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStyle",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "boxShadow",
  "boxSizing",
  "breakAfter",
  "breakBefore",
  "breakInside",
  "bufferedRendering",
  "captionSide",
  "caretColor",
  "clear",
  "clip",
  "clipPath",
  "clipRule",
  "color",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorRendering",
  "colorScheme",
  "columnCount",
  "columnFill",
  "columnGap",
  "columnRule",
  "columnRuleColor",
  "columnRuleStyle",
  "columnRuleWidth",
  "columnSpan",
  "columnWidth",
  "columns",
  "contain",
  "containIntrinsicBlockSize",
  "containIntrinsicHeight",
  "containIntrinsicInlineSize",
  "containIntrinsicSize",
  "containIntrinsicWidth",
  "content",
  "contentVisibility",
  "counterIncrement",
  "counterReset",
  "counterSet",
  "cursor",
  "cx",
  "cy",
  "d",
  "descentOverride",
  "direction",
  "display",
  "dominantBaseline",
  "emptyCells",
  "fallback",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexFlow",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "float",
  "floodColor",
  "floodOpacity",
  "font",
  "fontDisplay",
  "fontFamily",
  "fontFeatureSettings",
  "fontKerning",
  "fontOpticalSizing",
  "fontSize",
  "fontStretch",
  "fontStyle",
  "fontSynthesis",
  "fontSynthesisSmallCaps",
  "fontSynthesisStyle",
  "fontSynthesisWeight",
  "fontVariant",
  "fontVariantCaps",
  "fontVariantEastAsian",
  "fontVariantLigatures",
  "fontVariantNumeric",
  "fontVariationSettings",
  "fontWeight",
  "forcedColorAdjust",
  "gap",
  "grid",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnGap",
  "gridColumnStart",
  "gridGap",
  "gridRow",
  "gridRowEnd",
  "gridRowGap",
  "gridRowStart",
  "gridTemplate",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "hyphens",
  "imageOrientation",
  "imageRendering",
  "inherits",
  "initialValue",
  "inlineSize",
  "inset",
  "insetBlock",
  "insetBlockEnd",
  "insetBlockStart",
  "insetInline",
  "insetInlineEnd",
  "insetInlineStart",
  "isolation",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "letterSpacing",
  "lightingColor",
  "lineBreak",
  "lineGapOverride",
  "lineHeight",
  "listStyle",
  "listStyleImage",
  "listStylePosition",
  "listStyleType",
  "margin",
  "marginBlock",
  "marginBlockEnd",
  "marginBlockStart",
  "marginBottom",
  "marginInline",
  "marginInlineEnd",
  "marginInlineStart",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marker",
  "markerEnd",
  "markerMid",
  "markerStart",
  "mask",
  "maskType",
  "maxBlockSize",
  "maxHeight",
  "maxInlineSize",
  "maxWidth",
  "maxZoom",
  "minBlockSize",
  "minHeight",
  "minInlineSize",
  "minWidth",
  "minZoom",
  "mixBlendMode",
  "mozAnimation",
  "mozAnimationDelay",
  "mozAnimationDirection",
  "mozAnimationDuration",
  "mozAnimationFillMode",
  "mozAnimationIterationCount",
  "mozAnimationName",
  "mozAnimationPlayState",
  "mozAnimationTimingFunction",
  "mozAppearance",
  "mozBackfaceVisibility",
  "mozBorderEnd",
  "mozBorderEndColor",
  "mozBorderEndStyle",
  "mozBorderEndWidth",
  "mozBorderImage",
  "mozBorderStart",
  "mozBorderStartColor",
  "mozBorderStartStyle",
  "mozBorderStartWidth",
  "mozBoxAlign",
  "mozBoxDirection",
  "mozBoxFlex",
  "mozBoxOrdinalGroup",
  "mozBoxOrient",
  "mozBoxPack",
  "mozBoxSizing",
  "mozFloatEdge",
  "mozFontFeatureSettings",
  "mozFontLanguageOverride",
  "mozForceBrokenImageIcon",
  "mozHyphens",
  "mozImageRegion",
  "mozMarginEnd",
  "mozMarginStart",
  "mozOrient",
  "mozOsxFontSmoothing",
  "mozPaddingEnd",
  "mozPaddingStart",
  "mozPerspective",
  "mozPerspectiveOrigin",
  "mozTabSize",
  "mozTextSizeAdjust",
  "mozTransform",
  "mozTransformOrigin",
  "mozTransformStyle",
  "mozTransition",
  "mozTransitionDelay",
  "mozTransitionDuration",
  "mozTransitionProperty",
  "mozTransitionTimingFunction",
  "mozUserFocus",
  "mozUserInput",
  "mozUserModify",
  "mozUserSelect",
  "negative",
  "objectFit",
  "objectPosition",
  "offset",
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "opacity",
  "order",
  "orientation",
  "orphans",
  "outline",
  "outlineColor",
  "outlineOffset",
  "outlineStyle",
  "outlineWidth",
  "overflow",
  "overflowAnchor",
  "overflowClipMargin",
  "overflowWrap",
  "overflowX",
  "overflowY",
  "overscrollBehavior",
  "overscrollBehaviorBlock",
  "overscrollBehaviorInline",
  "overscrollBehaviorX",
  "overscrollBehaviorY",
  "pad",
  "padding",
  "paddingBlock",
  "paddingBlockEnd",
  "paddingBlockStart",
  "paddingBottom",
  "paddingInline",
  "paddingInlineEnd",
  "paddingInlineStart",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "page",
  "pageBreakAfter",
  "pageBreakBefore",
  "pageBreakInside",
  "pageOrientation",
  "paintOrder",
  "perspective",
  "perspectiveOrigin",
  "placeContent",
  "placeItems",
  "placeSelf",
  "pointerEvents",
  "position",
  "prefix",
  "quotes",
  "r",
  "range",
  "resize",
  "right",
  "rowGap",
  "rubyPosition",
  "rx",
  "ry",
  "scrollBehavior",
  "scrollMargin",
  "scrollMarginBlock",
  "scrollMarginBlockEnd",
  "scrollMarginBlockStart",
  "scrollMarginBottom",
  "scrollMarginInline",
  "scrollMarginInlineEnd",
  "scrollMarginInlineStart",
  "scrollMarginLeft",
  "scrollMarginRight",
  "scrollMarginTop",
  "scrollPadding",
  "scrollPaddingBlock",
  "scrollPaddingBlockEnd",
  "scrollPaddingBlockStart",
  "scrollPaddingBottom",
  "scrollPaddingInline",
  "scrollPaddingInlineEnd",
  "scrollPaddingInlineStart",
  "scrollPaddingLeft",
  "scrollPaddingRight",
  "scrollPaddingTop",
  "scrollSnapAlign",
  "scrollSnapStop",
  "scrollSnapType",
  "scrollbarGutter",
  "shapeImageThreshold",
  "shapeMargin",
  "shapeOutside",
  "shapeRendering",
  "size",
  "sizeAdjust",
  "speak",
  "speakAs",
  "stopColor",
  "stopOpacity",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "suffix",
  "symbols",
  "syntax",
  "system",
  "tabSize",
  "tableLayout",
  "textAlign",
  "textAlignLast",
  "textAnchor",
  "textCombineUpright",
  "textDecoration",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationSkipInk",
  "textDecorationStyle",
  "textDecorationThickness",
  "textEmphasis",
  "textEmphasisColor",
  "textEmphasisPosition",
  "textEmphasisStyle",
  "textIndent",
  "textOrientation",
  "textOverflow",
  "textRendering",
  "textShadow",
  "textSizeAdjust",
  "textTransform",
  "textUnderlineOffset",
  "textUnderlinePosition",
  "top",
  "touchAction",
  "transform",
  "transformBox",
  "transformOrigin",
  "transformStyle",
  "transition",
  "transitionDelay",
  "transitionDuration",
  "transitionProperty",
  "transitionTimingFunction",
  "unicodeBidi",
  "unicodeRange",
  "userSelect",
  "userZoom",
  "vectorEffect",
  "verticalAlign",
  "visibility",
  "webkitAlignContent",
  "webkitAlignItems",
  "webkitAlignSelf",
  "webkitAnimation",
  "webkitAnimationDelay",
  "webkitAnimationDirection",
  "webkitAnimationDuration",
  "webkitAnimationFillMode",
  "webkitAnimationIterationCount",
  "webkitAnimationName",
  "webkitAnimationPlayState",
  "webkitAnimationTimingFunction",
  "webkitAppRegion",
  "webkitAppearance",
  "webkitBackfaceVisibility",
  "webkitBackgroundClip",
  "webkitBackgroundOrigin",
  "webkitBackgroundSize",
  "webkitBorderAfter",
  "webkitBorderAfterColor",
  "webkitBorderAfterStyle",
  "webkitBorderAfterWidth",
  "webkitBorderBefore",
  "webkitBorderBeforeColor",
  "webkitBorderBeforeStyle",
  "webkitBorderBeforeWidth",
  "webkitBorderBottomLeftRadius",
  "webkitBorderBottomRightRadius",
  "webkitBorderEnd",
  "webkitBorderEndColor",
  "webkitBorderEndStyle",
  "webkitBorderEndWidth",
  "webkitBorderHorizontalSpacing",
  "webkitBorderImage",
  "webkitBorderRadius",
  "webkitBorderStart",
  "webkitBorderStartColor",
  "webkitBorderStartStyle",
  "webkitBorderStartWidth",
  "webkitBorderTopLeftRadius",
  "webkitBorderTopRightRadius",
  "webkitBorderVerticalSpacing",
  "webkitBoxAlign",
  "webkitBoxDecorationBreak",
  "webkitBoxDirection",
  "webkitBoxFlex",
  "webkitBoxOrdinalGroup",
  "webkitBoxOrient",
  "webkitBoxPack",
  "webkitBoxReflect",
  "webkitBoxShadow",
  "webkitBoxSizing",
  "webkitClipPath",
  "webkitColumnBreakAfter",
  "webkitColumnBreakBefore",
  "webkitColumnBreakInside",
  "webkitColumnCount",
  "webkitColumnGap",
  "webkitColumnRule",
  "webkitColumnRuleColor",
  "webkitColumnRuleStyle",
  "webkitColumnRuleWidth",
  "webkitColumnSpan",
  "webkitColumnWidth",
  "webkitColumns",
  "webkitFilter",
  "webkitFlex",
  "webkitFlexBasis",
  "webkitFlexDirection",
  "webkitFlexFlow",
  "webkitFlexGrow",
  "webkitFlexShrink",
  "webkitFlexWrap",
  "webkitFontFeatureSettings",
  "webkitFontSmoothing",
  "webkitHighlight",
  "webkitHyphenateCharacter",
  "webkitJustifyContent",
  "webkitLineBreak",
  "webkitLineClamp",
  "webkitLocale",
  "webkitLogicalHeight",
  "webkitLogicalWidth",
  "webkitMarginAfter",
  "webkitMarginBefore",
  "webkitMarginEnd",
  "webkitMarginStart",
  "webkitMask",
  "webkitMaskBoxImage",
  "webkitMaskBoxImageOutset",
  "webkitMaskBoxImageRepeat",
  "webkitMaskBoxImageSlice",
  "webkitMaskBoxImageSource",
  "webkitMaskBoxImageWidth",
  "webkitMaskClip",
  "webkitMaskComposite",
  "webkitMaskImage",
  "webkitMaskOrigin",
  "webkitMaskPosition",
  "webkitMaskPositionX",
  "webkitMaskPositionY",
  "webkitMaskRepeat",
  "webkitMaskRepeatX",
  "webkitMaskRepeatY",
  "webkitMaskSize",
  "webkitMaxLogicalHeight",
  "webkitMaxLogicalWidth",
  "webkitMinLogicalHeight",
  "webkitMinLogicalWidth",
  "webkitOpacity",
  "webkitOrder",
  "webkitPaddingAfter",
  "webkitPaddingBefore",
  "webkitPaddingEnd",
  "webkitPaddingStart",
  "webkitPerspective",
  "webkitPerspectiveOrigin",
  "webkitPerspectiveOriginX",
  "webkitPerspectiveOriginY",
  "webkitPrintColorAdjust",
  "webkitRtlOrdering",
  "webkitRubyPosition",
  "webkitShapeImageThreshold",
  "webkitShapeMargin",
  "webkitShapeOutside",
  "webkitTapHighlightColor",
  "webkitTextCombine",
  "webkitTextDecorationsInEffect",
  "webkitTextEmphasis",
  "webkitTextEmphasisColor",
  "webkitTextEmphasisPosition",
  "webkitTextEmphasisStyle",
  "webkitTextFillColor",
  "webkitTextOrientation",
  "webkitTextSecurity",
  "webkitTextSizeAdjust",
  "webkitTextStroke",
  "webkitTextStrokeColor",
  "webkitTextStrokeWidth",
  "webkitTransform",
  "webkitTransformOrigin",
  "webkitTransformOriginX",
  "webkitTransformOriginY",
  "webkitTransformOriginZ",
  "webkitTransformStyle",
  "webkitTransition",
  "webkitTransitionDelay",
  "webkitTransitionDuration",
  "webkitTransitionProperty",
  "webkitTransitionTimingFunction",
  "webkitUserDrag",
  "webkitUserModify",
  "webkitUserSelect",
  "webkitWritingMode",
  "whiteSpace",
  "widows",
  "width",
  "willChange",
  "wordBreak",
  "wordSpacing",
  "wordWrap",
  "writingMode",
  "x",
  "y",
  "zIndex",
  "zoom"
], uu = {
  _hover: [
    "&:hover"
  ],
  _active: [
    "&:active"
  ],
  _focus: [
    "&:focus"
  ],
  _focusWithin: [
    "&:focus-within"
  ],
  _focusVisible: [
    "&:focus-visible"
  ],
  _disabled: [
    "&[disabled]",
    "&[aria-disabled=true]"
  ],
  _readOnly: [
    "&[aria-readonly=true]",
    "&[readonly]"
  ],
  _before: [
    "&::before"
  ],
  _after: [
    "&::after"
  ],
  _empty: [
    "&:empty"
  ],
  _expanded: [
    "&[aria-expanded=true]"
  ],
  _checked: [
    "&[aria-checked=true]"
  ],
  _grabbed: [
    "&[aria-grabbed=true]"
  ],
  _pressed: [
    "&[aria-pressed=true]"
  ],
  _invalid: [
    "&[aria-invalid=true]"
  ],
  _busy: [
    "&[aria-busy=true]"
  ],
  _selected: [
    "&[aria-selected=true]"
  ],
  _hidden: [
    "&[hidden]"
  ],
  _webkitAutofill: [
    "&:-webkit-autofill"
  ],
  _even: [
    "&:nth-of-type(even)"
  ],
  _odd: [
    "&:nth-of-type(odd)"
  ],
  _first: [
    "&:first-of-type"
  ],
  _last: [
    "&:last-of-type"
  ],
  _notFirst: [
    "&:not(:first-of-type)"
  ],
  _notLast: [
    "&:not(:last-of-type)"
  ],
  _visited: [
    "&:visited"
  ],
  _indeterminate: [
    "&:indeterminate",
    "&[aria-checked=mixed]"
  ],
  _placeholder: [
    "&::placeholder"
  ],
  _placeholderShown: [
    "&:placeholder-shown"
  ],
  _fullScreen: [
    "&:fullscreen"
  ],
  _selection: [
    "&::selection"
  ],
  _rtl: [
    "[dir=rtl] &",
    "&[dir=rtl]"
  ],
  _ltr: [
    "[dir=ltr] &",
    "&[dir=ltr]"
  ]
};
function Gr(e, t) {
  return Object.entries(e).reduce((n, [r, o]) => o && typeof o == "object" ? (n[r] = Gr(o, t), n) : t(n, r, o, e), {});
}
function Kr(e) {
  return e && typeof e == "object" ? e : {};
}
function Hi(e, t, n) {
  let r = n;
  if (typeof r > "u") {
    const l = Object.entries(e).sort(([, p], [, h]) => p - h), u = l.findIndex(([p, h]) => p === t || h === t), d = l[u + 1];
    d && ([r] = d);
  }
  const o = typeof t == "string" ? e[t] : t, i = typeof r == "string" ? e[r] : r;
  if (typeof i != "number")
    return `(min-width: ${o}px)`;
  const a = o < i ? o : i, s = o > i ? o : i;
  return `(min-width: ${a}px) and (max-width: ${s - 1}px)`;
}
function hm(e, t, n, r) {
  const o = Kr(e.breakpoints), i = typeof n == "string" ? o[n] : n;
  if (typeof i != "number")
    return null;
  switch (t) {
    case "up":
      return `(min-width: ${i}px)`;
    case "down":
      return `(max-width: ${i - 1}px)`;
    case "between":
      return Hi(o, n, r);
    case "only":
      return Hi(o, n);
    case "not":
      return `not ${Hi(o, n)}`;
    default:
      return t;
  }
}
const xc = ["up", "down", "between", "only", "not"];
function gm(e, t) {
  const n = Object.keys(Kr(t.breakpoints)).map((r) => [`-${r}`, ...xc.map((o) => `-${r}-${o}`)]);
  return Gr(e, (r, o, i) => {
    for (const a of n) {
      const s = a.find((l) => o.endsWith(l));
      if (s) {
        const l = s.split("-");
        l.shift();
        let u = l[l.length - 1];
        u = xc.includes(u) ? l.pop() : "down";
        const d = l.join("-"), p = hm(t, u, d);
        return p ? Object.assign(Object.assign({}, r), { [`@media ${p}`]: Object.assign(Object.assign({}, r[`@media ${p}`]), { [o.slice(0, -s.length)]: i }) }) : r;
      }
    }
    return r[o] = i, r;
  });
}
function mm(e, t) {
  const { aliases: n } = t;
  return n && typeof n == "object" ? Gr(e, (r, o, i) => {
    var a;
    return r[(a = n[o]) !== null && a !== void 0 ? a : o] = i, r;
  }) : e;
}
function Ea(e) {
  return Object.entries(e).reduce((t, [n, r]) => {
    const o = uu[n];
    return o && r && typeof r == "object" ? (o.forEach((i) => {
      t[i] = Object.assign(t[i] || {}, Ea(r));
    }), t) : (t[n] = r && typeof r == "object" ? Ea(r) : r, t);
  }, {});
}
function ym(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function bm(e) {
  return Gr(e, (t, n, r) => (t[n.startsWith("webkit") || n.startsWith("moz") ? ym(n) : n] = r, t));
}
const vm = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
}, xm = [":", "&", ">", "~", "+", ".", ",", "#"];
function fu(e) {
  if (typeof e != "string")
    return !1;
  const t = e.trim();
  return e.startsWith(" ") || xm.some((n) => t.startsWith(n));
}
function du(e) {
  return e[0] + e[0] + e[1] + e[1] + e[2] + e[2];
}
function pu(e, t = 25) {
  if (!(typeof e == "string" && typeof t == "number" && e.startsWith("#")))
    return e;
  const n = Math.round(t / 100 * 255);
  let r = "", o = e.slice(1);
  if (o.length === 3)
    o = du(o);
  else if (o.length === 8)
    r = o.slice(-2), o = o.slice(0, 6);
  else if (o.length !== 6)
    return e;
  const i = parseInt(o, 16);
  let a = (i >> 16) + n;
  a > 255 ? a = 255 : a < 0 && (a = 0);
  let s = (i >> 8 & 255) + n;
  s > 255 ? s = 255 : s < 0 && (s = 0);
  let l = (i & 255) + n;
  return l > 255 ? l = 255 : l < 0 && (l = 0), `#${(l | s << 8 | a << 16).toString(16).padStart(6, "0")}${r}`;
}
const Om = (e, t = 12) => pu(e, -t);
function Em(e, t = 50) {
  if (!(typeof e == "string" && typeof t == "number" && e.startsWith("#")))
    return e;
  let n = 0, r = e.slice(1);
  if (r.length === 3)
    r = du(r);
  else if (r.length === 8)
    n = parseInt(r.slice(-2), 16), r = r.slice(0, 6);
  else if (r.length !== 6)
    return e;
  const o = Math.max(0, Math.min(255, Math.round((1 - t / 100) * 255 - n)));
  return `#${r}${o.toString(16).padStart(2, "0")}`;
}
const wm = [
  "background",
  "backgroundColor",
  "border",
  "borderBottom",
  "borderBottomColor",
  "borderColor",
  "borderLeft",
  "borderLeftColor",
  "borderRight",
  "borderRightColor",
  "borderTop",
  "borderTopColor",
  "boxShadow",
  "caretColor",
  "color",
  "columnRule",
  "columnRuleColor",
  "fill",
  "filter",
  "opacity",
  "outline",
  "outlineColor",
  "stroke",
  "textDecoration",
  "textDecorationColor",
  "textShadow"
];
function hu(e, t = {}) {
  return gu(null, e, t);
}
function gu(e, t, n = {}) {
  return e && !(fu(e) || wm.includes(e)) ? t : t && typeof t == "object" ? Gr(t, (r, o, i) => (r[o] = gu(o, i, n), r)) : typeof t == "string" ? mu(t, n) : t;
}
function mu(e, t = {}) {
  if (t.cache || (t.cache = {}), t.cache[t.mode] || (t.cache[t.mode] = {}), t.cache[t.mode][e])
    return t.cache[t.mode][e];
  const n = Object.entries(Kr(t.colors)).reduce((r, [o, i]) => typeof i == "object" ? Object.assign(Object.assign(Object.assign({}, r), { [o]: i }), yu(o, i)) : (r[o] = i, r), {});
  return t.cache[t.mode][e] = xu(bu(e, n, t));
}
function yu(e, t) {
  const n = {};
  return Object.entries(t).forEach(([r, o]) => {
    const i = `${e}.${r}`;
    if (typeof o == "object") {
      Object.assign(n, yu(i, o));
      return;
    }
    n[i] = o;
  }), n;
}
function bu(e, t, n, r = 0) {
  if (r >= 64)
    throw new Error("Could not convert color, you may have a circular color reference in your theme.");
  let o = e;
  return Object.keys(t).sort((i, a) => a.length - i.length).forEach((i) => {
    if (i && o.includes(i)) {
      const a = vu(i, t, n);
      typeof a == "string" && a.length > 0 && (o = o.replaceAll(i, a));
    }
  }), o === e ? o : bu(o, t, n, r + 1);
}
function vu(e, t, n, r = 0) {
  if (r >= 64)
    throw new Error("Could not resolve color, you may have a circular color reference in your theme.");
  const o = typeof t[e] == "string" ? t[e] : typeof t[e] == "object" ? t[e][n.mode || "light"] : e;
  return o === e ? o : vu(o, t, n, r + 1);
}
const Sm = [
  {
    name: "lighten",
    regex: /lighten\s*\(\s*(rgba?\s*\([^)]+\)|[^,)]+)(?:\s*,\s*)?([^)\s]*)\s*\)/g,
    fn: (e, t) => pu(e, t)
  },
  {
    name: "darken",
    regex: /darken\s*\(\s*(rgba?\s*\([^)]+\)|[^,)]+)(?:\s*,\s*)?([^)\s]*)\s*\)/g,
    fn: (e, t) => Om(e, t)
  },
  {
    name: "transparency",
    regex: /transparency\s*\(\s*(rgba?\s*\([^)]+\)|[^,)]+)(?:\s*,\s*)?([^)\s]*)\s*\)/g,
    fn: (e, t) => Em(e, t)
  }
];
function xu(e, t = 0) {
  if (t >= 64)
    throw new Error("Could not apply color helper. Too many recursions.");
  const n = Sm.reduce((r, { regex: o, fn: i, name: a }) => r.includes(a) ? r.replace(o, (s, l, u) => {
    let d = u ? parseInt(u) : void 0;
    return d !== d && (d = void 0), i(Cm(Im(l.trim())), d);
  }) : r, e);
  return n === e ? n : xu(n, t + 1);
}
const Tm = /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*?(\d{1,3})?\s*\)/;
function Cm(e) {
  if (e.includes("rgb")) {
    const t = e.match(Tm);
    if (t) {
      const n = parseInt(t[4]);
      return `#${parseInt(t[1]).toString(16).padEnd(2, "0")}${parseInt(t[2]).toString(16).padEnd(2, "0")}${parseInt(t[3]).toString(16).padEnd(2, "0")}${n === n ? n.toString(16).padEnd(2, "0") : ""}`;
    }
  }
  return e;
}
function Im(e) {
  return vm[e] || e;
}
function Ur(e, t) {
  return hu(bm(Ea(mm(gm(e, t), t))), t);
}
function Rt(e, t, n) {
  return Array.isArray(e) ? e.reduce((r, o) => Ho(r, Kr(typeof o == "function" ? o(t, n) : o)), {}) : {};
}
const km = lu.map((e) => `${e}-`), _m = Object.keys(uu);
function Dm(e, t, n = {}, r = []) {
  const o = _e();
  return De(() => {
    var i, a;
    const s = Object.assign(Object.assign({}, t), n), l = Object.keys(Kr(o.aliases)), u = l.map((b) => `${b}-`), d = {}, p = Rt((i = o[e]) === null || i === void 0 ? void 0 : i.Root, s, o), h = Rt((a = o[e]) === null || a === void 0 ? void 0 : a.DefaultProps, s, o);
    return Object.entries(t).forEach(([b, v]) => {
      (lu.includes(b) || km.some((g) => b.startsWith(g)) || l.includes(b) || u.some((g) => b.startsWith(g)) || fu(b) || _m.includes(b)) && !r.includes(b) ? d[b] = v : h[b] = v;
    }), [
      Ur(Ho(
        {},
        p,
        Rt(o.global, Object.assign(Object.assign({}, s), p), o),
        d,
        Rt(o.global, d, o)
      ), o),
      h
    ];
  }, [e, t, n, r, o]);
}
function N(e, t) {
  const n = xa(e, {
    shouldForwardProp: su
  })((i) => i.honorable);
  function r(i, a) {
    const s = _e(), [l, u] = Dm(t, i);
    return M(n, Object.assign({
      ref: a,
      theme: s,
      honorable: l
    }, u));
  }
  const o = ke(r);
  return o.displayName = `Honorable(${t})`, o;
}
const Ou = N("button", "ButtonBase"), Rm = N("input", "InputBase");
N("menu", "MenuBase");
N("select", "SelectBase");
N("a", "A");
N("abbr", "Abbr");
N("address", "Address");
N("area", "Area");
N("article", "Article");
N("aside", "Aside");
N("audio", "Audio");
N("b", "B");
N("base", "Base");
N("bdi", "Bdi");
N("bdo", "Bdo");
N("blockquote", "Blockquote");
N("body", "Body");
N("br", "Br");
N("canvas", "Canvas");
N("caption", "Caption");
N("cite", "Cite");
N("code", "Code");
N("col", "Col");
N("colgroup", "Colgroup");
N("data", "Data");
N("datalist", "Datalist");
N("dd", "Dd");
N("del", "Del");
N("details", "Details");
N("dfn", "Dfn");
N("dialog", "Dialog");
const Z = N("div", "Div");
N("dl", "Dl");
N("dt", "Dt");
N("em", "Em");
N("embed", "Embed");
N("fieldset", "Fieldset");
N("figcaption", "Figcaption");
N("figure", "Figure");
N("footer", "Footer");
N("form", "Form");
const Nm = N("h1", "H1"), Eu = N("h2", "H2");
N("h3", "H3");
N("h4", "H4");
N("h5", "H5");
N("h6", "H6");
N("head", "Head");
N("header", "Header");
N("hr", "Hr");
N("i", "I");
N("iframe", "Iframe");
const Pm = N("img", "Img");
N("ins", "Ins");
N("kbd", "Kbd");
N("label", "Label");
N("legend", "Legend");
const Am = N("li", "Li");
N("link", "Link");
N("main", "Main");
N("map", "Map");
N("mark", "Mark");
N("meta", "Meta");
N("meter", "Meter");
N("nav", "Nav");
N("noscript", "Noscript");
N("ol", "Ol");
N("optgroup", "Optgroup");
N("option", "Option");
N("output", "Output");
const wu = N("p", "P");
N("param", "Param");
N("picture", "Picture");
N("pre", "Pre");
N("progress", "Progress");
N("q", "Q");
N("rp", "Rp");
N("rt", "Rt");
N("ruby", "Ruby");
N("s", "S");
N("samp", "Samp");
N("script", "Script");
N("section", "Section");
N("slot", "Slot");
N("small", "Small");
N("source", "Source");
const mt = N("span", "Span");
N("strong", "Strong");
N("style", "Style");
N("sub", "Sub");
N("summary", "Summary");
N("sup", "Sup");
const jm = N("svg", "Svg");
N("table", "Table");
N("tbody", "Tbody");
N("td", "Td");
N("template", "Template");
N("textarea", "Textarea");
N("tfoot", "Tfoot");
N("th", "Th");
N("thead", "Thead");
N("time", "Time");
N("title", "Title");
N("tr", "Tr");
N("track", "Track");
N("u", "U");
const Mm = N("ul", "Ul");
N("var", "Var");
N("video", "Video");
N("wbr", "Wbr");
var E = { exports: {} };
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Wi, Oc;
function Lm() {
  if (Oc)
    return Wi;
  Oc = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function r(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var a = {}, s = 0; s < 10; s++)
        a["_" + String.fromCharCode(s)] = s;
      var l = Object.getOwnPropertyNames(a).map(function(d) {
        return a[d];
      });
      if (l.join("") !== "0123456789")
        return !1;
      var u = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(d) {
        u[d] = d;
      }), Object.keys(Object.assign({}, u)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Wi = o() ? Object.assign : function(i, a) {
    for (var s, l = r(i), u, d = 1; d < arguments.length; d++) {
      s = Object(arguments[d]);
      for (var p in s)
        t.call(s, p) && (l[p] = s[p]);
      if (e) {
        u = e(s);
        for (var h = 0; h < u.length; h++)
          n.call(s, u[h]) && (l[u[h]] = s[u[h]]);
      }
    }
    return l;
  }, Wi;
}
var qi, Ec;
function is() {
  if (Ec)
    return qi;
  Ec = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return qi = e, qi;
}
var Yi, wc;
function Su() {
  return wc || (wc = 1, Yi = Function.call.bind(Object.prototype.hasOwnProperty)), Yi;
}
var Gi, Sc;
function Fm() {
  if (Sc)
    return Gi;
  Sc = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = is(), n = {}, r = Su();
    e = function(i) {
      var a = "Warning: " + i;
      typeof console < "u" && console.error(a);
      try {
        throw new Error(a);
      } catch {
      }
    };
  }
  function o(i, a, s, l, u) {
    if (process.env.NODE_ENV !== "production") {
      for (var d in i)
        if (r(i, d)) {
          var p;
          try {
            if (typeof i[d] != "function") {
              var h = Error(
                (l || "React class") + ": " + s + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw h.name = "Invariant Violation", h;
            }
            p = i[d](a, d, l, s, null, t);
          } catch (v) {
            p = v;
          }
          if (p && !(p instanceof Error) && e(
            (l || "React class") + ": type specification of " + s + " `" + d + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof p + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), p instanceof Error && !(p.message in n)) {
            n[p.message] = !0;
            var b = u ? u() : "";
            e(
              "Failed " + s + " type: " + p.message + (b != null ? b : "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, Gi = o, Gi;
}
var Ki, Tc;
function Bm() {
  if (Tc)
    return Ki;
  Tc = 1;
  var e = Bo.exports, t = Lm(), n = is(), r = Su(), o = Fm(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(s) {
    var l = "Warning: " + s;
    typeof console < "u" && console.error(l);
    try {
      throw new Error(l);
    } catch {
    }
  });
  function a() {
    return null;
  }
  return Ki = function(s, l) {
    var u = typeof Symbol == "function" && Symbol.iterator, d = "@@iterator";
    function p(P) {
      var D = P && (u && P[u] || P[d]);
      if (typeof D == "function")
        return D;
    }
    var h = "<<anonymous>>", b = {
      array: S("array"),
      bigint: S("bigint"),
      bool: S("boolean"),
      func: S("function"),
      number: S("number"),
      object: S("object"),
      string: S("string"),
      symbol: S("symbol"),
      any: y(),
      arrayOf: T,
      element: O(),
      elementType: C(),
      instanceOf: _,
      node: pe(),
      objectOf: ee,
      oneOf: F,
      oneOfType: J,
      shape: L,
      exact: j
    };
    function v(P, D) {
      return P === D ? P !== 0 || 1 / P === 1 / D : P !== P && D !== D;
    }
    function g(P, D) {
      this.message = P, this.data = D && typeof D == "object" ? D : {}, this.stack = "";
    }
    g.prototype = Error.prototype;
    function w(P) {
      if (process.env.NODE_ENV !== "production")
        var D = {}, V = 0;
      function k(le, K, ie, ne, me, se, Fe) {
        if (ne = ne || h, se = se || ie, Fe !== n) {
          if (l) {
            var B = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw B.name = "Invariant Violation", B;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var Qe = ne + ":" + ie;
            !D[Qe] && V < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + se + "` prop on `" + ne + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), D[Qe] = !0, V++);
          }
        }
        return K[ie] == null ? le ? K[ie] === null ? new g("The " + me + " `" + se + "` is marked as required " + ("in `" + ne + "`, but its value is `null`.")) : new g("The " + me + " `" + se + "` is marked as required in " + ("`" + ne + "`, but its value is `undefined`.")) : null : P(K, ie, ne, me, se);
      }
      var G = k.bind(null, !1);
      return G.isRequired = k.bind(null, !0), G;
    }
    function S(P) {
      function D(V, k, G, le, K, ie) {
        var ne = V[k], me = fe(ne);
        if (me !== P) {
          var se = Ee(ne);
          return new g(
            "Invalid " + le + " `" + K + "` of type " + ("`" + se + "` supplied to `" + G + "`, expected ") + ("`" + P + "`."),
            { expectedType: P }
          );
        }
        return null;
      }
      return w(D);
    }
    function y() {
      return w(a);
    }
    function T(P) {
      function D(V, k, G, le, K) {
        if (typeof P != "function")
          return new g("Property `" + K + "` of component `" + G + "` has invalid PropType notation inside arrayOf.");
        var ie = V[k];
        if (!Array.isArray(ie)) {
          var ne = fe(ie);
          return new g("Invalid " + le + " `" + K + "` of type " + ("`" + ne + "` supplied to `" + G + "`, expected an array."));
        }
        for (var me = 0; me < ie.length; me++) {
          var se = P(ie, me, G, le, K + "[" + me + "]", n);
          if (se instanceof Error)
            return se;
        }
        return null;
      }
      return w(D);
    }
    function O() {
      function P(D, V, k, G, le) {
        var K = D[V];
        if (!s(K)) {
          var ie = fe(K);
          return new g("Invalid " + G + " `" + le + "` of type " + ("`" + ie + "` supplied to `" + k + "`, expected a single ReactElement."));
        }
        return null;
      }
      return w(P);
    }
    function C() {
      function P(D, V, k, G, le) {
        var K = D[V];
        if (!e.isValidElementType(K)) {
          var ie = fe(K);
          return new g("Invalid " + G + " `" + le + "` of type " + ("`" + ie + "` supplied to `" + k + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return w(P);
    }
    function _(P) {
      function D(V, k, G, le, K) {
        if (!(V[k] instanceof P)) {
          var ie = P.name || h, ne = ze(V[k]);
          return new g("Invalid " + le + " `" + K + "` of type " + ("`" + ne + "` supplied to `" + G + "`, expected ") + ("instance of `" + ie + "`."));
        }
        return null;
      }
      return w(D);
    }
    function F(P) {
      if (!Array.isArray(P))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), a;
      function D(V, k, G, le, K) {
        for (var ie = V[k], ne = 0; ne < P.length; ne++)
          if (v(ie, P[ne]))
            return null;
        var me = JSON.stringify(P, function(Fe, B) {
          var Qe = Ee(B);
          return Qe === "symbol" ? String(B) : B;
        });
        return new g("Invalid " + le + " `" + K + "` of value `" + String(ie) + "` " + ("supplied to `" + G + "`, expected one of " + me + "."));
      }
      return w(D);
    }
    function ee(P) {
      function D(V, k, G, le, K) {
        if (typeof P != "function")
          return new g("Property `" + K + "` of component `" + G + "` has invalid PropType notation inside objectOf.");
        var ie = V[k], ne = fe(ie);
        if (ne !== "object")
          return new g("Invalid " + le + " `" + K + "` of type " + ("`" + ne + "` supplied to `" + G + "`, expected an object."));
        for (var me in ie)
          if (r(ie, me)) {
            var se = P(ie, me, G, le, K + "." + me, n);
            if (se instanceof Error)
              return se;
          }
        return null;
      }
      return w(D);
    }
    function J(P) {
      if (!Array.isArray(P))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), a;
      for (var D = 0; D < P.length; D++) {
        var V = P[D];
        if (typeof V != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + Le(V) + " at index " + D + "."
          ), a;
      }
      function k(G, le, K, ie, ne) {
        for (var me = [], se = 0; se < P.length; se++) {
          var Fe = P[se], B = Fe(G, le, K, ie, ne, n);
          if (B == null)
            return null;
          B.data && r(B.data, "expectedType") && me.push(B.data.expectedType);
        }
        var Qe = me.length > 0 ? ", expected one of type [" + me.join(", ") + "]" : "";
        return new g("Invalid " + ie + " `" + ne + "` supplied to " + ("`" + K + "`" + Qe + "."));
      }
      return w(k);
    }
    function pe() {
      function P(D, V, k, G, le) {
        return ae(D[V]) ? null : new g("Invalid " + G + " `" + le + "` supplied to " + ("`" + k + "`, expected a ReactNode."));
      }
      return w(P);
    }
    function H(P, D, V, k, G) {
      return new g(
        (P || "React class") + ": " + D + " type `" + V + "." + k + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + G + "`."
      );
    }
    function L(P) {
      function D(V, k, G, le, K) {
        var ie = V[k], ne = fe(ie);
        if (ne !== "object")
          return new g("Invalid " + le + " `" + K + "` of type `" + ne + "` " + ("supplied to `" + G + "`, expected `object`."));
        for (var me in P) {
          var se = P[me];
          if (typeof se != "function")
            return H(G, le, K, me, Ee(se));
          var Fe = se(ie, me, G, le, K + "." + me, n);
          if (Fe)
            return Fe;
        }
        return null;
      }
      return w(D);
    }
    function j(P) {
      function D(V, k, G, le, K) {
        var ie = V[k], ne = fe(ie);
        if (ne !== "object")
          return new g("Invalid " + le + " `" + K + "` of type `" + ne + "` " + ("supplied to `" + G + "`, expected `object`."));
        var me = t({}, V[k], P);
        for (var se in me) {
          var Fe = P[se];
          if (r(P, se) && typeof Fe != "function")
            return H(G, le, K, se, Ee(Fe));
          if (!Fe)
            return new g(
              "Invalid " + le + " `" + K + "` key `" + se + "` supplied to `" + G + "`.\nBad object: " + JSON.stringify(V[k], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(P), null, "  ")
            );
          var B = Fe(ie, se, G, le, K + "." + se, n);
          if (B)
            return B;
        }
        return null;
      }
      return w(D);
    }
    function ae(P) {
      switch (typeof P) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !P;
        case "object":
          if (Array.isArray(P))
            return P.every(ae);
          if (P === null || s(P))
            return !0;
          var D = p(P);
          if (D) {
            var V = D.call(P), k;
            if (D !== P.entries) {
              for (; !(k = V.next()).done; )
                if (!ae(k.value))
                  return !1;
            } else
              for (; !(k = V.next()).done; ) {
                var G = k.value;
                if (G && !ae(G[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function ge(P, D) {
      return P === "symbol" ? !0 : D ? D["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && D instanceof Symbol : !1;
    }
    function fe(P) {
      var D = typeof P;
      return Array.isArray(P) ? "array" : P instanceof RegExp ? "object" : ge(D, P) ? "symbol" : D;
    }
    function Ee(P) {
      if (typeof P > "u" || P === null)
        return "" + P;
      var D = fe(P);
      if (D === "object") {
        if (P instanceof Date)
          return "date";
        if (P instanceof RegExp)
          return "regexp";
      }
      return D;
    }
    function Le(P) {
      var D = Ee(P);
      switch (D) {
        case "array":
        case "object":
          return "an " + D;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + D;
        default:
          return D;
      }
    }
    function ze(P) {
      return !P.constructor || !P.constructor.name ? h : P.constructor.name;
    }
    return b.checkPropTypes = o, b.resetWarningCache = o.resetWarningCache, b.PropTypes = b, b;
  }, Ki;
}
var Xi, Cc;
function $m() {
  if (Cc)
    return Xi;
  Cc = 1;
  var e = is();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, Xi = function() {
    function r(a, s, l, u, d, p) {
      if (p !== e) {
        var h = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw h.name = "Invariant Violation", h;
      }
    }
    r.isRequired = r;
    function o() {
      return r;
    }
    var i = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: o,
      element: r,
      elementType: r,
      instanceOf: o,
      node: r,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: n,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, Xi;
}
if (process.env.NODE_ENV !== "production") {
  var Vm = Bo.exports, Um = !0;
  E.exports = Bm()(Vm.isElement, Um);
} else
  E.exports = $m()();
function zm(e) {
  return Object.assign(Object.assign({}, e), { utils: {
    resolveColorString: (t) => mu(t, e),
    resolveColorObject: (t) => hu(t, e)
  } });
}
var wa = { exports: {} };
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 800, i = 16, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", u = "[object AsyncFunction]", d = "[object Boolean]", p = "[object Date]", h = "[object Error]", b = "[object Function]", v = "[object GeneratorFunction]", g = "[object Map]", w = "[object Number]", S = "[object Null]", y = "[object Object]", T = "[object Proxy]", O = "[object RegExp]", C = "[object Set]", _ = "[object String]", F = "[object Undefined]", ee = "[object WeakMap]", J = "[object ArrayBuffer]", pe = "[object DataView]", H = "[object Float32Array]", L = "[object Float64Array]", j = "[object Int8Array]", ae = "[object Int16Array]", ge = "[object Int32Array]", fe = "[object Uint8Array]", Ee = "[object Uint8ClampedArray]", Le = "[object Uint16Array]", ze = "[object Uint32Array]", P = /[\\^$.*+?()[\]{}|]/g, D = /^\[object .+?Constructor\]$/, V = /^(?:0|[1-9]\d*)$/, k = {};
  k[H] = k[L] = k[j] = k[ae] = k[ge] = k[fe] = k[Ee] = k[Le] = k[ze] = !0, k[s] = k[l] = k[J] = k[d] = k[pe] = k[p] = k[h] = k[b] = k[g] = k[w] = k[y] = k[O] = k[C] = k[_] = k[ee] = !1;
  var G = typeof tn == "object" && tn && tn.Object === Object && tn, le = typeof self == "object" && self && self.Object === Object && self, K = G || le || Function("return this")(), ie = t && !t.nodeType && t, ne = ie && !0 && e && !e.nodeType && e, me = ne && ne.exports === ie, se = me && G.process, Fe = function() {
    try {
      var c = ne && ne.require && ne.require("util").types;
      return c || se && se.binding && se.binding("util");
    } catch {
    }
  }(), B = Fe && Fe.isTypedArray;
  function Qe(c, f, m) {
    switch (m.length) {
      case 0:
        return c.call(f);
      case 1:
        return c.call(f, m[0]);
      case 2:
        return c.call(f, m[0], m[1]);
      case 3:
        return c.call(f, m[0], m[1], m[2]);
    }
    return c.apply(f, m);
  }
  function kt(c, f) {
    for (var m = -1, I = Array(c); ++m < c; )
      I[m] = f(m);
    return I;
  }
  function yt(c) {
    return function(f) {
      return c(f);
    };
  }
  function Xt(c, f) {
    return c == null ? void 0 : c[f];
  }
  function Nn(c, f) {
    return function(m) {
      return c(f(m));
    };
  }
  var Pn = Array.prototype, Jt = Function.prototype, bt = Object.prototype, jt = K["__core-js_shared__"], ct = Jt.toString, Ve = bt.hasOwnProperty, un = function() {
    var c = /[^.]+$/.exec(jt && jt.keys && jt.keys.IE_PROTO || "");
    return c ? "Symbol(src)_1." + c : "";
  }(), Qt = bt.toString, An = ct.call(Object), Mt = RegExp(
    "^" + ct.call(Ve).replace(P, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), vt = me ? K.Buffer : void 0, Zt = K.Symbol, en = K.Uint8Array, Lt = vt ? vt.allocUnsafe : void 0, fn = Nn(Object.getPrototypeOf, Object), dn = Object.create, or = bt.propertyIsEnumerable, ir = Pn.splice, Xe = Zt ? Zt.toStringTag : void 0, xt = function() {
    try {
      var c = gn(Object, "defineProperty");
      return c({}, "", {}), c;
    } catch {
    }
  }(), ar = vt ? vt.isBuffer : void 0, Ft = Math.max, jn = Date.now, dt = gn(K, "Map"), nt = gn(Object, "create"), pn = function() {
    function c() {
    }
    return function(f) {
      if (!ot(f))
        return {};
      if (dn)
        return dn(f);
      c.prototype = f;
      var m = new c();
      return c.prototype = void 0, m;
    };
  }();
  function Ge(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function sr() {
    this.__data__ = nt ? nt(null) : {}, this.size = 0;
  }
  function Mn(c) {
    var f = this.has(c) && delete this.__data__[c];
    return this.size -= f ? 1 : 0, f;
  }
  function cr(c) {
    var f = this.__data__;
    if (nt) {
      var m = f[c];
      return m === r ? void 0 : m;
    }
    return Ve.call(f, c) ? f[c] : void 0;
  }
  function Ln(c) {
    var f = this.__data__;
    return nt ? f[c] !== void 0 : Ve.call(f, c);
  }
  function Fn(c, f) {
    var m = this.__data__;
    return this.size += this.has(c) ? 0 : 1, m[c] = nt && f === void 0 ? r : f, this;
  }
  Ge.prototype.clear = sr, Ge.prototype.delete = Mn, Ge.prototype.get = cr, Ge.prototype.has = Ln, Ge.prototype.set = Fn;
  function Ue(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function lr() {
    this.__data__ = [], this.size = 0;
  }
  function Bn(c) {
    var f = this.__data__, m = Ye(f, c);
    if (m < 0)
      return !1;
    var I = f.length - 1;
    return m == I ? f.pop() : ir.call(f, m, 1), --this.size, !0;
  }
  function ur(c) {
    var f = this.__data__, m = Ye(f, c);
    return m < 0 ? void 0 : f[m][1];
  }
  function fr(c) {
    return Ye(this.__data__, c) > -1;
  }
  function dr(c, f) {
    var m = this.__data__, I = Ye(m, c);
    return I < 0 ? (++this.size, m.push([c, f])) : m[I][1] = f, this;
  }
  Ue.prototype.clear = lr, Ue.prototype.delete = Bn, Ue.prototype.get = ur, Ue.prototype.has = fr, Ue.prototype.set = dr;
  function rt(c) {
    var f = -1, m = c == null ? 0 : c.length;
    for (this.clear(); ++f < m; ) {
      var I = c[f];
      this.set(I[0], I[1]);
    }
  }
  function x() {
    this.size = 0, this.__data__ = {
      hash: new Ge(),
      map: new (dt || Ue)(),
      string: new Ge()
    };
  }
  function A(c) {
    var f = $t(this, c).delete(c);
    return this.size -= f ? 1 : 0, f;
  }
  function $(c) {
    return $t(this, c).get(c);
  }
  function te(c) {
    return $t(this, c).has(c);
  }
  function Oe(c, f) {
    var m = $t(this, c), I = m.size;
    return m.set(c, f), this.size += m.size == I ? 0 : 1, this;
  }
  rt.prototype.clear = x, rt.prototype.delete = A, rt.prototype.get = $, rt.prototype.has = te, rt.prototype.set = Oe;
  function de(c) {
    var f = this.__data__ = new Ue(c);
    this.size = f.size;
  }
  function ve() {
    this.__data__ = new Ue(), this.size = 0;
  }
  function he(c) {
    var f = this.__data__, m = f.delete(c);
    return this.size = f.size, m;
  }
  function qe(c) {
    return this.__data__.get(c);
  }
  function Ae(c) {
    return this.__data__.has(c);
  }
  function Me(c, f) {
    var m = this.__data__;
    if (m instanceof Ue) {
      var I = m.__data__;
      if (!dt || I.length < n - 1)
        return I.push([c, f]), this.size = ++m.size, this;
      m = this.__data__ = new rt(I);
    }
    return m.set(c, f), this.size = m.size, this;
  }
  de.prototype.clear = ve, de.prototype.delete = he, de.prototype.get = qe, de.prototype.has = Ae, de.prototype.set = Me;
  function Ze(c, f) {
    var m = bn(c), I = !m && yn(c), W = !m && !I && yr(c), X = !m && !I && !W && vr(c), re = m || I || W || X, U = re ? kt(c.length, String) : [], oe = U.length;
    for (var je in c)
      (f || Ve.call(c, je)) && !(re && (je == "length" || W && (je == "offset" || je == "parent") || X && (je == "buffer" || je == "byteLength" || je == "byteOffset") || gr(je, oe))) && U.push(je);
    return U;
  }
  function it(c, f, m) {
    (m !== void 0 && !Vt(c[f], m) || m === void 0 && !(f in c)) && hn(c, f, m);
  }
  function $n(c, f, m) {
    var I = c[f];
    (!(Ve.call(c, f) && Vt(I, m)) || m === void 0 && !(f in c)) && hn(c, f, m);
  }
  function Ye(c, f) {
    for (var m = c.length; m--; )
      if (Vt(c[m][0], f))
        return m;
    return -1;
  }
  function hn(c, f, m) {
    f == "__proto__" && xt ? xt(c, f, {
      configurable: !0,
      enumerable: !0,
      value: m,
      writable: !0
    }) : c[f] = m;
  }
  var Zo = di();
  function Bt(c) {
    return c == null ? c === void 0 ? F : S : Xe && Xe in Object(c) ? pi(c) : xi(c);
  }
  function pr(c) {
    return Ot(c) && Bt(c) == s;
  }
  function ei(c) {
    if (!ot(c) || yi(c))
      return !1;
    var f = xn(c) ? Mt : D;
    return f.test(Si(c));
  }
  function ti(c) {
    return Ot(c) && br(c.length) && !!k[Bt(c)];
  }
  function ni(c) {
    if (!ot(c))
      return bi(c);
    var f = mr(c), m = [];
    for (var I in c)
      I == "constructor" && (f || !Ve.call(c, I)) || m.push(I);
    return m;
  }
  function hr(c, f, m, I, W) {
    c !== f && Zo(f, function(X, re) {
      if (W || (W = new de()), ot(X))
        ri(c, f, re, m, hr, I, W);
      else {
        var U = I ? I(mn(c, re), X, re + "", c, f, W) : void 0;
        U === void 0 && (U = X), it(c, re, U);
      }
    }, xr);
  }
  function ri(c, f, m, I, W, X, re) {
    var U = mn(c, m), oe = mn(f, m), je = re.get(oe);
    if (je) {
      it(c, m, je);
      return;
    }
    var Re = X ? X(U, oe, m + "", c, f, re) : void 0, Et = Re === void 0;
    if (Et) {
      var On = bn(oe), En = !On && yr(oe), Er = !On && !En && vr(oe);
      Re = oe, On || En || Er ? bn(U) ? Re = U : Ti(U) ? Re = li(U) : En ? (Et = !1, Re = ai(oe, !0)) : Er ? (Et = !1, Re = ci(oe, !0)) : Re = [] : Ci(oe) || yn(oe) ? (Re = U, yn(U) ? Re = Ii(U) : (!ot(U) || xn(U)) && (Re = hi(oe))) : Et = !1;
    }
    Et && (re.set(oe, Re), W(Re, oe, I, X, re), re.delete(oe)), it(c, m, Re);
  }
  function oi(c, f) {
    return Ei(Oi(c, f, Or), c + "");
  }
  var ii = xt ? function(c, f) {
    return xt(c, "toString", {
      configurable: !0,
      enumerable: !1,
      value: _i(f),
      writable: !0
    });
  } : Or;
  function ai(c, f) {
    if (f)
      return c.slice();
    var m = c.length, I = Lt ? Lt(m) : new c.constructor(m);
    return c.copy(I), I;
  }
  function si(c) {
    var f = new c.constructor(c.byteLength);
    return new en(f).set(new en(c)), f;
  }
  function ci(c, f) {
    var m = f ? si(c.buffer) : c.buffer;
    return new c.constructor(m, c.byteOffset, c.length);
  }
  function li(c, f) {
    var m = -1, I = c.length;
    for (f || (f = Array(I)); ++m < I; )
      f[m] = c[m];
    return f;
  }
  function ui(c, f, m, I) {
    var W = !m;
    m || (m = {});
    for (var X = -1, re = f.length; ++X < re; ) {
      var U = f[X], oe = I ? I(m[U], c[U], U, m, c) : void 0;
      oe === void 0 && (oe = c[U]), W ? hn(m, U, oe) : $n(m, U, oe);
    }
    return m;
  }
  function fi(c) {
    return oi(function(f, m) {
      var I = -1, W = m.length, X = W > 1 ? m[W - 1] : void 0, re = W > 2 ? m[2] : void 0;
      for (X = c.length > 3 && typeof X == "function" ? (W--, X) : void 0, re && gi(m[0], m[1], re) && (X = W < 3 ? void 0 : X, W = 1), f = Object(f); ++I < W; ) {
        var U = m[I];
        U && c(f, U, I, X);
      }
      return f;
    });
  }
  function di(c) {
    return function(f, m, I) {
      for (var W = -1, X = Object(f), re = I(f), U = re.length; U--; ) {
        var oe = re[c ? U : ++W];
        if (m(X[oe], oe, X) === !1)
          break;
      }
      return f;
    };
  }
  function $t(c, f) {
    var m = c.__data__;
    return mi(f) ? m[typeof f == "string" ? "string" : "hash"] : m.map;
  }
  function gn(c, f) {
    var m = Xt(c, f);
    return ei(m) ? m : void 0;
  }
  function pi(c) {
    var f = Ve.call(c, Xe), m = c[Xe];
    try {
      c[Xe] = void 0;
      var I = !0;
    } catch {
    }
    var W = Qt.call(c);
    return I && (f ? c[Xe] = m : delete c[Xe]), W;
  }
  function hi(c) {
    return typeof c.constructor == "function" && !mr(c) ? pn(fn(c)) : {};
  }
  function gr(c, f) {
    var m = typeof c;
    return f = f == null ? a : f, !!f && (m == "number" || m != "symbol" && V.test(c)) && c > -1 && c % 1 == 0 && c < f;
  }
  function gi(c, f, m) {
    if (!ot(m))
      return !1;
    var I = typeof f;
    return (I == "number" ? vn(m) && gr(f, m.length) : I == "string" && f in m) ? Vt(m[f], c) : !1;
  }
  function mi(c) {
    var f = typeof c;
    return f == "string" || f == "number" || f == "symbol" || f == "boolean" ? c !== "__proto__" : c === null;
  }
  function yi(c) {
    return !!un && un in c;
  }
  function mr(c) {
    var f = c && c.constructor, m = typeof f == "function" && f.prototype || bt;
    return c === m;
  }
  function bi(c) {
    var f = [];
    if (c != null)
      for (var m in Object(c))
        f.push(m);
    return f;
  }
  function xi(c) {
    return Qt.call(c);
  }
  function Oi(c, f, m) {
    return f = Ft(f === void 0 ? c.length - 1 : f, 0), function() {
      for (var I = arguments, W = -1, X = Ft(I.length - f, 0), re = Array(X); ++W < X; )
        re[W] = I[f + W];
      W = -1;
      for (var U = Array(f + 1); ++W < f; )
        U[W] = I[W];
      return U[f] = m(re), Qe(c, this, U);
    };
  }
  function mn(c, f) {
    if (!(f === "constructor" && typeof c[f] == "function") && f != "__proto__")
      return c[f];
  }
  var Ei = wi(ii);
  function wi(c) {
    var f = 0, m = 0;
    return function() {
      var I = jn(), W = i - (I - m);
      if (m = I, W > 0) {
        if (++f >= o)
          return arguments[0];
      } else
        f = 0;
      return c.apply(void 0, arguments);
    };
  }
  function Si(c) {
    if (c != null) {
      try {
        return ct.call(c);
      } catch {
      }
      try {
        return c + "";
      } catch {
      }
    }
    return "";
  }
  function Vt(c, f) {
    return c === f || c !== c && f !== f;
  }
  var yn = pr(function() {
    return arguments;
  }()) ? pr : function(c) {
    return Ot(c) && Ve.call(c, "callee") && !or.call(c, "callee");
  }, bn = Array.isArray;
  function vn(c) {
    return c != null && br(c.length) && !xn(c);
  }
  function Ti(c) {
    return Ot(c) && vn(c);
  }
  var yr = ar || Di;
  function xn(c) {
    if (!ot(c))
      return !1;
    var f = Bt(c);
    return f == b || f == v || f == u || f == T;
  }
  function br(c) {
    return typeof c == "number" && c > -1 && c % 1 == 0 && c <= a;
  }
  function ot(c) {
    var f = typeof c;
    return c != null && (f == "object" || f == "function");
  }
  function Ot(c) {
    return c != null && typeof c == "object";
  }
  function Ci(c) {
    if (!Ot(c) || Bt(c) != y)
      return !1;
    var f = fn(c);
    if (f === null)
      return !0;
    var m = Ve.call(f, "constructor") && f.constructor;
    return typeof m == "function" && m instanceof m && ct.call(m) == An;
  }
  var vr = B ? yt(B) : ti;
  function Ii(c) {
    return ui(c, xr(c));
  }
  function xr(c) {
    return vn(c) ? Ze(c, !0) : ni(c);
  }
  var ki = fi(function(c, f, m, I) {
    hr(c, f, m, I);
  });
  function _i(c) {
    return function() {
      return c;
    };
  }
  function Or(c) {
    return c;
  }
  function Di() {
    return !1;
  }
  e.exports = ki;
})(wa, wa.exports);
const Hm = wa.exports;
function Wm(e, t) {
  if (Array.isArray(e))
    return [...e, ...t];
}
function qm(...e) {
  return Hm({}, ...e, Wm);
}
const Ym = {
  theme: E.exports.object
};
function Tu({ theme: e = {}, children: t }) {
  const n = zm(e);
  return M(cu.Provider, Object.assign({ value: n }, { children: Be(Xg, Object.assign({ theme: n }, { children: [t, M(Z, { id: "honorable-portal" })] })) }));
}
Tu.propTypes = Ym;
var Gm = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Ic = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
function Km(e) {
  return e.fontFamily ? e.fontFamily = `${e.fontFamily}, ${Ic}` : e.fontFamily = Ic, e;
}
const Xm = `
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
    ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
    ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the 'main' element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on 'h1' elements within 'section' and
 * 'article' contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
    ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd 'em' font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
    ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd 'em' font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent 'sub' and 'sup' elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
    ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
    ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from 'fieldset' elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    'fieldset' elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to 'inherit' in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
    ========================================================================== */

/*
  * Add the correct display in Edge, IE 10+, and Firefox.
  */

details {
  display: block;
}

/*
  * Add the correct display in all browsers.
  */

summary {
  display: list-item;
}

/* Misc
    ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
`;
function Jm() {
  const e = _e(), t = e.stylesheet || {}, { html: n } = t, r = Gm(t, ["html"]);
  return Be(mo, { children: [M(kr, { styles: yo`${Xm}` }), Array.isArray(n) && M(kr, { styles: {
    html: Km(Ur(Rt(n, {}, e), e))
  } }), Object.entries(r || {}).map(([o, i]) => Array.isArray(i) && M(kr, { styles: {
    [o]: Ur(Rt(i, {}, e), e)
  } }, o)), M(kr, { styles: yo`
          :root {
            ${Object.keys(e.colors || {}).map((o) => `	--color-${o}: ${e.utils.resolveColorString(o)};
`)}
          }
        ` })] });
}
Ct(null);
E.exports.node.isRequired, E.exports.any, E.exports.any;
function Pe(e, t, n) {
  return De(() => {
    var r;
    const o = Rt((r = n[e]) === null || r === void 0 ? void 0 : r.Root, t, n);
    return Ur(Ho(
      {},
      o,
      Rt(n.global, Object.assign(Object.assign({}, t), o), n)
    ), n);
  }, [e, t, n]);
}
function ce(e, t, n) {
  var r;
  const o = e.split("."), i = o.shift(), a = o.join("."), s = (r = n[i]) === null || r === void 0 ? void 0 : r[a];
  if (!s)
    return {};
  const l = Rt(s, t, n);
  return Ur(Ho(
    {},
    l,
    Rt(n.global, l, n),
    t[`${a}Props`] || {}
  ), n);
}
var Qm = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Zm = {
  rotation: E.exports.number
};
function ey(e, t) {
  const { rotation: n = 0 } = e, r = Qm(e, ["rotation"]), o = _e(), i = Object.assign(Object.assign({}, e), { rotation: n }), a = Pe("Caret", i, o);
  return M(jm, Object.assign({ ref: t, width: 15, viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", transition: "transform 150ms ease", transform: `rotate(${n}deg)` }, a, r, { children: M("path", { d: "M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) }));
}
const Zn = ke(ey);
Zn.displayName = "Caret";
Zn.propTypes = Zm;
var ty = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const ny = {
  expanded: E.exports.bool,
  defaultExpanded: E.exports.bool,
  onExpand: E.exports.func,
  title: E.exports.node,
  expandIcon: E.exports.node
};
function ry(e, t) {
  const { expanded: n, defaultExpanded: r, onExpand: o, expandIcon: i, title: a, children: s } = e, l = ty(e, ["expanded", "defaultExpanded", "onExpand", "expandIcon", "title", "children"]), u = _e(), d = $e(), [p, h] = ye("auto"), [b, v] = ye(r != null ? r : !1), g = n != null ? n : b, w = Object.assign(Object.assign({}, e), { expanded: g }), S = Pe("Accordion", w, u), y = Ne(() => {
    v(!g), typeof o == "function" && o(!g);
  }, [g, o]), T = Ne((O) => {
    (O.key === "Enter" || O.key === " ") && (O.preventDefault(), y());
  }, [y]);
  return we(() => {
    h(d.current.offsetHeight);
  }, [s]), Be(Z, Object.assign({ ref: t }, S, l, { children: [Be(Z, Object.assign({ tabIndex: 0, display: "flex", alignItems: "center", cursor: "pointer" }, ce("Accordion.Title", w, u), { onClick: y, onKeyDown: T }, { children: [a, M(Z, { flexGrow: 1 }), M(Z, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center" }, ce("Accordion.ExpandIcon", w, u), { children: i || M(Zn, {}) }))] })), M(Z, Object.assign({ height: g ? p : 0 }, ce("Accordion.ChildrenWrapper", w, u), { children: M(Z, Object.assign({ ref: d }, ce("Accordion.Children", w, u), { children: s })) }))] }));
}
const Cu = ke(ry);
Cu.displayName = "Accordion";
Cu.propTypes = ny;
function oy(e) {
  const [t, n] = ye(!1), [r, o] = ye(!1);
  return Rn(() => {
    if (!e)
      return;
    const i = document.createElement("img");
    i.onload = () => {
      n(!0);
    }, i.onerror = () => {
      n(!0), o(!0);
    }, i.src = e;
  }, [e]), [t, r];
}
var iy = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const ay = {
  size: E.exports.number,
  src: E.exports.string,
  name: E.exports.string
};
function kc(e, t = 95, n = 60) {
  let r = 0;
  for (let i = 0; i < e.length; i++)
    r = e.charCodeAt(i) + ((r << 5) - r);
  return `hsl(${r % 360}, ${t}%, ${n}%)`;
}
function sy(e) {
  return e.split(" ").map((n) => n[0]).filter((n, r, o) => r === 0 || r === o.length - 1).join("").toUpperCase();
}
function cy(e) {
  return M("svg", Object.assign({ width: 16, viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, e, { children: M("path", { d: "M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) }));
}
function ly(e, t) {
  const { size: n = 40, src: r, name: o } = e, i = iy(e, ["size", "src", "name"]), a = _e(), [s, l] = oy(r), u = Pe("Avatar", e, a);
  return r && s && !l ? M(Pm, Object.assign({ ref: t, src: r, alt: o || "Avatar", width: n, height: n, objectFit: "cover", flexShrink: 0, backgroundColor: o ? `${kc(o)} !important` : null }, u, i)) : M(Z, Object.assign({ ref: t, display: "flex", alignItems: "center", justifyContent: "center", width: n, height: n, flexShrink: 0, backgroundColor: o ? `${kc(o)}` : null, userSelect: "none" }, u, i, { children: o ? sy(o) : M(cy, { width: n * 3 / 5 }) }));
}
const Iu = ke(ly);
Iu.displayName = "Avatar";
Iu.propTypes = ay;
const uy = {};
function fy(e, t) {
  const n = _e(), r = Pe("Box", e, n);
  return M(Z, Object.assign({ ref: t }, r, e));
}
const ku = ke(fy);
ku.displayName = "Box";
ku.propTypes = uy;
function _c(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
function Ht(e, t) {
  return De(() => e == null && t == null ? null : (n) => {
    _c(e, n), _c(t, n);
  }, [e, t]);
}
var dy = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const py = {
  size: E.exports.number,
  color: E.exports.string
};
function hy(e, t) {
  var { size: n, color: r } = e, o = dy(e, ["size", "color"]);
  const i = _e(), a = Pe("Spinner", Object.assign({ size: n, color: r }, o), i);
  return M(mt, Object.assign({ ref: t }, a, o));
}
const as = ke(hy);
as.displayName = "Spinner";
as.propTypes = py;
var gy = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const ss = {
  startIcon: E.exports.node,
  endIcon: E.exports.node,
  loading: E.exports.bool,
  loadingIndicator: E.exports.node,
  disabled: E.exports.bool
};
function my(e, t) {
  const { startIcon: n, endIcon: r, children: o, loading: i, loadingIndicator: a } = e, s = gy(e, ["startIcon", "endIcon", "children", "loading", "loadingIndicator"]), l = _e(), u = $e(), d = Ht(t, u), [p, h] = ye("auto"), b = Pe("Button", e, l);
  return we(() => {
    !u.current || h(u.current.offsetHeight);
  }, []), Be(Ou, Object.assign({ ref: d, display: "inline-flex", alignItems: "center", disabled: i, position: "relative" }, b, s, { children: [!!n && M(mt, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center", visibility: i ? "hidden" : "inherit" }, ce("Button.StartIcon", e, l), { children: n })), i && M(mt, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }, ce("Button.LoadingIndicator", e, l), { children: a || M(as, Object.assign({ size: typeof p == "number" ? p * 3 / 5 : 16 }, ce("Spinner", e, l))) })), M(mt, Object.assign({ visibility: i ? "hidden" : "inherit" }, ce("Button.Children", e, l), { children: o })), !!r && M(mt, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center", visibility: i ? "hidden" : "inherit" }, ce("Button.EndIcon", e, l), { children: r }))] }));
}
const er = ke(my);
er.displayName = "Button";
er.propTypes = ss;
var yy = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const by = {};
function vy(e, t) {
  const { direction: n = "row" } = e, r = yy(e, ["direction"]), o = _e(), i = Object.assign(Object.assign({}, e), { direction: n }), a = Pe("ButtonGroup", i, o);
  return M(Z, Object.assign({ ref: t, display: "inline-flex", flexDirection: n }, a, r));
}
const _u = ke(vy);
_u.displayName = "ButtonGroup";
_u.propTypes = by;
const xy = {};
function Oy(e, t) {
  const n = _e(), r = Pe("Card", e, n);
  return M(Z, Object.assign({ ref: t }, r, e));
}
const Du = ke(Oy);
Du.displayName = "Card";
Du.propTypes = xy;
function on(e, t) {
  return Object.assign(Object.assign({}, e), { target: Object.assign(Object.assign({}, e.target), t), currentTarget: Object.assign(Object.assign({}, e.currentTarget), t) });
}
var Ey = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const wy = {
  checked: E.exports.bool,
  defaultChecked: E.exports.bool,
  disabled: E.exports.bool,
  icon: E.exports.node,
  onChange: E.exports.func,
  labelPosition: E.exports.oneOf(["left", "right", "top", "bottom"])
}, Sy = M("svg", Object.assign({ width: "100%", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: M("path", { d: "M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) }));
function Ty(e, t) {
  var n;
  const { defaultChecked: r, checked: o, disabled: i = !1, icon: a = Sy, onChange: s, children: l, labelPosition: u = "right" } = e, d = Ey(e, ["defaultChecked", "checked", "disabled", "icon", "onChange", "children", "labelPosition"]), p = _e(), [h, b] = ye(r), v = (n = o != null ? o : h) !== null && n !== void 0 ? n : !1, g = Object.assign(Object.assign({}, e), {
    checked: v,
    disabled: i,
    icon: a,
    labelPosition: u
  }), w = Pe("Checkbox", g, p), S = u === "left" ? { justifyContent: "flex-start", flexDirection: "row-reverse" } : u === "top" ? { justifyContent: "flex-end", flexDirection: "column-reverse" } : u === "bottom" ? { justifyContent: "flex-start", flexDirection: "column" } : { justifyContent: "flex-start" };
  function y(O) {
    i || (typeof s == "function" && s(on(O, { checked: !v })), b(!v));
  }
  function T(O) {
    i || (O.code === "Enter" || O.code === "Space") && y(O);
  }
  return Be(Z, Object.assign({ ref: t, tabIndex: 0, display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }, S, w, d, { onClick: (O) => {
    y(O), typeof e.onClick == "function" && e.onClick(O);
  }, onKeyDown: (O) => {
    T(O), typeof e.onKeyDown == "function" && e.onKeyDown(O);
  } }, { children: [M(mt, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, ce("Checkbox.Control", g, p), { children: v && a })), !!l && M(Z, Object.assign({}, ce("Checkbox.Children", g, p), { children: l }))] }));
}
const Ru = ke(Ty);
Ru.displayName = "Checkbox";
Ru.propTypes = wy;
const cs = Ct([{}, () => {
}]);
function Nu(e) {
  const t = $e();
  return we(() => {
    t.current = e;
  }, [e]), t.current;
}
function ls(e) {
  we(() => {
    function t(n) {
      n.key === "Escape" && e(n);
    }
    return window.addEventListener("keydown", t), () => {
      window.removeEventListener("keydown", t);
    };
  }, [e]);
}
function Wo(e, t) {
  we(() => {
    function n(r) {
      e.current && !e.current.contains(r.target) && t(r);
    }
    return document.addEventListener("click", n), document.addEventListener("touchstart", n), () => {
      document.removeEventListener("click", n), document.removeEventListener("touchstart", n);
    };
  }, [t]);
}
function Cy(e, t) {
  const n = {}, r = {};
  for (const o in e)
    typeof t[o] > "u" ? r[o] = e[o] : n[o] = e[o];
  return [n, r];
}
function Pu(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), o, i;
  for (i = 0; i < r.length; i++)
    o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
function Sa(e, t) {
  return Sa = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, o) {
    return r.__proto__ = o, r;
  }, Sa(e, t);
}
function Iy(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, Sa(e, t);
}
const Dc = {
  disabled: !1
};
var ky = process.env.NODE_ENV !== "production" ? E.exports.oneOfType([E.exports.number, E.exports.shape({
  enter: E.exports.number,
  exit: E.exports.number,
  appear: E.exports.number
}).isRequired]) : null;
process.env.NODE_ENV !== "production" && E.exports.oneOfType([E.exports.string, E.exports.shape({
  enter: E.exports.string,
  exit: E.exports.string,
  active: E.exports.string
}), E.exports.shape({
  enter: E.exports.string,
  enterDone: E.exports.string,
  enterActive: E.exports.string,
  exit: E.exports.string,
  exitDone: E.exports.string,
  exitActive: E.exports.string
})]);
const Au = qn.createContext(null);
var _y = function(t) {
  return t.scrollTop;
}, _r = "unmounted", wn = "exited", Sn = "entering", Hn = "entered", Ta = "exiting", Yt = /* @__PURE__ */ function(e) {
  Iy(t, e);
  function t(r, o) {
    var i;
    i = e.call(this, r, o) || this;
    var a = o, s = a && !a.isMounting ? r.enter : r.appear, l;
    return i.appearStatus = null, r.in ? s ? (l = wn, i.appearStatus = Sn) : l = Hn : r.unmountOnExit || r.mountOnEnter ? l = _r : l = wn, i.state = {
      status: l
    }, i.nextCallback = null, i;
  }
  t.getDerivedStateFromProps = function(o, i) {
    var a = o.in;
    return a && i.status === _r ? {
      status: wn
    } : null;
  };
  var n = t.prototype;
  return n.componentDidMount = function() {
    this.updateStatus(!0, this.appearStatus);
  }, n.componentDidUpdate = function(o) {
    var i = null;
    if (o !== this.props) {
      var a = this.state.status;
      this.props.in ? a !== Sn && a !== Hn && (i = Sn) : (a === Sn || a === Hn) && (i = Ta);
    }
    this.updateStatus(!1, i);
  }, n.componentWillUnmount = function() {
    this.cancelNextCallback();
  }, n.getTimeouts = function() {
    var o = this.props.timeout, i, a, s;
    return i = a = s = o, o != null && typeof o != "number" && (i = o.exit, a = o.enter, s = o.appear !== void 0 ? o.appear : a), {
      exit: i,
      enter: a,
      appear: s
    };
  }, n.updateStatus = function(o, i) {
    if (o === void 0 && (o = !1), i !== null)
      if (this.cancelNextCallback(), i === Sn) {
        if (this.props.unmountOnExit || this.props.mountOnEnter) {
          var a = this.props.nodeRef ? this.props.nodeRef.current : Zr.findDOMNode(this);
          a && _y(a);
        }
        this.performEnter(o);
      } else
        this.performExit();
    else
      this.props.unmountOnExit && this.state.status === wn && this.setState({
        status: _r
      });
  }, n.performEnter = function(o) {
    var i = this, a = this.props.enter, s = this.context ? this.context.isMounting : o, l = this.props.nodeRef ? [s] : [Zr.findDOMNode(this), s], u = l[0], d = l[1], p = this.getTimeouts(), h = s ? p.appear : p.enter;
    if (!o && !a || Dc.disabled) {
      this.safeSetState({
        status: Hn
      }, function() {
        i.props.onEntered(u);
      });
      return;
    }
    this.props.onEnter(u, d), this.safeSetState({
      status: Sn
    }, function() {
      i.props.onEntering(u, d), i.onTransitionEnd(h, function() {
        i.safeSetState({
          status: Hn
        }, function() {
          i.props.onEntered(u, d);
        });
      });
    });
  }, n.performExit = function() {
    var o = this, i = this.props.exit, a = this.getTimeouts(), s = this.props.nodeRef ? void 0 : Zr.findDOMNode(this);
    if (!i || Dc.disabled) {
      this.safeSetState({
        status: wn
      }, function() {
        o.props.onExited(s);
      });
      return;
    }
    this.props.onExit(s), this.safeSetState({
      status: Ta
    }, function() {
      o.props.onExiting(s), o.onTransitionEnd(a.exit, function() {
        o.safeSetState({
          status: wn
        }, function() {
          o.props.onExited(s);
        });
      });
    });
  }, n.cancelNextCallback = function() {
    this.nextCallback !== null && (this.nextCallback.cancel(), this.nextCallback = null);
  }, n.safeSetState = function(o, i) {
    i = this.setNextCallback(i), this.setState(o, i);
  }, n.setNextCallback = function(o) {
    var i = this, a = !0;
    return this.nextCallback = function(s) {
      a && (a = !1, i.nextCallback = null, o(s));
    }, this.nextCallback.cancel = function() {
      a = !1;
    }, this.nextCallback;
  }, n.onTransitionEnd = function(o, i) {
    this.setNextCallback(i);
    var a = this.props.nodeRef ? this.props.nodeRef.current : Zr.findDOMNode(this), s = o == null && !this.props.addEndListener;
    if (!a || s) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var l = this.props.nodeRef ? [this.nextCallback] : [a, this.nextCallback], u = l[0], d = l[1];
      this.props.addEndListener(u, d);
    }
    o != null && setTimeout(this.nextCallback, o);
  }, n.render = function() {
    var o = this.state.status;
    if (o === _r)
      return null;
    var i = this.props, a = i.children;
    i.in, i.mountOnEnter, i.unmountOnExit, i.appear, i.enter, i.exit, i.timeout, i.addEndListener, i.onEnter, i.onEntering, i.onEntered, i.onExit, i.onExiting, i.onExited, i.nodeRef;
    var s = Pu(i, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return /* @__PURE__ */ q(Au.Provider, {
      value: null,
      children: typeof a == "function" ? a(o, s) : qn.cloneElement(qn.Children.only(a), s)
    });
  }, t;
}(qn.Component);
Yt.contextType = Au;
Yt.propTypes = process.env.NODE_ENV !== "production" ? {
  nodeRef: E.exports.shape({
    current: typeof Element > "u" ? E.exports.any : function(e, t, n, r, o, i) {
      var a = e[t];
      return E.exports.instanceOf(a && "ownerDocument" in a ? a.ownerDocument.defaultView.Element : Element)(e, t, n, r, o, i);
    }
  }),
  children: E.exports.oneOfType([E.exports.func.isRequired, E.exports.element.isRequired]).isRequired,
  in: E.exports.bool,
  mountOnEnter: E.exports.bool,
  unmountOnExit: E.exports.bool,
  appear: E.exports.bool,
  enter: E.exports.bool,
  exit: E.exports.bool,
  timeout: function(t) {
    var n = ky;
    t.addEndListener || (n = n.isRequired);
    for (var r = arguments.length, o = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
      o[i - 1] = arguments[i];
    return n.apply(void 0, [t].concat(o));
  },
  addEndListener: E.exports.func,
  onEnter: E.exports.func,
  onEntering: E.exports.func,
  onEntered: E.exports.func,
  onExit: E.exports.func,
  onExiting: E.exports.func,
  onExited: E.exports.func
} : {};
function zn() {
}
Yt.defaultProps = {
  in: !1,
  mountOnEnter: !1,
  unmountOnExit: !1,
  appear: !1,
  enter: !0,
  exit: !0,
  onEnter: zn,
  onEntering: zn,
  onEntered: zn,
  onExit: zn,
  onExiting: zn,
  onExited: zn
};
Yt.UNMOUNTED = _r;
Yt.EXITED = wn;
Yt.ENTERING = Sn;
Yt.ENTERED = Hn;
Yt.EXITING = Ta;
const bo = Yt, Ca = Ct([{}, () => {
}, {}, () => {
}]);
var ju = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Dy = {
  value: E.exports.any,
  itemIndex: E.exports.number,
  active: E.exports.bool,
  isSubMenuItem: E.exports.bool,
  fade: E.exports.bool,
  disabled: E.exports.bool,
  onClick: E.exports.func
};
function Rc(e) {
  const { isTop: t = !1, size: n = 0 } = e, r = ju(e, ["isTop", "size"]), [o, i] = ye(), [a, s] = ye(!0);
  return a ? M(Z, Object.assign({ width: 0, height: 0, borderLeft: `${n}px solid transparent`, borderBottom: t ? `${n}px solid transparent` : "none", borderTop: t ? "none" : `${n}px solid transparent`, cursor: "pointer", onMouseEnter: () => {
    i(setTimeout(() => {
      s(!1);
    }, 200));
  }, onMouseLeave: () => clearTimeout(o), zIndex: 100 }, r)) : null;
}
function Ry(e, t) {
  const { value: n, children: r, active: o, itemIndex: i, isSubMenuItem: a, fade: s, disabled: l, onClick: u } = e, d = ju(e, ["value", "children", "active", "itemIndex", "isSubMenuItem", "fade", "disabled", "onClick"]), p = _e(), h = $e(), b = Ht(t, h), [v, g, , w] = tt(Ca), [S, y] = tt(cs), [T, O] = ye({ active: !1, isSubMenuVisible: !1 }), [C, _] = ye(0), F = Pe("MenuItem", e, p), ee = De(() => {
    let H;
    return zt.forEach(r, (L) => {
      !H && (L == null ? void 0 : L.type) === _n && (H = L);
    }), H;
  }, [r]);
  we(() => {
    _(h.current.offsetHeight * 1.5);
  }, []), we(() => {
    o && v.active && h.current.focus();
  }, [o, v.active]), we(() => {
    S.value === n && S.renderedItem !== r && y((H) => Object.assign(Object.assign({}, H), { renderedItem: r }));
  }, [S, y, n, r]);
  function J(H) {
    H.preventDefault(), !(!(o && v.active) || v.locked) && (ee && H.key === "ArrowRight" ? v.isSubMenuVisible ? (g((L) => Object.assign(Object.assign({}, L), { active: !1 })), O((L) => Object.assign(Object.assign({}, L), { active: !0, activeItemIndex: 0, isSubMenuVisible: !0 }))) : (g((L) => Object.assign(Object.assign({}, L), { isSubMenuVisible: !0 })), O((L) => Object.assign(Object.assign({}, L), { active: !1, activeItemIndex: -1 }))) : a && H.key === "ArrowLeft" ? ee ? (O((L) => Object.assign(Object.assign({}, L), { active: !1, isSubMenuVisible: !1 })), v.isSubMenuVisible ? (h.current.focus(), g((L) => Object.assign(Object.assign({}, L), { active: !0, isSubMenuVisible: !1 }))) : (g((L) => Object.assign(Object.assign({}, L), { active: !1, activeItemIndex: -1 })), setTimeout(() => {
      w((L) => Object.assign(Object.assign({}, L), { active: !0, isSubMenuVisible: !1 }));
    }, 0))) : (g((L) => Object.assign(Object.assign({}, L), { active: !1, isSubMenuVisible: !1 })), setTimeout(() => {
      w((L) => Object.assign(Object.assign({}, L), { active: !0, isSubMenuVisible: !1 }));
    }, 0)) : H.key === "Enter" && pe(H));
  }
  function pe(H) {
    l || v.locked || (H.persist(), y((L) => Object.assign(Object.assign({}, L), {
      value: n,
      event: H,
      renderedItem: r
    })), g((L) => Object.assign(Object.assign({}, L), { shouldSyncWithParent: !0 })), O((L) => Object.assign(Object.assign({}, L), { active: !1, isSubMenuVisible: !1, activeItemIndex: -1 })), typeof u == "function" && u(H));
  }
  return Be(Z, Object.assign({ ref: b, position: "relative", tabIndex: i }, F, d, { onKeyDown: (H) => {
    J(H), typeof e.onKeyDown == "function" && e.onKeyDown(H);
  } }, { children: [Be(Z, Object.assign({ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none", onClick: pe, onMouseMove: () => {
    o && v.active && v.activeItemIndex === i || v.locked || (g((H) => Object.assign(Object.assign({}, H), { active: !0, activeItemIndex: i, isSubMenuVisible: !0 })), O((H) => Object.assign(Object.assign({}, H), { active: !1, activeItemIndex: -1, isSubMenuVisible: !1 })), w((H) => Object.assign(Object.assign({}, H), { active: !1 })), h.current.focus());
  } }, ce("MenuItem.Children", e, p), { children: [zt.map(r, (H) => (H == null ? void 0 : H.type) === _n ? null : H), ee && Be(mo, { children: [M(mt, { flexGrow: 1 }), M(Zn, Object.assign({ marginLeft: 8, marginRight: -8, rotation: -90 }, ce("MenuItem.Caret", e, p)))] })] })), o && ee && Be(mo, { children: [M(Rc, { isTop: !0, size: C, position: "absolute", top: -C, right: 0 }), At(ee, Object.assign({ fade: s, isSubMenu: !0, menuState: T, setMenuState: O, position: "absolute", top: 0, left: "100%", display: v.isSubMenuVisible ? "block" : "none" }, ee.props)), M(Rc, { size: C, position: "absolute", bottom: -C, right: 0 })] })] }));
}
const _t = ke(Ry);
_t.displayName = "MenuItem";
_t.propTypes = Dy;
var Ny = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Py = {
  menuState: E.exports.object,
  setMenuState: E.exports.func,
  isSubMenu: E.exports.bool,
  fade: E.exports.bool,
  open: E.exports.bool,
  transtionDuration: E.exports.number
}, Ay = {
  activeItemIndex: -1,
  defaultActiveItemIndex: -1,
  active: !1,
  isSubMenuVisible: !1,
  shouldFocus: !1,
  shouldSyncWithParent: !1,
  locked: !1
};
function jy(e) {
  return Object.assign(Object.assign({}, Ay), e);
}
function My(e, t) {
  const { menuState: n, setMenuState: r, fade: o, open: i, isSubMenu: a, transtionDuration: s = 300, children: l } = e, u = Ny(e, ["menuState", "setMenuState", "fade", "open", "isSubMenu", "transtionDuration", "children"]), d = _e(), p = $e(), h = Ht(t, p), [b, v] = ye({}), [g, w] = tt(Ca), S = De(() => jy(n != null ? n : b), [n, b]), y = De(() => r != null ? r : v, [r, v]), T = De(() => [S, y, g, w], [S, y, g, w]), O = S.defaultActiveItemIndex > -1 && S.activeItemIndex === -1 ? S.defaultActiveItemIndex : S.activeItemIndex, C = i != null ? i : !0, [_, F] = ye(C), ee = Object.assign(Object.assign({}, e), S), J = Pe("Menu", ee, d);
  Wo(p, () => {
    y((j) => Object.assign(Object.assign({}, j), { activeItemIndex: -1, isSubMenuVisible: !1 }));
  }), we(() => {
    !p.current || S.shouldFocus && (p.current.focus(), y((j) => Object.assign(Object.assign({}, j), { active: !0, shouldFocus: !1 })));
  }, [S.shouldFocus, y]), we(() => {
    S.shouldSyncWithParent && (w((j) => Object.assign(Object.assign({}, j), { shouldSyncWithParent: !0 })), y((j) => Object.assign(Object.assign({}, j), { active: !1, activeItemIndex: -1, shouldSyncWithParent: !1 })));
  }, [S.shouldSyncWithParent, y, w]), we(() => {
    C ? (y((j) => Object.assign(Object.assign({}, j), { active: !0 })), F(!0)) : (y((j) => Object.assign(Object.assign({}, j), { activeItemIndex: -1, isSubMenuVisible: !1 })), o ? setTimeout(() => {
      F(!1);
    }, s) : F(!1));
  }, [C, o, s, y]);
  function pe(j) {
    if (j.preventDefault(), !(!S.active || S.locked))
      switch (j.key) {
        case "ArrowUp": {
          const ae = Math.max(0, O - 1);
          O !== ae && y((ge) => Object.assign(Object.assign({}, ge), { activeItemIndex: ae, isSubMenuVisible: !0 }));
          break;
        }
        case "ArrowDown": {
          const ae = Math.min(zt.count(l) - 1, O + 1);
          O !== ae && y((ge) => Object.assign(Object.assign({}, ge), { activeItemIndex: ae, isSubMenuVisible: !0 }));
          break;
        }
      }
  }
  function H() {
    y((j) => Object.assign(Object.assign({}, j), { active: !1, activeItemIndex: -1, isSubMenuVisible: !1 }));
  }
  function L(j) {
    if (!o)
      return j;
    const ae = {
      opacity: 0,
      transition: `opacity ${s}ms ease`
    }, ge = {
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0 }
    };
    return M(bo, Object.assign({ in: C, appear: !0, timeout: s, onEntered: () => y((fe) => Object.assign(Object.assign({}, fe), { locked: !1 })), onExit: () => y((fe) => Object.assign(Object.assign({}, fe), { locked: !0 })) }, { children: (fe) => At(j, Object.assign(Object.assign(Object.assign({}, j.props), ae), ge[fe])) }));
  }
  return C || _ ? M(Ca.Provider, Object.assign({ value: T }, { children: L(M(Z, Object.assign({ ref: h, tabIndex: 0, display: "inline-block" }, J, u, { onKeyDown: (j) => {
    pe(j), typeof e.onKeyDown == "function" && e.onKeyDown(j);
  }, onMouseLeave: (j) => {
    H(), typeof e.onMouseLeave == "function" && e.onMouseLeave(j);
  } }, { children: zt.map(l, (j, ae) => (j == null ? void 0 : j.type) === _t ? At(j, Object.assign({ fade: o, isSubMenuItem: a, itemIndex: ae, active: ae === O }, j.props)) : j) }))) })) : null;
}
const _n = ke(My);
_n.displayName = "Menu";
_n.propTypes = Py;
var Ly = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Fy = Object.assign(Object.assign({}, ss), { open: E.exports.bool, defaultOpen: E.exports.bool, label: E.exports.string, fade: E.exports.bool, endIcon: E.exports.node, onChange: E.exports.func, onOpen: E.exports.func });
function By(e, t) {
  var n;
  const [r, o] = Cy(e, ss), { open: i, defaultOpen: a, label: s, fade: l, endIcon: u, onChange: d, onOpen: p, children: h } = o, b = Ly(o, ["open", "defaultOpen", "label", "fade", "endIcon", "onChange", "onOpen", "children"]), v = _e(), g = $e(), w = Ht(t, g), [S, y] = ye(a), [T, O] = ye({}), [C, _] = ye({}), F = De(() => [C, _], [C, _]), { value: ee, event: J } = C, pe = Nu(J), H = (n = i != null ? i : S) !== null && n !== void 0 ? n : !1, L = Object.assign(Object.assign({}, e), { open: H }), j = Pe("DropdownButton", L, v), ae = Ne(() => {
    y(!0), O((Ee) => Object.assign(Object.assign({}, Ee), { shouldFocus: !0, isSubMenuVisible: !0, activeItemIndex: -1 })), typeof p == "function" && p(!0);
  }, [p]), ge = Ne(() => {
    y(!1), O((Ee) => Object.assign(Object.assign({}, Ee), { activeItemIndex: -1 })), typeof p == "function" && p(!1);
  }, [p]), fe = Ne(() => {
    H && ge();
  }, [H, ge]);
  return ls(ge), Wo(g, fe), we(() => {
    J && pe !== J && (typeof d == "function" && d(on(J, { value: ee })), ge());
  }, [pe, J, ee, d, ge]), Be(Z, Object.assign({ ref: w, position: "relative", display: "inline-block" }, j, b, { children: [M(er, Object.assign({ endIcon: u || M(Zn, { rotation: H ? 180 : 0 }) }, r, { onClick: (Ee) => {
    r.disabled || (H ? ge() : ae(), typeof r.onClick == "function" && r.onClick(Ee));
  } }, ce("DropdownButton.Button", L, v), { children: s })), M(cs.Provider, Object.assign({ value: F }, { children: M(_n, Object.assign({ fade: l, open: H, menuState: T, setMenuState: O, position: "absolute", top: "100%", right: 0, left: 0, zIndex: 100 }, ce("DropdownButton.Menu", L, v), { children: h })) }))] }));
}
const Mu = ke(By);
Mu.displayName = "DropdownButton";
Mu.propTypes = Fy;
var $y = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Vy = {
  direction: E.exports.oneOf(["row", "column"]),
  wrap: E.exports.oneOfType([E.exports.bool, E.exports.oneOf(["wrap", "nowrap", "wrap-reverse"])]),
  basis: E.exports.oneOfType([E.exports.string, E.exports.number]),
  grow: E.exports.oneOfType([E.exports.bool, E.exports.number]),
  shrink: E.exports.oneOfType([E.exports.bool, E.exports.number]),
  align: E.exports.oneOfType([E.exports.oneOf(["flex-start", "flex-end", "center", "baseline", "stretch"]), E.exports.string]),
  justify: E.exports.oneOfType([E.exports.oneOf(["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"]), E.exports.string])
};
function Uy(e, t) {
  const { direction: n, wrap: r, basis: o, grow: i, shrink: a, align: s, justify: l } = e, u = $y(e, ["direction", "wrap", "basis", "grow", "shrink", "align", "justify"]), d = _e(), p = Pe("Flex", e, d);
  return M(Z, Object.assign({ ref: t, display: "flex", flexDirection: n, flexWrap: typeof r == "boolean" ? "wrap" : r, flexBasis: o, flexGrow: typeof i == "boolean" ? 1 : i, flexShrink: typeof a == "boolean" ? 1 : a, alignItems: s, justifyContent: l }, p, u));
}
const us = ke(Uy);
us.displayName = "Flex";
us.propTypes = Vy;
const zy = {};
function Hy(e, t) {
  const n = _e(), r = Pe("Icon", e, n);
  return M(mt, Object.assign({ ref: t, display: "inline-flex", alignItems: "center", justifyContent: "center" }, r, e));
}
const Lu = ke(Hy);
Lu.displayName = "Icon";
Lu.propTypes = zy;
const Wy = {};
function qy(e, t) {
  const n = _e(), r = $e(), o = Ht(t, r), [i, a] = ye("auto"), s = Pe("IconButton", e, n);
  return we(() => {
    r.current && a(r.current.offsetWidth);
  }, [n]), M(Ou, Object.assign({ ref: o, height: i, display: "inline-flex", alignItem: "center", justifyContent: "center" }, s, e));
}
const Fu = ke(qy);
Fu.displayName = "IconButton";
Fu.propTypes = Wy;
var Yy = Rn, Gy = function(t) {
  var n = z.useRef(t);
  return Yy(function() {
    n.current = t;
  }), n;
}, Nc = function(t, n) {
  if (typeof t == "function") {
    t(n);
    return;
  }
  t.current = n;
}, Ky = function(t, n) {
  var r = $e();
  return Ne(function(o) {
    t.current = o, r.current && Nc(r.current, null), r.current = n, n && Nc(n, o);
  }, [n]);
}, Pc = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0"
}, Ac = function(t) {
  Object.keys(Pc).forEach(function(n) {
    t.style.setProperty(n, Pc[n], "important");
  });
}, lt = null, Xy = function(t, n) {
  var r = t.scrollHeight;
  return n.sizingStyle.boxSizing === "border-box" ? r + n.borderSize : r - n.paddingSize;
};
function Jy(e, t, n, r) {
  n === void 0 && (n = 1), r === void 0 && (r = 1 / 0), lt || (lt = document.createElement("textarea"), lt.setAttribute("tabindex", "-1"), lt.setAttribute("aria-hidden", "true"), Ac(lt)), lt.parentNode === null && document.body.appendChild(lt);
  var o = e.paddingSize, i = e.borderSize, a = e.sizingStyle, s = a.boxSizing;
  Object.keys(a).forEach(function(h) {
    var b = h;
    lt.style[b] = a[b];
  }), Ac(lt), lt.value = t;
  var l = Xy(lt, e);
  lt.value = "x";
  var u = lt.scrollHeight - o, d = u * n;
  s === "border-box" && (d = d + o + i), l = Math.max(d, l);
  var p = u * r;
  return s === "border-box" && (p = p + o + i), l = Math.min(p, l), [l, u];
}
var jc = function() {
}, Qy = function(t, n) {
  return t.reduce(function(r, o) {
    return r[o] = n[o], r;
  }, {});
}, Zy = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "tabSize",
  "textIndent",
  "textRendering",
  "textTransform",
  "width",
  "wordBreak"
], eb = !!document.documentElement.currentStyle, tb = function(t) {
  var n = window.getComputedStyle(t);
  if (n === null)
    return null;
  var r = Qy(Zy, n), o = r.boxSizing;
  if (o === "")
    return null;
  eb && o === "border-box" && (r.width = parseFloat(r.width) + parseFloat(r.borderRightWidth) + parseFloat(r.borderLeftWidth) + parseFloat(r.paddingRight) + parseFloat(r.paddingLeft) + "px");
  var i = parseFloat(r.paddingBottom) + parseFloat(r.paddingTop), a = parseFloat(r.borderBottomWidth) + parseFloat(r.borderTopWidth);
  return {
    sizingStyle: r,
    paddingSize: i,
    borderSize: a
  };
}, nb = function(t) {
  var n = Gy(t);
  Rn(function() {
    var r = function(i) {
      n.current(i);
    };
    return window.addEventListener("resize", r), function() {
      window.removeEventListener("resize", r);
    };
  }, []);
}, rb = function(t, n) {
  var r = t.cacheMeasurements, o = t.maxRows, i = t.minRows, a = t.onChange, s = a === void 0 ? jc : a, l = t.onHeightChange, u = l === void 0 ? jc : l, d = Pu(t, ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"]);
  if (process.env.NODE_ENV !== "production" && d.style) {
    if ("maxHeight" in d.style)
      throw new Error("Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.");
    if ("minHeight" in d.style)
      throw new Error("Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.");
  }
  var p = d.value !== void 0, h = $e(null), b = Ky(h, n), v = $e(0), g = $e(), w = function() {
    var T = h.current, O = r && g.current ? g.current : tb(T);
    if (!!O) {
      g.current = O;
      var C = Jy(O, T.value || T.placeholder || "x", i, o), _ = C[0], F = C[1];
      v.current !== _ && (v.current = _, T.style.setProperty("height", _ + "px", "important"), u(_, {
        rowHeight: F
      }));
    }
  }, S = function(T) {
    p || w(), s(T);
  };
  return Rn(w), nb(w), /* @__PURE__ */ Nt("textarea", $r({}, d, {
    onChange: S,
    ref: b
  }));
}, ob = /* @__PURE__ */ ke(rb);
const ib = ob;
var ab = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const sb = {
  type: E.exports.string,
  value: E.exports.oneOfType([E.exports.string, E.exports.number]),
  defaultValue: E.exports.oneOfType([E.exports.string, E.exports.number]),
  placeholder: E.exports.string,
  onChange: E.exports.func,
  onFocus: E.exports.func,
  onBlur: E.exports.func,
  onKeyDown: E.exports.func,
  onKeyUp: E.exports.func,
  onEnter: E.exports.func,
  startIcon: E.exports.node,
  endIcon: E.exports.node,
  disabled: E.exports.bool,
  autoFocus: E.exports.bool,
  multiline: E.exports.bool,
  minRows: E.exports.number,
  maxRows: E.exports.number,
  inputProps: E.exports.object
};
function cb(e, t) {
  const { type: n, value: r, defaultValue: o, placeholder: i, onChange: a, onFocus: s, onBlur: l, onKeyDown: u, onKeyUp: d, onEnter: p, startIcon: h, endIcon: b, disabled: v, autoFocus: g, multiline: w, minRows: S, maxRows: y, inputProps: T = {} } = e, O = ab(e, ["type", "value", "defaultValue", "placeholder", "onChange", "onFocus", "onBlur", "onKeyDown", "onKeyUp", "onEnter", "startIcon", "endIcon", "disabled", "autoFocus", "multiline", "minRows", "maxRows", "inputProps"]), C = _e(), [_, F] = ye(o != null ? o : ""), ee = r != null ? r : _, J = Object.assign(Object.assign({}, e), { value: ee }), pe = Pe("Input", J, C);
  function H(j) {
    F(j.target.value), typeof a == "function" && a(j);
  }
  function L(j) {
    j.key === "Enter" && typeof p == "function" && p(j);
  }
  return Be(Z, Object.assign({ ref: t, display: "inline-flex", justifyContent: "flex-start" }, pe, O, { children: [!!h && M(Z, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center" }, ce("Input.StartIcon", J, C), { children: h })), !w && M(Rm, Object.assign({ type: n, autoFocus: g, disabled: v, value: ee, onChange: H, placeholder: i, width: "100%" }, T, { onFocus: (j) => {
    typeof s == "function" && s(j);
  }, onBlur: (j) => {
    typeof l == "function" && l(j);
  }, onKeyDown: (j) => {
    L(j), typeof u == "function" && u(j);
  }, onKeyUp: d }, ce("Input.InputBase", J, C), { flexGrow: 1 })), w && M(ib, { autoFocus: g, disabled: v, value: ee, onChange: H, placeholder: i, onFocus: (j) => {
    typeof s == "function" && s(j);
  }, onBlur: (j) => {
    typeof l == "function" && l(j);
  }, onKeyDown: (j) => {
    L(j), typeof u == "function" && u(j);
  }, onKeyUp: d, minRows: S, maxRows: y, style: Object.assign({ flexGrow: 1, width: "100%" }, ce("Input.TextArea", J, C)) }), !!b && M(Z, Object.assign({ display: "flex", alignItems: "center", justifyContent: "center" }, ce("Input.EndIcon", J, C), { children: b }))] }));
}
const fs = ke(cb);
fs.displayName = "Input";
fs.propTypes = sb;
var lb = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const ub = {
  open: E.exports.bool,
  onClose: E.exports.func,
  fade: E.exports.bool,
  transitionDuration: E.exports.number,
  disableEscapeKey: E.exports.bool,
  portal: E.exports.bool
};
function fb(e, t) {
  const { open: n = !0, fade: r = !0, onClose: o, transitionDuration: i = 250, disableEscapeKey: a = !1, portal: s = !1 } = e, l = lb(e, ["open", "fade", "onClose", "transitionDuration", "disableEscapeKey", "portal"]), u = _e(), d = $e(), [p, h] = ye(n), [b, v] = ye(!1), g = Pe("Modal", e, u), w = De(() => document.createElement("div"), []);
  ls((_) => p && !b && !a && S(_));
  const S = Ne((_) => {
    typeof o == "function" && (r ? (v(!0), setTimeout(() => {
      v(!1), o(_);
    }, i)) : o(_));
  }, [r, i, o]);
  if (we(() => {
    h(r && n ? !0 : r && !n ? !1 : n);
  }, [r, n, i]), we(() => {
    const _ = document.getElementById("honorable-portal");
    if (s && _)
      return _.appendChild(w), () => {
        _.removeChild(w);
      };
  }, [s, w]), !(n || p || b))
    return null;
  function y(_) {
    _.target === d.current && S(_);
  }
  function T(_) {
    if (!r)
      return _;
    const F = Object.assign({ opacity: 0, transition: `opacity ${i}ms ease` }, ce("BackdropDefaultStyle", e, u)), ee = Object.assign({ entering: { opacity: 1 }, entered: { opacity: 1 }, exiting: { opacity: 0 }, exited: { opacity: 0 } }, ce("BackdropTransitionStyle", e, u));
    return M(bo, Object.assign({ in: p && !b, timeout: i }, { children: (J) => At(_, Object.assign(Object.assign(Object.assign({}, _.props), F), ee[J])) }));
  }
  function O(_) {
    return s ? yf(_, w) : _;
  }
  function C(_) {
    if (!r)
      return _;
    const F = Object.assign({ opacity: 0, transition: `opacity ${i}ms ease` }, ce("InnerDefaultStyle", e, u)), ee = Object.assign({ entering: { opacity: 1 }, entered: { opacity: 1 }, exiting: { opacity: 0 }, exited: { opacity: 0 } }, ce("InnerTransitionStyle", e, u));
    return M(bo, Object.assign({ in: p && !b, timeout: i }, { children: (J) => At(_, Object.assign(Object.assign(Object.assign({}, _.props), F), ee[J])) }));
  }
  return O(T(M(Z, Object.assign({ ref: d, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "fixed", top: "0", left: "0", right: "0", bottom: "0", zIndex: "1000", backgroundColor: "rgba(0, 0, 0, 0.5)", onClick: y }, ce("Modal.Backdrop", e, u), { children: C(M(Z, Object.assign({ ref: t, backgroundColor: "background", overflowY: "auto", margin: 32 }, g, l))) }))));
}
const Bu = ke(fb);
Bu.displayName = "Modal";
Bu.propTypes = ub;
var db = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const pb = {};
function hb(e, t) {
  const { value: n } = e, r = db(e, ["value"]), o = _e(), i = Pe("ProgressBar", e, o);
  return M(Z, Object.assign({ ref: t, display: "flex", justifyContent: "flex-start", height: 8 }, i, r, { children: M(Z, Object.assign({ backgroundColor: "black", width: `max(0%, min(100%, calc(${n} * 100%)))` }, ce("ProgressBar.Bar", e, o))) }));
}
const $u = ke(hb);
$u.displayName = "ProgressBar";
$u.propTypes = pb;
var gb = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const mb = {
  value: E.exports.any,
  checked: E.exports.bool,
  defaultChecked: E.exports.bool,
  disabled: E.exports.bool,
  iconChecked: E.exports.node,
  iconUnchecked: E.exports.node,
  onChange: E.exports.func,
  labelPosition: E.exports.oneOf(["left", "right", "top", "bottom"])
}, yb = M("svg", Object.assign({ width: "100%", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: M("path", { d: "M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }) })), bb = Be("svg", Object.assign({ width: "100%", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [M("path", { d: "M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 11.1575 3.84216 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1575 0.877045 7.49985 0.877045ZM1.82701 7.49988C1.82701 4.36686 4.36683 1.82704 7.49985 1.82704C10.6328 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6328 13.1727 7.49985 13.1727C4.36683 13.1727 1.82701 10.6329 1.82701 7.49988ZM7.49999 9.49999C8.60456 9.49999 9.49999 8.60456 9.49999 7.49999C9.49999 6.39542 8.60456 5.49999 7.49999 5.49999C6.39542 5.49999 5.49999 6.39542 5.49999 7.49999C5.49999 8.60456 6.39542 9.49999 7.49999 9.49999Z", fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd" }), M("circle", { cx: "7.5", cy: "7.5", r: "3", fill: "currentColor" })] }));
function vb(e, t) {
  var n;
  const { value: r, defaultChecked: o, checked: i, disabled: a = !1, iconUnchecked: s = yb, iconChecked: l = bb, onChange: u, children: d, labelPosition: p = "right" } = e, h = gb(e, ["value", "defaultChecked", "checked", "disabled", "iconUnchecked", "iconChecked", "onChange", "children", "labelPosition"]), b = _e(), [v, g] = ye(o), w = (n = i != null ? i : v) !== null && n !== void 0 ? n : !1, S = Object.assign(Object.assign({}, e), {
    checked: w,
    disabled: a,
    iconChecked: l,
    iconUnchecked: s,
    labelPosition: p
  }), y = Pe("Radio", S, b), T = p === "left" ? { justifyContent: "flex-start", flexDirection: "row-reverse" } : p === "top" ? { justifyContent: "flex-end", flexDirection: "column-reverse" } : p === "bottom" ? { justifyContent: "flex-start", flexDirection: "column" } : { justifyContent: "flex-start" };
  function O(_) {
    a || (typeof u == "function" && u(on(_, { checked: !w, value: r })), g(!w));
  }
  function C(_) {
    a || (_.code === "Enter" || _.code === "Space") && O(_);
  }
  return Be(Z, Object.assign({ ref: t, tabIndex: 0, display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }, T, y, h, { onClick: (_) => {
    O(_), typeof e.onClick == "function" && e.onClick(_);
  }, onKeyDown: (_) => {
    C(_), typeof e.onKeyDown == "function" && e.onKeyDown(_);
  } }, { children: [M(mt, Object.assign({ display: "inline-flex", alignItems: "center", justifyContent: "center" }, ce("Radio.Control", S, b), { children: w ? l : s })), !!d && M(Z, Object.assign({}, ce("Radio.Children", S, b), { children: d }))] }));
}
const vo = ke(vb);
vo.displayName = "Radio";
vo.propTypes = mb;
var xb = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Ob = {
  value: E.exports.any,
  defaultValue: E.exports.any,
  onChange: E.exports.func,
  row: E.exports.bool
};
function Eb(e, t) {
  var n;
  const { value: r, defaultValue: o, onChange: i, row: a = !1, children: s } = e, l = xb(e, ["value", "defaultValue", "onChange", "row", "children"]), u = _e(), [d, p] = ye(o), h = (n = r != null ? r : d) !== null && n !== void 0 ? n : !1, b = Object.assign(Object.assign({}, e), { value: h, row: a }), v = Pe("RadioGroup", b, u), g = De(() => {
    const y = [];
    return zt.forEach(s, (T) => {
      (T == null ? void 0 : T.type) === vo && !T.props.disabled && y.push(T.props.value);
    }), y;
  }, [s]);
  function w(y) {
    typeof i == "function" && i(y), p(y.target.value);
  }
  function S(y) {
    var T, O;
    if (!a && y.code === "ArrowDown" || a && y.code === "ArrowRight") {
      const C = g.findIndex((F) => F === h), _ = (T = g[C + 1]) !== null && T !== void 0 ? T : g[0];
      w(on(y, { value: _ }));
    }
    if (!a && y.code === "ArrowUp" || a && y.code === "ArrowLeft") {
      const C = g.findIndex((F) => F === h), _ = (O = g[C - 1]) !== null && O !== void 0 ? O : g[g.length - 1];
      w(on(y, { value: _ }));
    }
  }
  return M(us, Object.assign({ ref: t, direction: a ? "row" : "column", tabIndex: 0 }, v, l, { onKeyDown: (y) => {
    S(y), typeof e.onKeyDown == "function" && e.onKeyDown(y);
  } }, { children: zt.map(s, (y) => (y == null ? void 0 : y.type) === vo ? M(Z, Object.assign({}, ce("RadioGroup.Radio", e, u), { children: At(y, Object.assign(Object.assign({}, y.props), { checked: y.props.value === h, onChange: w })) })) : y) }));
}
const Vu = ke(Eb);
Vu.displayName = "RadioGroup";
Vu.propTypes = Ob;
function wb(e) {
  const t = $e(e);
  return we(() => {
    t.current = e;
  }, [e]), t.current;
}
var Sb = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const Tb = {
  open: E.exports.bool,
  defaultOpen: E.exports.bool,
  value: E.exports.any,
  onChange: E.exports.func,
  onOpen: E.exports.func,
  fade: E.exports.bool,
  renderSelected: E.exports.func,
  startIcon: E.exports.element,
  endIcon: E.exports.oneOfType([E.exports.element, E.exports.bool])
};
function Cb(e, t) {
  var n;
  const { open: r, defaultOpen: o, value: i, onChange: a, onOpen: s, fade: l, onClick: u, children: d, renderSelected: p, startIcon: h = null, endIcon: b = null } = e, v = Sb(e, ["open", "defaultOpen", "value", "onChange", "onOpen", "fade", "onClick", "children", "renderSelected", "startIcon", "endIcon"]), g = _e(), w = $e(), S = Ht(t, w), [y, T] = ye((n = r != null ? r : o) !== null && n !== void 0 ? n : !1), [O, C] = ye({}), [_, F] = ye({ value: i }), ee = De(() => [_, F], [_, F]), { value: J, renderedItem: pe, event: H } = _, L = Nu(H), j = wb(r), ae = Object.assign(Object.assign({}, e), { open: y }), ge = Pe("Select", ae, g), fe = Ne((D) => {
    T(D), typeof s == "function" && s(D);
  }, [s]), Ee = Ne(() => {
    y && fe(!1);
  }, [fe, y]);
  ls(Ee), Wo(w, Ee), we(() => {
    typeof r > "u" || j === r || fe(r);
  }, [r, j, fe]), we(() => {
    i !== _.value && F((D) => Object.assign(Object.assign({}, D), { value: i, renderedItem: null }));
  }, [i, _.value]), we(() => {
    H && L !== H && typeof a == "function" && (a(on(H, { value: J })), fe(!1), C((D) => Object.assign(Object.assign({}, D), { activeItemIndex: -1 })));
  }, [L, H, J, a, fe]);
  function Le() {
    if (!pe)
      return "\xA0";
    if (typeof p == "function")
      return p(J);
    const D = [];
    return zt.forEach(pe, (V) => {
      (V == null ? void 0 : V.type) !== _n && D.push(V);
    }), D;
  }
  function ze() {
    return h ? M(mt, Object.assign({ paddingLeft: 4, paddingRight: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", userSelect: "none" }, ce("Select.StartIcon", e, g), { children: h })) : null;
  }
  function P() {
    return b === !1 ? null : M(mt, Object.assign({ padding: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", userSelect: "none" }, ce("Select.EndIcon", e, g), { children: b || M(Zn, { rotation: y ? 180 : 0 }) }));
  }
  return Be(Z, Object.assign({ ref: S, minWidth: 128 + 32 + 8 + 2, position: "relative" }, ge, v, { children: [Be(Z, Object.assign({ display: "flex", alignItems: "center", height: "100%", onClick: (D) => {
    fe(!y), C((V) => Object.assign(Object.assign({}, V), { shouldFocus: !0 })), typeof u == "function" && u(D);
  } }, ce("Select.Selected", e, g), { children: [ze(), M(Z, Object.assign({ flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, { children: Le() })), P()] })), M(cs.Provider, Object.assign({ value: ee }, { children: M(_n, Object.assign({ fade: l, menuState: O, setMenuState: C, position: "absolute", top: "100%", right: -1, left: -1, zIndex: 100, display: y ? "block" : "none" }, ce("Select.Menu", e, g), { children: d })) }))] }));
}
const xo = ke(Cb);
xo.displayName = "Select";
xo.propTypes = Tb;
var Ib = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const kb = {
  animation: E.exports.oneOfType([
    E.exports.oneOf(["wave"]),
    E.exports.bool
  ])
}, _b = os`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`, Db = os`
  0% {
    transform: translateX(-100%);
  }
  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;
function Rb(e, t) {
  const { children: n, animation: r = !0 } = e, o = Ib(e, ["children", "animation"]), i = _e(), a = Pe("Skeleton", e, i);
  let s = {};
  return r === "wave" ? s = {
    webkitMaskImage: "-webkit-radial-gradient(white, black)",
    "&::after": {
      animation: `${Db} 1.6s linear 0.5s infinite`,
      background: `linear-gradient(90deg, transparent, ${i.utils.resolveColorString(i.mode === "light" ? "transparency(white, 66)" : "lighten(background-light, 5)")}, transparent)`,
      content: '""',
      position: "absolute",
      transform: "translateX(-100%)",
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    }
  } : r && (s = {
    animation: `${_b} 1.5s ease-in-out 0.5s infinite`
  }), Be(Z, Object.assign({ ref: t, position: "relative", width: n ? void 0 : "100%" }, a, o, { children: [M(Z, Object.assign({ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, css: yo(s) }, ce("Skeleton.Inner", e, i))), M(Z, Object.assign({ visibility: "hidden" }, ce("Skeleton.Children", e, i), { children: n }))] }));
}
const Uu = ke(Rb);
Uu.displayName = "Skeleton";
Uu.propTypes = kb;
function qo(e) {
  return e.split("-")[0];
}
function ds(e) {
  return e.split("-")[1];
}
function Yo(e) {
  return ["top", "bottom"].includes(qo(e)) ? "x" : "y";
}
function zu(e) {
  return e === "y" ? "height" : "width";
}
function Mc(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const i = r.x + r.width / 2 - o.width / 2, a = r.y + r.height / 2 - o.height / 2, s = Yo(t), l = zu(s), u = r[l] / 2 - o[l] / 2, d = qo(t), p = s === "x";
  let h;
  switch (d) {
    case "top":
      h = {
        x: i,
        y: r.y - o.height
      };
      break;
    case "bottom":
      h = {
        x: i,
        y: r.y + r.height
      };
      break;
    case "right":
      h = {
        x: r.x + r.width,
        y: a
      };
      break;
    case "left":
      h = {
        x: r.x - o.width,
        y: a
      };
      break;
    default:
      h = {
        x: r.x,
        y: r.y
      };
  }
  switch (ds(t)) {
    case "start":
      h[s] -= u * (n && p ? -1 : 1);
      break;
    case "end":
      h[s] += u * (n && p ? -1 : 1);
      break;
  }
  return h;
}
const Nb = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: a
  } = n, s = await (a.isRTL == null ? void 0 : a.isRTL(t));
  if (process.env.NODE_ENV !== "production" && (a == null && console.error(["Floating UI: `platform` property was not passed to config. If you", "want to use Floating UI on the web, install @floating-ui/dom", "instead of the /core package. Otherwise, you can create your own", "`platform`: https://floating-ui.com/docs/platform"].join(" ")), i.filter((v) => {
    let {
      name: g
    } = v;
    return g === "autoPlacement" || g === "flip";
  }).length > 1))
    throw new Error(["Floating UI: duplicate `flip` and/or `autoPlacement`", "middleware detected. This will lead to an infinite loop. Ensure only", "one of either has been passed to the `middleware` array."].join(" "));
  let l = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: u,
    y: d
  } = Mc(l, r, s), p = r, h = {}, b = 0;
  for (let v = 0; v < i.length; v++) {
    const {
      name: g,
      fn: w
    } = i[v], {
      x: S,
      y,
      data: T,
      reset: O
    } = await w({
      x: u,
      y: d,
      initialPlacement: r,
      placement: p,
      strategy: o,
      middlewareData: h,
      rects: l,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    if (u = S != null ? S : u, d = y != null ? y : d, h = {
      ...h,
      [g]: {
        ...h[g],
        ...T
      }
    }, process.env.NODE_ENV !== "production" && b > 50 && console.warn(["Floating UI: The middleware lifecycle appears to be running in an", "infinite loop. This is usually caused by a `reset` continually", "being returned without a break condition."].join(" ")), O && b <= 50) {
      b++, typeof O == "object" && (O.placement && (p = O.placement), O.rects && (l = O.rects === !0 ? await a.getElementRects({
        reference: e,
        floating: t,
        strategy: o
      }) : O.rects), {
        x: u,
        y: d
      } = Mc(l, p, s)), v = -1;
      continue;
    }
  }
  return {
    x: u,
    y: d,
    placement: p,
    strategy: o,
    middlewareData: h
  };
};
function Pb(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Hu(e) {
  return typeof e != "number" ? Pb(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Oo(e) {
  return {
    ...e,
    top: e.y,
    left: e.x,
    right: e.x + e.width,
    bottom: e.y + e.height
  };
}
async function Ab(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: i,
    rects: a,
    elements: s,
    strategy: l
  } = e, {
    boundary: u = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: p = "floating",
    altBoundary: h = !1,
    padding: b = 0
  } = t, v = Hu(b), w = s[h ? p === "floating" ? "reference" : "floating" : p], S = Oo(await i.getClippingRect({
    element: (n = await (i.isElement == null ? void 0 : i.isElement(w))) == null || n ? w : w.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(s.floating)),
    boundary: u,
    rootBoundary: d,
    strategy: l
  })), y = Oo(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: p === "floating" ? {
      ...a.floating,
      x: r,
      y: o
    } : a.reference,
    offsetParent: await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(s.floating)),
    strategy: l
  }) : a[p]);
  return {
    top: S.top - y.top + v.top,
    bottom: y.bottom - S.bottom + v.bottom,
    left: S.left - y.left + v.left,
    right: y.right - S.right + v.right
  };
}
const jb = Math.min, Mb = Math.max;
function Ia(e, t, n) {
  return Mb(e, jb(t, n));
}
const Lc = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      element: n,
      padding: r = 0
    } = e != null ? e : {}, {
      x: o,
      y: i,
      placement: a,
      rects: s,
      platform: l
    } = t;
    if (n == null)
      return process.env.NODE_ENV !== "production" && console.warn("Floating UI: No `element` was passed to the `arrow` middleware."), {};
    const u = Hu(r), d = {
      x: o,
      y: i
    }, p = Yo(a), h = ds(a), b = zu(p), v = await l.getDimensions(n), g = p === "y" ? "top" : "left", w = p === "y" ? "bottom" : "right", S = s.reference[b] + s.reference[p] - d[p] - s.floating[b], y = d[p] - s.reference[p], T = await (l.getOffsetParent == null ? void 0 : l.getOffsetParent(n));
    let O = T ? p === "y" ? T.clientHeight || 0 : T.clientWidth || 0 : 0;
    O === 0 && (O = s.floating[b]);
    const C = S / 2 - y / 2, _ = u[g], F = O - v[b] - u[w], ee = O / 2 - v[b] / 2 + C, J = Ia(_, ee, F), L = (h === "start" ? u[g] : u[w]) > 0 && ee !== J && s.reference[b] <= s.floating[b] ? ee < _ ? _ - ee : F - ee : 0;
    return {
      [p]: d[p] - L,
      data: {
        [p]: J,
        centerOffset: ee - J
      }
    };
  }
});
async function Lb(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, i = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), a = qo(n), s = ds(n), l = Yo(n) === "x", u = ["left", "top"].includes(a) ? -1 : 1, d = i && l ? -1 : 1, p = typeof t == "function" ? t(e) : t;
  let {
    mainAxis: h,
    crossAxis: b,
    alignmentAxis: v
  } = typeof p == "number" ? {
    mainAxis: p,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...p
  };
  return s && typeof v == "number" && (b = s === "end" ? v * -1 : v), l ? {
    x: b * d,
    y: h * u
  } : {
    x: h * u,
    y: b * d
  };
}
const Fb = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r
      } = t, o = await Lb(t, e);
      return {
        x: n + o.x,
        y: r + o.y,
        data: o
      };
    }
  };
};
function Bb(e) {
  return e === "x" ? "y" : "x";
}
const $b = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o
      } = t, {
        mainAxis: i = !0,
        crossAxis: a = !1,
        limiter: s = {
          fn: (w) => {
            let {
              x: S,
              y
            } = w;
            return {
              x: S,
              y
            };
          }
        },
        ...l
      } = e, u = {
        x: n,
        y: r
      }, d = await Ab(t, l), p = Yo(qo(o)), h = Bb(p);
      let b = u[p], v = u[h];
      if (i) {
        const w = p === "y" ? "top" : "left", S = p === "y" ? "bottom" : "right", y = b + d[w], T = b - d[S];
        b = Ia(y, b, T);
      }
      if (a) {
        const w = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", y = v + d[w], T = v - d[S];
        v = Ia(y, v, T);
      }
      const g = s.fn({
        ...t,
        [p]: b,
        [h]: v
      });
      return {
        ...g,
        data: {
          x: g.x - n,
          y: g.y - r
        }
      };
    }
  };
};
function Wu(e) {
  return e && e.document && e.location && e.alert && e.setInterval;
}
function Gt(e) {
  if (e == null)
    return window;
  if (!Wu(e)) {
    const t = e.ownerDocument;
    return t && t.defaultView || window;
  }
  return e;
}
function an(e) {
  return Gt(e).getComputedStyle(e);
}
function sn(e) {
  return Wu(e) ? "" : e ? (e.nodeName || "").toLowerCase() : "";
}
function qu() {
  const e = navigator.userAgentData;
  return e != null && e.brands ? e.brands.map((t) => t.brand + "/" + t.version).join(" ") : navigator.userAgent;
}
function Tt(e) {
  return e instanceof Gt(e).HTMLElement;
}
function Wt(e) {
  return e instanceof Gt(e).Element;
}
function Vb(e) {
  return e instanceof Gt(e).Node;
}
function zr(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  const t = Gt(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
function Xr(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = an(e);
  return /auto|scroll|overlay|hidden/.test(t + r + n) && !["inline", "contents"].includes(o);
}
function Ub(e) {
  return ["table", "td", "th"].includes(sn(e));
}
function Yu(e) {
  const t = /firefox/i.test(qu()), n = an(e);
  return n.transform !== "none" || n.perspective !== "none" || t && n.willChange === "filter" || t && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective"].some((r) => n.willChange.includes(r)) || ["paint", "layout", "strict", "content"].some(
    (r) => {
      const o = n.contain;
      return o != null ? o.includes(r) : !1;
    }
  );
}
function Gu() {
  return !/^((?!chrome|android).)*safari/i.test(qu());
}
function ps(e) {
  return ["html", "body", "#document"].includes(sn(e));
}
const Fc = Math.min, Pr = Math.max, Eo = Math.round;
function qt(e, t, n) {
  var r, o, i, a;
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const s = e.getBoundingClientRect();
  let l = 1, u = 1;
  t && Tt(e) && (l = e.offsetWidth > 0 && Eo(s.width) / e.offsetWidth || 1, u = e.offsetHeight > 0 && Eo(s.height) / e.offsetHeight || 1);
  const d = Wt(e) ? Gt(e) : window, p = !Gu() && n, h = (s.left + (p && (r = (o = d.visualViewport) == null ? void 0 : o.offsetLeft) != null ? r : 0)) / l, b = (s.top + (p && (i = (a = d.visualViewport) == null ? void 0 : a.offsetTop) != null ? i : 0)) / u, v = s.width / l, g = s.height / u;
  return {
    width: v,
    height: g,
    top: b,
    right: h + v,
    bottom: b + g,
    left: h,
    x: h,
    y: b
  };
}
function ln(e) {
  return ((Vb(e) ? e.ownerDocument : e.document) || window.document).documentElement;
}
function Go(e) {
  return Wt(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.pageXOffset,
    scrollTop: e.pageYOffset
  };
}
function Ku(e) {
  return qt(ln(e)).left + Go(e).scrollLeft;
}
function zb(e) {
  const t = qt(e);
  return Eo(t.width) !== e.offsetWidth || Eo(t.height) !== e.offsetHeight;
}
function Hb(e, t, n) {
  const r = Tt(t), o = ln(t), i = qt(
    e,
    r && zb(t),
    n === "fixed"
  );
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const s = {
    x: 0,
    y: 0
  };
  if (r || !r && n !== "fixed")
    if ((sn(t) !== "body" || Xr(o)) && (a = Go(t)), Tt(t)) {
      const l = qt(t, !0);
      s.x = l.x + t.clientLeft, s.y = l.y + t.clientTop;
    } else
      o && (s.x = Ku(o));
  return {
    x: i.left + a.scrollLeft - s.x,
    y: i.top + a.scrollTop - s.y,
    width: i.width,
    height: i.height
  };
}
function hs(e) {
  return sn(e) === "html" ? e : e.assignedSlot || e.parentNode || (zr(e) ? e.host : null) || ln(e);
}
function Bc(e) {
  return !Tt(e) || an(e).position === "fixed" ? null : e.offsetParent;
}
function Wb(e) {
  let t = hs(e);
  for (zr(t) && (t = t.host); Tt(t) && !ps(t); ) {
    if (Yu(t))
      return t;
    {
      const n = t.parentNode;
      t = zr(n) ? n.host : n;
    }
  }
  return null;
}
function ka(e) {
  const t = Gt(e);
  let n = Bc(e);
  for (; n && Ub(n) && an(n).position === "static"; )
    n = Bc(n);
  return n && (sn(n) === "html" || sn(n) === "body" && an(n).position === "static" && !Yu(n)) ? t : n || Wb(e) || t;
}
function $c(e) {
  if (Tt(e))
    return {
      width: e.offsetWidth,
      height: e.offsetHeight
    };
  const t = qt(e);
  return {
    width: t.width,
    height: t.height
  };
}
function qb(e) {
  let {
    rect: t,
    offsetParent: n,
    strategy: r
  } = e;
  const o = Tt(n), i = ln(n);
  if (n === i)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const s = {
    x: 0,
    y: 0
  };
  if ((o || !o && r !== "fixed") && ((sn(n) !== "body" || Xr(i)) && (a = Go(n)), Tt(n))) {
    const l = qt(n, !0);
    s.x = l.x + n.clientLeft, s.y = l.y + n.clientTop;
  }
  return {
    ...t,
    x: t.x - a.scrollLeft + s.x,
    y: t.y - a.scrollTop + s.y
  };
}
function Yb(e, t) {
  const n = Gt(e), r = ln(e), o = n.visualViewport;
  let i = r.clientWidth, a = r.clientHeight, s = 0, l = 0;
  if (o) {
    i = o.width, a = o.height;
    const u = Gu();
    (u || !u && t === "fixed") && (s = o.offsetLeft, l = o.offsetTop);
  }
  return {
    width: i,
    height: a,
    x: s,
    y: l
  };
}
function Gb(e) {
  var t;
  const n = ln(e), r = Go(e), o = (t = e.ownerDocument) == null ? void 0 : t.body, i = Pr(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), a = Pr(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0);
  let s = -r.scrollLeft + Ku(e);
  const l = -r.scrollTop;
  return an(o || n).direction === "rtl" && (s += Pr(n.clientWidth, o ? o.clientWidth : 0) - i), {
    width: i,
    height: a,
    x: s,
    y: l
  };
}
function Xu(e) {
  const t = hs(e);
  return ps(t) ? e.ownerDocument.body : Tt(t) && Xr(t) ? t : Xu(t);
}
function wo(e, t) {
  var n;
  t === void 0 && (t = []);
  const r = Xu(e), o = r === ((n = e.ownerDocument) == null ? void 0 : n.body), i = Gt(r), a = o ? [i].concat(i.visualViewport || [], Xr(r) ? r : []) : r, s = t.concat(a);
  return o ? s : s.concat(wo(a));
}
function Kb(e, t) {
  const n = t.getRootNode == null ? void 0 : t.getRootNode();
  if (e.contains(t))
    return !0;
  if (n && zr(n)) {
    let r = t;
    do {
      if (r && e === r)
        return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function Xb(e, t) {
  let n = e;
  for (; n && !ps(n) && !t.includes(n) && !(Wt(n) && ["absolute", "fixed"].includes(an(n).position)); ) {
    const r = hs(n);
    n = zr(r) ? r.host : r;
  }
  return n;
}
function Jb(e, t) {
  const n = qt(e, !1, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft;
  return {
    top: r,
    left: o,
    x: o,
    y: r,
    right: o + e.clientWidth,
    bottom: r + e.clientHeight,
    width: e.clientWidth,
    height: e.clientHeight
  };
}
function Vc(e, t, n) {
  return t === "viewport" ? Oo(Yb(e, n)) : Wt(t) ? Jb(t, n) : Oo(Gb(ln(e)));
}
function Qb(e) {
  const t = wo(e), n = Xb(e, t);
  let r = null;
  if (n && Tt(n)) {
    const o = ka(n);
    Xr(n) ? r = n : Tt(o) && (r = o);
  }
  return Wt(r) ? t.filter((o) => r && Wt(o) && Kb(o, r) && sn(o) !== "body") : [];
}
function Zb(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const a = [...n === "clippingAncestors" ? Qb(t) : [].concat(n), r], s = a[0], l = a.reduce((u, d) => {
    const p = Vc(t, d, o);
    return u.top = Pr(p.top, u.top), u.right = Fc(p.right, u.right), u.bottom = Fc(p.bottom, u.bottom), u.left = Pr(p.left, u.left), u;
  }, Vc(t, s, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
const ev = {
  getClippingRect: Zb,
  convertOffsetParentRelativeRectToViewportRelativeRect: qb,
  isElement: Wt,
  getDimensions: $c,
  getOffsetParent: ka,
  getDocumentElement: ln,
  getElementRects: (e) => {
    let {
      reference: t,
      floating: n,
      strategy: r
    } = e;
    return {
      reference: Hb(t, ka(n), r),
      floating: {
        ...$c(n),
        x: 0,
        y: 0
      }
    };
  },
  getClientRects: (e) => Array.from(e.getClientRects()),
  isRTL: (e) => an(e).direction === "rtl"
};
function tv(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: i = !0,
    elementResize: a = !0,
    animationFrame: s = !1
  } = r, l = o && !s, u = l || i ? [...Wt(e) ? wo(e) : [], ...wo(t)] : [];
  u.forEach((v) => {
    l && v.addEventListener("scroll", n, {
      passive: !0
    }), i && v.addEventListener("resize", n);
  });
  let d = null;
  if (a) {
    let v = !0;
    d = new ResizeObserver(() => {
      v || n(), v = !1;
    }), Wt(e) && !s && d.observe(e), d.observe(t);
  }
  let p, h = s ? qt(e) : null;
  s && b();
  function b() {
    const v = qt(e);
    h && (v.x !== h.x || v.y !== h.y || v.width !== h.width || v.height !== h.height) && n(), h = v, p = requestAnimationFrame(b);
  }
  return n(), () => {
    var v;
    u.forEach((g) => {
      l && g.removeEventListener("scroll", n), i && g.removeEventListener("resize", n);
    }), (v = d) == null || v.disconnect(), d = null, s && cancelAnimationFrame(p);
  };
}
const nv = (e, t, n) => Nb(e, t, {
  platform: ev,
  ...n
});
var _a = typeof document < "u" ? Rn : we;
function So(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n != t.length)
        return !1;
      for (r = n; r-- !== 0; )
        if (!So(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const i = o[r];
      if (!(i === "_owner" && e.$$typeof) && !So(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function rv(e) {
  const t = z.useRef(e);
  return _a(() => {
    t.current = e;
  }), t;
}
function ov(e) {
  let {
    middleware: t,
    placement: n = "bottom",
    strategy: r = "absolute",
    whileElementsMounted: o
  } = e === void 0 ? {} : e;
  const [i, a] = z.useState({
    x: null,
    y: null,
    strategy: r,
    placement: n,
    middlewareData: {}
  }), [s, l] = z.useState(t);
  So(s == null ? void 0 : s.map((O) => {
    let {
      name: C,
      options: _
    } = O;
    return {
      name: C,
      options: _
    };
  }), t == null ? void 0 : t.map((O) => {
    let {
      name: C,
      options: _
    } = O;
    return {
      name: C,
      options: _
    };
  })) || l(t);
  const u = z.useRef(null), d = z.useRef(null), p = z.useRef(null), h = z.useRef(i), b = rv(o), v = z.useCallback(() => {
    !u.current || !d.current || nv(u.current, d.current, {
      middleware: s,
      placement: n,
      strategy: r
    }).then((O) => {
      g.current && !So(h.current, O) && (h.current = O, mf.flushSync(() => {
        a(O);
      }));
    });
  }, [s, n, r]);
  _a(() => {
    g.current && v();
  }, [v]);
  const g = z.useRef(!1);
  _a(() => (g.current = !0, () => {
    g.current = !1;
  }), []);
  const w = z.useCallback(() => {
    if (typeof p.current == "function" && (p.current(), p.current = null), u.current && d.current)
      if (b.current) {
        const O = b.current(u.current, d.current, v);
        p.current = O;
      } else
        v();
  }, [v, b]), S = z.useCallback((O) => {
    u.current = O, w();
  }, [w]), y = z.useCallback((O) => {
    d.current = O, w();
  }, [w]), T = z.useMemo(() => ({
    reference: u,
    floating: d
  }), []);
  return z.useMemo(() => ({
    ...i,
    update: v,
    refs: T,
    reference: S,
    floating: y
  }), [i, v, T, S, y]);
}
const iv = (e) => {
  const {
    element: t,
    padding: n
  } = e;
  function r(o) {
    return Object.prototype.hasOwnProperty.call(o, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(o) {
      return r(t) ? t.current != null ? Lc({
        element: t.current,
        padding: n
      }).fn(o) : {} : t ? Lc({
        element: t,
        padding: n
      }).fn(o) : {};
    }
  };
};
var av = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const sv = {
  children: E.exports.node.isRequired,
  label: E.exports.node,
  arrow: E.exports.bool,
  arrowSize: E.exports.number,
  displayOn: E.exports.arrayOf(E.exports.oneOf(["hover", "focus", "click"])),
  transitionDuration: E.exports.number,
  enterDelay: E.exports.number,
  leaveDelay: E.exports.number,
  followCursor: E.exports.bool,
  onOpen: E.exports.func,
  open: E.exports.bool,
  placement: E.exports.oneOf([
    "bottom-end",
    "bottom-start",
    "bottom",
    "left-end",
    "left-start",
    "left",
    "right-end",
    "right-start",
    "right",
    "top-end",
    "top-start",
    "top"
  ])
};
function cv(e, t) {
  const {
    children: n,
    label: r = "",
    arrow: o = !1,
    arrowSize: i = 8,
    displayOn: a = ["hover", "focus", "click"],
    transitionDuration: s = 150,
    enterDelay: l,
    leaveDelay: u,
    onOpen: d,
    open: p,
    placement: h = "top"
  } = e, b = av(e, ["children", "label", "arrow", "arrowSize", "displayOn", "transitionDuration", "enterDelay", "leaveDelay", "onOpen", "open", "placement"]), v = _e(), g = Pe("Tooltip", e, v), w = $e(), S = $e(), y = [Fb(8), $b({ padding: 8 })];
  o && y.push(iv({ element: w, padding: 8 }));
  const { x: T, y: O, reference: C, floating: _, strategy: F, middlewareData: { arrow: { x: ee, y: J } = {} } } = ov({
    placement: h,
    middleware: y,
    whileElementsMounted: tv
  }), pe = Ht(S, C), H = Ht(t, _), [L, j] = ye(!1), ae = p != null ? p : L, ge = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  }[h.split("-")[0]], fe = Ne((k) => {
    !L || !a.includes("click") || setTimeout(() => {
      j(!1), typeof d == "function" && d(k, !1);
    }, u);
  }, [a, L, u, d]), Ee = Ne((k) => {
    L || !a.includes("click") || setTimeout(() => {
      j(!0), typeof d == "function" && d(k, !0);
    }, l);
  }, [a, L, l, d]), Le = Ne((k) => {
    L || !a.includes("hover") || setTimeout(() => {
      j(!0), typeof d == "function" && d(k, !0);
    }, l);
  }, [a, L, l, d]), ze = Ne((k) => {
    !L || !a.includes("hover") || setTimeout(() => {
      j(!1), typeof d == "function" && d(k, !1);
    }, u);
  }, [a, L, u, d]), P = Ne((k) => {
    L || !a.includes("click") || setTimeout(() => {
      j(!0), typeof d == "function" && d(k, !0);
    }, l);
  }, [a, L, l, d]), D = Ne((k) => {
    !L || !a.includes("click") || setTimeout(() => {
      j(!1), typeof d == "function" && d(k, !1);
    }, u);
  }, [a, L, u, d]);
  Wo(S, fe), we(() => {
    if (!S.current)
      return;
    const { current: k } = S;
    return k.addEventListener("click", Ee), k.addEventListener("mouseenter", Le), k.addEventListener("mouseleave", ze), k.addEventListener("focus", P), k.addEventListener("blur", D), () => {
      k.removeEventListener("click", Ee), k.removeEventListener("mouseenter", Le), k.removeEventListener("mouseleave", ze), k.removeEventListener("focus", P), k.removeEventListener("blur", D);
    };
  }, [Le, ze, Ee, P, D]);
  function V(k) {
    const G = {
      position: F,
      top: O != null ? O : "",
      left: T != null ? T : ""
    }, le = {
      display: "none",
      opacity: 0,
      transition: `opacity ${s}ms ease`
    }, K = {
      entering: { opacity: 0, display: "block" },
      entered: { opacity: 1, display: "block" },
      exiting: { opacity: 0, display: "block" },
      exited: { opacity: 0, display: "none" }
    };
    return M(bo, Object.assign({ in: ae, timeout: s }, { children: (ie) => At(k, Object.assign(Object.assign(Object.assign(Object.assign({}, k.props), G), le), K[ie])) }));
  }
  return Be(mo, { children: [zt.map(zt.only(n), (k) => At(k, Object.assign(Object.assign({}, k.props), { ref: pe }))), V(Be(Z, Object.assign({ ref: H, backgroundColor: "black", color: "white", cursor: "default" }, g, b, { children: [!!o && M(Z, Object.assign({ ref: w, position: "absolute", background: "black", width: i, height: i, top: J != null ? J : "", left: ee != null ? ee : "", transform: "rotate(45deg)", zIndex: 0 }, { [ge]: -i / 2 }, ce("Tooltip.Arrow", e, v))), M(Z, Object.assign({ position: "relative", zIndex: 1 }, ce("Tooltip.Label", e, v), { children: r }))] })))] });
}
const gs = ke(cv);
gs.displayName = "Tooltip";
gs.propTypes = sv;
var lv = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const uv = {
  defaultValue: E.exports.number,
  disabled: E.exports.bool,
  marks: E.exports.arrayOf(E.exports.shape({
    label: E.exports.node,
    value: E.exports.number.isRequired
  })),
  max: E.exports.number,
  min: E.exports.number,
  step: E.exports.number,
  onChange: E.exports.func,
  onChangeCommited: E.exports.func,
  orientation: E.exports.oneOf(["horizontal", "vertical"]),
  value: E.exports.number,
  noSwap: E.exports.bool,
  knobSize: E.exports.number,
  markOffset: E.exports.number,
  labelTooltipDisplay: E.exports.oneOf(["on", "off", "auto"])
};
function fv({ label: e, position: t, isHorizontal: n, markOffset: r, styles: o, innerStyles: i }) {
  const a = $e(), [s, l] = ye(0);
  return we(() => {
    !a.current || l(a.current.clientHeight);
  }, []), M(Z, Object.assign({ ref: a, position: "absolute", top: n ? `calc(100% + ${r}px)` : t, left: n ? t : `calc(100% + ${r}px)` }, o, { children: M(Z, Object.assign({ position: "relative", top: n ? 0 : -s / 2, left: n ? "-50%" : 0, opacity: s > 0 ? 1 : 0 }, i, { children: e })) }));
}
function dv(e, t) {
  const { defaultValue: n, disabled: r, marks: o, max: i = 1, min: a = 0, step: s, onChange: l, onChangeCommited: u, orientation: d = "horizontal", noSwap: p = !1, value: h, knobSize: b = 16, markOffset: v = 8, labelTooltipDisplay: g = "off" } = e, w = lv(e, ["defaultValue", "disabled", "marks", "max", "min", "step", "onChange", "onChangeCommited", "orientation", "noSwap", "value", "knobSize", "markOffset", "labelTooltipDisplay"]), S = _e(), y = $e(), T = Ht(t, y), [O, C] = ye(-1), [_, F] = ye([0, 0, 0]), [ee, J] = ye(0), [pe, H] = ye(Array.isArray(n) ? n : [n || a]), L = De(() => {
    var D;
    return (D = h ? Array.isArray(h) ? h : [h] : void 0) !== null && D !== void 0 ? D : pe;
  }, [h, pe]), j = d === "horizontal", ae = Pe("Slider", e, S), ge = Ne((D) => `${(D - a) / (i - a) * 100}%`, [a, i]), fe = Ne((D, V, k) => {
    H((G) => {
      const le = [...G];
      return le[k] = V, le;
    }), typeof l == "function" && l(D, V, k);
  }, [l]), Ee = Ne((D) => {
    if (O === -1 || r)
      return;
    const V = (j ? D.clientX : D.clientY) - ee, { [j ? "width" : "height"]: k } = y.current.getBoundingClientRect();
    let G = Math.max(a, Math.min(i, _[1] + V / k * (i - a)));
    typeof s == "number" && s > 0 && (G = Math.round(G / s) * s), p && (G = Math.max(_[0], Math.min(_[2], G))), fe(D, G, O);
  }, [O, _, ee, j, a, i, s, fe, p, r]), Le = Ne((D) => {
    typeof u == "function" && u(D, L[O], O), C(-1);
  }, [u, L, O]);
  function ze(D, V) {
    C(V), F([L[V - 1] || a, L[V], L[V + 1] || i]), J(j ? D.clientX : D.clientY);
  }
  we(() => (window.addEventListener("mousemove", Ee), window.addEventListener("mouseup", Le), () => {
    window.removeEventListener("mousemove", Ee), window.removeEventListener("mouseup", Le);
  }), [Ee, Le]);
  function P(D, V) {
    return g === "on" || g === "auto" && D === O ? M(gs, Object.assign({ open: g === "on" || O === D, label: L[D].toFixed(2) }, { children: V }), D) : V;
  }
  return Be(Z, Object.assign({ ref: T, position: "relative", height: j ? 8 : 256, width: j ? 256 : 8 }, ae, w, { children: [M(Z, Object.assign({ width: j ? "100%" : 8, height: j ? 8 : "100%", backgroundColor: "black" }, ce("Slider.Track", e, S))), L.map((D, V) => P(V, M(Z, Object.assign({ width: b, height: b, backgroundColor: "blue", userSelect: "none", position: "absolute", borderRadius: "50%", top: j ? `calc(${-b / 2}px + 50%)` : `calc(${ge(D)} - ${b / 2}px)`, left: j ? `calc(${ge(D)} - ${b / 2}px)` : `calc(${-b / 2}px + 50%)`, onMouseDown: (k) => ze(k, V) }, ce("Slider.Knob", e, S)), V))), Array.isArray(o) && o.map(({ label: D, value: V }, k) => M(fv, { label: D || V, position: ge(V), markOffset: v, isHorizontal: j, styles: ce("Mark", e, S), innerStyles: ce("Slider.MarkInner", e, S) }, k))] }));
}
const Ju = ke(dv);
Ju.displayName = "Slider";
Ju.propTypes = uv;
var pv = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
};
const hv = {
  checked: E.exports.bool,
  defaultChecked: E.exports.bool,
  onChange: E.exports.func,
  checkedBackground: E.exports.node,
  uncheckedBackground: E.exports.node,
  labelPosition: E.exports.oneOf(["left", "right", "top", "bottom"])
};
function gv(e, t) {
  const { defaultChecked: n, checked: r, disabled: o, onChange: i, checkedBackground: a = null, uncheckedBackground: s = null, labelPosition: l = "right", children: u } = e, d = pv(e, ["defaultChecked", "checked", "disabled", "onChange", "checkedBackground", "uncheckedBackground", "labelPosition", "children"]), p = _e(), [h, b] = ye(n), v = typeof r == "boolean" ? r : h, g = Object.assign(Object.assign({}, e), { checked: v }), w = Pe("Switch", g, p), S = l === "left" ? { justifyContent: "flex-start", flexDirection: "row-reverse" } : l === "top" ? { justifyContent: "flex-end", flexDirection: "column-reverse" } : l === "bottom" ? { justifyContent: "flex-start", flexDirection: "column" } : { justifyContent: "flex-start" };
  function y(T) {
    (T.code === "Enter" || T.code === "Space") && (typeof i == "function" && i(on(T, { checked: !v })), b(!v));
  }
  return Be(Z, Object.assign({ ref: t, display: "flex", alignItems: "center", tabIndex: 0, userSelect: "none", cursor: "pointer" }, S, w, d, { onClick: (T) => {
    o || (typeof i == "function" && i(on(T, { checked: !v })), typeof e.onClick == "function" && e.onClick(T), b(!v));
  }, onKeyDown: (T) => {
    o || (y(T), typeof e.onKeyDown == "function" && e.onKeyDown(T));
  } }, { children: [Be(Z, Object.assign({ display: "flex", flexDirection: "column", flexShrink: 0, position: "relative", width: 50, height: 24, borderRadius: 24 / 2, role: "button" }, ce("Switch.Control", g, p), { children: [v && !!a && M(Z, Object.assign({ display: "flex", alignItems: "center", justifyContent: "flex-start", flexGrow: 1 }, ce("Switch.CheckedBackground", g, p), { children: a })), !v && !!s && M(Z, Object.assign({ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1 }, ce("Switch.UncheckedBackground", g, p), { children: s })), M(mt, Object.assign({ position: "absolute", width: 20, height: 20, borderRadius: "50%", backgroundColor: "white", top: 2, left: v ? "calc(100% - 22px)" : 2, transition: "left 150ms ease" }, ce("Switch.Handle", g, p)))] })), !!u && M(Z, Object.assign({}, ce("Switch.Children", g, p), { children: u }))] }));
}
const Qu = ke(gv);
Qu.displayName = "Switch";
Qu.propTypes = hv;
const mv = {};
function yv(e, t) {
  const n = _e(), r = Pe("Text", e, n);
  return M(wu, Object.assign({ ref: t }, r, e));
}
const Zu = ke(yv);
Zu.displayName = "Text";
Zu.propTypes = mv;
const bv = Tl({
  url: "http://localhost:4000/graphql"
});
function vv() {
  const e = [
    "0px 0px 0px 0px",
    "0px 2px 1px -1px",
    "0px 3px 1px -2px",
    "0px 3px 3px -2px",
    "0px 2px 4px -1px",
    "0px 3px 5px -1px",
    "0px 3px 5px -1px",
    "0px 4px 5px -2px",
    "0px 5px 5px -3px",
    "0px 5px 6px -3px",
    "0px 6px 6px -3px",
    "0px 6px 7px -4px",
    "0px 7px 8px -4px",
    "0px 7px 8px -4px",
    "0px 7px 9px -4px",
    "0px 8px 9px -5px",
    "0px 8px 10px -5px",
    "0px 8px 11px -5px",
    "0px 9px 11px -5px",
    "0px 9px 12px -6px",
    "0px 10px 13px -6px",
    "0px 10px 13px -6px",
    "0px 10px 14px -6px",
    "0px 11px 14px -7px",
    "0px 11px 15px -7px"
  ], t = [
    "0px 0px 0px 0px",
    "0px 1px 1px 0px",
    "0px 2px 2px 0px",
    "0px 3px 4px 0px",
    "0px 4px 5px 0px",
    "0px 5px 8px 0px",
    "0px 6px 10px 0px",
    "0px 7px 10px 1px",
    "0px 8px 10px 1px",
    "0px 9px 12px 1px",
    "0px 10px 14px 1px",
    "0px 11px 15px 1px",
    "0px 12px 17px 2px",
    "0px 13px 19px 2px",
    "0px 14px 21px 2px",
    "0px 15px 22px 2px",
    "0px 16px 24px 2px",
    "0px 17px 26px 2px",
    "0px 18px 28px 2px",
    "0px 19px 29px 2px",
    "0px 20px 31px 3px",
    "0px 21px 33px 3px",
    "0px 22px 35px 3px",
    "0px 23px 36px 3px",
    "0px 24px 38px 3px"
  ], n = [
    "0px 0px 0px 0px",
    "0px 1px 3px 0px",
    "0px 1px 5px 0px",
    "0px 1px 8px 0px",
    "0px 1px 10px 0px",
    "0px 1px 14px 0px",
    "0px 1px 18px 0px",
    "0px 2px 16px 1px",
    "0px 3px 14px 2px",
    "0px 3px 16px 2px",
    "0px 4px 18px 3px",
    "0px 4px 20px 3px",
    "0px 5px 22px 4px",
    "0px 5px 24px 4px",
    "0px 5px 26px 4px",
    "0px 6px 28px 5px",
    "0px 6px 30px 5px",
    "0px 6px 32px 5px",
    "0px 7px 34px 6px",
    "0px 7px 36px 6px",
    "0px 8px 38px 7px",
    "0px 8px 40px 7px",
    "0px 8px 42px 7px",
    "0px 9px 44px 8px",
    "0px 9px 46px 8px"
  ], r = [{ boxShadow: "none" }];
  for (let o = 1; o <= 24; o++)
    r.push({
      boxShadow: `${e[o]} shadow, ${t[o]} shadow, ${n[o]} shadow`
    });
  return r;
}
const xv = os`
  to { transform: rotate(360deg); }
`, Ji = ({ labelPosition: e }) => ({
  marginLeft: e === "right" || !e ? 8 : 0,
  marginRight: e === "left" ? 8 : 0,
  marginTop: e === "bottom" ? 8 : 0,
  marginBottom: e === "top" ? 8 : 0
}), Ov = {
  name: "Default",
  mode: "light",
  breakpoints: {
    mobile: 600,
    tablet: 900,
    desktop: 1200
  },
  colors: {
    primary: "#3e73dd",
    background: {
      light: "white",
      dark: "#1c1f2b"
    },
    "background-light": {
      light: "#f5f7f9",
      dark: "#22293b"
    },
    text: {
      light: "#3b454e",
      dark: "white"
    },
    "text-light": {
      light: "lighten(text, 15)",
      dark: "darken(text, 15)"
    },
    "text-xlight": {
      light: "lighten(text, 30)",
      dark: "darken(text, 30)"
    },
    border: {
      light: "#ddd",
      dark: "#444"
    },
    hover: {
      light: "lighten(border, 5)",
      dark: "darken(border, 5)"
    },
    shadow: {
      light: "rgba(0, 0, 0, 0.2)",
      dark: "rgba(96, 96, 96, 0.5)"
    },
    success: "#64db5c",
    error: "#ff4d4d",
    warning: "#ff7900",
    skeleton: {
      light: "#00000015",
      dark: "lighten(background-light, 15)"
    }
  },
  stylesheet: {
    html: [
      {
        fontSize: 16,
        color: "text",
        backgroundColor: "background",
        webkitFontSmoothing: "antialiased",
        mozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
        boxSizing: "border-box"
      }
    ],
    "*, *:before, *:after": [
      {
        boxSizing: "inherit"
      }
    ]
  },
  global: [
    ...vv().map((e, t) => ((n) => ({ elevation: r }) => r === n && e)(t))
  ],
  A: {
    Root: [
      {
        display: "inline-block",
        color: "primary",
        textDecoration: "none",
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline"
        }
      }
    ]
  },
  Accordion: {
    Root: [
      {
        elevation: 1,
        backgroundColor: "background",
        borderBottom: "1px solid border",
        overflow: "hidden",
        userSelect: "none",
        "&:first-of-type": {
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4
        },
        "&:last-of-type": {
          borderBottom: "none",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4
        }
      }
    ],
    Title: [
      {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16
      }
    ],
    ChildrenWrapper: [
      {
        transition: "height 200ms ease"
      }
    ],
    Children: [
      {
        paddingTop: 0,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16
      }
    ],
    ExpandIcon: [
      {
        marginLeft: 16,
        transition: "transform 200ms ease"
      },
      ({ expanded: e }) => e && {
        transform: "rotate(180deg)"
      }
    ]
  },
  Autocomplete: {
    NoOption: [
      {
        userSelect: "none",
        color: "text-light"
      }
    ]
  },
  Avatar: {
    Root: [
      {
        color: "white",
        fontWeight: "bold",
        borderRadius: "50%"
      },
      ({ name: e, src: t }) => !(e || t) && {
        backgroundColor: "primary"
      }
    ]
  },
  Button: {
    Root: [
      {
        minHeight: 38,
        color: "white",
        backgroundColor: "primary",
        border: "none",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 4,
        userSelect: "none",
        textDecoration: "none",
        transition: "color 150ms ease, background-color 150ms ease, border 150ms ease",
        flexShrink: 0,
        ":hover": {
          backgroundColor: "darken(primary, 10)"
        },
        ":active": {
          backgroundColor: "darken(primary, 20)"
        },
        ":disabled": {
          backgroundColor: "lightgrey",
          cursor: "not-allowed",
          ":hover": {
            backgroundColor: "lightgrey"
          }
        }
      }
    ],
    StartIcon: [
      {
        marginLeft: -6,
        marginRight: 8
      }
    ],
    EndIcon: [
      {
        marginLeft: 8,
        marginRight: -6
      }
    ],
    Spinner: [
      {
        color: "white"
      }
    ]
  },
  ButtonBase: {
    Root: [
      {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
      }
    ]
  },
  ButtonGroup: {
    Root: [
      {
        border: "1px solid primary",
        borderRadius: 4,
        "& > button": {
          border: "none",
          borderRadius: 0
        }
      },
      ({ direction: e }) => e === "row" && {
        "& > button": {
          borderLeft: "1px solid darken(primary)",
          "&:first-of-type": {
            borderLeft: "none"
          }
        }
      },
      ({ direction: e }) => e === "column" && {
        "& > button": {
          borderTop: "1px solid darken(primary)",
          "&:first-of-type": {
            borderTop: "none"
          }
        }
      }
    ]
  },
  Card: {
    Root: [
      (e, t) => ({
        elevation: 1,
        backgroundColor: t.mode === "light" ? "background" : "background-light"
      })
    ]
  },
  Checkbox: {
    Root: [
      {
        "&:hover > span": {
          border: "1px solid primary"
        }
      },
      ({ disabled: e }) => e && {
        cursor: "not-allowed",
        "&:hover > span": {
          border: "1px solid border"
        }
      }
    ],
    Control: [
      {
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: "transparent",
        border: "1px solid border",
        borderRadius: 2
      },
      ({ checked: e }) => e && {
        backgroundColor: "primary",
        border: "1px solid primary"
      },
      ({ disabled: e }) => e && {
        backgroundColor: "border",
        border: "1px solid border",
        "&:hover": {
          border: "1px solid border"
        }
      }
    ],
    Children: [
      Ji
    ]
  },
  DatePicker: {
    WeekDays: [
      {
        fontWeight: 500,
        color: "text-xlight",
        fontSize: "0.85rem"
      }
    ],
    MonthAndYearInner: [
      {
        fontWeight: 500
      }
    ],
    Caret: [
      {
        "&:hover": {
          borderColor: "transparent",
          backgroundColor: "hover"
        }
      }
    ]
  },
  DatePickerDay: {
    Root: [
      {
        "& > div": {
          borderColor: "transparent"
        },
        "&:hover > div": {
          borderColor: "transparent",
          backgroundColor: "hover"
        }
      }
    ],
    Inner: [
      {
        borderColor: "transparent"
      },
      ({ active: e }) => e && {
        backgroundColor: "primary !important",
        color: "white"
      }
    ]
  },
  DropdownButton: {
    Button: {
      EndIcon: [
        {
          marginLeft: 8,
          marginRight: -6
        }
      ]
    }
  },
  H1: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  H2: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  H3: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  H4: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  H5: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  H6: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  Hr: {
    Root: [
      {
        borderWidth: 0,
        borderTop: "1px solid border"
      }
    ]
  },
  IconButton: {
    Root: [
      {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        border: "none",
        borderRadius: "50%",
        background: "background",
        elevation: 1,
        transition: "color 200ms ease, background-color 200ms ease",
        "&:hover": {
          backgroundColor: "transparency(primary, 85)"
        },
        "&:active": {
          backgroundColor: "transparency(primary, 65)"
        }
      }
    ]
  },
  Input: {
    Root: [
      {
        width: 256,
        minHeight: 38,
        paddingLeft: 8,
        paddingRight: 8,
        color: "text",
        border: "1px solid border",
        borderRadius: 4
      },
      ({ focused: e }) => e && {
        border: "1px solid primary"
      },
      ({ disabled: e }) => e && {
        backgroundColor: "background-light",
        cursor: "not-allowed"
      }
    ],
    InputBase: [
      ({ disabled: e }) => e && {
        cursor: "not-allowed",
        backgroundColor: "background-light"
      }
    ],
    StartIcon: [
      {
        paddingRight: 8
      }
    ],
    EndIcon: [
      {
        paddingLeft: 8
      }
    ],
    TextArea: [
      {
        color: "text",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0,
        resize: "none",
        outline: "none",
        border: "none",
        backgroundColor: "transparent"
      }
    ]
  },
  InputBase: {
    Root: [
      {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        lineHeight: "32px",
        color: "text",
        backgroundColor: "transparent",
        border: "none",
        "&:focus": {
          outline: "none"
        },
        '&[type="checkbox"]': {
          appearance: "none",
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: "background",
          border: "1px solid border",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          "&::before": {
            content: '""',
            width: 12,
            height: 12,
            transform: "scale(0)",
            boxShadow: "inset 1em 1em primary",
            transformUrigin: "bottom left",
            clipPath: "polygon(28% 38%, 41% 53%, 75% 24%, 86% 38%, 40% 78%, 15% 50%)"
          },
          "&:checked::before": {
            transform: "scale(1.35)"
          },
          "&:checked, &:hover": {
            borderColor: "primary"
          }
        }
      }
    ]
  },
  Label: {
    Root: [
      {
        display: "block",
        marginBottom: 4
      }
    ]
  },
  Menu: {
    Root: [
      {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 0,
        paddingRight: 0,
        elevation: 1,
        backgroundColor: "background",
        borderRadius: 4,
        outline: "none"
      },
      ({ isSubMenu: e }) => e && {
        marginTop: -8
      }
    ]
  },
  MenuItem: {
    Root: [
      {
        outline: "none"
      }
    ],
    Children: [
      {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16
      },
      ({ active: e }) => e && {
        backgroundColor: "background-light"
      },
      ({ disabled: e }) => e && {
        backgroundColor: "none",
        text: "text-light"
      }
    ]
  },
  Modal: {
    Root: [
      {
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        paddingRight: 32,
        borderRadius: 4
      }
    ]
  },
  P: {
    Root: [
      {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0
      }
    ]
  },
  Pre: {
    Root: [
      {
        display: "inline-block",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
        backgroundColor: "background-light"
      }
    ]
  },
  ProgressBar: {
    Bar: [
      {
        borderRadius: 4,
        backgroundColor: "primary",
        transition: "width 150ms ease"
      }
    ]
  },
  Radio: {
    Root: [
      {
        outline: "none",
        "&:hover > span": {
          color: "primary"
        }
      },
      ({ disabled: e }) => e && {
        cursor: "not-allowed",
        "&:hover > span": {
          color: "border"
        }
      }
    ],
    Control: [
      {
        width: 20,
        height: 20,
        color: "border",
        borderRadius: "50%",
        userSelect: "none"
      },
      ({ checked: e }) => e && {
        color: "primary"
      }
    ],
    Children: [
      Ji,
      ({ disabled: e }) => e && {
        color: "border"
      }
    ]
  },
  RadioGroup: {
    Radio: [
      ({ row: e }) => e && {
        marginRight: 8,
        "&:last-of-type": {
          marginRight: 0
        }
      },
      ({ row: e }) => !e && {
        marginBottom: 8,
        "&:last-of-type": {
          marginBottom: 0
        }
      }
    ]
  },
  Select: {
    Root: [
      {
        width: 256,
        height: 38,
        display: "inline-block",
        borderRadius: 4,
        border: "1px solid border",
        "&:hover": {
          border: "1px solid primary"
        }
      }
    ],
    Selected: [
      {
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 0,
        cursor: "pointer",
        userSelect: "none"
      }
    ]
  },
  Slider: {
    Root: [
      ({ disabled: e }) => e && {
        cursor: "not-allowed"
      }
    ],
    Track: [
      {
        backgroundColor: "darken(background-light, 15)",
        borderRadius: 4
      }
    ],
    Knob: [
      {
        backgroundColor: "primary"
      }
    ],
    Mark: [
      {
        color: "text-light"
      }
    ]
  },
  Skeleton: {
    Root: [
      {
        overflow: "hidden"
      },
      ({ variant: e }) => e === "line" && {
        borderRadius: 4,
        height: "1.666ex"
      },
      ({ variant: e }) => e === "circular" && {
        borderRadius: "50%"
      }
    ],
    Inner: [
      {
        backgroundColor: "skeleton"
      }
    ]
  },
  Spinner: {
    Root: [
      ({ size: e = 24, color: t = "primary" }) => ({
        width: e,
        height: e,
        position: "relative",
        display: "inline-block",
        "&:before": {
          content: "''",
          position: "absolute",
          top: "50%",
          left: "50%",
          width: e - 4,
          height: e - 4,
          marginTop: -(e - 2) / 2,
          marginLeft: -(e - 2) / 2,
          borderRadius: "50%",
          borderTop: `2px solid ${t}`,
          borderRight: "2px solid transparent",
          animation: `${xv} 666ms linear infinite`
        }
      })
    ]
  },
  Switch: {
    Control: [
      {
        backgroundColor: "background-light",
        transition: "background-color 150ms ease",
        "&:hover": {
          boxShadow: "0 0 0 2px border"
        }
      },
      ({ checked: e }) => e && {
        backgroundColor: "primary"
      }
    ],
    Children: [
      Ji
    ]
  },
  Table: {
    Root: [
      {
        width: "100%",
        backgroundColor: "background",
        border: "1px solid border",
        borderRadius: 4,
        borderCollapse: "collapse"
      }
    ]
  },
  Td: {
    Root: [
      {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16
      }
    ]
  },
  Th: {
    Root: [
      {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16
      }
    ]
  },
  Tr: {
    Root: [
      {
        textAlign: "left",
        borderTop: "1px solid border",
        "&:first-of-type": {
          border: "none"
        }
      }
    ]
  },
  Tooltip: {
    Root: [
      {
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 2,
        backgroundColor: "lighten(black, 33)"
      }
    ],
    Label: [
      {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
        whiteSpace: "nowrap"
      }
    ],
    Arrow: [
      {
        backgroundColor: "lighten(black, 33)"
      }
    ]
  }
}, Ev = [
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "mr",
  "ml",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pr",
  "pl"
], wv = {
  m: "margin",
  p: "padding"
}, Sv = {
  "": [""],
  x: ["Left", "Right"],
  y: ["Top", "Bottom"],
  t: ["Top"],
  b: ["Bottom"],
  l: ["Left"],
  r: ["Right"]
};
function Tv(e, t) {
  if (typeof e == "string")
    return e;
  const n = parseFloat(e);
  return n !== n ? e : n * t;
}
function Cv(e, t, n) {
  const [r, o = ""] = e.split(""), i = wv[r], a = Tv(t, n), s = {};
  return Sv[o].map((l) => i + l).forEach((l) => {
    s[l] = a;
  }), s;
}
function Iv(e = 16) {
  return (t) => Object.entries(t).filter(([n]) => Ev.includes(n)).reduce((n, [r, o]) => Object.assign(Object.assign(Object.assign({}, n), Cv(r, o, e)), { [r]: null }), {});
}
function kv(e = 16) {
  return (t) => typeof t.gap == "number" ? {
    gap: t.gap * e
  } : {};
}
const Uc = (e) => e < 4, zc = (e) => e > 3 && e < 7, Hc = (e) => e > 6, Wc = (e) => e == 1 || e == 4 || e == 7, qc = (e) => e == 2 || e == 5 || e == 8, Yc = (e) => e == 3 || e == 6 || e == 9;
function _v(e) {
  if (!(typeof e == "string" && e.length > 1))
    return null;
  let t = 0;
  const n = e[0] === "x", r = e[1], o = parseInt(e[2]);
  (o || o === 0) && t++;
  const i = e[t + 2] === "a", a = e[t + 2] === "b", s = e[t + 2] === "e";
  (i || a || s) && t++;
  const l = e[t + 2] === "s", u = e[t + 2] === "z", d = e[t + 2] === "f", p = e[t + 2] === "l", h = n ? Uc : Wc, b = n ? zc : qc, v = n ? Hc : Yc, g = n ? Wc : Uc, w = n ? qc : zc, S = n ? Yc : Hc, y = {};
  return g(r) ? y.jc = "flex-start" : S(r) ? y.jc = "flex-end" : y.jc = i ? "space-around" : a ? "space-between" : s ? "space-evenly" : "center", h(r) ? y.ac = y.ai = "flex-start" : v(r) ? y.ac = y.ai = "flex-end" : y.ac = y.ai = "center", o ? (y.d = `${n ? "row" : "column"}${S(o) ? "-reverse" : ""}`, y.w = `wrap${v(o) ? "-reverse" : ""}`, S(o) && !w(r) && (y.jc = y.jc === "flex-end" ? "flex-start" : "flex-end"), v(o) && !b(r) && (y.ac = y.ai = y.ai === "flex-end" ? "flex-start" : "flex-end")) : (y.d = n ? "row" : "column", y.w = "nowrap", o === 0 && (y.d += "-reverse", w(r) || (y.jc = y.jc === "flex-end" ? "flex-start" : "flex-end"))), l && (y.ai = "stretch"), u && (y.ai = "baseline"), d && (y.ai = "first baseline"), p && (y.ai = "last baseline"), y;
}
const Qi = {
  d: "row",
  w: "nowrap",
  jc: "flex-start",
  ai: "stretch",
  ac: "normal"
}, ef = {
  d: "flex-direction",
  w: "flex-wrap",
  jc: "justify-content",
  ai: "align-items",
  ac: "align-content"
}, Dv = {
  d: "flexDirection",
  w: "flexWrap",
  jc: "justifyContent",
  ai: "alignItems",
  ac: "alignContent"
}, Gc = Object.keys(ef);
class Rv {
  constructor(t) {
    Object.assign(this, { code: t }, Qi, _v(t));
  }
  toCss() {
    let t = "";
    return Gc.filter((n) => Qi[n] !== this[n]).forEach((n) => t += `  ${ef[n]}: ${this[n]};
`), `.${this.code} {
  display: flex;
${t}}
`;
  }
  toJs() {
    const t = { display: "flex" };
    return Gc.filter((n) => Qi[n] !== this[n]).forEach((n) => t[Dv[n]] = this[n]), t;
  }
}
const Nv = (e) => new Rv(e).toJs(), Kc = {
  none: 0,
  medium: 3,
  large: 6
}, Pv = {
  50: "#eff9ff",
  100: "#def1ff",
  200: "#b6e5ff",
  300: "#75d3ff",
  400: "#2cbdff",
  500: "#00aaff",
  600: "#0083d4",
  700: "#0068ab",
  800: "#00588d",
  900: "#064974"
}, Av = {
  900: "#74480F",
  800: "#89580A",
  700: "#A67202",
  600: "#D19F00",
  500: "#EFCA00",
  400: "#FFE60D",
  300: "#FFF541",
  200: "#FFFE86",
  100: "#FEFFC1",
  50: "#FFFFE7"
}, jv = {
  950: "#032117",
  900: "#053827",
  850: "#074F37",
  800: "#0A6B4A",
  700: "#0F996A",
  600: "#13C386",
  500: "#17E8A0",
  400: "#3CECAF",
  300: "#6AF1C2",
  200: "#99F5D5",
  100: "#C7FAE8",
  50: "#F1FEF9"
}, Mv = {
  950: "#130205",
  900: "#200308",
  850: "#38060E",
  800: "#660A19",
  700: "#8B0E23",
  600: "#BA1239",
  500: "#E81748",
  400: "#ED456A",
  300: "#F2788D",
  200: "#F599A8",
  100: "#FAC7D0",
  50: "#FFF0F2"
}, Lv = {
  50: "#f6f6f7",
  100: "#e0e2e7",
  200: "#c1c2ce",
  300: "#9a9cae",
  400: "#75768c",
  500: "#5a5b72",
  600: "#47485a",
  700: "#3b3b4a",
  800: "#32323d",
  900: "#101013"
}, Fv = {
  50: "#fef1fa",
  100: "#fde6f6",
  200: "#feccef",
  300: "#ffa2e2",
  400: "#fd66cb",
  500: "#f73db4",
  600: "#e81a94",
  700: "#ca0c77",
  800: "#a60e61",
  900: "#8a1154"
}, Bv = qm(Ov, {
  name: "WorldCollector",
  stylesheet: {
    html: [
      {
        overscrollBehaviorX: "none"
      }
    ],
    body: [
      {
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        overscrollBehaviorX: "none"
      }
    ],
    a: [
      {
        color: "primary"
      }
    ]
  },
  colors: {
    primary: "blue.500",
    blue: Pv,
    green: jv,
    yellow: Av,
    red: Mv,
    grey: Lv,
    pink: Fv
  },
  global: [
    Iv(),
    kv(),
    ({ xflex: e }) => typeof e == "string" && Nv(e),
    ({ borderRadius: e }) => typeof e == "string" && typeof Kc[e] < "u" && {
      borderRadius: Kc[e]
    }
  ],
  Ul: {
    Root: [
      {
        margin: 0
      }
    ]
  },
  Ol: {
    Root: [
      {
        margin: 0
      }
    ]
  },
  Label: {
    Root: [
      {
        marginBottom: 0
      }
    ]
  },
  H1: {
    Root: [
      {
        fontFamily: "'Cormorant', serif",
        fontSize: 48
      }
    ]
  },
  H2: {
    Root: [
      {
        fontFamily: "'Cormorant', serif",
        fontSize: 40
      }
    ]
  },
  H3: {
    Root: [
      {
        fontFamily: "'Cormorant', serif",
        fontSize: 32
      }
    ]
  },
  H4: {
    Root: [
      {
        fontFamily: "'Cormorant', serif",
        fontSize: 24
      }
    ]
  },
  H5: {
    Root: [
      {
        fontFamily: "'Cormorant', serif"
      }
    ]
  },
  H6: {
    Root: [
      {
        fontFamily: "'Cormorant', serif"
      }
    ]
  }
}), $v = Ct("production"), tf = Ct(null), Ko = Ct({
  hierarchyIds: [],
  setHierarchyIds: () => {
  }
});
function Vv(e, t) {
  const n = Ne(() => {
    try {
      const i = localStorage.getItem(e);
      if (i)
        return JSON.parse(i);
    } catch {
      console.log("Error on localStorage.getItem of", e);
    }
    return t;
  }, [e, t]), [r, o] = ye(n());
  return we(() => {
    localStorage.setItem(e, JSON.stringify(r));
  }, [e, r]), [r, o];
}
/**
 * @remix-run/router v1.0.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function To() {
  return To = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, To.apply(this, arguments);
}
var nn;
(function(e) {
  e.Pop = "POP", e.Push = "PUSH", e.Replace = "REPLACE";
})(nn || (nn = {}));
const Xc = "popstate";
function Uv(e) {
  e === void 0 && (e = {});
  function t(r, o) {
    let {
      pathname: i,
      search: a,
      hash: s
    } = r.location;
    return Da(
      "",
      {
        pathname: i,
        search: a,
        hash: s
      },
      o.state && o.state.usr || null,
      o.state && o.state.key || "default"
    );
  }
  function n(r, o) {
    return typeof o == "string" ? o : Co(o);
  }
  return Hv(t, n, null, e);
}
function zv() {
  return Math.random().toString(36).substr(2, 8);
}
function Jc(e) {
  return {
    usr: e.state,
    key: e.key
  };
}
function Da(e, t, n, r) {
  return n === void 0 && (n = null), To({
    pathname: typeof e == "string" ? e : e.pathname,
    search: "",
    hash: ""
  }, typeof t == "string" ? tr(t) : t, {
    state: n,
    key: t && t.key || r || zv()
  });
}
function Co(e) {
  let {
    pathname: t = "/",
    search: n = "",
    hash: r = ""
  } = e;
  return n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n), r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r), t;
}
function tr(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && (t.hash = e.substr(n), e = e.substr(0, n));
    let r = e.indexOf("?");
    r >= 0 && (t.search = e.substr(r), e = e.substr(0, r)), e && (t.pathname = e);
  }
  return t;
}
function Hv(e, t, n, r) {
  r === void 0 && (r = {});
  let {
    window: o = document.defaultView,
    v5Compat: i = !1
  } = r, a = o.history, s = nn.Pop, l = null;
  function u() {
    s = nn.Pop, l && l({
      action: s,
      location: h.location
    });
  }
  function d(b, v) {
    s = nn.Push;
    let g = Da(h.location, b, v);
    n && n(g, b);
    let w = Jc(g), S = h.createHref(g);
    try {
      a.pushState(w, "", S);
    } catch {
      o.location.assign(S);
    }
    i && l && l({
      action: s,
      location: g
    });
  }
  function p(b, v) {
    s = nn.Replace;
    let g = Da(h.location, b, v);
    n && n(g, b);
    let w = Jc(g), S = h.createHref(g);
    a.replaceState(w, "", S), i && l && l({
      action: s,
      location: g
    });
  }
  let h = {
    get action() {
      return s;
    },
    get location() {
      return e(o, a);
    },
    listen(b) {
      if (l)
        throw new Error("A history only accepts one active listener");
      return o.addEventListener(Xc, u), l = b, () => {
        o.removeEventListener(Xc, u), l = null;
      };
    },
    createHref(b) {
      return t(o, b);
    },
    push: d,
    replace: p,
    go(b) {
      return a.go(b);
    }
  };
  return h;
}
var Qc;
(function(e) {
  e.data = "data", e.deferred = "deferred", e.redirect = "redirect", e.error = "error";
})(Qc || (Qc = {}));
function Wv(e, t, n) {
  n === void 0 && (n = "/");
  let r = typeof t == "string" ? tr(t) : t, o = rf(r.pathname || "/", n);
  if (o == null)
    return null;
  let i = nf(e);
  qv(i);
  let a = null;
  for (let s = 0; a == null && s < i.length; ++s)
    a = t0(i[s], o);
  return a;
}
function nf(e, t, n, r) {
  return t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = ""), e.forEach((o, i) => {
    let a = {
      relativePath: o.path || "",
      caseSensitive: o.caseSensitive === !0,
      childrenIndex: i,
      route: o
    };
    a.relativePath.startsWith("/") && (be(a.relativePath.startsWith(r), 'Absolute route path "' + a.relativePath + '" nested under path ' + ('"' + r + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes."), a.relativePath = a.relativePath.slice(r.length));
    let s = Ut([r, a.relativePath]), l = n.concat(a);
    o.children && o.children.length > 0 && (be(
      o.index !== !0,
      "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + s + '".')
    ), nf(o.children, t, l, s)), !(o.path == null && !o.index) && t.push({
      path: s,
      score: Zv(s, o.index),
      routesMeta: l
    });
  }), t;
}
function qv(e) {
  e.sort((t, n) => t.score !== n.score ? n.score - t.score : e0(t.routesMeta.map((r) => r.childrenIndex), n.routesMeta.map((r) => r.childrenIndex)));
}
const Yv = /^:\w+$/, Gv = 3, Kv = 2, Xv = 1, Jv = 10, Qv = -2, Zc = (e) => e === "*";
function Zv(e, t) {
  let n = e.split("/"), r = n.length;
  return n.some(Zc) && (r += Qv), t && (r += Kv), n.filter((o) => !Zc(o)).reduce((o, i) => o + (Yv.test(i) ? Gv : i === "" ? Xv : Jv), r);
}
function e0(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, o) => r === t[o]) ? e[e.length - 1] - t[t.length - 1] : 0;
}
function t0(e, t) {
  let {
    routesMeta: n
  } = e, r = {}, o = "/", i = [];
  for (let a = 0; a < n.length; ++a) {
    let s = n[a], l = a === n.length - 1, u = o === "/" ? t : t.slice(o.length) || "/", d = ms({
      path: s.relativePath,
      caseSensitive: s.caseSensitive,
      end: l
    }, u);
    if (!d)
      return null;
    Object.assign(r, d.params);
    let p = s.route;
    i.push({
      params: r,
      pathname: Ut([o, d.pathname]),
      pathnameBase: a0(Ut([o, d.pathnameBase])),
      route: p
    }), d.pathnameBase !== "/" && (o = Ut([o, d.pathnameBase]));
  }
  return i;
}
function ms(e, t) {
  typeof e == "string" && (e = {
    path: e,
    caseSensitive: !1,
    end: !0
  });
  let [n, r] = n0(e.path, e.caseSensitive, e.end), o = t.match(n);
  if (!o)
    return null;
  let i = o[0], a = i.replace(/(.)\/+$/, "$1"), s = o.slice(1);
  return {
    params: r.reduce((u, d, p) => {
      if (d === "*") {
        let h = s[p] || "";
        a = i.slice(0, i.length - h.length).replace(/(.)\/+$/, "$1");
      }
      return u[d] = r0(s[p] || "", d), u;
    }, {}),
    pathname: i,
    pathnameBase: a,
    pattern: e
  };
}
function n0(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !0), Dn(e === "*" || !e.endsWith("*") || e.endsWith("/*"), 'Route path "' + e + '" will be treated as if it were ' + ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'));
  let r = [], o = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/:(\w+)/g, (a, s) => (r.push(s), "([^\\/]+)"));
  return e.endsWith("*") ? (r.push("*"), o += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : n ? o += "\\/*$" : e !== "" && e !== "/" && (o += "(?:(?=\\/|$))"), [new RegExp(o, t ? void 0 : "i"), r];
}
function r0(e, t) {
  try {
    return decodeURIComponent(e);
  } catch (n) {
    return Dn(!1, 'The value for the URL param "' + t + '" will not be decoded because' + (' the string "' + e + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + n + ").")), e;
  }
}
function rf(e, t) {
  if (t === "/")
    return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase()))
    return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length, r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function be(e, t) {
  if (e === !1 || e === null || typeof e > "u")
    throw new Error(t);
}
function Dn(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {
    }
  }
}
function o0(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: o = ""
  } = typeof e == "string" ? tr(e) : e;
  return {
    pathname: n ? n.startsWith("/") ? n : i0(n, t) : t,
    search: s0(r),
    hash: c0(o)
  };
}
function i0(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return e.split("/").forEach((o) => {
    o === ".." ? n.length > 1 && n.pop() : o !== "." && n.push(o);
  }), n.length > 1 ? n.join("/") : "/";
}
function Zi(e, t, n, r) {
  return "Cannot include a '" + e + "' character in a manually specified " + ("`to." + t + "` field [" + JSON.stringify(r) + "].  Please separate it out to the ") + ("`to." + n + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function of(e, t, n, r) {
  r === void 0 && (r = !1);
  let o;
  typeof e == "string" ? o = tr(e) : (o = To({}, e), be(!o.pathname || !o.pathname.includes("?"), Zi("?", "pathname", "search", o)), be(!o.pathname || !o.pathname.includes("#"), Zi("#", "pathname", "hash", o)), be(!o.search || !o.search.includes("#"), Zi("#", "search", "hash", o)));
  let i = e === "" || o.pathname === "", a = i ? "/" : o.pathname, s;
  if (r || a == null)
    s = n;
  else {
    let p = t.length - 1;
    if (a.startsWith("..")) {
      let h = a.split("/");
      for (; h[0] === ".."; )
        h.shift(), p -= 1;
      o.pathname = h.join("/");
    }
    s = p >= 0 ? t[p] : "/";
  }
  let l = o0(o, s), u = a && a !== "/" && a.endsWith("/"), d = (i || a === ".") && n.endsWith("/");
  return !l.pathname.endsWith("/") && (u || d) && (l.pathname += "/"), l;
}
const Ut = (e) => e.join("/").replace(/\/\/+/g, "/"), a0 = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"), s0 = (e) => !e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e, c0 = (e) => !e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e;
class l0 {
  constructor(t, n, r) {
    this.status = t, this.statusText = n || "", this.data = r;
  }
}
function u0(e) {
  return e instanceof l0;
}
/**
 * React Router v6.4.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function Ra() {
  return Ra = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Ra.apply(this, arguments);
}
function f0(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
const af = typeof Object.is == "function" ? Object.is : f0, {
  useState: d0,
  useEffect: p0,
  useLayoutEffect: h0,
  useDebugValue: g0
} = z;
let el = !1, tl = !1;
function m0(e, t, n) {
  process.env.NODE_ENV !== "production" && (el || "startTransition" in z && (el = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.")));
  const r = t();
  if (process.env.NODE_ENV !== "production" && !tl) {
    const a = t();
    af(r, a) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), tl = !0);
  }
  const [{
    inst: o
  }, i] = d0({
    inst: {
      value: r,
      getSnapshot: t
    }
  });
  return h0(() => {
    o.value = r, o.getSnapshot = t, ea(o) && i({
      inst: o
    });
  }, [e, r, t]), p0(() => (ea(o) && i({
    inst: o
  }), e(() => {
    ea(o) && i({
      inst: o
    });
  })), [e]), g0(r), r;
}
function ea(e) {
  const t = e.getSnapshot, n = e.value;
  try {
    const r = t();
    return !af(n, r);
  } catch {
    return !0;
  }
}
function y0(e, t, n) {
  return t();
}
const b0 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", v0 = !b0, x0 = v0 ? y0 : m0;
"useSyncExternalStore" in z && ((e) => e.useSyncExternalStore)(z);
const sf = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (sf.displayName = "DataStaticRouterContext");
const ys = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (ys.displayName = "DataRouter");
const Xo = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (Xo.displayName = "DataRouterState");
const O0 = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (O0.displayName = "Await");
const Jr = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (Jr.displayName = "Navigation");
const Qr = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (Qr.displayName = "Location");
const Kt = /* @__PURE__ */ z.createContext({
  outlet: null,
  matches: []
});
process.env.NODE_ENV !== "production" && (Kt.displayName = "Route");
const bs = /* @__PURE__ */ z.createContext(null);
process.env.NODE_ENV !== "production" && (bs.displayName = "RouteError");
function E0(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t;
  nr() || (process.env.NODE_ENV !== "production" ? be(
    !1,
    "useHref() may be used only in the context of a <Router> component."
  ) : be(!1));
  let {
    basename: r,
    navigator: o
  } = z.useContext(Jr), {
    hash: i,
    pathname: a,
    search: s
  } = Hr(e, {
    relative: n
  }), l = a;
  return r !== "/" && (l = a === "/" ? r : Ut([r, a])), o.createHref({
    pathname: l,
    search: s,
    hash: i
  });
}
function nr() {
  return z.useContext(Qr) != null;
}
function rr() {
  return nr() || (process.env.NODE_ENV !== "production" ? be(
    !1,
    "useLocation() may be used only in the context of a <Router> component."
  ) : be(!1)), z.useContext(Qr).location;
}
function w0(e) {
  nr() || (process.env.NODE_ENV !== "production" ? be(
    !1,
    "useMatch() may be used only in the context of a <Router> component."
  ) : be(!1));
  let {
    pathname: t
  } = rr();
  return z.useMemo(() => ms(e, t), [t, e]);
}
function cf(e) {
  return e.filter((t, n) => n === 0 || !t.route.index && t.pathnameBase !== e[n - 1].pathnameBase);
}
function lf() {
  nr() || (process.env.NODE_ENV !== "production" ? be(
    !1,
    "useNavigate() may be used only in the context of a <Router> component."
  ) : be(!1));
  let {
    basename: e,
    navigator: t
  } = z.useContext(Jr), {
    matches: n
  } = z.useContext(Kt), {
    pathname: r
  } = rr(), o = JSON.stringify(cf(n).map((s) => s.pathnameBase)), i = z.useRef(!1);
  return z.useEffect(() => {
    i.current = !0;
  }), z.useCallback(function(s, l) {
    if (l === void 0 && (l = {}), process.env.NODE_ENV !== "production" && Dn(i.current, "You should call navigate() in a React.useEffect(), not when your component is first rendered."), !i.current)
      return;
    if (typeof s == "number") {
      t.go(s);
      return;
    }
    let u = of(s, JSON.parse(o), r, l.relative === "path");
    e !== "/" && (u.pathname = u.pathname === "/" ? e : Ut([e, u.pathname])), (l.replace ? t.replace : t.push)(u, l.state, l);
  }, [e, t, o, r]);
}
const S0 = /* @__PURE__ */ z.createContext(null);
function T0(e) {
  let t = z.useContext(Kt).outlet;
  return t && /* @__PURE__ */ q(S0.Provider, {
    value: e,
    children: t
  });
}
function vs() {
  let {
    matches: e
  } = z.useContext(Kt), t = e[e.length - 1];
  return t ? t.params : {};
}
function Hr(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t, {
    matches: r
  } = z.useContext(Kt), {
    pathname: o
  } = rr(), i = JSON.stringify(cf(r).map((a) => a.pathnameBase));
  return z.useMemo(() => of(e, JSON.parse(i), o, n === "path"), [e, i, o, n]);
}
function C0(e, t) {
  nr() || (process.env.NODE_ENV !== "production" ? be(
    !1,
    "useRoutes() may be used only in the context of a <Router> component."
  ) : be(!1));
  let n = z.useContext(Xo), {
    matches: r
  } = z.useContext(Kt), o = r[r.length - 1], i = o ? o.params : {}, a = o ? o.pathname : "/", s = o ? o.pathnameBase : "/", l = o && o.route;
  if (process.env.NODE_ENV !== "production") {
    let w = l && l.path || "";
    A0(a, !l || w.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + a + '" (under <Route path="' + w + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + w + '"> to <Route ') + ('path="' + (w === "/" ? "*" : w + "/*") + '">.'));
  }
  let u = rr(), d;
  if (t) {
    var p;
    let w = typeof t == "string" ? tr(t) : t;
    s === "/" || ((p = w.pathname) == null ? void 0 : p.startsWith(s)) || (process.env.NODE_ENV !== "production" ? be(!1, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + s + '" ') + ('but pathname "' + w.pathname + '" was given in the `location` prop.')) : be(!1)), d = w;
  } else
    d = u;
  let h = d.pathname || "/", b = s === "/" ? h : h.slice(s.length) || "/", v = Wv(e, {
    pathname: b
  });
  process.env.NODE_ENV !== "production" && (process.env.NODE_ENV !== "production" && Dn(l || v != null, 'No routes matched location "' + d.pathname + d.search + d.hash + '" '), process.env.NODE_ENV !== "production" && Dn(v == null || v[v.length - 1].route.element !== void 0, 'Matched leaf route at location "' + d.pathname + d.search + d.hash + '" does not have an element. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.'));
  let g = D0(v && v.map((w) => Object.assign({}, w, {
    params: Object.assign({}, i, w.params),
    pathname: Ut([s, w.pathname]),
    pathnameBase: w.pathnameBase === "/" ? s : Ut([s, w.pathnameBase])
  })), r, n || void 0);
  return t ? /* @__PURE__ */ q(Qr.Provider, {
    value: {
      location: Ra({
        pathname: "/",
        search: "",
        hash: "",
        state: null,
        key: "default"
      }, d),
      navigationType: nn.Pop
    },
    children: g
  }) : g;
}
function I0() {
  let e = P0(), t = u0(e) ? e.status + " " + e.statusText : e instanceof Error ? e.message : JSON.stringify(e), n = e instanceof Error ? e.stack : null, r = "rgba(200,200,200, 0.5)", o = {
    padding: "0.5rem",
    backgroundColor: r
  }, i = {
    padding: "2px 4px",
    backgroundColor: r
  };
  return /* @__PURE__ */ at(qr, {
    children: [/* @__PURE__ */ q("h2", {
      children: "Unhandled Thrown Error!"
    }), /* @__PURE__ */ q("h3", {
      style: {
        fontStyle: "italic"
      },
      children: t
    }), n ? /* @__PURE__ */ q("pre", {
      style: o,
      children: n
    }) : null, /* @__PURE__ */ q("p", {
      children: "\u{1F4BF} Hey developer \u{1F44B}"
    }), /* @__PURE__ */ at("p", {
      children: ["You can provide a way better UX than this when your app throws errors by providing your own\xA0", /* @__PURE__ */ q("code", {
        style: i,
        children: "errorElement"
      }), " props on\xA0", /* @__PURE__ */ q("code", {
        style: i,
        children: "<Route>"
      })]
    })]
  });
}
class k0 extends z.Component {
  constructor(t) {
    super(t), this.state = {
      location: t.location,
      error: t.error
    };
  }
  static getDerivedStateFromError(t) {
    return {
      error: t
    };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ? {
      error: t.error,
      location: t.location
    } : {
      error: t.error || n.error,
      location: n.location
    };
  }
  componentDidCatch(t, n) {
    console.error("React Router caught the following error during render", t, n);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ q(bs.Provider, {
      value: this.state.error,
      children: this.props.component
    }) : this.props.children;
  }
}
function _0(e) {
  let {
    routeContext: t,
    match: n,
    children: r
  } = e, o = z.useContext(sf);
  return o && n.route.errorElement && (o._deepestRenderedBoundaryId = n.route.id), /* @__PURE__ */ q(Kt.Provider, {
    value: t,
    children: r
  });
}
function D0(e, t, n) {
  if (t === void 0 && (t = []), e == null)
    if (n != null && n.errors)
      e = n.matches;
    else
      return null;
  let r = e, o = n == null ? void 0 : n.errors;
  if (o != null) {
    let i = r.findIndex((a) => a.route.id && (o == null ? void 0 : o[a.route.id]));
    i >= 0 || (process.env.NODE_ENV !== "production" ? be(!1, "Could not find a matching route for the current errors: " + o) : be(!1)), r = r.slice(0, Math.min(r.length, i + 1));
  }
  return r.reduceRight((i, a, s) => {
    let l = a.route.id ? o == null ? void 0 : o[a.route.id] : null, u = n ? a.route.errorElement || /* @__PURE__ */ q(I0, {}) : null, d = () => /* @__PURE__ */ q(_0, {
      match: a,
      routeContext: {
        outlet: i,
        matches: t.concat(r.slice(0, s + 1))
      },
      children: l ? u : a.route.element !== void 0 ? a.route.element : i
    });
    return n && (a.route.errorElement || s === 0) ? /* @__PURE__ */ q(k0, {
      location: n.location,
      component: u,
      error: l,
      children: d()
    }) : d();
  }, null);
}
var nl;
(function(e) {
  e.UseRevalidator = "useRevalidator";
})(nl || (nl = {}));
var Na;
(function(e) {
  e.UseLoaderData = "useLoaderData", e.UseActionData = "useActionData", e.UseRouteError = "useRouteError", e.UseNavigation = "useNavigation", e.UseRouteLoaderData = "useRouteLoaderData", e.UseMatches = "useMatches", e.UseRevalidator = "useRevalidator";
})(Na || (Na = {}));
function R0(e) {
  return e + " must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.";
}
function N0(e) {
  let t = z.useContext(Xo);
  return t || (process.env.NODE_ENV !== "production" ? be(!1, R0(e)) : be(!1)), t;
}
function P0() {
  var e;
  let t = z.useContext(bs), n = N0(Na.UseRouteError), r = z.useContext(Kt), o = r.matches[r.matches.length - 1];
  return t || (r || (process.env.NODE_ENV !== "production" ? be(!1, "useRouteError must be used inside a RouteContext") : be(!1)), o.route.id || (process.env.NODE_ENV !== "production" ? be(!1, 'useRouteError can only be used on routes that contain a unique "id"') : be(!1)), (e = n.errors) == null ? void 0 : e[o.route.id]);
}
const rl = {};
function A0(e, t, n) {
  !t && !rl[e] && (rl[e] = !0, process.env.NODE_ENV !== "production" && Dn(!1, n));
}
function j0(e) {
  return T0(e.context);
}
function uo(e) {
  process.env.NODE_ENV !== "production" ? be(!1, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.") : be(!1);
}
function M0(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: o = nn.Pop,
    navigator: i,
    static: a = !1
  } = e;
  nr() && (process.env.NODE_ENV !== "production" ? be(!1, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : be(!1));
  let s = t.replace(/^\/*/, "/"), l = z.useMemo(() => ({
    basename: s,
    navigator: i,
    static: a
  }), [s, i, a]);
  typeof r == "string" && (r = tr(r));
  let {
    pathname: u = "/",
    search: d = "",
    hash: p = "",
    state: h = null,
    key: b = "default"
  } = r, v = z.useMemo(() => {
    let g = rf(u, s);
    return g == null ? null : {
      pathname: g,
      search: d,
      hash: p,
      state: h,
      key: b
    };
  }, [s, u, d, p, h, b]);
  return process.env.NODE_ENV !== "production" && Dn(v != null, '<Router basename="' + s + '"> is not able to match the URL ' + ('"' + u + d + p + '" because it does not start with the ') + "basename, so the <Router> won't render anything."), v == null ? null : /* @__PURE__ */ q(Jr.Provider, {
    value: l,
    children: /* @__PURE__ */ q(Qr.Provider, {
      children: n,
      value: {
        location: v,
        navigationType: o
      }
    })
  });
}
function L0(e) {
  let {
    children: t,
    location: n
  } = e, r = z.useContext(ys), o = r && !t ? r.router.routes : Pa(t);
  return C0(o, n);
}
var ol;
(function(e) {
  e[e.pending = 0] = "pending", e[e.success = 1] = "success", e[e.error = 2] = "error";
})(ol || (ol = {}));
new Promise(() => {
});
function Pa(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return z.Children.forEach(e, (r, o) => {
    if (!/* @__PURE__ */ z.isValidElement(r))
      return;
    if (r.type === z.Fragment) {
      n.push.apply(n, Pa(r.props.children, t));
      return;
    }
    r.type !== uo && (process.env.NODE_ENV !== "production" ? be(!1, "[" + (typeof r.type == "string" ? r.type : r.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : be(!1)), !r.props.index || !r.props.children || (process.env.NODE_ENV !== "production" ? be(!1, "An index route cannot have child routes.") : be(!1));
    let i = [...t, o], a = {
      id: r.props.id || i.join("-"),
      caseSensitive: r.props.caseSensitive,
      element: r.props.element,
      index: r.props.index,
      path: r.props.path,
      loader: r.props.loader,
      action: r.props.action,
      errorElement: r.props.errorElement,
      hasErrorBoundary: r.props.errorElement != null,
      shouldRevalidate: r.props.shouldRevalidate,
      handle: r.props.handle
    };
    r.props.children && (a.children = Pa(r.props.children, i)), n.push(a);
  }), n;
}
/**
 * React Router DOM v6.4.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function Aa() {
  return Aa = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Aa.apply(this, arguments);
}
function xs(e, t) {
  if (e == null)
    return {};
  var n = {}, r = Object.keys(e), o, i;
  for (i = 0; i < r.length; i++)
    o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
const fo = "get", ta = "application/x-www-form-urlencoded";
function Jo(e) {
  return e != null && typeof e.tagName == "string";
}
function F0(e) {
  return Jo(e) && e.tagName.toLowerCase() === "button";
}
function B0(e) {
  return Jo(e) && e.tagName.toLowerCase() === "form";
}
function $0(e) {
  return Jo(e) && e.tagName.toLowerCase() === "input";
}
function V0(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function U0(e, t) {
  return e.button === 0 && (!t || t === "_self") && !V0(e);
}
function z0(e, t, n) {
  let r, o, i, a;
  if (B0(e)) {
    let d = n.submissionTrigger;
    r = n.method || e.getAttribute("method") || fo, o = n.action || e.getAttribute("action") || t, i = n.encType || e.getAttribute("enctype") || ta, a = new FormData(e), d && d.name && a.append(d.name, d.value);
  } else if (F0(e) || $0(e) && (e.type === "submit" || e.type === "image")) {
    let d = e.form;
    if (d == null)
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    r = n.method || e.getAttribute("formmethod") || d.getAttribute("method") || fo, o = n.action || e.getAttribute("formaction") || d.getAttribute("action") || t, i = n.encType || e.getAttribute("formenctype") || d.getAttribute("enctype") || ta, a = new FormData(d), e.name && a.append(e.name, e.value);
  } else {
    if (Jo(e))
      throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    if (r = n.method || fo, o = n.action || t, i = n.encType || ta, e instanceof FormData)
      a = e;
    else if (a = new FormData(), e instanceof URLSearchParams)
      for (let [d, p] of e)
        a.append(d, p);
    else if (e != null)
      for (let d of Object.keys(e))
        a.append(d, e[d]);
  }
  let {
    protocol: s,
    host: l
  } = window.location;
  return {
    url: new URL(o, s + "//" + l),
    method: r,
    encType: i,
    formData: a
  };
}
const H0 = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"], W0 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "children"], q0 = ["reloadDocument", "replace", "method", "action", "onSubmit", "fetcherKey", "routeId", "relative"];
function Y0(e) {
  let {
    basename: t,
    children: n,
    window: r
  } = e, o = z.useRef();
  o.current == null && (o.current = Uv({
    window: r,
    v5Compat: !0
  }));
  let i = o.current, [a, s] = z.useState({
    action: i.action,
    location: i.location
  });
  return z.useLayoutEffect(() => i.listen(s), [i]), /* @__PURE__ */ q(M0, {
    basename: t,
    children: n,
    location: a.location,
    navigationType: a.action,
    navigator: i
  });
}
process.env.NODE_ENV;
const Qo = /* @__PURE__ */ z.forwardRef(function(t, n) {
  let {
    onClick: r,
    relative: o,
    reloadDocument: i,
    replace: a,
    state: s,
    target: l,
    to: u,
    preventScrollReset: d
  } = t, p = xs(t, H0), h = E0(u, {
    relative: o
  }), b = Q0(u, {
    replace: a,
    state: s,
    target: l,
    preventScrollReset: d,
    relative: o
  });
  function v(g) {
    r && r(g), g.defaultPrevented || b(g);
  }
  return /* @__PURE__ */ q("a", {
    ...p,
    href: h,
    onClick: i ? r : v,
    ref: n,
    target: l
  });
});
process.env.NODE_ENV !== "production" && (Qo.displayName = "Link");
const G0 = /* @__PURE__ */ z.forwardRef(function(t, n) {
  let {
    "aria-current": r = "page",
    caseSensitive: o = !1,
    className: i = "",
    end: a = !1,
    style: s,
    to: l,
    children: u
  } = t, d = xs(t, W0), p = Hr(l), h = w0({
    path: p.pathname,
    end: a,
    caseSensitive: o
  }), b = z.useContext(Xo), v = b == null ? void 0 : b.navigation.location, g = Hr(v || ""), S = z.useMemo(() => v ? ms({
    path: p.pathname,
    end: a,
    caseSensitive: o
  }, g.pathname) : null, [v, p.pathname, o, a, g.pathname]) != null, y = h != null, T = y ? r : void 0, O;
  typeof i == "function" ? O = i({
    isActive: y,
    isPending: S
  }) : O = [i, y ? "active" : null, S ? "pending" : null].filter(Boolean).join(" ");
  let C = typeof s == "function" ? s({
    isActive: y,
    isPending: S
  }) : s;
  return /* @__PURE__ */ q(Qo, {
    ...d,
    "aria-current": T,
    className: O,
    ref: n,
    style: C,
    to: l,
    children: typeof u == "function" ? u({
      isActive: y,
      isPending: S
    }) : u
  });
});
process.env.NODE_ENV !== "production" && (G0.displayName = "NavLink");
const uf = /* @__PURE__ */ z.forwardRef((e, t) => /* @__PURE__ */ q(K0, {
  ...e,
  ref: t
}));
process.env.NODE_ENV !== "production" && (uf.displayName = "Form");
const K0 = /* @__PURE__ */ z.forwardRef((e, t) => {
  let {
    reloadDocument: n,
    replace: r,
    method: o = fo,
    action: i,
    onSubmit: a,
    fetcherKey: s,
    routeId: l,
    relative: u
  } = e, d = xs(e, q0), p = Z0(s, l), h = o.toLowerCase() === "get" ? "get" : "post", b = ff(i, {
    relative: u
  });
  return /* @__PURE__ */ q("form", {
    ref: t,
    method: h,
    action: b,
    onSubmit: n ? a : (g) => {
      if (a && a(g), g.defaultPrevented)
        return;
      g.preventDefault();
      let w = g.nativeEvent.submitter;
      p(w || g.currentTarget, {
        method: o,
        replace: r,
        relative: u
      });
    },
    ...d
  });
});
process.env.NODE_ENV !== "production" && (uf.displayName = "Form");
process.env.NODE_ENV;
var ja;
(function(e) {
  e.UseScrollRestoration = "useScrollRestoration", e.UseSubmitImpl = "useSubmitImpl", e.UseFetcher = "useFetcher";
})(ja || (ja = {}));
var il;
(function(e) {
  e.UseFetchers = "useFetchers", e.UseScrollRestoration = "useScrollRestoration";
})(il || (il = {}));
function X0(e) {
  return e + " must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.";
}
function J0(e) {
  let t = z.useContext(ys);
  return t || (process.env.NODE_ENV !== "production" ? be(!1, X0(e)) : be(!1)), t;
}
function Q0(e, t) {
  let {
    target: n,
    replace: r,
    state: o,
    preventScrollReset: i,
    relative: a
  } = t === void 0 ? {} : t, s = lf(), l = rr(), u = Hr(e, {
    relative: a
  });
  return z.useCallback((d) => {
    if (U0(d, n)) {
      d.preventDefault();
      let p = r !== void 0 ? r : Co(l) === Co(u);
      s(e, {
        replace: p,
        state: o,
        preventScrollReset: i,
        relative: a
      });
    }
  }, [l, s, u, r, o, n, e, i, a]);
}
function Z0(e, t) {
  let {
    router: n
  } = J0(ja.UseSubmitImpl), r = ff();
  return z.useCallback(function(o, i) {
    if (i === void 0 && (i = {}), typeof document > "u")
      throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
    let {
      method: a,
      encType: s,
      formData: l,
      url: u
    } = z0(o, r, i), d = u.pathname + u.search, p = {
      replace: i.replace,
      formData: l,
      formMethod: a,
      formEncType: s
    };
    e ? (t == null && (process.env.NODE_ENV !== "production" ? be(!1, "No routeId available for useFetcher()") : be(!1)), n.fetch(e, t, d, p)) : n.navigate(d, p);
  }, [r, n, e, t]);
}
function ff(e, t) {
  let {
    relative: n
  } = t === void 0 ? {} : t, {
    basename: r
  } = z.useContext(Jr), o = z.useContext(Kt);
  o || (process.env.NODE_ENV !== "production" ? be(!1, "useFormAction must be used inside a RouteContext") : be(!1));
  let [i] = o.matches.slice(-1), a = e != null ? e : ".", s = Aa({}, Hr(a, {
    relative: n
  })), l = rr();
  if (e == null && (s.search = l.search, s.hash = l.hash, i.route.index)) {
    let u = new URLSearchParams(s.search);
    u.delete("index"), s.search = u.toString() ? "?" + u.toString() : "";
  }
  return (!e || e === ".") && i.route.index && (s.search = s.search ? s.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (s.pathname = s.pathname === "/" ? r : Ut([r, s.pathname])), Co(s);
}
const df = `
  query {
    components {
      id
      name
    }
  }
`, ex = `
  query ($id: String!){
    component (id: $id) {
      id
      name
      file {
        id
        path
        relativePath
      }
    }
  }
`, tx = `
  mutation ($name: String!) {
    createComponent (name: $name) {
      id
    }
  }
`, nx = `
  mutation ($sourceComponentId: String!, $targetComponentId: String!, $hierarchyIds: [String!]!, $hierarchyPosition: ComponentHierarchyPosition!) {
    addComponent (sourceComponentId: $sourceComponentId, targetComponentId: $targetComponentId, hierarchyIds: $hierarchyIds, hierarchyPosition: $hierarchyPosition) {
      id
    }
  }
`, rx = `
  mutation ($sourceComponentId: String!, $hierarchyIds: [String!]!) {
    deleteComponent (sourceComponentId: $sourceComponentId, hierarchyIds: $hierarchyIds) {
      id
    }
  }
`;
function ox({
  component: e
}) {
  const t = hf(() => import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    e.file.path
  ));
  return /* @__PURE__ */ q(gf, {
    fallback: /* @__PURE__ */ q(qr, {
      children: "Loading..."
    }),
    children: /* @__PURE__ */ q(t, {})
  });
}
const ix = cn(ox);
function ax() {
  const {
    id: e
  } = vs(), [t] = Ua({
    query: ex,
    variables: {
      id: e
    }
  });
  return t.fetching || t.error || !t.data.component ? null : /* @__PURE__ */ at(qr, {
    children: [/* @__PURE__ */ q(Eu, {
      mt: 2,
      children: t.data.component.name
    }), /* @__PURE__ */ q(wu, {
      children: t.data.component.file.relativePath
    }), /* @__PURE__ */ q(Z, {
      mt: 2,
      children: /* @__PURE__ */ q(ix, {
        component: t.data.component
      })
    })]
  });
}
const sx = cn(ax);
function cx() {
  const [e] = Ua({
    query: df
  });
  return e.fetching || e.error ? null : /* @__PURE__ */ at(qr, {
    children: [/* @__PURE__ */ q(Eu, {
      mt: 2,
      children: "Components"
    }), /* @__PURE__ */ q(Mm, {
      mt: 2,
      children: e.data.components.map((t) => /* @__PURE__ */ q(Am, {
        children: /* @__PURE__ */ q(Qo, {
          to: `/__ecu__/component/${t.id}`,
          children: t.name
        })
      }, t.id))
    })]
  });
}
const lx = cn(cx);
function ux() {
  const [e, t] = ye(""), [, n] = Va(tx), r = lf();
  function o() {
    n({
      name: e
    }).then((i) => {
      r(`/__ecu__/component/${i.data.createComponent.id}`);
    });
  }
  return /* @__PURE__ */ at(Z, {
    xflex: "x4",
    gap: 1,
    children: [/* @__PURE__ */ q(Qo, {
      to: "/__ecu__/components",
      children: "Components"
    }), /* @__PURE__ */ q(fs, {
      value: e,
      onChange: (i) => t(i.target.value)
    }), /* @__PURE__ */ q(er, {
      onClick: o,
      children: "Create component"
    }), /* @__PURE__ */ q(fx, {}), /* @__PURE__ */ q(dx, {})]
  });
}
function fx() {
  const {
    id: e
  } = vs(), {
    hierarchyIds: t
  } = tt(Ko), [n, r] = ye(""), [o, i] = ye("before"), [a] = Ua({
    query: df
  }), [, s] = Va(nx);
  if (a.fetching || a.error)
    return null;
  function l() {
    s({
      sourceComponentId: e,
      targetComponentId: n,
      hierarchyIds: t,
      hierarchyPosition: o
    });
  }
  return e ? /* @__PURE__ */ at(Z, {
    xflex: "x4",
    gap: 1,
    children: [/* @__PURE__ */ at(xo, {
      value: n,
      onChange: (u) => r(u.target.value),
      children: [/* @__PURE__ */ q(_t, {
        value: "",
        children: "Select a component"
      }), a.data.components.map((u) => /* @__PURE__ */ q(_t, {
        value: u.id,
        children: u.name
      }, u.id))]
    }), /* @__PURE__ */ at(xo, {
      value: o,
      onChange: (u) => i(u.target.value),
      children: [/* @__PURE__ */ q(_t, {
        value: "before",
        children: "Before"
      }), /* @__PURE__ */ q(_t, {
        value: "after",
        children: "After"
      }), /* @__PURE__ */ q(_t, {
        value: "within",
        children: "Within"
      }), /* @__PURE__ */ q(_t, {
        value: "children",
        children: "Children"
      }), /* @__PURE__ */ q(_t, {
        value: "parent",
        children: "Parent"
      })]
    }), /* @__PURE__ */ q(er, {
      onClick: l,
      disabled: !(n && t.length),
      children: "Add component"
    })]
  }) : null;
}
function dx() {
  const {
    id: e
  } = vs(), {
    hierarchyIds: t
  } = tt(Ko), [, n] = Va(rx);
  function r() {
    n({
      sourceComponentId: e,
      hierarchyIds: t
    });
  }
  return e ? /* @__PURE__ */ q(er, {
    onClick: r,
    disabled: !t.length,
    children: "Delete component"
  }) : null;
}
const px = cn(ux);
function hx() {
  return /* @__PURE__ */ at(Z, {
    xflex: "y2s",
    overflowY: "auto",
    width: "100vw",
    height: "100vh",
    p: 1,
    children: [/* @__PURE__ */ q(Nm, {
      children: "Ecu"
    }), /* @__PURE__ */ q(px, {}), /* @__PURE__ */ q(j0, {})]
  });
}
const gx = cn(hx);
function mx({
  children: e
}) {
  return /* @__PURE__ */ at(Y0, {
    children: [e, /* @__PURE__ */ q(L0, {
      children: /* @__PURE__ */ at(uo, {
        path: "/__ecu__",
        element: /* @__PURE__ */ q(gx, {}),
        children: [/* @__PURE__ */ q(uo, {
          path: "components",
          element: /* @__PURE__ */ q(lx, {})
        }), /* @__PURE__ */ q(uo, {
          path: "component/:id",
          element: /* @__PURE__ */ q(sx, {})
        })]
      })
    })]
  });
}
const yx = cn(mx);
function bx({
  mode: e = "production",
  hot: t = null
}) {
  const [n, r] = Vv("ecu-hierarchyIds", []), o = De(() => ({
    hierarchyIds: n,
    setHierarchyIds: r
  }), [n, r]);
  return /* @__PURE__ */ q(jd, {
    value: bv,
    children: /* @__PURE__ */ q(sh, {
      backend: Qh,
      children: /* @__PURE__ */ at(Tu, {
        theme: Bv,
        children: [/* @__PURE__ */ q(Jm, {}), /* @__PURE__ */ q($v.Provider, {
          value: e,
          children: /* @__PURE__ */ q(tf.Provider, {
            value: t,
            children: /* @__PURE__ */ q(Ko.Provider, {
              value: o,
              children: /* @__PURE__ */ q(yx, {})
            })
          })
        })]
      })
    })
  });
}
const Tx = cn(bx);
function al(e, t) {
  typeof e == "function" ? e(t) : e && (e.current = t);
}
function Ma(e, t) {
  return De(() => e == null && t == null ? null : (n) => {
    al(e, n), al(t, n);
  }, [e, t]);
}
function vx(e, t) {
  const n = {};
  let r = e;
  for (; r && r.getAttribute("data-ecu"); )
    r = r.parentElement;
  function o(a) {
    const s = a.getAttribute("data-ecu");
    if (s && (typeof n[s] > "u" ? n[s] = 0 : n[s]++), a === e)
      return !0;
    for (const l of a.children)
      if (o(l))
        return !0;
    return !1;
  }
  return o(r) ? `${t}:${n[t]}` : t;
}
function xx(e, t) {
  const n = tt(tf), [r, o] = ye(""), i = Ne(() => {
    !(t != null && t.current) || o(vx(t.current, e));
  }, [e, t]);
  return we(() => {
    i();
  }, [i]), we(() => {
    n && n.on("vite:beforeUpdate", () => {
      i();
    });
  }, [n, i]), r;
}
function na(e) {
  const t = [];
  let n = e;
  for (; n; ) {
    const r = n.getAttribute("data-ecu-hierarchy");
    if (!r)
      break;
    t.push(r), n = n.parentElement;
  }
  return t.reverse();
}
function Ox(e, t = "") {
  const n = $e(null), r = xx(e, n), { hierarchyIds: o, setHierarchyIds: i } = tt(Ko), [{ isDragging: a }, s] = Dh(() => ({
    type: "Node",
    item: () => ({ hierarchyIds: na(n.current) }),
    end: (v, g) => {
      const w = g.getDropResult();
      v && w && alert(`You dropped ${v.hierarchyIds} into ${w.hierarchyIds}!`);
    },
    collect: (v) => ({
      isDragging: v.isDragging(),
      handlerId: v.getHandlerId()
    })
  }), []), [{ canDrop: l, isOverCurrent: u }, d] = Fh(() => ({
    accept: "Node",
    drop: (v, g) => {
      if (!g.didDrop())
        return { hierarchyIds: na(n.current) };
    },
    collect: (v) => ({
      isOverCurrent: v.isOver({ shallow: !0 }),
      canDrop: v.canDrop()
    })
  }), []), p = Ma(n, Ma(s, d)), h = Ne((v) => {
    if (v.detail < 2)
      return;
    v.stopPropagation();
    const g = na(v.target);
    i((w) => {
      const S = [];
      for (let y = 0; y < g.length; y++) {
        const T = g[y];
        if (S.push(T), w[y] !== T)
          break;
      }
      return S;
    });
  }, [i]), b = Ne(() => {
    let v = t;
    return o[o.length - 1] === r && (v += " ecu-selected"), a && (v += " ecu-drag"), l && u && (v += " ecu-drop"), v.trim();
  }, [t, o, r, a, l, u]);
  return {
    ref: p,
    hierarchyId: r,
    onClick: h,
    className: b()
  };
}
function Ex({
  "data-ecu": e,
  className: t,
  children: n
}, r) {
  const {
    ref: o,
    className: i,
    hierarchyId: a,
    onClick: s
  } = Ox(e, t), l = Ma(r, o);
  return /* @__PURE__ */ q("div", {
    ref: l,
    className: i,
    "data-ecu": e,
    "data-ecu-hierarchy": a,
    onClick: s,
    children: n
  });
}
const Cx = ke(Ex);
export {
  Cx as Div,
  Tx as EcuMaster
};
