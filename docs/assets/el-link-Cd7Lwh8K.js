import{F as m,G as y,j as c,k as v,s as h,o as n,c as o,g as r,w as g,av as b,e as i,Q as C,ai as l,v as d,m as f,_ as E,y as B}from"./index-BUA1jv6k.js";const _=m({type:{type:String,values:["primary","success","warning","info","danger","default"],default:"default"},underline:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},href:{type:String,default:""},target:{type:String,default:"_self"},icon:{type:y}}),w={click:t=>t instanceof MouseEvent},S=["href","target"],$=c({name:"ElLink"}),L=c({...$,props:_,emits:w,setup(t,{emit:u}){const s=t,a=v("link"),p=h(()=>[a.b(),a.m(s.type),a.is("disabled",s.disabled),a.is("underline",s.underline&&!s.disabled)]);function k(e){s.disabled||u("click",e)}return(e,I)=>(n(),o("a",{class:d(i(p)),href:e.disabled||!e.href?void 0:e.href,target:e.disabled||!e.href?void 0:e.target,onClick:k},[e.icon?(n(),r(i(C),{key:0},{default:g(()=>[(n(),r(b(e.icon)))]),_:1})):l("v-if",!0),e.$slots.default?(n(),o("span",{key:1,class:d(i(a).e("inner"))},[f(e.$slots,"default")],2)):l("v-if",!0),e.$slots.icon?f(e.$slots,"icon",{key:2}):l("v-if",!0)],10,S))}});var P=E(L,[["__file","link.vue"]]);const j=B(P);export{j as E};
