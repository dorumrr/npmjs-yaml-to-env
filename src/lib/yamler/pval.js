const Char={ANCHOR:"&",COMMENT:"#",TAG:"!",DIRECTIVES_END:"-",DOCUMENT_END:"."},Type={ALIAS:"ALIAS",BLANK_LINE:"BLANK_LINE",BLOCK_FOLDED:"BLOCK_FOLDED",BLOCK_LITERAL:"BLOCK_LITERAL",COMMENT:"COMMENT",DIRECTIVE:"DIRECTIVE",DOCUMENT:"DOCUMENT",FLOW_MAP:"FLOW_MAP",FLOW_SEQ:"FLOW_SEQ",MAP:"MAP",MAP_KEY:"MAP_KEY",MAP_VALUE:"MAP_VALUE",PLAIN:"PLAIN",QUOTE_DOUBLE:"QUOTE_DOUBLE",QUOTE_SINGLE:"QUOTE_SINGLE",SEQ:"SEQ",SEQ_ITEM:"SEQ_ITEM"},defaultTagPrefix="tag:yaml.org,2002:",defaultTags={MAP:"tag:yaml.org,2002:map",SEQ:"tag:yaml.org,2002:seq",STR:"tag:yaml.org,2002:str"};function findLineStarts(t){const e=[0];let n=t.indexOf("\n");for(;-1!==n;)n+=1,e.push(n),n=t.indexOf("\n",n);return e}function getSrcInfo(t){let e,n;return"string"==typeof t?(e=findLineStarts(t),n=t):(Array.isArray(t)&&(t=t[0]),t&&t.context&&(t.lineStarts||(t.lineStarts=findLineStarts(t.context.src)),e=t.lineStarts,n=t.context.src)),{lineStarts:e,src:n}}function getLinePos(t,e){if("number"!=typeof t||t<0)return null;const{lineStarts:n,src:r}=getSrcInfo(e);if(!n||!r||t>r.length)return null;for(let e=0;e<n.length;++e){const r=n[e];if(t<r)return{line:e,col:t-n[e-1]+1};if(t===r)return{line:e+1,col:1}}const s=n.length;return{line:s,col:t-n[s-1]+1}}function getLine(t,e){const{lineStarts:n,src:r}=getSrcInfo(e);if(!n||!(t>=1)||t>n.length)return null;const s=n[t-1];let i=n[t];for(;i&&i>s&&"\n"===r[i-1];)--i;return r.slice(s,i)}function getPrettyContext({start:t,end:e},n,r=80){let s=getLine(t.line,n);if(!s)return null;let{col:i}=t;if(s.length>r)if(i<=r-10)s=s.substr(0,r-1)+"…";else{const t=Math.round(r/2);s.length>i+t&&(s=s.substr(0,i+t-1)+"…"),i-=s.length-r,s="…"+s.substr(1-r)}let o=1,a="";e&&(e.line===t.line&&i+(e.col-t.col)<=r+1?o=e.col-t.col:(o=Math.min(s.length+1,r)-i,a="…"));return`${s}\n${i>1?" ".repeat(i-1):""}${"^".repeat(o)}${a}`}class Range{static copy(t){return new Range(t.start,t.end)}constructor(t,e){this.start=t,this.end=e||t}isEmpty(){return"number"!=typeof this.start||!this.end||this.end<=this.start}setOrigRange(t,e){const{start:n,end:r}=this;if(0===t.length||r<=t[0])return this.origStart=n,this.origEnd=r,e;let s=e;for(;s<t.length&&!(t[s]>n);)++s;this.origStart=n+s;const i=s;for(;s<t.length&&!(t[s]>=r);)++s;return this.origEnd=r+s,i}}class Node{static addStringTerminator(t,e,n){if("\n"===n[n.length-1])return n;const r=Node.endOfWhiteSpace(t,e);return r>=t.length||"\n"===t[r]?n+"\n":n}static atDocumentBoundary(t,e,n){const r=t[e];if(!r)return!0;const s=t[e-1];if(s&&"\n"!==s)return!1;if(n){if(r!==n)return!1}else if(r!==Char.DIRECTIVES_END&&r!==Char.DOCUMENT_END)return!1;const i=t[e+1],o=t[e+2];if(i!==r||o!==r)return!1;const a=t[e+3];return!a||"\n"===a||"\t"===a||" "===a}static endOfIdentifier(t,e){let n=t[e];const r="<"===n,s=r?["\n","\t"," ",">"]:["\n","\t"," ","[","]","{","}",","];for(;n&&-1===s.indexOf(n);)n=t[e+=1];return r&&">"===n&&(e+=1),e}static endOfIndent(t,e){let n=t[e];for(;" "===n;)n=t[e+=1];return e}static endOfLine(t,e){let n=t[e];for(;n&&"\n"!==n;)n=t[e+=1];return e}static endOfWhiteSpace(t,e){let n=t[e];for(;"\t"===n||" "===n;)n=t[e+=1];return e}static startOfLine(t,e){let n=t[e-1];if("\n"===n)return e;for(;n&&"\n"!==n;)n=t[e-=1];return e+1}static endOfBlockIndent(t,e,n){const r=Node.endOfIndent(t,n);if(r>n+e)return r;{const e=Node.endOfWhiteSpace(t,r),n=t[e];if(!n||"\n"===n)return e}return null}static atBlank(t,e,n){const r=t[e];return"\n"===r||"\t"===r||" "===r||n&&!r}static nextNodeIsIndented(t,e,n){return!(!t||e<0)&&(e>0||n&&"-"===t)}static normalizeOffset(t,e){const n=t[e];return n?"\n"!==n&&"\n"===t[e-1]?e-1:Node.endOfWhiteSpace(t,e):e}static foldNewline(t,e,n){let r=0,s=!1,i="",o=t[e+1];for(;" "===o||"\t"===o||"\n"===o;){switch(o){case"\n":r=0,e+=1,i+="\n";break;case"\t":r<=n&&(s=!0),e=Node.endOfWhiteSpace(t,e+2)-1;break;case" ":r+=1,e+=1}o=t[e+1]}return i||(i=" "),o&&r<=n&&(s=!0),{fold:i,offset:e,error:s}}constructor(t,e,n){Object.defineProperty(this,"context",{value:n||null,writable:!0}),this.error=null,this.range=null,this.valueRange=null,this.props=e||[],this.type=t,this.value=null}getPropValue(t,e,n){if(!this.context)return null;const{src:r}=this.context,s=this.props[t];return s&&r[s.start]===e?r.slice(s.start+(n?1:0),s.end):null}get anchor(){for(let t=0;t<this.props.length;++t){const e=this.getPropValue(t,Char.ANCHOR,!0);if(null!=e)return e}return null}get comment(){const t=[];for(let e=0;e<this.props.length;++e){const n=this.getPropValue(e,Char.COMMENT,!0);null!=n&&t.push(n)}return t.length>0?t.join("\n"):null}commentHasRequiredWhitespace(t){const{src:e}=this.context;if(this.header&&t===this.header.end)return!1;if(!this.valueRange)return!1;const{end:n}=this.valueRange;return t!==n||Node.atBlank(e,n-1)}get hasComment(){if(this.context){const{src:t}=this.context;for(let e=0;e<this.props.length;++e)if(t[this.props[e].start]===Char.COMMENT)return!0}return!1}get hasProps(){if(this.context){const{src:t}=this.context;for(let e=0;e<this.props.length;++e)if(t[this.props[e].start]!==Char.COMMENT)return!0}return!1}get includesTrailingLines(){return!1}get jsonLike(){return-1!==[Type.FLOW_MAP,Type.FLOW_SEQ,Type.QUOTE_DOUBLE,Type.QUOTE_SINGLE].indexOf(this.type)}get rangeAsLinePos(){if(!this.range||!this.context)return;const t=getLinePos(this.range.start,this.context.root);if(!t)return;return{start:t,end:getLinePos(this.range.end,this.context.root)}}get rawValue(){if(!this.valueRange||!this.context)return null;const{start:t,end:e}=this.valueRange;return this.context.src.slice(t,e)}get tag(){for(let t=0;t<this.props.length;++t){const e=this.getPropValue(t,Char.TAG,!1);if(null!=e){if("<"===e[1])return{verbatim:e.slice(2,-1)};{const[t,n,r]=e.match(/^(.*!)([^!]*)$/);return{handle:n,suffix:r}}}}return null}get valueRangeContainsNewline(){if(!this.valueRange||!this.context)return!1;const{start:t,end:e}=this.valueRange,{src:n}=this.context;for(let r=t;r<e;++r)if("\n"===n[r])return!0;return!1}parseComment(t){const{src:e}=this.context;if(e[t]===Char.COMMENT){const n=Node.endOfLine(e,t+1),r=new Range(t,n);return this.props.push(r),n}return t}setOrigRanges(t,e){return this.range&&(e=this.range.setOrigRange(t,e)),this.valueRange&&this.valueRange.setOrigRange(t,e),this.props.forEach((n=>n.setOrigRange(t,e))),e}toString(){const{context:{src:t},range:e,value:n}=this;if(null!=n)return n;const r=t.slice(e.start,e.end);return Node.addStringTerminator(t,e.end,r)}}class YAMLError extends Error{constructor(t,e,n){if(!(n&&e instanceof Node))throw new Error(`Invalid arguments for new ${t}`);super(),this.name=t,this.message=n,this.source=e}makePretty(){if(!this.source)return;this.nodeType=this.source.type;const t=this.source.context&&this.source.context.root;if("number"==typeof this.offset){this.range=new Range(this.offset,this.offset+1);const e=t&&getLinePos(this.offset,t);if(e){const t={line:e.line,col:e.col+1};this.linePos={start:e,end:t}}delete this.offset}else this.range=this.source.range,this.linePos=this.source.rangeAsLinePos;if(this.linePos){const{line:e,col:n}=this.linePos.start;this.message+=` at line ${e}, column ${n}`;const r=t&&getPrettyContext(this.linePos,t);r&&(this.message+=`:\n\n${r}\n`)}delete this.source}}class YAMLReferenceError extends YAMLError{constructor(t,e){super("YAMLReferenceError",t,e)}}class YAMLSemanticError extends YAMLError{constructor(t,e){super("YAMLSemanticError",t,e)}}class YAMLSyntaxError extends YAMLError{constructor(t,e){super("YAMLSyntaxError",t,e)}}class YAMLWarning extends YAMLError{constructor(t,e){super("YAMLWarning",t,e)}}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class PlainValue extends Node{static endOfLine(t,e,n){let r=t[e],s=e;for(;r&&"\n"!==r&&(!n||"["!==r&&"]"!==r&&"{"!==r&&"}"!==r&&","!==r);){const e=t[s+1];if(":"===r&&(!e||"\n"===e||"\t"===e||" "===e||n&&","===e))break;if((" "===r||"\t"===r)&&"#"===e)break;s+=1,r=e}return s}get strValue(){if(!this.valueRange||!this.context)return null;let{start:t,end:e}=this.valueRange;const{src:n}=this.context;let r=n[e-1];for(;t<e&&("\n"===r||"\t"===r||" "===r);)r=n[--e-1];let s="";for(let r=t;r<e;++r){const t=n[r];if("\n"===t){const{fold:t,offset:e}=Node.foldNewline(n,r,-1);s+=t,r=e}else if(" "===t||"\t"===t){const i=r;let o=n[r+1];for(;r<e&&(" "===o||"\t"===o);)r+=1,o=n[r+1];"\n"!==o&&(s+=r>i?n.slice(i,r+1):t)}else s+=t}const i=n[t];switch(i){case"\t":return{errors:[new YAMLSemanticError(this,"Plain value cannot start with a tab character")],str:s};case"@":case"`":return{errors:[new YAMLSemanticError(this,`Plain value cannot start with reserved character ${i}`)],str:s};default:return s}}parseBlockValue(t){const{indent:e,inFlow:n,src:r}=this.context;let s=t,i=t;for(let t=r[s];"\n"===t&&!Node.atDocumentBoundary(r,s+1);t=r[s]){const t=Node.endOfBlockIndent(r,e,s+1);if(null===t||"#"===r[t])break;"\n"===r[t]?s=t:(i=PlainValue.endOfLine(r,t,n),s=i)}return this.valueRange.isEmpty()&&(this.valueRange.start=t),this.valueRange.end=i,i}parse(t,e){this.context=t;const{inFlow:n,src:r}=t;let s=e;const i=r[s];return i&&"#"!==i&&"\n"!==i&&(s=PlainValue.endOfLine(r,e,n)),this.valueRange=new Range(e,s),s=Node.endOfWhiteSpace(r,s),s=this.parseComment(s),this.hasComment&&!this.valueRange.isEmpty()||(s=this.parseBlockValue(s)),s}}exports.Char=Char,exports.Node=Node,exports.PlainValue=PlainValue,exports.Range=Range,exports.Type=Type,exports.YAMLError=YAMLError,exports.YAMLReferenceError=YAMLReferenceError,exports.YAMLSemanticError=YAMLSemanticError,exports.YAMLSyntaxError=YAMLSyntaxError,exports.YAMLWarning=YAMLWarning,exports._defineProperty=_defineProperty,exports.defaultTagPrefix=defaultTagPrefix,exports.defaultTags=defaultTags;
