import{C as m,D as y,i as c,j as g,q as h,o as a,c as o,f as r,w as v,as as b,d as t,M as C,ag as l,s as d,k as f,_ as E,n as B}from"./index-BYnOmLgs.js";const w=m({type:{type:String,values:["primary","success","warning","info","danger","default"],default:"default"},underline:{type:Boolean,default:!0},disabled:Boolean,href:{type:String,default:""},target:{type:String,default:"_self"},icon:{type:y}}),S={click:i=>i instanceof MouseEvent},$=c({name:"ElLink"}),L=c({...$,props:w,emits:S,setup(i,{emit:u}){const s=i,n=g("link"),p=h(()=>[n.b(),n.m(s.type),n.is("disabled",s.disabled),n.is("underline",s.underline&&!s.disabled)]);function k(e){s.disabled||u("click",e)}return(e,_)=>(a(),o("a",{class:d(t(p)),href:e.disabled||!e.href?void 0:e.href,target:e.disabled||!e.href?void 0:e.target,onClick:k},[e.icon?(a(),r(t(C),{key:0},{default:v(()=>[(a(),r(b(e.icon)))]),_:1})):l("v-if",!0),e.$slots.default?(a(),o("span",{key:1,class:d(t(n).e("inner"))},[f(e.$slots,"default")],2)):l("v-if",!0),e.$slots.icon?f(e.$slots,"icon",{key:2}):l("v-if",!0)],10,["href","target"]))}});var P=E(L,[["__file","link.vue"]]);const I=B(P);export{I as E};
