import{C as g,bQ as z,aH as v,D as b,W as C,i as d,j as _,r as w,q as i,H as B,o as n,c as u,v as f,d as o,f as m,w as P,as as A,M as N,k as j,s as q,_ as D,V as H,ak as I,n as L}from"./index-BYnOmLgs.js";const T=g({size:{type:[Number,String],values:z,default:"",validator:a=>v(a)},shape:{type:String,values:["circle","square"],default:"circle"},icon:{type:b},src:{type:String,default:""},alt:String,srcSet:String,fit:{type:C(String),default:"cover"}}),V={error:a=>a instanceof Event},F=d({name:"ElAvatar"}),M=d({...F,props:T,emits:V,setup(a,{emit:y}){const t=a,e=_("avatar"),c=w(!1),S=i(()=>{const{size:s,icon:l,shape:p}=t,r=[e.b()];return H(s)&&r.push(e.m(s)),l&&r.push(e.m("icon")),p&&r.push(e.m(p)),r}),h=i(()=>{const{size:s}=t;return v(s)?e.cssVarBlock({size:I(s)||""}):void 0}),E=i(()=>({objectFit:t.fit}));B(()=>t.src,()=>c.value=!1);function k(s){c.value=!0,y("error",s)}return(s,l)=>(n(),u("span",{class:q(o(S)),style:f(o(h))},[(s.src||s.srcSet)&&!c.value?(n(),u("img",{key:0,src:s.src,alt:s.alt,srcset:s.srcSet,style:f(o(E)),onError:k},null,44,["src","alt","srcset"])):s.icon?(n(),m(o(N),{key:1},{default:P(()=>[(n(),m(A(s.icon)))]),_:1})):j(s.$slots,"default",{key:2})],6))}});var Q=D(M,[["__file","avatar.vue"]]);const W=L(Q);export{W as E};
