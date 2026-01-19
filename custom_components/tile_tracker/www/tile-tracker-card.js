function t(t,e,o,i){var s,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,o,i);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(r<3?s(n):r>3?s(e,o,n):s(e,o))||n);return r>3&&n&&Object.defineProperty(e,o,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,o=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new r(o,t,i)},a=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",b=g.reactiveElementPolyfillSupport,_=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},y=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);s?.call(this,e),this.requestUpdate(t,r,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(o)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const o of i){const i=document.createElement("style"),s=e.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(e,o.type);this._$Em=t,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const r=s.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,o,i=!1,s){if(void 0!==t){const r=this.constructor;if(!1===i&&(s=this[t]),o??=r.getPropertyOptions(t),!((o.hasChanged??y)(s,e)||o.useDefault&&o.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:s},r){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,b?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,C=w.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+S,T=`<${N}>`,P=document,R=()=>P.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,M="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,U=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...o)=>({_$litType$:t,strings:e,values:o}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,G=P.createTreeWalker(P,129);function K(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const o=t.length-1,i=[];let s,r=2===e?"<svg>":3===e?"<math>":"",n=z;for(let e=0;e<o;e++){const o=t[e];let a,c,l=-1,d=0;for(;d<o.length&&(n.lastIndex=d,c=n.exec(o),null!==c);)d=n.lastIndex,n===z?"!--"===c[1]?n=O:void 0!==c[1]?n=U:void 0!==c[2]?(I.test(c[2])&&(s=RegExp("</"+c[2],"g")),n=H):void 0!==c[3]&&(n=H):n===H?">"===c[0]?(n=s??z,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?H:'"'===c[3]?B:j):n===B||n===j?n=H:n===O||n===U?n=z:(n=H,s=void 0);const h=n===H&&t[e+1].startsWith("/>")?" ":"";r+=n===z?o+T:l>=0?(i.push(a),o.slice(0,l)+E+o.slice(l)+S+h):o+S+(-2===l?e:h)}return[K(t,r+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let s=0,r=0;const n=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=Y.createElement(c,o),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[r++],o=i.getAttribute(t).split(S),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:o,ctor:"."===n[1]?et:"?"===n[1]?ot:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:s}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],R()),G.nextNode(),a.push({type:2,index:++s});i.append(t[e],R())}}}else if(8===i.nodeType)if(i.data===N)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const o=P.createElement("template");return o.innerHTML=t,o}}function Z(t,e,o=t,i){if(e===F)return e;let s=void 0!==i?o._$Co?.[i]:o._$Cl;const r=D(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=s:o._$Cl=s),void 0!==s&&(e=Z(t,s._$AS(t,e.values),s,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);G.currentNode=i;let s=G.nextNode(),r=0,n=0,a=o[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=o[++n]}r!==a?.index&&(s=G.nextNode(),r++)}return G.currentNode=P,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),D(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&D(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=Y.createElement(K(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Y(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const s of t)i===e.length?e.push(o=new Q(this.O(R()),this.O(R()),this,this.options)):o=e[i],o._$AI(s),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=W}_$AI(t,e=this,o,i){const s=this.strings;let r=!1;if(void 0===s)t=Z(this,t,e,0),r=!D(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const i=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=Z(this,i[o+n],e,n),a===F&&(a=this._$AH[n]),r||=!D(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class ot extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends tt{constructor(t,e,o,i,s){super(t,e,o,i,s),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===F)return;const o=this._$AH,i=t===W&&o!==W||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==W&&(o===W||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Y,Q),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let s=i._$litPart$;if(void 0===s){const t=o?.renderBefore??null;i._$litPart$=s=new Q(e.insertBefore(R(),t),t,void 0,o??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},ht=(t=dt,e,o)=>{const{kind:i,metadata:s}=o;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(o.name,t),"accessor"===i){const{name:i}=o;return{set(o){const s=e.get.call(this);e.set.call(this,o),this.requestUpdate(i,s,t,!0,o)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=o;return function(o){const s=this[i];e.call(this,o),this.requestUpdate(i,s,t,!0,o)}}throw Error("Unsupported decorator location: "+i)};function pt(t){return(e,o)=>"object"==typeof o?ht(t,e,o):((t,e,o)=>{const i=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),i?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}function ut(t){return pt({...t,state:!0,attribute:!1})}var gt,mt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(gt||(gt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(mt||(mt={}));var ft=function(t,e,o,i){i=i||{},o=null==o?{}:o;var s=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=o,t.dispatchEvent(s),s};console.info("%c TILE-TRACKER-CARD %c 1.2.0 ","color: white; font-weight: bold; background: #1E88E5","color: #1E88E5; font-weight: bold; background: white");const bt="#4CAF50",_t="#4CAF50",vt="#FF9800",yt="#F44336",$t="mdi:battery",xt="mdi:battery-90",wt="mdi:battery-80",kt="mdi:battery-70",Ct="mdi:battery-60",At="mdi:battery-50",Et="mdi:battery-40",St="mdi:battery-30",Nt="mdi:battery-20",Tt="mdi:battery-10",Pt="mdi:battery-outline",Rt="mdi:battery-unknown",Dt=["C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4","C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5","C6","C#6","D6","D#6","E6","F6","F#6","G6"],Lt=[{value:"1/32",label:"1/32",symbol:"𝅘𝅥𝅱"},{value:"1/16",label:"1/16",symbol:"𝅘𝅥𝅰"},{value:"1/8",label:"1/8",symbol:"♪"},{value:"dotted 1/8",label:"1/8.",symbol:"♪·"},{value:"1/4",label:"1/4",symbol:"♩"},{value:"dotted 1/4",label:"1/4.",symbol:"♩·"},{value:"1/2",label:"1/2",symbol:"𝅗𝅥"},{value:"3/4",label:"3/4",symbol:"𝅗𝅥·"},{value:"whole",label:"whole",symbol:"𝅝"}],Mt=["last_seen","latitude","longitude","source_type"];window.customCards=window.customCards||[],window.customCards.push({type:"tile-tracker-card",name:"Tile Tracker Card",description:"A card for displaying Tile device trackers with ring control and song composer"});let zt=class extends at{constructor(){super(...arguments),this._showConfig=!1,this._showComposer=!1,this._composerNotes=[],this._selectedDuration="1/8",this._songName="Custom Song",this._isRingLoading=!1,this._showLostConfirm=!1,this._ringTimer=null}static async getConfigElement(){return await Promise.resolve().then(function(){return Ht}),document.createElement("tile-tracker-card-editor")}static getStubConfig(){return{type:"custom:tile-tracker-card",entity:"",show_map:!0,show_attributes:Mt}}setConfig(t){if(!t.entity)throw new Error("You must specify an entity");if(!t.entity.startsWith("device_tracker."))throw new Error("Entity must be a device_tracker");this._config={show_map:!0,map_height:150,show_attributes:Mt,tap_action:{action:"more-info"},...t}}getCardSize(){let t=2;return this._config?.show_map&&(t+=3),this._config?.show_attributes?.length&&(t+=Math.ceil(this._config.show_attributes.length/2)),this._showConfig&&(t+=4),this._showComposer&&(t+=6),t}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config"))return!0;if(t.has("_showConfig"))return!0;if(t.has("_showComposer"))return!0;if(t.has("_showLostConfirm"))return!0;if(t.has("_composerNotes"))return!0;if(t.has("_selectedDuration"))return!0;if(!t.has("hass"))return!1;const e=t.get("hass");if(!e)return!0;const o=this._config.entity;return e.states[o]!==this.hass.states[o]}_getRelatedEntities(){const t=this.hass.states[this._config.entity],e=t?.attributes?.tile_uuid||t?.attributes?.tile_id||"",o=(t?.attributes?.friendly_name||"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")||e.substring(0,8);return{tileId:e,volumeEntity:`select.${o}_default_volume`,durationEntity:`number.${o}_default_duration`,songEntity:`select.${o}_song`,lostSwitch:`switch.${o}_lost`,locateButton:`button.${o}_locate`}}_formatRelativeTime(t){if(!t)return null;try{const e=new Date(t),o=(new Date).getTime()-e.getTime();if(o<0)return"just now";const i=Math.floor(o/1e3),s=Math.floor(o/6e4),r=Math.floor(o/36e5),n=Math.floor(o/864e5),a=Math.floor(n/7),c=Math.floor(n/30);return i<60?"just now":1===s?"1 minute ago":s<60?`${s} minutes ago`:1===r?"1 hour ago":r<24?`${r} hours ago`:1===n?"1 day ago":n<7?`${n} days ago`:1===a?"1 week ago":a<4?`${a} weeks ago`:1===c?"1 month ago":c<12?`${c} months ago`:e.toLocaleDateString()}catch{return null}}render(){if(!this._config||!this.hass)return W;const t=this._config.entity,e=this.hass.states[t];if(!e)return V`
        <ha-card>
          <div class="warning">
            Entity not found: ${t}
          </div>
        </ha-card>
      `;const o=this._config.name||e.attributes.friendly_name||t,i=e.attributes.product||e.attributes.tile_type||"Tile",s=e.attributes.ring_state||"silent",r=this._getBatteryLevel(e),n=e.attributes.battery_status,a=n&&"none"!==n.toLowerCase()?n:"unknown",c=e.attributes.last_timestamp,l=this._formatRelativeTime(c),d=!0===e.attributes.lost;return V`
      <ha-card>
        ${this._renderHeader(o,i,s,r,a,l,d)}
        ${this._config.show_map?this._renderMap(e):W}
        ${this._renderAttributes(e)}
        ${this._showConfig?this._renderConfigPanel():W}
        ${W&&this._showComposer?this._renderSongComposer():W}
      </ha-card>
    `}_renderHeader(t,e,o,i,s,r,n){const a="ringing"===o,c=this._getBatteryInfo(i,s),l=a?bt:"var(--secondary-background-color)",d=a?"white":"var(--primary-text-color)",h=this._isRingLoading?"mdi:loading":a?"mdi:bell-ring":"mdi:bell",p=n?"var(--error-color, #f44336)":"var(--secondary-background-color)",u=n?"white":"var(--primary-text-color)";return V`
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
          <button
            class="action-icon-button ${n?"active-lost":""}"
            style="--btn-bg: ${p}; --btn-icon-color: ${u}"
            @click=${this._handleLostClick}
            title="${n?"Tile is marked as lost":"Mark as lost"}"
          >
            <ha-icon icon="${n?"mdi:alert-circle":"mdi:crosshairs-question"}"></ha-icon>
          </button>
          <button
            class="action-icon-button ${a?"active-ring":""} ${this._isRingLoading?"loading":""}"
            style="--btn-bg: ${l}; --btn-icon-color: ${d}"
            @click=${this._handleRingClick}
            title="Ring Tile"
            ?disabled=${this._isRingLoading}
          >
            <ha-icon icon="${h}" class="${this._isRingLoading?"spin":""}"></ha-icon>
          </button>
          <div class="battery" title="${c.tooltip}">
            <ha-icon
              icon="${c.icon}"
              style="color: ${c.color}"
            ></ha-icon>
            <span class="battery-text" style="color: ${c.color}">${c.text}</span>
          </div>
        </div>
      </div>
      ${this._showLostConfirm?this._renderLostConfirmDialog():W}
    `}_renderConfigPanel(){const t=this._getRelatedEntities(),e=this.hass.states[t.volumeEntity],o=this.hass.states[t.durationEntity],i=this.hass.states[t.songEntity];this.hass.states[t.lostSwitch];const s=e?.state||"medium",r=o?.state||"5",n=i?.state||"Default",a=i?.attributes?.available_songs||[{id:0,name:"Default"},{id:1,name:"Chirp"}];return V`
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
            ${Lt.map(t=>V`
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
      ${t.map((t,e)=>{const o=Dt.find(e=>e.startsWith(t[0])&&e.includes("#")&&e.endsWith(t.slice(-1)));return V`
          <div class="white-key" @click=${()=>this._addNote(t)} data-note="${t}">
            ${t}
          </div>
          ${o?V`
            <div 
              class="black-key" 
              @click=${t=>{t.stopPropagation(),this._addNote(o)}}
              style="left: ${28*(e+1)-9}px"
            >
              ${o.replace("#","♯")}
            </div>
          `:W}
        `})}
    `}_renderMap(t){const e=t.attributes.latitude,o=t.attributes.longitude;if(!e||!o)return V`
        <div class="map-placeholder">
          <ha-icon icon="mdi:map-marker-question"></ha-icon>
          <span>Location unavailable</span>
        </div>
      `;const i=this._config.map_height||150;return V`
      <div class="map-container" style="height: ${i}px">
        <iframe
          src="${`https://www.openstreetmap.org/export/embed.html?bbox=${o-.005}%2C${e-.005}%2C${o+.005}%2C${e+.005}&layer=mapnik&marker=${e}%2C${o}`}"
          style="border: 0; width: 100%; height: 100%;"
          loading="lazy"
          title="Tile Location Map"
        ></iframe>
      </div>
    `}_renderAttributes(t){const e=this._config.show_attributes||[];if(!e.length)return W;const o=e.filter(e=>void 0!==t.attributes[e]);return o.length?V`
      <div class="divider"></div>
      <div class="attributes">
        ${o.map(e=>this._renderAttribute(e,t.attributes[e]))}
      </div>
    `:W}_renderAttribute(t,e){const o=this._formatAttributeName(t),i=this._formatAttributeValue(t,e);return V`
      <div class="attribute">
        <div class="attr-name">${o}</div>
        <div class="attr-value">${i}</div>
      </div>
    `}_formatAttributeName(t){return t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}_formatAttributeValue(t,e){if(null==e)return"Unknown";if("last_seen"===t&&"string"==typeof e)try{return new Date(e).toLocaleString()}catch{return String(e)}return"latitude"!==t&&"longitude"!==t||"number"!=typeof e?String(e):e.toFixed(6)}_getBatteryLevel(t){const e=t.attributes.battery_level;if("number"==typeof e)return e;if("string"==typeof e){const t=parseInt(e,10);return isNaN(t)?null:t}return null}_getBatteryInfo(t,e){const o=t=>t?t.charAt(0).toUpperCase()+t.slice(1).toLowerCase():"";if(null===t){const t=e.toLowerCase();return t.includes("full")||t.includes("high")?{icon:$t,color:_t,tooltip:`Battery: ${e}`,text:o(e)}:t.includes("medium")||t.includes("ok")?{icon:At,color:vt,tooltip:`Battery: ${e}`,text:o(e)}:t.includes("low")?{icon:Nt,color:yt,tooltip:`Battery: ${e}`,text:o(e)}:{icon:Rt,color:"#9E9E9E",tooltip:`Battery: ${e}`,text:"unknown"!==e?o(e):""}}let i=Pt,s=yt;return t>=95?(i=$t,s=_t):t>=85?(i=xt,s=_t):t>=75?(i=wt,s=_t):t>=65?(i=kt,s=_t):t>=55?(i=Ct,s=_t):t>=45?(i=At,s=vt):t>=35?(i=Et,s=vt):t>=25?(i=St,s=vt):t>=15?(i=Nt,s=yt):t>=5&&(i=Tt,s=yt),{icon:i,color:s,tooltip:`Battery: ${t}%`,text:`${t}%`}}_handleHeaderClick(t){t.stopPropagation(),ft(this,"hass-more-info",{entityId:this._config.entity})}_toggleConfig(t){t.stopPropagation(),this._showConfig=!this._showConfig,this._showConfig&&(this._showComposer=!1)}_toggleComposer(t){t?.stopPropagation(),this._showComposer=!this._showComposer}_handleLostClick(t){t.stopPropagation();const e=this.hass.states[this._config.entity];!0===e?.attributes?.lost?this._toggleLost(!1):this._showLostConfirm=!0}_confirmMarkLost(){this._showLostConfirm=!1,this._toggleLost(!0)}_cancelLostConfirm(){this._showLostConfirm=!1}_renderLostConfirmDialog(){return V`
      <div class="confirm-overlay" @click=${this._cancelLostConfirm}>
        <div class="confirm-dialog" @click=${t=>t.stopPropagation()}>
          <div class="confirm-icon">🔍</div>
          <div class="confirm-title">Mark Tile as Lost?</div>
          <div class="confirm-message">
            This will notify Tile's community network to help locate your device.
            Your Tile will be flagged as lost in the Tile app and network.
          </div>
          <div class="confirm-actions">
            <button class="confirm-btn cancel" @click=${this._cancelLostConfirm}>Cancel</button>
            <button class="confirm-btn confirm" @click=${this._confirmMarkLost}>Mark as Lost</button>
          </div>
        </div>
      </div>
    `}_handleRingClick(t){if(t.stopPropagation(),this._isRingLoading)return;const e=this._getRelatedEntities(),o=this.hass.states[this._config.entity],i=o?.attributes?.duration||5;this._isRingLoading=!0,this._ringTimer&&clearTimeout(this._ringTimer),this._ringTimer=setTimeout(()=>{this._isRingLoading=!1,this._ringTimer=null},1e3*i),this.hass.callService("button","press",{entity_id:e.locateButton})}_setVolume(t){const e=this._getRelatedEntities();this.hass.callService("select","select_option",{entity_id:e.volumeEntity,option:t})}_setDuration(t){const e=this._getRelatedEntities();this.hass.callService("number","set_value",{entity_id:e.durationEntity,value:t})}_setSongOption(t){const e=this._getRelatedEntities();this.hass.callService("select","select_option",{entity_id:e.songEntity,option:t})}_toggleLost(t){const e=this._getRelatedEntities();this.hass.callService("switch",t?"turn_on":"turn_off",{entity_id:e.lostSwitch})}_programPreset(t){const e=this._getRelatedEntities();this.hass.callService("tile_tracker","play_preset_song",{tile_id:e.tileId,preset:t})}_addNote(t){this._composerNotes=[...this._composerNotes,{note:t,duration:this._selectedDuration}]}_addRest(){this._composerNotes=[...this._composerNotes,{note:"Rest",duration:this._selectedDuration}]}_removeNote(t){this._composerNotes=this._composerNotes.filter((e,o)=>o!==t)}_undoNote(){this._composerNotes=this._composerNotes.slice(0,-1)}_clearNotes(){this._composerNotes=[]}_programCustomSong(){if(0===this._composerNotes.length)return;const t=this._getRelatedEntities(),e=this._composerNotes.map(t=>"Rest"===t.note?`R:${t.duration}`:`${t.note}:${t.duration}`).join(" | ");this.hass.callService("tile_tracker","compose_song",{tile_id:t.tileId,notation:e,song_name:this._songName}),this._showComposer=!1,this._composerNotes=[]}static get styles(){return n`
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

      .action-icon-button.active-lost {
        background: var(--error-color, #f44336);
        color: white;
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

      /* Confirmation Dialog */
      .confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .confirm-dialog {
        background: var(--card-background-color, #fff);
        border-radius: 12px;
        padding: 24px;
        max-width: 320px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        text-align: center;
      }

      .confirm-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      .confirm-title {
        font-size: 1.2em;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-text-color);
      }

      .confirm-message {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        margin-bottom: 24px;
        line-height: 1.4;
      }

      .confirm-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .confirm-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.95em;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
        border: none;
      }

      .confirm-btn:hover {
        opacity: 0.9;
      }

      .confirm-btn.cancel {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .confirm-btn.confirm {
        background: var(--error-color, #f44336);
        color: white;
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
    `}};t([pt({attribute:!1})],zt.prototype,"hass",void 0),t([ut()],zt.prototype,"_config",void 0),t([ut()],zt.prototype,"_showConfig",void 0),t([ut()],zt.prototype,"_showComposer",void 0),t([ut()],zt.prototype,"_composerNotes",void 0),t([ut()],zt.prototype,"_selectedDuration",void 0),t([ut()],zt.prototype,"_songName",void 0),t([ut()],zt.prototype,"_isRingLoading",void 0),t([ut()],zt.prototype,"_showLostConfirm",void 0),zt=t([lt("tile-tracker-card")],zt);const Ot=[{value:"last_seen",label:"Last Seen"},{value:"latitude",label:"Latitude"},{value:"longitude",label:"Longitude"},{value:"source_type",label:"Source Type"},{value:"tile_id",label:"Tile ID"},{value:"battery_status",label:"Battery Status"},{value:"ring_state",label:"Ring State"},{value:"voip_state",label:"VoIP State"},{value:"firmware_version",label:"Firmware Version"},{value:"hardware_version",label:"Hardware Version"}];let Ut=class extends at{setConfig(t){this._config=t}_getDeviceTrackers(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).filter(t=>{const e=this.hass.states[t];return"tile"===e.attributes?.source||void 0!==e.attributes?.tile_id||t.toLowerCase().includes("tile")}).sort():[]}render(){if(!this.hass||!this._config)return V``;const t=this._getDeviceTrackers(),e=Object.keys(this.hass.states).filter(t=>t.startsWith("device_tracker.")).sort();return V`
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
            ${Ot.map(t=>V`
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
    `}_entityChanged(t){const e=t.target.value;e!==this._config.entity&&this._updateConfig({entity:e})}_nameChanged(t){const e=t.target.value;if(e!==this._config.name)if(e)this._updateConfig({name:e});else{const t={...this._config};delete t.name,this._config=t,ft(this,"config-changed",{config:this._config})}}_showMapChanged(t){const e=t.target.checked;this._updateConfig({show_map:e})}_mapHeightChanged(t){const e=parseInt(t.target.value,10);isNaN(e)||e===this._config.map_height||this._updateConfig({map_height:e})}_attributeChanged(t,e){const o=this._config.show_attributes||[];let i;if(e&&!o.includes(t))i=[...o,t];else{if(e||!o.includes(t))return;i=o.filter(e=>e!==t)}this._updateConfig({show_attributes:i})}_updateConfig(t){this._config={...this._config,...t},ft(this,"config-changed",{config:this._config})}static get styles(){return n`
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
    `}};t([pt({attribute:!1})],Ut.prototype,"hass",void 0),t([ut()],Ut.prototype,"_config",void 0),Ut=t([lt("tile-tracker-card-editor")],Ut);var Ht=Object.freeze({__proto__:null,get TileTrackerCardEditor(){return Ut}});export{zt as TileTrackerCard};
