function t(t,e,i,o){var s,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new r(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",b=g.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=o;const r=s.fromAttribute(e,t.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const r=this.constructor;if(!1===o&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??y)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,b?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+S,N=`<${T}>`,P=document,R=()=>P.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,M="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,L=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,G=P.createTreeWalker(P,129);function K(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,o=[];let s,r=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===z?"!--"===l[1]?n=U:void 0!==l[1]?n=L:void 0!==l[2]?(I.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=H):void 0!==l[3]&&(n=H):n===H?">"===l[0]?(n=s??z,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?H:'"'===l[3]?B:j):n===B||n===j?n=H:n===U||n===L?n=z:(n=H,s=void 0);const h=n===H&&t[e+1].startsWith("/>")?" ":"";r+=n===z?i+N:c>=0?(o.push(a),i.slice(0,c)+E+i.slice(c)+S+h):i+S+(-2===c?e:h)}return[K(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Z{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,r=0;const n=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=Z.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=c[r++],i=o.getAttribute(t).split(S),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(I.test(o.tagName)){const t=o.textContent.split(S),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],R()),G.nextNode(),a.push({type:2,index:++s});o.append(t[e],R())}}}else if(8===o.nodeType)if(o.data===T)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(S,t+1));)a.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,o){if(e===F)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const r=D(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=X(t,s._$AS(t,e.values),s,o)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??P).importNode(e,!0);G.currentNode=o;let s=G.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(s=G.nextNode(),r++)}return G.currentNode=P,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),D(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Y(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new Q(this.O(R()),this.O(R()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,o){const s=this.strings;let r=!1;if(void 0===s)t=X(this,t,e,0),r=!D(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const o=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=X(this,o[i+n],e,n),a===F&&(a=this._$AH[n]),r||=!D(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}r&&!o&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??W)===F)return;const i=this._$AH,o=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Z,Q),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new Q(e.insertBefore(R(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},ht=(t=dt,e,i)=>{const{kind:o,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function pt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}var gt,mt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(gt||(gt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(mt||(mt={}));var ft=function(t,e,i,o){o=o||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return s.detail=i,t.dispatchEvent(s),s};console.info("%c TILE-TRACKER-CARD %c 1.2.3 ","color: white; font-weight: bold; background: #1E88E5","color: #1E88E5; font-weight: bold; background: white");const bt="#4CAF50",_t="#4CAF50",vt="#FF9800",yt="#F44336",$t="mdi:battery",xt="mdi:battery-90",wt="mdi:battery-80",kt="mdi:battery-70",At="mdi:battery-60",Ct="mdi:battery-50",Et="mdi:battery-40",St="mdi:battery-30",Tt="mdi:battery-20",Nt="mdi:battery-10",Pt="mdi:battery-outline",Rt="mdi:battery-unknown",Dt=["C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6","C#6","D6","D#6","E6","F6","F#6","G6"],Ot=[{value:"1/32",label:"1/32",symbol:"𝅘𝅥𝅱"},{value:"1/16",label:"1/16",symbol:"𝅘𝅥𝅰"},{value:"1/8",label:"1/8",symbol:"♪"},{value:"dotted 1/8",label:"1/8.",symbol:"♪·"},{value:"1/4",label:"1/4",symbol:"♩"},{value:"dotted 1/4",label:"1/4.",symbol:"♩·"},{value:"1/2",label:"1/2",symbol:"𝅗𝅥"},{value:"3/4",label:"3/4",symbol:"𝅗𝅥·"},{value:"whole",label:"whole",symbol:"𝅝"}],Mt=["last_seen","latitude","longitude","source_type"];window.customCards=window.customCards||[],window.customCards.push({type:"tile-tracker-card",name:"Tile Tracker Card",description:"A card for displaying Tile device trackers with ring control and song composer"});let zt=class extends at{constructor(){super(...arguments),this._showConfig=!1,this._showComposer=!1,this._composerNotes=[],this._selectedDuration="1/8",this._songName="Custom Song",this._isRingLoading=!1,this._showLostConfirm=!1,this._ringTimer=null}static async getConfigElement(){return await Promise.resolve().then(function(){return Ht}),document.createElement("tile-tracker-card-editor")}static getStubConfig(){return{type:"custom:tile-tracker-card",entity:"",show_map:!0,show_attributes:Mt}}setConfig(t){if(!t.entity)throw new Error("You must specify an entity");if(!t.entity.startsWith("device_tracker."))throw new Error("Entity must be a device_tracker");this._config={show_map:!0,map_height:150,show_attributes:Mt,tap_action:{action:"more-info"},...t}}getCardSize(){let t=2;return this._config?.show_map&&(t+=3),this._config?.show_attributes?.length&&(t+=Math.ceil(this._config.show_attributes.length/2)),this._showConfig&&(t+=4),this._showComposer&&(t+=6),t}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config"))return!0;if(t.has("_showConfig"))return!0;if(t.has("_showComposer"))return!0;if(t.has("_showLostConfirm"))return!0;if(t.has("_composerNotes"))return!0;if(t.has("_selectedDuration"))return!0;if(!t.has("hass"))return!1;const e=t.get("hass");if(!e)return!0;const i=this._config.entity;return e.states[i]!==this.hass.states[i]}_getRelatedEntities(){const t=this.hass.states[this._config.entity],e=t?.attributes?.tile_uuid||t?.attributes?.tile_id||"",i=this._config.entity.replace("device_tracker.","");let o=i;if(i.length%2==0||i.includes("_")){const t=i.split("_");if(t.length>=2&&t.length%2==0){const e=t.length/2,i=t.slice(0,e).join("_");i===t.slice(e).join("_")&&(o=i)}}o||(o=e.substring(0,8));const s={tileId:e,volumeEntity:`select.${o}_default_volume`,durationEntity:`number.${o}_default_duration`,songEntity:`select.${o}_song`,lostSwitch:`switch.${o}_lost`,locateButton:`button.${o}_locate`};return console.debug("[Tile Tracker Card] Related entities:",{configEntity:this._config.entity,entitySlug:i,computedPrefix:o,entities:s,volumeStateExists:!!this.hass.states[s.volumeEntity],durationStateExists:!!this.hass.states[s.durationEntity],lostStateExists:!!this.hass.states[s.lostSwitch]}),s}_formatRelativeTime(t){if(!t)return null;try{const e=new Date(t),i=(new Date).getTime()-e.getTime();if(i<0)return"just now";const o=Math.floor(i/1e3),s=Math.floor(i/6e4),r=Math.floor(i/36e5),n=Math.floor(i/864e5),a=Math.floor(n/7),l=Math.floor(n/30);return o<60?"just now":1===s?"1 minute ago":s<60?`${s} minutes ago`:1===r?"1 hour ago":r<24?`${r} hours ago`:1===n?"1 day ago":n<7?`${n} days ago`:1===a?"1 week ago":a<4?`${a} weeks ago`:1===l?"1 month ago":l<12?`${l} months ago`:e.toLocaleDateString()}catch{return null}}render(){if(!this._config||!this.hass)return W;const t=this._config.entity,e=this.hass.states[t];if(!e)return V`
        <ha-card>
          <div class="warning">
            Entity not found: ${t}
          </div>
        </ha-card>
      `;const i=this._config.name||e.attributes.friendly_name||t,o=e.attributes.product||e.attributes.tile_type||"Tile",s=e.attributes.ring_state||"silent",r=this._getBatteryLevel(e),n=e.attributes.battery_status,a=n&&"none"!==n.toLowerCase()?n:"unknown",l=e.attributes.last_timestamp,c=this._formatRelativeTime(l),d=!0===e.attributes.lost;return V`
      <ha-card>
        ${this._renderHeader(i,o,s,r,a,c,d)}
        ${this._config.show_map?this._renderMap(e):W}
        ${this._renderAttributes(e)}
        ${this._showConfig?this._renderConfigPanel():W}
        ${W&&this._showComposer?this._renderSongComposer():W}
      </ha-card>
    `}_renderHeader(t,e,i,o,s,r,n){const a="ringing"===i,l=this._getBatteryInfo(o,s),c=a?bt:"var(--secondary-background-color)",d=a?"white":"var(--primary-text-color)",h=this._isRingLoading?"mdi:loading":a?"mdi:bell-ring":"mdi:bell";return V`
      <div class="header" @click=${this._handleHeaderClick}>
        <div class="info">
          <div class="name">${t}</div>
          <div class="subtitle">
            <span class="product">${e}</span>
            ${r?V`<span class="last-seen">• ${r}</span>`:W}
          </div>
        </div>
        <div class="controls">
          <div
            class="config-button"
            @click=${this._toggleConfig}
            title="Configure"
          >
            <ha-icon icon="mdi:cog"></ha-icon>
          </div>
          ${n?V`
            <div
              class="lost-badge"
              title="Tile is marked as lost (use Tile app to change)"
            >
              <ha-icon icon="mdi:alert-circle"></ha-icon>
              <span>Lost</span>
            </div>
          `:W}
          <button
            class="action-icon-button ${a?"active-ring":""} ${this._isRingLoading?"loading":""}"
            style="--btn-bg: ${c}; --btn-icon-color: ${d}"
            @click=${this._handleRingClick}
            title="Ring Tile"
            ?disabled=${this._isRingLoading}
          >
            <ha-icon icon="${h}" class="${this._isRingLoading?"spin":""}"></ha-icon>
          </button>
          <div class="battery" title="${l.tooltip}">
            <ha-icon
              icon="${l.icon}"
              style="color: ${l.color}"
            ></ha-icon>
            <span class="battery-text" style="color: ${l.color}">${l.text}</span>
          </div>
        </div>
      </div>
    `}_renderConfigPanel(){const t=this._getRelatedEntities(),e=this.hass.states[t.volumeEntity],i=this.hass.states[t.durationEntity],o=this.hass.states[t.songEntity];this.hass.states[t.lostSwitch];const s=e?.state||"medium",r=i?.state||"5",n=o?.state||"Default",a=o?.attributes?.available_songs||[{id:0,name:"Default"},{id:1,name:"Chirp"}];return V`
      <div class="divider"></div>
      <div class="config-panel">
        <div class="config-header">
          <span class="config-title">⚙️ Settings</span>
          <button class="close-btn" @click=${this._toggleConfig}>×</button>
        </div>

        <div class="config-grid">
          <!-- Default Song -->
          <div class="config-item">
            <label>Default Song</label>
            <div class="song-row">
              <select 
                .value=${n}
                @change=${t=>this._setSongOption(t.target.value)}
              >
                ${a.map(t=>V`<option value="${t.name}" ?selected=${t.name===n}>${t.name}</option>`)}
              </select>
              <!-- 
                SONG COMPOSER DISABLED: The song programming feature requires additional
                research. While the BLE protocol for sending song data blocks has been
                implemented following the node-tile reference, the Tile device returns
                ERROR_HASH on the final block. This suggests either:
                1. Songs may require device-specific encryption/signing with a private key
                2. The song data format may require specific header/metadata structure  
                3. There may be additional handshake or validation steps not yet discovered
                The underlying services (program_song, compose_song, play_preset_song) remain
                available for testing via Developer Tools > Services.
                See: https://github.com/lesleyxyz/node-tile for reference implementation.
              -->
              <!-- <button 
                class="compose-btn" 
                @click=${this._toggleComposer}
                title="Compose new song"
              >
                🎵
              </button> -->
            </div>
          </div>

          <!-- Default Volume -->
          <div class="config-item">
            <label>Default Volume</label>
            <select 
              .value=${s}
              @change=${t=>this._setVolume(t.target.value)}
            >
              <option value="low" ?selected=${"low"===s}>🔈 Low</option>
              <option value="medium" ?selected=${"medium"===s}>🔉 Medium</option>
              <option value="high" ?selected=${"high"===s}>🔊 High</option>
            </select>
          </div>

          <!-- Default Duration -->
          <div class="config-item">
            <label>Default Duration (seconds)</label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              .value=${r}
              @input=${t=>this._setDuration(parseInt(t.target.value))}
            />
            <span class="duration-value">${r}s</span>
          </div>
        </div>
      </div>
    `}_renderSongComposer(){return V`
      <div class="divider"></div>
      <div class="composer-panel">
        <div class="composer-header">
          <span class="composer-title">🎹 Song Composer</span>
          <button class="close-btn" @click=${this._toggleComposer}>×</button>
        </div>

        <!-- Song Name -->
        <div class="composer-row">
          <label>Song Name:</label>
          <input 
            type="text" 
            .value=${this._songName}
            @input=${t=>this._songName=t.target.value}
            placeholder="My Custom Song"
          />
        </div>

        <!-- Duration Selector -->
        <div class="composer-row">
          <label>Note Duration:</label>
          <div class="duration-buttons">
            ${Ot.map(t=>V`
              <button 
                class="dur-btn ${t.value===this._selectedDuration?"selected":""}"
                @click=${()=>this._selectedDuration=t.value}
                title="${t.label}"
              >
                ${t.symbol}
              </button>
            `)}
            <button class="dur-btn rest-btn" @click=${this._addRest} title="Add Rest">
              🔇
            </button>
          </div>
        </div>

        <!-- Piano -->
        <div class="piano-wrapper">
          <div class="piano">
            ${this._renderPianoKeys()}
          </div>
        </div>

        <!-- Notes Display -->
        <div class="notes-display">
          ${0===this._composerNotes.length?V`<span class="empty-notes">Click piano keys to add notes...</span>`:this._composerNotes.map((t,e)=>V`
                <span 
                  class="note-chip ${"Rest"===t.note?"rest":""}"
                  @click=${()=>this._removeNote(e)}
                  title="Click to remove"
                >
                  ${"Rest"===t.note?"🔇":t.note}:${t.duration}
                </span>
              `)}
        </div>
        <div class="notes-count">${this._composerNotes.length} notes</div>

        <!-- Composer Actions -->
        <div class="composer-actions">
          <button class="action-btn danger" @click=${this._clearNotes}>Clear</button>
          <button class="action-btn secondary" @click=${this._undoNote} ?disabled=${0===this._composerNotes.length}>Undo</button>
          <button class="action-btn secondary" @click=${this._toggleComposer}>Cancel</button>
          <button 
            class="action-btn primary" 
            @click=${this._programCustomSong}
            ?disabled=${0===this._composerNotes.length}
          >
            Program to Tile
          </button>
        </div>
      </div>
    `}_renderPianoKeys(){const t=Dt.filter(t=>!t.includes("#"));return V`
      ${t.map((t,e)=>{const i=Dt.find(e=>e.startsWith(t[0])&&e.includes("#")&&e.endsWith(t.slice(-1)));return V`
          <div class="white-key" @click=${()=>this._addNote(t)} data-note="${t}">
            ${t}
          </div>
          ${i?V`
            <div 
              class="black-key" 
              @click=${t=>{t.stopPropagation(),this._addNote(i)}}
              style="left: ${28*(e+1)-9}px"
            >
              ${i.replace("#","♯")}
            </div>
          `:W}
        `})}
    `}_renderMap(t){const e=t.attributes.latitude,i=t.attributes.longitude;if(!e||!i)return V`
        <div class="map-placeholder">
          <ha-icon icon="mdi:map-marker-question"></ha-icon>
          <span>Location unavailable</span>
        </div>
      `;const o=this._config.map_height||150;return V`
      <div class="map-container" style="height: ${o}px">
        <iframe
          src="${`https://www.openstreetmap.org/export/embed.html?bbox=${i-.005}%2C${e-.005}%2C${i+.005}%2C${e+.005}&layer=mapnik&marker=${e}%2C${i}`}"
          style="border: 0; width: 100%; height: 100%;"
          loading="lazy"
          title="Tile Location Map"
        ></iframe>
      </div>
    `}_renderAttributes(t){const e=this._config.show_attributes||[];if(!e.length)return W;const i=e.filter(e=>void 0!==t.attributes[e]);return i.length?V`
      <div class="divider"></div>
      <div class="attributes">
        ${i.map(e=>this._renderAttribute(e,t.attributes[e]))}
      </div>
    `:W}_renderAttribute(t,e){const i=this._formatAttributeName(t),o=this._formatAttributeValue(t,e);return V`
      <div class="attribute">
        <div class="attr-name">${i}</div>
        <div class="attr-value">${o}</div>
      </div>
    `}_formatAttributeName(t){return t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}_formatAttributeValue(t,e){if(null==e)return"Unknown";if("last_seen"===t&&"string"==typeof e)try{return new Date(e).toLocaleString()}catch{return String(e)}return"latitude"!==t&&"longitude"!==t||"number"!=typeof e?String(e):e.toFixed(6)}_getBatteryLevel(t){const e=t.attributes.battery_level;if("number"==typeof e)return e;if("string"==typeof e){const t=parseInt(e,10);return isNaN(t)?null:t}return null}_getBatteryInfo(t,e){const i=t=>t?t.charAt(0).toUpperCase()+t.slice(1).toLowerCase():"";if(null===t){const t=e.toLowerCase();return t.includes("full")||t.includes("high")?{icon:$t,color:_t,tooltip:`Battery: ${e}`,text:i(e)}:t.includes("medium")||t.includes("ok")?{icon:Ct,color:vt,tooltip:`Battery: ${e}`,text:i(e)}:t.includes("low")?{icon:Tt,color:yt,tooltip:`Battery: ${e}`,text:i(e)}:{icon:Rt,color:"#9E9E9E",tooltip:`Battery: ${e}`,text:"unknown"!==e?i(e):""}}let o=Pt,s=yt;return t>=95?(o=$t,s=_t):t>=85?(o=xt,s=_t):t>=75?(o=wt,s=_t):t>=65?(o=kt,s=_t):t>=55?(o=At,s=_t):t>=45?(o=Ct,s=vt):t>=35?(o=Et,s=vt):t>=25?(o=St,s=vt):t>=15?(o=Tt,s=yt):t>=5&&(o=Nt,s=yt),{icon:o,color:s,tooltip:`Battery: ${t}%`,text:`${t}%`}}_handleHeaderClick(t){t.stopPropagation(),ft(this,"hass-more-info",{entityId:this._config.entity})}_toggleConfig(t){t.stopPropagation(),this._showConfig=!this._showConfig,this._showConfig&&(this._showComposer=!1)}_toggleComposer(t){t?.stopPropagation(),this._showComposer=!this._showComposer}_handleRingClick(t){if(t.stopPropagation(),this._isRingLoading)return;const e=this._getRelatedEntities(),i=this.hass.states[this._config.entity],o=i?.attributes?.duration||5;this._isRingLoading=!0,this._ringTimer&&clearTimeout(this._ringTimer),this._ringTimer=setTimeout(()=>{this._isRingLoading=!1,this._ringTimer=null},1e3*o),this.hass.callService("button","press",{entity_id:e.locateButton})}_setVolume(t){const e=this._getRelatedEntities();console.info("[Tile Tracker Card] Setting volume:",t,"on entity:",e.volumeEntity),this.hass.callService("select","select_option",{entity_id:e.volumeEntity,option:t})}_setDuration(t){const e=this._getRelatedEntities();console.info("[Tile Tracker Card] Setting duration:",t,"on entity:",e.durationEntity),this.hass.callService("number","set_value",{entity_id:e.durationEntity,value:t})}_setSongOption(t){const e=this._getRelatedEntities();console.info("[Tile Tracker Card] Setting song:",t,"on entity:",e.songEntity),this.hass.callService("select","select_option",{entity_id:e.songEntity,option:t})}_toggleLost(t){const e=this._getRelatedEntities();console.info("[Tile Tracker Card] Toggling lost:",t,"on entity:",e.lostSwitch),this.hass.callService("switch",t?"turn_on":"turn_off",{entity_id:e.lostSwitch})}_programPreset(t){const e=this._getRelatedEntities();this.hass.callService("tile_tracker","play_preset_song",{tile_id:e.tileId,preset:t})}_addNote(t){this._composerNotes=[...this._composerNotes,{note:t,duration:this._selectedDuration}]}_addRest(){this._composerNotes=[...this._composerNotes,{note:"Rest",duration:this._selectedDuration}]}_removeNote(t){this._composerNotes=this._composerNotes.filter((e,i)=>i!==t)}_undoNote(){this._composerNotes=this._composerNotes.slice(0,-1)}_clearNotes(){this._composerNotes=[]}_programCustomSong(){if(0===this._composerNotes.length)return;const t=this._getRelatedEntities(),e=this._composerNotes.map(t=>"Rest"===t.note?`R:${t.duration}`:`${t.note}:${t.duration}`).join(" | ");this.hass.callService("tile_tracker","compose_song",{tile_id:t.tileId,notation:e,song_name:this._songName}),this._showComposer=!1,this._composerNotes=[]}static get styles(){return n`
      :host {
        display: block;
      }

      ha-card {
        padding: 0;
        overflow: hidden;
      }

      .warning {
        padding: 16px;
        color: var(--warning-color, #ffc107);
        text-align: center;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        cursor: pointer;
      }

      .header:hover {
        background: var(--secondary-background-color);
      }

      .info {
        flex: 1;
        min-width: 0;
      }

      .name {
        font-weight: 500;
        font-size: 1.1em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .subtitle {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .last-seen {
        opacity: 0.8;
      }

      .controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .config-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.2s;
      }

      .config-button:hover {
        background: var(--secondary-background-color);
      }

      .action-icon-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--btn-bg, var(--secondary-background-color));
        color: var(--btn-icon-color, var(--primary-text-color));
        border: none;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .action-icon-button:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .action-icon-button:active:not(:disabled) {
        transform: scale(0.95);
      }

      .action-icon-button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }

      .action-icon-button.active-ring {
        background: #4CAF50;
        color: white;
      }

      /* Lost status badge (read-only) */
      .lost-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 16px;
        background: var(--error-color, #f44336);
        color: white;
        font-size: 0.85em;
        font-weight: 500;
        cursor: help;
      }

      .lost-badge ha-icon {
        --mdc-icon-size: 18px;
      }

      .action-icon-button.loading {
        background: var(--primary-color);
        color: white;
      }

      .action-icon-button ha-icon {
        --mdc-icon-size: 24px;
      }

      .action-icon-button ha-icon.spin {
        animation: spin 1s linear infinite;
      }

      /* Keep old class for backwards compatibility */
      .ring-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--ring-bg, var(--secondary-background-color));
        color: var(--ring-icon-color, var(--primary-text-color));
        border: none;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .battery {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .battery ha-icon {
        --mdc-icon-size: 24px;
      }

      .battery-text {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .divider {
        height: 1px;
        background-color: var(--divider-color);
        margin: 0 16px;
      }

      /* Config Panel */
      .config-panel {
        padding: 16px;
        background: var(--secondary-background-color);
      }

      .config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .config-title {
        font-weight: 500;
        font-size: 1.1em;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 4px 8px;
      }

      .close-btn:hover {
        color: var(--primary-text-color);
      }

      .config-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .config-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .config-item.full-width {
        grid-column: 1 / -1;
      }

      .config-item label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }

      .config-item select,
      .config-item input[type="text"] {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .config-item input[type="range"] {
        width: 100%;
      }

      .duration-value {
        font-size: 0.9em;
        color: var(--primary-color);
        font-weight: 500;
      }

      .song-row {
        display: flex;
        gap: 8px;
      }

      .song-row select {
        flex: 1;
      }

      .compose-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        cursor: pointer;
        font-size: 1.1em;
      }

      .compose-btn:hover {
        opacity: 0.9;
      }

      .preset-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .preset-btn {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 0.85em;
        transition: all 0.2s;
      }

      .preset-btn:hover {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: var(--primary-color);
      }

      /* Switch toggle */
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .3s;
        border-radius: 26px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: var(--error-color, #f44336);
      }

      input:checked + .slider:before {
        transform: translateX(24px);
      }

      .lost-badge {
        color: var(--error-color, #f44336);
        font-size: 0.85em;
        font-weight: 500;
      }

      /* Song Composer */
      .composer-panel {
        padding: 16px;
        background: var(--secondary-background-color);
      }

      .composer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .composer-title {
        font-weight: 500;
        font-size: 1.1em;
      }

      .composer-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .composer-row label {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        min-width: 100px;
      }

      .composer-row input[type="text"] {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .duration-buttons {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .dur-btn {
        padding: 6px 10px;
        border: 2px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 1em;
        transition: all 0.2s;
      }

      .dur-btn:hover {
        border-color: var(--primary-color);
      }

      .dur-btn.selected {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border-color: var(--primary-color);
      }

      .rest-btn {
        background: var(--warning-color, #ffc107);
        border-color: var(--warning-color, #ffc107);
        color: #000;
      }

      /* Piano */
      .piano-wrapper {
        overflow-x: auto;
        margin: 12px 0;
      }

      .piano {
        display: flex;
        position: relative;
        height: 100px;
        min-width: 500px;
      }

      .white-key {
        width: 28px;
        height: 100%;
        background: linear-gradient(to bottom, #fff 0%, #f0f0f0 100%);
        border: 1px solid #ccc;
        border-radius: 0 0 4px 4px;
        cursor: pointer;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 4px;
        font-size: 8px;
        color: #666;
        user-select: none;
        transition: background 0.1s;
      }

      .white-key:hover {
        background: linear-gradient(to bottom, #e8f4fc 0%, #d0e8f0 100%);
      }

      .white-key:active {
        background: linear-gradient(to bottom, #4fc3f7 0%, #29b6f6 100%);
      }

      .black-key {
        width: 18px;
        height: 60%;
        background: linear-gradient(to bottom, #333 0%, #000 100%);
        border-radius: 0 0 3px 3px;
        position: absolute;
        z-index: 1;
        cursor: pointer;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 4px;
        font-size: 7px;
        color: #999;
        user-select: none;
        transition: background 0.1s;
      }

      .black-key:hover {
        background: linear-gradient(to bottom, #444 0%, #222 100%);
      }

      .black-key:active {
        background: linear-gradient(to bottom, #0277bd 0%, #01579b 100%);
      }

      /* Notes Display */
      .notes-display {
        background: var(--card-background-color);
        border-radius: 4px;
        padding: 12px;
        min-height: 50px;
        max-height: 100px;
        overflow-y: auto;
      }

      .empty-notes {
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 0.9em;
      }

      .note-chip {
        display: inline-block;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        padding: 4px 8px;
        border-radius: 12px;
        margin: 2px;
        font-size: 0.75em;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .note-chip.rest {
        background: var(--warning-color, #ffc107);
        color: #000;
      }

      .note-chip:hover {
        opacity: 0.7;
      }

      .notes-count {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin-top: 8px;
      }

      .composer-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
      }

      .action-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
        font-weight: 500;
        transition: opacity 0.2s;
      }

      .action-btn:hover:not(:disabled) {
        opacity: 0.9;
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-btn.primary {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        margin-left: auto;
      }

      .action-btn.secondary {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .action-btn.danger {
        background: var(--error-color, #f44336);
        color: #fff;
      }

      /* Map */
      .map-container {
        width: 100%;
        position: relative;
        overflow: hidden;
      }

      .map-container ha-map {
        height: 100%;
        width: 100%;
      }

      .map-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        color: var(--secondary-text-color);
        gap: 8px;
      }

      .map-placeholder ha-icon {
        --mdc-icon-size: 32px;
        opacity: 0.5;
      }

      /* Attributes */
      .attributes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px 16px;
      }

      .attribute {
        display: flex;
        flex-direction: column;
      }

      .attr-name {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        text-transform: capitalize;
      }

      .attr-value {
        font-size: 0.95em;
        word-break: break-word;
      }

      @media (max-width: 500px) {
        .config-grid {
          grid-template-columns: 1fr;
        }

        .preset-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .attributes {
          grid-template-columns: 1fr;
        }
      }
    `}};t([pt({attribute:!1})],zt.prototype,"hass",void 0),t([ut()],zt.prototype,"_config",void 0),t([ut()],zt.prototype,"_showConfig",void 0),t([ut()],zt.prototype,"_showComposer",void 0),t([ut()],zt.prototype,"_composerNotes",void 0),t([ut()],zt.prototype,"_selectedDuration",void 0),t([ut()],zt.prototype,"_songName",void 0),t([ut()],zt.prototype,"_isRingLoading",void 0),t([ut()],zt.prototype,"_showLostConfirm",void 0),zt=t([ct("tile-tracker-card")],zt);const Ut=[{value:"last_seen",label:"Last Seen"},{value:"latitude",label:"Latitude"},{value:"longitude",label:"Longitude"},{value:"source_type",label:"Source Type"},{value:"tile_id",label:"Tile ID"},{value:"battery_status",label:"Battery Status"},{value:"ring_state",label:"Ring State"},{value:"voip_state",label:"VoIP State"},{value:"firmware_version",label:"Firmware Version"},{value:"hardware_version",label:"Hardware Version"}];let Lt=class extends at{setConfig(t){this._config=t}_getDeviceTrackers(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).filter(t=>{const e=this.hass.states[t];return"tile"===e.attributes?.source||void 0!==e.attributes?.tile_id||t.toLowerCase().includes("tile")}).sort():[]}render(){if(!this.hass||!this._config)return V``;const t=this._getDeviceTrackers(),e=Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).sort();return V`
      <div class="card-config">
        <div class="field">
          <label>Entity *</label>
          <select
            .value=${this._config.entity||""}
            @change=${this._entityChanged}
          >
            <option value="">Select a Tile tracker...</option>
            ${t.length>0?V`
              <optgroup label="Tile Trackers">
                ${t.map(t=>V`
                  <option value=${t} ?selected=${this._config.entity===t}>
                    ${this.hass.states[t]?.attributes?.friendly_name||t}
                  </option>
                `)}
              </optgroup>
            `:W}
            ${e.length>t.length?V`
              <optgroup label="Other Device Trackers">
                ${e.filter(e=>!t.includes(e)).map(t=>V`
                    <option value=${t} ?selected=${this._config.entity===t}>
                      ${this.hass.states[t]?.attributes?.friendly_name||t}
                    </option>
                  `)}
              </optgroup>
            `:W}
          </select>
        </div>

        <div class="field">
          <label>Name (optional)</label>
          <input
            type="text"
            .value=${this._config.name||""}
            @input=${this._nameChanged}
            placeholder="Override display name"
          />
        </div>

        <div class="field checkbox">
          <label>
            <input
              type="checkbox"
              .checked=${!1!==this._config.show_map}
              @change=${this._showMapChanged}
            />
            Show Map
          </label>
        </div>

        ${!1!==this._config.show_map?V`
          <div class="field">
            <label>Map Height (px)</label>
            <input
              type="number"
              min="50"
              max="500"
              .value=${this._config.map_height||150}
              @input=${this._mapHeightChanged}
            />
          </div>
        `:W}

        <div class="field">
          <label>Attributes to Display</label>
          <div class="checkboxes">
            ${Ut.map(t=>V`
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  .checked=${(this._config.show_attributes||[]).includes(t.value)}
                  @change=${e=>this._attributeChanged(t.value,e.target.checked)}
                />
                ${t.label}
              </label>
            `)}
          </div>
        </div>
      </div>
    `}_entityChanged(t){const e=t.target.value;e!==this._config.entity&&this._updateConfig({entity:e})}_nameChanged(t){const e=t.target.value;if(e!==this._config.name)if(e)this._updateConfig({name:e});else{const t={...this._config};delete t.name,this._config=t,ft(this,"config-changed",{config:this._config})}}_showMapChanged(t){const e=t.target.checked;this._updateConfig({show_map:e})}_mapHeightChanged(t){const e=parseInt(t.target.value,10);isNaN(e)||e===this._config.map_height||this._updateConfig({map_height:e})}_attributeChanged(t,e){const i=this._config.show_attributes||[];let o;if(e&&!i.includes(t))o=[...i,t];else{if(e||!i.includes(t))return;o=i.filter(e=>e!==t)}this._updateConfig({show_attributes:o})}_updateConfig(t){this._config={...this._config,...t},ft(this,"config-changed",{config:this._config})}static get styles(){return n`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field > label {
        font-weight: 500;
        font-size: 0.9em;
        color: var(--primary-text-color);
      }

      .field.checkbox > label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      input[type="text"],
      input[type="number"],
      select {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 1em;
      }

      input[type="text"]:focus,
      input[type="number"]:focus,
      select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .checkboxes {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9em;
        cursor: pointer;
      }

      .checkbox-item input {
        cursor: pointer;
      }

      @media (max-width: 400px) {
        .checkboxes {
          grid-template-columns: 1fr;
        }
      }
    `}};t([pt({attribute:!1})],Lt.prototype,"hass",void 0),t([ut()],Lt.prototype,"_config",void 0),Lt=t([ct("tile-tracker-card-editor")],Lt);var Ht=Object.freeze({__proto__:null,get TileTrackerCardEditor(){return Lt}});export{zt as TileTrackerCard};
