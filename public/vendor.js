!function(){"use strict";var e=0,r={};function i(t){if(!t)throw new Error("No options passed to Waypoint constructor");if(!t.element)throw new Error("No element option passed to Waypoint constructor");if(!t.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=i.Adapter.extend({},i.defaults,t),this.element=this.options.element,this.adapter=new i.Adapter(this.element),this.callback=t.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=i.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=i.Context.findOrCreateByElement(this.options.context),i.offsetAliases[this.options.offset]&&(this.options.offset=i.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),r[this.key]=this,e+=1}i.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},i.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},i.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete r[this.key]},i.prototype.disable=function(){return this.enabled=!1,this},i.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},i.prototype.next=function(){return this.group.next(this)},i.prototype.previous=function(){return this.group.previous(this)},i.invokeAll=function(t){var e=[];for(var i in r)e.push(r[i]);for(var n=0,o=e.length;n<o;n++)e[n][t]()},i.destroyAll=function(){i.invokeAll("destroy")},i.disableAll=function(){i.invokeAll("disable")},i.enableAll=function(){for(var t in i.Context.refreshAll(),r)r[t].enabled=!0;return this},i.refreshAll=function(){i.Context.refreshAll()},i.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},i.viewportWidth=function(){return document.documentElement.clientWidth},i.adapters=[],i.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},i.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=i}(),function(){"use strict";function s(t,e){return t.triggerPoint-e.triggerPoint}function l(t,e){return e.triggerPoint-t.triggerPoint}var e={vertical:{},horizontal:{}},i=window.Waypoint;function n(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),e[this.axis][this.name]=this}n.prototype.add=function(t){this.waypoints.push(t)},n.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},n.prototype.flushTriggers=function(){for(var t in this.triggerQueues){var e=this.triggerQueues[t],i="up"===t||"left"===t;e.sort(i?l:s);for(var n=0,o=e.length;n<o;n+=1){var r=e[n];(r.options.continuous||n===e.length-1)&&r.trigger([t])}}this.clearTriggerQueues()},n.prototype.next=function(t){this.waypoints.sort(s);var e=i.Adapter.inArray(t,this.waypoints);return e===this.waypoints.length-1?null:this.waypoints[e+1]},n.prototype.previous=function(t){this.waypoints.sort(s);var e=i.Adapter.inArray(t,this.waypoints);return e?this.waypoints[e-1]:null},n.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},n.prototype.remove=function(t){var e=i.Adapter.inArray(t,this.waypoints);-1<e&&this.waypoints.splice(e,1)},n.prototype.first=function(){return this.waypoints[0]},n.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},n.findOrCreate=function(t){return e[t.axis][t.name]||new n(t)},i.Group=n}(),function(){"use strict";function e(t){window.setTimeout(t,1e3/60)}var i=0,n={},y=window.Waypoint,t=window.onload;function o(t){this.element=t,this.Adapter=y.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,n[t.waypointContextKey]=this,i+=1,y.windowContext||(y.windowContext=!0,y.windowContext=new o(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}o.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},o.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete n[this.key])},o.prototype.createThrottledResizeHandler=function(){var t=this;function e(){t.handleResize(),t.didResize=!1}this.adapter.on("resize.waypoints",function(){t.didResize||(t.didResize=!0,y.requestAnimationFrame(e))})},o.prototype.createThrottledScrollHandler=function(){var t=this;function e(){t.handleScroll(),t.didScroll=!1}this.adapter.on("scroll.waypoints",function(){t.didScroll&&!y.isTouch||(t.didScroll=!0,y.requestAnimationFrame(e))})},o.prototype.handleResize=function(){y.Context.refreshAll()},o.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var n=e[i],o=n.newScroll>n.oldScroll?n.forward:n.backward;for(var r in this.waypoints[i]){var s=this.waypoints[i][r];if(null!==s.triggerPoint){var l=n.oldScroll<s.triggerPoint,a=n.newScroll>=s.triggerPoint;(l&&a||!l&&!a)&&(s.queueTrigger(o),t[s.group.id]=s.group)}}}for(var h in t)t[h].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},o.prototype.innerHeight=function(){return this.element==this.element.window?y.viewportHeight():this.adapter.innerHeight()},o.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},o.prototype.innerWidth=function(){return this.element==this.element.window?y.viewportWidth():this.adapter.innerWidth()},o.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var n=0,o=t.length;n<o;n++)t[n].destroy()},o.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),n={};for(var o in this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}}){var r=t[o];for(var s in this.waypoints[o]){var l,a,h,p,u=this.waypoints[o][s],d=u.options.offset,f=u.triggerPoint,c=0,w=null==f;u.element!==u.element.window&&(c=u.adapter.offset()[r.offsetProp]),"function"==typeof d?d=d.apply(u):"string"==typeof d&&(d=parseFloat(d),-1<u.options.offset.indexOf("%")&&(d=Math.ceil(r.contextDimension*d/100))),l=r.contextScroll-r.contextOffset,u.triggerPoint=Math.floor(c+l-d),a=f<r.oldScroll,h=u.triggerPoint>=r.oldScroll,p=!a&&!h,!w&&(a&&h)?(u.queueTrigger(r.backward),n[u.group.id]=u.group):!w&&p?(u.queueTrigger(r.forward),n[u.group.id]=u.group):w&&r.oldScroll>=u.triggerPoint&&(u.queueTrigger(r.forward),n[u.group.id]=u.group)}}return y.requestAnimationFrame(function(){for(var t in n)n[t].flushTriggers()}),this},o.findOrCreateByElement=function(t){return o.findByElement(t)||new o(t)},o.refreshAll=function(){for(var t in n)n[t].refresh()},o.findByElement=function(t){return n[t.waypointContextKey]},window.onload=function(){t&&t(),o.refreshAll()},y.requestAnimationFrame=function(t){(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||e).call(window,t)},y.Context=o}(),function(){"use strict";var t=window.Waypoint;function n(t){return t===t.window}function o(t){return n(t)?t:t.defaultView}function e(t){this.element=t,this.handlers={}}e.prototype.innerHeight=function(){return n(this.element)?this.element.innerHeight:this.element.clientHeight},e.prototype.innerWidth=function(){return n(this.element)?this.element.innerWidth:this.element.clientWidth},e.prototype.off=function(t,e){function i(t,e,i){for(var n=0,o=e.length-1;n<o;n++){var r=e[n];i&&i!==r||t.removeEventListener(r)}}var n=t.split("."),o=n[0],r=n[1],s=this.element;if(r&&this.handlers[r]&&o)i(s,this.handlers[r][o],e),this.handlers[r][o]=[];else if(o)for(var l in this.handlers)i(s,this.handlers[l][o]||[],e),this.handlers[l][o]=[];else if(r&&this.handlers[r]){for(var a in this.handlers[r])i(s,this.handlers[r][a],e);this.handlers[r]={}}},e.prototype.offset=function(){if(!this.element.ownerDocument)return null;var t=this.element.ownerDocument.documentElement,e=o(this.element.ownerDocument),i={top:0,left:0};return this.element.getBoundingClientRect&&(i=this.element.getBoundingClientRect()),{top:i.top+e.pageYOffset-t.clientTop,left:i.left+e.pageXOffset-t.clientLeft}},e.prototype.on=function(t,e){var i=t.split("."),n=i[0],o=i[1]||"__default",r=this.handlers[o]=this.handlers[o]||{};(r[n]=r[n]||[]).push(e),this.element.addEventListener(n,e)},e.prototype.outerHeight=function(t){var e,i=this.innerHeight();return t&&!n(this.element)&&(e=window.getComputedStyle(this.element),i+=parseInt(e.marginTop,10),i+=parseInt(e.marginBottom,10)),i},e.prototype.outerWidth=function(t){var e,i=this.innerWidth();return t&&!n(this.element)&&(e=window.getComputedStyle(this.element),i+=parseInt(e.marginLeft,10),i+=parseInt(e.marginRight,10)),i},e.prototype.scrollLeft=function(){var t=o(this.element);return t?t.pageXOffset:this.element.scrollLeft},e.prototype.scrollTop=function(){var t=o(this.element);return t?t.pageYOffset:this.element.scrollTop},e.extend=function(){var t=Array.prototype.slice.call(arguments);function e(t,e){if("object"==typeof t&&"object"==typeof e)for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}for(var i=1,n=t.length;i<n;i++)e(t[0],t[i]);return t[0]},e.inArray=function(t,e,i){return null==e?-1:e.indexOf(t,i)},e.isEmptyObject=function(t){for(var e in t)return!1;return!0},t.adapters.push({name:"noframework",Adapter:e}),t.Adapter=e}();