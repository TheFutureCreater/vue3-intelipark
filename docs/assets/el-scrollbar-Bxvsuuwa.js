import{F as A,_ as W,j as N,H as q,k as F,r as c,s as T,O as Q,bd as B,a5 as j,o as C,g as M,w as I,R as Z,b as O,v as L,e as b,x,S as ee,T as te,b2 as ae,c as G,d as D,U as le,Y as se,aK as R,am as U,L as Y,a3 as oe,a4 as X,M as re,K as ne,N as ie,c7 as ce,m as ue,av as ve,ai as fe,a1 as me,y as de}from"./index-DD-vFXzg.js";import{t as pe}from"./el-input-DPTDNp8d.js";import{u as he}from"./constants-DMJ24cW0.js";const H=4,be={vertical:{offset:"offsetHeight",scroll:"scrollTop",scrollSize:"scrollHeight",size:"height",key:"vertical",axis:"Y",client:"clientY",direction:"top"},horizontal:{offset:"offsetWidth",scroll:"scrollLeft",scrollSize:"scrollWidth",size:"width",key:"horizontal",axis:"X",client:"clientX",direction:"left"}},ye=({move:y,size:u,bar:o})=>({[o.size]:u,transform:`translate${o.axis}(${y}%)`}),$=Symbol("scrollbarContextKey"),ge=A({vertical:Boolean,size:String,move:Number,ratio:{type:Number,required:!0},always:Boolean}),Se="Thumb",we=N({__name:"thumb",props:ge,setup(y){const u=y,o=q($),l=F("scrollbar");o||pe(Se,"can not inject scrollbar context");const r=c(),v=c(),d=c({}),p=c(!1);let a=!1,h=!1,g=ae?document.onselectstart:null;const t=T(()=>be[u.vertical?"vertical":"horizontal"]),s=T(()=>ye({size:u.size,move:u.move,bar:t.value})),f=T(()=>r.value[t.value.offset]**2/o.wrapElement[t.value.scrollSize]/u.ratio/v.value[t.value.offset]),m=i=>{var w;if(i.stopPropagation(),i.ctrlKey||[1,2].includes(i.button))return;(w=window.getSelection())==null||w.removeAllRanges(),_(i);const E=i.currentTarget;E&&(d.value[t.value.axis]=E[t.value.offset]-(i[t.value.client]-E.getBoundingClientRect()[t.value.direction]))},z=i=>{if(!v.value||!r.value||!o.wrapElement)return;const w=Math.abs(i.target.getBoundingClientRect()[t.value.direction]-i[t.value.client]),E=v.value[t.value.offset]/2,P=(w-E)*100*f.value/r.value[t.value.offset];o.wrapElement[t.value.scroll]=P*o.wrapElement[t.value.scrollSize]/100},_=i=>{i.stopImmediatePropagation(),a=!0,document.addEventListener("mousemove",S),document.addEventListener("mouseup",n),g=document.onselectstart,document.onselectstart=()=>!1},S=i=>{if(!r.value||!v.value||a===!1)return;const w=d.value[t.value.axis];if(!w)return;const E=(r.value.getBoundingClientRect()[t.value.direction]-i[t.value.client])*-1,P=v.value[t.value.offset]-w,J=(E-P)*100*f.value/r.value[t.value.offset];o.wrapElement[t.value.scroll]=J*o.wrapElement[t.value.scrollSize]/100},n=()=>{a=!1,d.value[t.value.axis]=0,document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",n),K(),h&&(p.value=!1)},e=()=>{h=!1,p.value=!!u.size},k=()=>{h=!0,p.value=a};Q(()=>{K(),document.removeEventListener("mouseup",n)});const K=()=>{document.onselectstart!==g&&(document.onselectstart=g)};return B(j(o,"scrollbarElement"),"mousemove",e),B(j(o,"scrollbarElement"),"mouseleave",k),(i,w)=>(C(),M(te,{name:b(l).b("fade"),persisted:""},{default:I(()=>[Z(O("div",{ref_key:"instance",ref:r,class:L([b(l).e("bar"),b(l).is(b(t).key)]),onMousedown:z},[O("div",{ref_key:"thumb",ref:v,class:L(b(l).e("thumb")),style:x(b(s)),onMousedown:m},null,38)],34),[[ee,i.always||p.value]])]),_:1},8,["name"]))}});var V=W(we,[["__file","thumb.vue"]]);const ze=A({always:{type:Boolean,default:!0},minSize:{type:Number,required:!0}}),_e=N({__name:"bar",props:ze,setup(y,{expose:u}){const o=y,l=q($),r=c(0),v=c(0),d=c(""),p=c(""),a=c(1),h=c(1);return u({handleScroll:s=>{if(s){const f=s.offsetHeight-H,m=s.offsetWidth-H;v.value=s.scrollTop*100/f*a.value,r.value=s.scrollLeft*100/m*h.value}},update:()=>{const s=l==null?void 0:l.wrapElement;if(!s)return;const f=s.offsetHeight-H,m=s.offsetWidth-H,z=f**2/s.scrollHeight,_=m**2/s.scrollWidth,S=Math.max(z,o.minSize),n=Math.max(_,o.minSize);a.value=z/(f-z)/(S/(f-S)),h.value=_/(m-_)/(n/(m-n)),p.value=S+H<f?`${S}px`:"",d.value=n+H<m?`${n}px`:""}}),(s,f)=>(C(),G(le,null,[D(V,{move:r.value,ratio:h.value,size:d.value,always:s.always},null,8,["move","ratio","size","always"]),D(V,{move:v.value,ratio:a.value,size:p.value,vertical:"",always:s.always},null,8,["move","ratio","size","always"])],64))}});var Ee=W(_e,[["__file","bar.vue"]]);const He=A({height:{type:[String,Number],default:""},maxHeight:{type:[String,Number],default:""},native:{type:Boolean,default:!1},wrapStyle:{type:se([String,Object,Array]),default:""},wrapClass:{type:[String,Array],default:""},viewClass:{type:[String,Array],default:""},viewStyle:{type:[String,Array,Object],default:""},noresize:Boolean,tag:{type:String,default:"div"},always:Boolean,minSize:{type:Number,default:20},id:String,role:String,...he(["ariaLabel","ariaOrientation"])}),Te={scroll:({scrollTop:y,scrollLeft:u})=>[y,u].every(R)},ke="ElScrollbar",Re=N({name:ke}),Ce=N({...Re,props:He,emits:Te,setup(y,{expose:u,emit:o}){const l=y,r=F("scrollbar");let v,d;const p=c(),a=c(),h=c(),g=c(),t=T(()=>{const e={};return l.height&&(e.height=U(l.height)),l.maxHeight&&(e.maxHeight=U(l.maxHeight)),[l.wrapStyle,e]}),s=T(()=>[l.wrapClass,r.e("wrap"),{[r.em("wrap","hidden-default")]:!l.native}]),f=T(()=>[r.e("view"),l.viewClass]),m=()=>{var e;a.value&&((e=g.value)==null||e.handleScroll(a.value),o("scroll",{scrollTop:a.value.scrollTop,scrollLeft:a.value.scrollLeft}))};function z(e,k){me(e)?a.value.scrollTo(e):R(e)&&R(k)&&a.value.scrollTo(e,k)}const _=e=>{R(e)&&(a.value.scrollTop=e)},S=e=>{R(e)&&(a.value.scrollLeft=e)},n=()=>{var e;(e=g.value)==null||e.update()};return Y(()=>l.noresize,e=>{e?(v==null||v(),d==null||d()):({stop:v}=oe(h,n),d=B("resize",n))},{immediate:!0}),Y(()=>[l.maxHeight,l.height],()=>{l.native||X(()=>{var e;n(),a.value&&((e=g.value)==null||e.handleScroll(a.value))})}),re($,ne({scrollbarElement:p,wrapElement:a})),ie(()=>{l.native||X(()=>{n()})}),ce(()=>n()),u({wrapRef:a,update:n,scrollTo:z,setScrollTop:_,setScrollLeft:S,handleScroll:m}),(e,k)=>(C(),G("div",{ref_key:"scrollbarRef",ref:p,class:L(b(r).b())},[O("div",{ref_key:"wrapRef",ref:a,class:L(b(s)),style:x(b(t)),onScroll:m},[(C(),M(ve(e.tag),{id:e.id,ref_key:"resizeRef",ref:h,class:L(b(f)),style:x(e.viewStyle),role:e.role,"aria-label":e.ariaLabel,"aria-orientation":e.ariaOrientation},{default:I(()=>[ue(e.$slots,"default")]),_:3},8,["id","class","style","role","aria-label","aria-orientation"]))],38),e.native?fe("v-if",!0):(C(),M(Ee,{key:0,ref_key:"barRef",ref:g,always:e.always,"min-size":e.minSize},null,8,["always","min-size"]))],2))}});var Le=W(Ce,[["__file","scrollbar.vue"]]);const Me=de(Le);export{Me as E};
