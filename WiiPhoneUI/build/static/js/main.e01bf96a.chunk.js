(this.webpackJsonpwiiphoneui=this.webpackJsonpwiiphoneui||[]).push([[0],{15:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var o=n(1),s=n(6),c=n.n(s),i=(n(15),n(3),n(4)),a=n(2),r=n(0);function u(e){return Object(r.jsx)("div",{className:"controllerButton "+(e.pressed?"controllerButtonActive ":"")+(e.round?"controllerButtonRound ":""),onTouchStart:function(){e.buttonPressed()},onTouchEnd:function(){e.buttonReleased()},children:e.buttonDisplay})}function l(){var e=Object(o.useState)({acceleration:{x:0,y:0,z:0},rotation:{alpha:0,beta:0,gamma:0}}),t=Object(a.a)(e,2),n=t[0],s=t[1],c=Object(o.useState)({timestamp:Date.now(),Recenter:0,A:0,B:0,One:0,Two:0,Minus:0,Plus:0,Home:0,Up:0,Down:0,Left:0,Right:0,acceleration:{x:0,y:0,z:0},rotation:{alpha:0,beta:0,gamma:0}}),l=Object(a.a)(c,2),d=l[0],b=l[1],j=Object(o.useState)(!1),p=Object(a.a)(j,2),f=p[0],O=p[1],m=Object(o.useState)(null),h=Object(a.a)(m,2),v=h[0],R=h[1],x=Object(o.useState)(!1),w=Object(a.a)(x,2),y=w[0],D=w[1],P=Object(o.useState)("N/A"),g=Object(a.a)(P,2),N=g[0],S=g[1];Object(o.useEffect)((function(){document.body.style.overflow="hidden";var e=window.location.href,t="wss://".concat(e.match(/^https?:\/\/([^:]+).+$/)[1],":1338"),n=new WebSocket(t);R(n),n.onopen=function(e){O(!0)},n.onmessage=function(e){S(e.data)}}),[]),Object(o.useEffect)((function(){b((function(e){return e.timestamp=Date.now(),e.acceleration=n.acceleration,e.rotation=n.rotation,f&&v.send(JSON.stringify(e)),Object(i.a)({},e)}))}),[n,v,f]);var W=function(e,t){d[e]=t,b(Object(i.a)({},d))};return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsxs)("div",{className:"infoWrapper",children:[Object(r.jsxs)("div",{children:["Connected: ",f.toString(),", Motion Enabled: ",y.toString()]}),Object(r.jsxs)("div",{children:["Controller Slot: ",N.toString()]}),Object(r.jsx)("button",{onClick:function(){null!=DeviceMotionEvent&&null!=DeviceMotionEvent.requestPermission&&"function"===typeof DeviceMotionEvent.requestPermission&&DeviceMotionEvent.requestPermission().then((function(e){"granted"===e&&(D(!0),window.addEventListener("devicemotion",(function(e){s((function(t){return{acceleration:{x:(0*t.acceleration.x+1*e.accelerationIncludingGravity.x)/9.8,y:(0*t.acceleration.z+1*e.accelerationIncludingGravity.z)/9.8,z:-(0*t.acceleration.y+1*e.accelerationIncludingGravity.y)/9.8},rotation:{alpha:0*t.rotation.alpha+1*e.rotationRate.alpha,beta:-(0*t.rotation.gamma+1*e.rotationRate.gamma),gamma:0*t.rotation.beta+1*e.rotationRate.beta}}}))})))}))},children:"Give Motion Control Permission"})]}),Object(r.jsxs)("div",{className:"controllerWrapper",children:[Object(r.jsx)("div",{className:"controllerRowWrapper",children:Object(r.jsx)(u,{buttonDisplay:"Center",pressed:1===d.Recenter,buttonPressed:function(){W("Recenter",1)},buttonReleased:function(){W("Recenter",0)}})}),Object(r.jsx)("div",{className:"controllerRowWrapper",children:Object(r.jsx)(u,{buttonDisplay:"^",pressed:1===d.Up,buttonPressed:function(){W("Up",1)},buttonReleased:function(){W("Up",0)}})}),Object(r.jsxs)("div",{className:"controllerRowWrapper",children:[Object(r.jsx)(u,{buttonDisplay:"<",pressed:1===d.Left,buttonPressed:function(){W("Left",1)},buttonReleased:function(){W("Left",0)}}),Object(r.jsx)(u,{buttonDisplay:">",pressed:1===d.Right,buttonPressed:function(){W("Right",1)},buttonReleased:function(){W("Right",0)}})]}),Object(r.jsx)("div",{className:"controllerRowWrapper",children:Object(r.jsx)(u,{buttonDisplay:"v",pressed:1===d.Down,buttonPressed:function(){W("Down",1)},buttonReleased:function(){W("Down",0)}})}),Object(r.jsxs)("div",{className:"controllerRowWrapper",children:[Object(r.jsx)(u,{round:!0,buttonDisplay:"A",pressed:1===d.A,buttonPressed:function(){W("A",1)},buttonReleased:function(){W("A",0)}}),Object(r.jsx)(u,{buttonDisplay:"B",pressed:1===d.B,buttonPressed:function(){W("B",1)},buttonReleased:function(){W("B",0)}})]}),Object(r.jsxs)("div",{className:"controllerRowWrapper",children:[Object(r.jsx)(u,{round:!0,buttonDisplay:"-",pressed:1===d.Minus,buttonPressed:function(){W("Minus",1)},buttonReleased:function(){W("Minus",0)}}),Object(r.jsx)(u,{round:!0,buttonDisplay:"Home",pressed:1===d.Home,buttonPressed:function(){W("Home",1)},buttonReleased:function(){W("Home",0)}}),Object(r.jsx)(u,{round:!0,buttonDisplay:"+",pressed:1===d.Plus,buttonPressed:function(){W("Plus",1)},buttonReleased:function(){W("Plus",0)}})]}),Object(r.jsx)("div",{className:"controllerRowWrapper",children:Object(r.jsx)(u,{round:!0,buttonDisplay:"1",pressed:1===d.One,buttonPressed:function(){W("One",1)},buttonReleased:function(){W("One",0)}})}),Object(r.jsx)("div",{className:"controllerRowWrapper",children:Object(r.jsx)(u,{round:!0,buttonDisplay:"2",pressed:1===d.Two,buttonPressed:function(){W("Two",1)},buttonReleased:function(){W("Two",0)}})})]})]})}c.a.createRoot(document.getElementById("root")).render(Object(r.jsx)(l,{}))},3:function(e,t,n){}},[[17,1,2]]]);
//# sourceMappingURL=main.e01bf96a.chunk.js.map