var $req;!function(n,e){"use strict";var t={},r={};$req=function(n,e){var o=[],n=new DependencyManager(n,t),u=[];n.forEach(function(n){u.push(n.name),utils.inObject(n.name,r)||o.push(i(n.name,n.url))}),(new BasicDeferred).when.apply(null,o).then(function(){var n=[];u.forEach(function(e){n.push(r[e])}),e.apply(this,n)}).fail(function(n){console.log(n)})},$req.setConfig=function(n){t=n};var o=function(){var e=n.createElement("script");return e.type="text/javascript",e.charset="utf-8",e.async=!0,e},i=function(t,r){var i=new BasicDeferred,c=o();c.src=r;var a=utils.shallowClone(e);return c.addEventListener("load",function(n){var r=n.currentTarget,o=u(a,e,t);utils.isEmptyArray(o)||(o.forEach(function(n){delete e[n]}),i.resolve()),r.parentNode.removeChild(r)}),c.addEventListener("error",function(n){var e=n.currentTarget;e.parentNode.removeChild(e),i.reject("Error: "+t+" could not be loaded")}),n.getElementsByTagName("head")[0].appendChild(c),i.promise()},u=function(n,e,t){var o=[];e=utils.shallowClone(e);for(var i in e)n[i]||r[t]||(r[t]=e[i],o.push(i));return o}}(document,window);var DependencyManager=function(n,e){"use strict";var t={},r=[],o=[];e=e||{};var i=function(n,e,t,o){utils.isEmptyArray(t)||t.forEach(function(n){r.indexOf(n)>-1&&t.slice(t.indexOf(n),1)}),utils.isEmptyArray(t)?a(n,e,o):u(n,e,t,o)},u=function(n,e,r,o){t[e]||(t[e]={},t[e].url=n,t[e].pos=o,t[e].deps=r)},c=function(n){for(var e in t)if(t.hasOwnProperty(e)){var r=t[e],o=r.deps.indexOf(n);o>-1&&(t[e].deps.splice(o,1),t[e].deps.length||a(r.url,e,r.pos))}},a=function(n,e,t){var i={};i.name=e,i.url=n,i.pos=t,o.push(i),-1==r.indexOf(e)&&r.push(e),c(e)},s=0;return n.forEach(function(n){var t=n,r=[];e[n]&&(t=e[n].url||t,r=e[n].deps||r),i(t,n,r,s),s+=1}),utils.isEmptyObject(t)||r.forEach(function(n){c(n)}),o},utils={isArray:function(n){return"[object Array]"==Object.prototype.toString.call(n)},isObject:function(n){return"[object Object]"==Object.prototype.toString.call(n)},isString:function(n){return"[object String]"==Object.prototype.toString.call(n)},isNumber:function(n){return"[object Number]"==Object.prototype.toString.call(n)},isFunction:function(n){return"[object Function]"==Object.prototype.toString.call(n)},isEmptyObject:function(n){return!Object.keys(n).length},isEmptyArray:function(n){return!n.length},objectLen:function(n){return Object.keys(n).length},inObject:function(n,e){var t=!1;for(var r in e)if(e.hasOwnProperty(r)){r==n&&(t=!0);break}return t},shallowClone:function(n){var e={};for(var t in n)e[t]=n[t];return e},deepClone:function(n){return JSON.parse(JSON.stringify(n))},anotherClone:function(n){return new Object(n)}},BasicDeferred=function(n){n=n||{verbose:!1,processOnFail:!1};var e,t,r=[],o=[],i=null,u=function(u,c,a){i--,u?r[a]=c[0]:(o[a]=c[0],n.processOnFail||(i=!1,r=[]),n.verbose&&console.log("The argument in the position number: "+a+" has failed")),i||(o.length&&(o=Array.prototype.slice.call(o),t.apply(null,o)),r.length&&(r=Array.prototype.slice.call(r),e.apply(null,r)))},c=function(n,e){e=Array.prototype.slice.call(e),n.apply(null,e)},a=function(n){return e=n,this},s=function(n){return e=n,this},l=function(n){return t=n,this};return{when:function(){for(var n=i=arguments.length;n--;)arguments[n].self.pos=n,arguments[n].self.resolve=function(){u(!0,arguments,this.pos)},arguments[n].self.reject=function(){u(!1,arguments,this.pos)};return{then:s,fail:l,done:a}},resolve:function(){c(e,arguments)},reject:function(){c(t,arguments)},promise:function(){return{done:a,fail:l,self:this}}}};