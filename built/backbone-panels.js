//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

define("__backbone-panels/panel-builder/parse-data",["require","exports","module","lodash"],function(e,t,n){var a=e("lodash"),i={x:["minLeft","left","maxLeft","minWidth","width","maxWidth","defaultWidth"],y:["minTop","top","maxTop","minHeight","height","maxHeight"]};n.exports=function(e){return a.each(i.x,function(t){e[t]=this.panels.evalMeasureX(e[t])},this),a.each(i.y,function(t){e[t]=this.panels.evalMeasureY(e[t])},this),e}}),define("__backbone-panels/panel-builder/animations",["require","exports","module","lodash"],function(e,t){var n=e("lodash");t.open=function(e,t){this.enablePanel();var n=parseFloat(this.panels.evalMeasureX(this.model.get("openWidth"))),a=parseFloat(this.model.get("width")),i=Math.abs(n-a);return"left"===e?this.aExpandToLeft(i,t):this.aExpandToRight(i,t)},t.openToRight=function(e){return this.open("right",e)},t.openToLeft=function(e){return this.open("left",e)},t.close=function(e,t){t=t||{};var a=t.complete;t.complete=n.bind(function(){a&&a.apply(this.$el,arguments),this.disablePanel()},this);var i=parseFloat(this.panels.evalMeasureX(this.model.get("closeWidth")))||0,s=parseFloat(this.model.get("width")),l=Math.abs(i-s);return"left"===e?this.aContractToLeft(l,t):this.aContractToRight(l,t)},t.closeToRight=function(e){return this.close("right",e)},t.closeToLeft=function(e){return this.close("left",e)}}),define("__backbone-panels/panel-builder/index",["require","exports","module","lodash","backbone-ui-resizable","./parse-data","./animations"],function(e,t,n){var a=(e("lodash"),e("backbone-ui-resizable")),i=n.exports=a.extend({initialize:function(e){a.prototype.initialize.call(this,e),this.initializePanel(e)},initializePanel:function(e){this.panels=e.panels,this.id=this.$el.prop("id");var t=this.parseData(this.$el.data());this.model.set(t),this.$el.addClass(this.panelClass),e.disabled?this.disablePanel():this.enablePanel()},parseData:e("./parse-data"),handles:"w,e",handleOptions:{clss:"handle",ratio:0,thickness:25},panelClass:"panel",enablePanel:function(){return this.$el.addClass(this.panelClass+"-enabled").removeClass(this.panelClass+"-disabled"),this.model.set(this.__minmax__),this.model.set("panelEnabled",!0),this},disablePanel:function(){var e=this.model;this.__minmax__={minWidth:e.get("minWidth"),maxWidth:e.get("maxWidth")},e.set({minWidth:e.get("width"),maxWidth:e.get("width"),panelEnabled:!1}),this.$el.addClass(this.panelClass+"-disabled").removeClass(this.panelClass+"-enabled")}});i.proto(e("./animations"))}),define("__backbone-panels/iterators",["require","exports","module","lodash"],function(e,t){var n=e("lodash"),a=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","findIndex","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample","partition"];n.each(a,function(e){t[e]=function(){var t=Array.prototype.slice.call(arguments);return t.unshift(this.panels),n[e].apply(n,t)}}),t.panelIndex=function(e){return this.findIndex(function(t){return t.cid===e.cid})},t.before=function(e){return this.first(e)},t.after=function(e){return this.rest(e+1)},t.reduceBefore=function(e,t,a,i){var s=this.before(e);return n.reduce(s,t,a,i)},t.reduceAfter=function(e,t,a,i){var s=this.after(e);return n.reduce(s,t,a,i)}}),define("__backbone-panels/panel-config",["require","exports","module"],function(e,t){t.sumBefore=function(e,t){return this.reduceBefore(t,function(t,n){return t+n.get(e)},0)},t.sumAfter=function(e,t){return this.reduceAfter(t,function(t,n){return t+n.get(e)},0)},t.calculateLeftPos=function(e){return this.sumBefore("width",e)},t.postitionPanel=function(e){var t=this.panelIndex(e),n=this.calculateLeftPos(t);e.model.set({left:n,top:0})},t.setPanelRightBoundaries=function(e){var t=this.panelIndex(e),n=this.sumAfter("minWidth",t),a=this.sumAfter("maxWidth",t),i=this.sumAfter("width",-1);e.model.set("maxRight",i-n),e.model.set("minRight",i-a)},t.setPanelLeftBoundaries=function(e){var t=this.panelIndex(e),n=this.sumBefore("maxWidth",t),a=this.sumBefore("minWidth",t);e.model.set("maxLeft",n),e.model.set("minLeft",a)},t.arrange=function(){this.each(function(e,t){0===t?e.disableHandle("w"):t===this.panels.length-1&&e.disableHandle("e"),this.postitionPanel(e),this.setPanelRightBoundaries(e),this.setPanelLeftBoundaries(e)},this)}}),define("__backbone-panels/event-handlers",["require","exports","module","lodash"],function(e,t){e("lodash");t.handlePanelResize=function(e,t){if("panels-control"!==t.agent){var n,a,i=this.panelIndex(e),s=Math.abs(t.delta);"expand"===t.action?"w"===t.handle?(n=this.before(i),this.contractPanelsToLeft(n,s)):"e"===t.handle&&(a=this.after(i),this.contractPanelsToRight(a,s)):"contract"===t.action&&("w"===t.handle?(n=this.before(i),this.expandPanelsToRight(n,s)):"e"===t.handle&&(a=this.after(i),this.expandPanelsToLeft(a,s)))}},t.handlePanelResizeStart=function(){},t.handlePanelResizeStop=function(){}}),define("__backbone-panels/actions",["require","exports","module","lodash"],function(e,t){e("lodash");t.contractPanelsToLeft=function(e,t){for(;e.length>0&&0!==t;){var n=e.pop();if(0===e.length)t=n.contractToLeft(t,{agent:"panels-control"});else{var a=t/1.5,i=t-a,s=n.moveToLeft(a,{agent:"panels-control"}),l=n.contractToLeft(i+s,{agent:"panels-control"});l&&n.moveToLeft(l,{agent:"panels-control"}),t=a+l}}},t.contractPanelsToRight=function(e,t){for(;e.length>0&&t>0;){var n=e.shift();if(0===e.length)t=n.contractToRight(t,{agent:"panels-control"});else{var a=t/1.5,i=t-a,s=n.moveToRight(a,{agent:"panels-control"}),l=n.contractToRight(i+s,{agent:"panels-control"});l&&n.moveToRight(l,{agent:"panels-control"}),t=a+l}}},t.expandPanelsToLeft=function(e,t){for(;e.length>0&&0!==t;){var n=e.shift();if(0===e.length)t=n.expandToLeft(t,{agent:"panels-control"});else{var a=t/1.5,i=t-a,s=n.moveToLeft(a,{agent:"panels-control"}),l=n.expandToLeft(i+s,{agent:"panels-control"});l&&n.moveToLeft(l,{agent:"panels-control"}),t=a+l}}},t.expandPanelsToRight=function(e,t){for(;e.length>0&&0!==t;){var n=e.pop();if(0===e.length)t=n.expandToRight(t,{agent:"panels-control"});else{var a=t/1.5,i=t-a,s=n.moveToRight(a,{agent:"panels-control"}),l=n.expandToRight(i+s,{agent:"panels-control"});l&&n.moveToRight(l,{agent:"panels-control"}),t=a+l}}}}),define("__backbone-panels/calculators",["require","exports","module"],function(e,t){var n=/[0-9.]+%/;t.evalMeasureX=function(e){if(n.test(e)){var t=1*parseFloat(e)/100;e=t*this.$el.width()}return e},t.evalMeasureY=function(e){if(n.test(e)){var t=1*parseFloat(e)/100;e=t*this.$el.height()}return e}}),define("__backbone-panels/enable-disable",["require","exports","module"],function(e,t){t.enablePanel=function(e){return this.getPanelById(e).enablePanel(),this},t.disablePanel=function(e){return this.getPanelById(e).disablePanel(),this},t.enablePanelAt=function(e){return this.getPanelAt(e).enablePanel(),this},t.disablePanelAt=function(e){return this.getPanelAt(e).disablePanel(),this}}),define("backbone-panels",["require","exports","module","jquery","lowercase-backbone","lodash","./__backbone-panels/panel-builder/index","./__backbone-panels/iterators","./__backbone-panels/panel-config","./__backbone-panels/event-handlers","./__backbone-panels/actions","./__backbone-panels/calculators","./__backbone-panels/enable-disable"],function(e,t,n){var a=e("jquery"),i=e("lowercase-backbone"),s=e("lodash"),l=n.exports=i.view.extend({initialize:function(){i.view.prototype.initialize.apply(this,arguments),this.initializePanels.apply(this,arguments)},initializePanels:function(){s.bindAll(this,"handlePanelResize","handlePanelResizeStart","handlePanelResizeStop"),this.$el.css(this.css),this.panels=[],s.each(this.$el.children(),function(e,t){this.addPanel(t,{el:a(e)})},this),this.arrange()},panelBuilder:e("./__backbone-panels/panel-builder/index"),panelTemplate:"<div></div>",panelClass:"panel",addPanel:function(e,t){var n;if(t.el)n=t.el;else{var l=s.isFunction(this.panelTemplate)?this.panelTemplate(t):this.panelTemplate;n=a(l)}n.addClass(this.panelClass).appendTo(this.$el);var o=this.panelBuilder(s.extend({},this.handleOptions,t,{el:n,model:i.model(t),panels:this}));this.listenTo(o,"resizestart",this.handlePanelResizeStart).listenTo(o,"resize-x",this.handlePanelResize).listenTo(o,"resizestop",this.handlePanelResizeStop),this.listenTo(o.model,"change:minWidth change:maxWidth",this.arrange),this.panels.splice(e,1,o)},getPanelById:function(e){return this.find(function(t){return t.id===e})},getPanelAt:function(e){return this.panels[e]},css:{position:"relative"}});l.proto(e("./__backbone-panels/iterators")),l.proto(e("./__backbone-panels/panel-config")),l.proto(e("./__backbone-panels/event-handlers")),l.proto(e("./__backbone-panels/actions")),l.proto(e("./__backbone-panels/calculators")),l.proto(e("./__backbone-panels/enable-disable"))});