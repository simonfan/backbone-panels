//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

define("__backbone-panels/panel-builder/parse-data",["require","exports","module","lodash"],function(e,n,t){var a=e("lodash"),i={x:["minLeft","left","maxLeft","minWidth","width","maxWidth","defaultWidth"],y:["minTop","top","maxTop","minHeight","height","maxHeight"]};t.exports=function(e){return a.each(i.x,function(n){e[n]=this.panels.evalMeasureX(e[n])},this),a.each(i.y,function(n){e[n]=this.panels.evalMeasureY(e[n])},this),e}}),define("__backbone-panels/panel-builder/animations",["require","exports","module","lodash"],function(e,n){var t=e("lodash");n.open=function(e,n){this.enablePanel();var a=parseInt(this.panels.evalMeasureX(this.model.get("openWidth"))),i=parseInt(this.model.get("width")),l=a-i;n=n||{};var s=n.complete;return n.complete=t.bind(function(){s&&s.apply(this.$el,arguments),t.isNumber(this._real_min_width_before_close_)&&(this.model.set("minWidth",this._real_min_width_before_close_),delete this._real_min_width_before_close_),this.panels.arrangePositions()},this),"w"===e?this.aExpandToW(l,n):this.aExpandToE(l,n)},n.openToE=function(e){return this.open("e",e)},n.openToW=function(e){return this.open("w",e)},n.close=function(e,n){n=n||{};var a=this.model,i=parseFloat(this.panels.evalMeasureX(a.get("closeWidth")))||0,l=parseFloat(a.get("width")),s=Math.abs(i-l),o=n.complete;return n.complete=t.bind(function(){o&&o.apply(this.$el,arguments),this.disablePanel(),this.panels.arrangePositions()},this),this._real_min_width_before_close_=a.get("minWidth"),a.set("minWidth",i),"w"===e?this.aContractToW(s,n):this.aContractToE(s,n)},n.closeToRight=function(e){return this.close("e",e)},n.closeToLeft=function(e){return this.close("w",e)}}),define("__backbone-panels/panel-builder/enable-disable",["require","exports","module"],function(e,n){n._initializePanelEnableDisable=function(){this.listenTo(this.model,"change:panelStatus",function(){this.panelEnabled()?(this.enableResizable(),this.$el.addClass(this.panelClass+"-enabled").removeClass(this.panelClass+"-disabled")):(this.disableResizable(),this.$el.addClass(this.panelClass+"-disabled").removeClass(this.panelClass+"-enabled")),this.panels.arrangeBoundaries().arrangeHandles()})},n.panelEnabled=function(){return"enabled"===this.model.get("panelStatus")},n.enablePanel=function(){return this.model.set("panelStatus","enabled"),this},n.disablePanel=function(){return this.model.set("panelStatus","disabled"),this}}),define("__backbone-panels/panel-builder/index",["require","exports","module","lodash","backbone-ui-resizable","lowercase-backbone","./parse-data","./animations","./enable-disable"],function(e,n,t){var a=e("lodash"),i=e("backbone-ui-resizable"),l=e("lowercase-backbone"),s=t.exports=i.extend({initialize:function(e){l.view.prototype.initialize.call(this,e),this.initializeModelDock(e),this.initializeUIDraggable(e),this.initializeUIResizable(e),this.initializePanel(e)},initializePanel:function(e){this.panels=e.panels,this.id=this.$el.prop("id");var n=this.parseData(this.$el.data());a.defaults(n,{panelStatus:"enabled"}),this.model.set(n),this._initializePanelEnableDisable(),this.$el.addClass(this.panelClass)},parseData:e("./parse-data"),handles:"w,e",handleOptions:{clss:"handle",ratio:0,thickness:25},panelClass:"panel"});s.proto(e("./animations")).proto(e("./enable-disable"))}),define("__backbone-panels/iterators",["require","exports","module","lodash"],function(e,n){var t=e("lodash"),a=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","findIndex","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample","partition"];t.each(a,function(e){n[e]=function(){var n=Array.prototype.slice.call(arguments);return n.unshift(this.panels),t[e].apply(t,n)}}),n.panelIndex=function(e){return this.findIndex(function(n){return n.cid===e.cid})},n.before=function(e){return this.first(e)},n.after=function(e){return this.rest(e+1)},n.reduceBefore=function(e,n,a,i){var l=this.before(e);return t.reduce(l,n,a,i)},n.reduceAfter=function(e,n,a,i){var l=this.after(e);return t.reduce(l,n,a,i)}}),define("__backbone-panels/arrange/position",["require","exports","module","lodash"],function(e,n,t){function a(e){return this.reduceBefore(e,function(e,n){return e+n.get("width")},0)}var i=e("lodash");t.exports=i.throttle(function(){return this.each(function(e,n){var t=a.call(this,n);e.model.set({left:t,top:0})},this),this},50)}),define("__backbone-panels/arrange/boundaries",["require","exports","module"],function(e,n,t){function a(e,n){return this.reduceBefore(n,function(n,t){return t.panelEnabled()?n+t.get(e):n+t.get("width")},0)}function i(e,n){var t=a.call(this,"maxWidth",n),i=a.call(this,"minWidth",n);e.model.set("maxLeft",t),e.model.set("minLeft",i)}function l(e,n){return this.reduceAfter(n,function(n,t){return t.panelEnabled()?n+t.get(e):n+t.get("width")},0)}function s(e,n){var t=l.call(this,"minWidth",n),a=l.call(this,"maxWidth",n),i=l.call(this,"width",-1);e.model.set("maxRight",i-t),e.model.set("minRight",i-a)}t.exports=function(){return this.each(function(e,n){i.call(this,e,n),s.call(this,e,n)},this),this}}),define("__backbone-panels/arrange/index",["require","exports","module","lodash","./position","./boundaries"],function(e,n){var t=e("lodash");n.arrangePositions=e("./position"),n.arrangeBoundaries=e("./boundaries"),n.arrangeHandles=function(){var e=this.filter(function(e){return e.panelEnabled()});return t.each(e,function(n,t){0===t?n.disableHandle("w").enableHandle("e"):t===e.length-1?n.disableHandle("e").enableHandle("w"):n.enableHandle("w").enableHandle("e")},this),this},n.arrange=function(){this.arrangePositions(),this.arrangeBoundaries(),this.arrangeHandles()}}),define("__backbone-panels/event-handlers",["require","exports","module","lodash"],function(e,n){e("lodash");n.handlePanelResize=function(e,n){if("panels-control"!==n.agent){var t,a,i=this.panelIndex(e),l=Math.abs(n.delta);n.panel=e,"expand"===n.action?"w"===n.handle?(t=this.before(i),this.contractPanelsToLeft(t,l,n)):"e"===n.handle&&(a=this.after(i),this.contractPanelsToRight(a,l,n)):"contract"===n.action&&("w"===n.handle?(t=this.before(i),this.expandPanelsToRight(t,l,n)):"e"===n.handle&&(a=this.after(i),this.expandPanelsToLeft(a,l,n)))}},n.handlePanelResizeStart=function(){},n.handlePanelResizeStop=function(){}}),define("__backbone-panels/controllers",["require","exports","module","lodash"],function(e,n){function t(e){return function(n,t,i){var l=this.controlOptions,s=a.clone(n);-1===e.loopDirection&&s.reverse();for(var o=[];s.length&&0!==t;){var r=s.pop();if(r.panelEnabled())if(o.push(r),0===s.length)t=r[e.absorb](t,l);else{{var h=this.calcPanelElasticity({index:n.length-s.length-1,panel:r,panels:n,operation:e.operation,eventData:i}),d=t*h,c=t-d,p=r[e.absorb](d,l);r[e.move](c+p,l)}t-=d-p}else r[e.move](t,l)}if(t)for(;o.length>0&&0!==t;)t=o.pop()[e.absorb](t,l)}}var a=e("lodash");n.calcPanelElasticity=function(e){var n=parseFloat(e.panel.model.get("elasticity"));return isNaN(n)?this.controlOptions.elasticity:n},n.controlOptions={agent:"panels-control",elasticity:.3},n.contractPanelsToLeft=t({absorb:"contractToLeft",move:"moveToLeft",loopDirection:1,operation:"contract"}),n.contractPanelsToRight=t({absorb:"contractToRight",move:"moveToRight",loopDirection:-1,operation:"contract"}),n.expandPanelsToLeft=t({absorb:"expandToLeft",move:"moveToLeft",loopDirection:-1,operation:"expand"}),n.expandPanelsToRight=t({absorb:"expandToRight",move:"moveToRight",loopDirection:1,operation:"expand"})}),define("__backbone-panels/calculators",["require","exports","module"],function(e,n){var t=/[0-9.]+%/;n.evalMeasureX=function(e){if(t.test(e)){var n=1*parseFloat(e)/100;e=n*this.$el.width()}return e},n.evalMeasureY=function(e){if(t.test(e)){var n=1*parseFloat(e)/100;e=n*this.$el.height()}return e}}),define("__backbone-panels/enable-disable",["require","exports","module"],function(e,n){n.enablePanel=function(e){return this.getPanelById(e).enablePanel(),this},n.disablePanel=function(e){return this.getPanelById(e).disablePanel(),this},n.enablePanelAt=function(e){return this.getPanelAt(e).enablePanel(),this},n.disablePanelAt=function(e){return this.getPanelAt(e).disablePanel(),this}}),define("backbone-panels",["require","exports","module","jquery","lowercase-backbone","lodash","./__backbone-panels/panel-builder/index","./__backbone-panels/iterators","./__backbone-panels/arrange/index","./__backbone-panels/event-handlers","./__backbone-panels/controllers","./__backbone-panels/calculators","./__backbone-panels/enable-disable"],function(e,n,t){var a=e("jquery"),i=e("lowercase-backbone"),l=e("lodash"),s=e("./__backbone-panels/panel-builder/index"),o=t.exports=i.view.extend({initialize:function(){i.view.prototype.initialize.apply(this,arguments),this.initializePanels.apply(this,arguments)},initializePanels:function(){l.bindAll(this,"handlePanelResize","handlePanelResizeStart","handlePanelResizeStop"),this.$el.css(this.css),this.panels=[],l.each(this.$el.children(),function(e,n){this.addPanel(n,{el:a(e)})},this),this.arrange()},panelBuilder:s,panelTemplate:"<div></div>",panelClass:"panel",addPanel:function(e,n){var t;if(n.el)t=n.el;else{var s=l.isFunction(this.panelTemplate)?this.panelTemplate(n):this.panelTemplate;t=a(s)}t.addClass(this.panelClass).appendTo(this.$el);var o=this.panelBuilder(l.extend({},this.handleOptions,n,{el:t,model:i.model(),panels:this}));this.listenTo(o,"resizestart",this.handlePanelResizeStart).listenTo(o,"resize-x",this.handlePanelResize).listenTo(o,"resizestop",this.handlePanelResizeStop),this.listenTo(o.model,"change:minWidth change:maxWidth",this.arrangeBoundaries),this.panels.splice(e,1,o)},getPanelById:function(e){return this.find(function(n){return n.id===e})},getPanelAt:function(e){return this.panels[e]},css:{position:"relative"}});o.proto(e("./__backbone-panels/iterators")),o.proto(e("./__backbone-panels/arrange/index")),o.proto(e("./__backbone-panels/event-handlers")),o.proto(e("./__backbone-panels/controllers")),o.proto(e("./__backbone-panels/calculators")),o.proto(e("./__backbone-panels/enable-disable")),o.panelBuilder=s});