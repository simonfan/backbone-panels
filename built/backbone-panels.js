//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

define("__backbone-panels/panel-builder",["require","exports","module","lodash","backbone-ui-resizable"],function(e,n,t){{var a=(e("lodash"),e("backbone-ui-resizable"));t.exports=a.extend({handleOptions:{directions:"w,e",clss:"handle",ratio:0,thickness:25}})}}),define("__backbone-panels/iterators",["require","exports","module","lodash"],function(e,n){var t=e("lodash"),a=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","findIndex","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample","partition"];t.each(a,function(e){n[e]=function(){var n=Array.prototype.slice.call(arguments);return n.unshift(this.panels),t[e].apply(t,n)}}),n.panelIndex=function(e){return this.findIndex(function(n){return n.cid===e.cid})},n.before=function(e){return this.first(e)},n.after=function(e){return this.rest(e+1)},n.reduceBefore=function(e,n,a,i){var s=this.before(e);return t.reduce(s,n,a,i)},n.reduceAfter=function(e,n,a,i){var s=this.after(e);return t.reduce(s,n,a,i)}}),define("__backbone-panels/panel-config",["require","exports","module"],function(e,n){n.sumBefore=function(e,n){return this.reduceBefore(n,function(n,t){return n+t.get(e)},0)},n.sumAfter=function(e,n){return this.reduceAfter(n,function(n,t){return n+t.get(e)},0)},n.calculateLeftPos=function(e){return this.sumBefore("width",e)},n.postitionPanel=function(e){var n=this.panelIndex(e),t=this.calculateLeftPos(n);e.model.set({left:t,top:0})},n.setPanelRightBoundaries=function(e){var n=this.panelIndex(e),t=this.sumAfter("minWidth",n),a=this.sumAfter("maxWidth",n),i=this.sumAfter("width",-1);e.model.set("maxRight",i-t),e.model.set("minRight",i-a)},n.setPanelLeftBoundaries=function(e){var n=this.panelIndex(e),t=this.sumBefore("maxWidth",n),a=this.sumBefore("minWidth",n);e.model.set("maxLeft",t),e.model.set("minLeft",a)},n.arrange=function(){this.each(function(e){this.postitionPanel(e),this.setPanelRightBoundaries(e),this.setPanelLeftBoundaries(e)},this)}}),define("__backbone-panels/event-handlers",["require","exports","module","lodash"],function(e,n){e("lodash");n.handlePanelResize=function(e,n){var t=this.panelIndex(e),a=Math.abs(n.delta);if("panels-control"!==n.agent)if("expand"===n.action){if("w"===n.handle){var i=this.before(t);this.contractPanelsToLeft(i,a)}else if("e"===n.handle){var s=this.after(t);this.contractPanelsToRight(s,a)}}else if("contract"===n.action)if("w"===n.handle){var i=this.before(t);this.expandPanelsToRight(i,a)}else if("e"===n.handle){var s=this.after(t);this.expandPanelsToLeft(s,a)}},n.handlePanelResizeStart=function(){},n.handlePanelResizeStop=function(){}}),define("__backbone-panels/actions",["require","exports","module","lodash"],function(e,n){e("lodash");n.contractPanelsToLeft=function(e,n){for(;e.length>0&&0!==n;){var t=e.pop(),a=t.contractToLeft(n,{agent:"panels-control"});t.moveToLeft(a,{agent:"panels-control"}),n=a}},n.contractPanelsToRight=function(e,n){for(;e.length>0&&n>0;){var t=e.shift(),a=t.contractToRight(n,{agent:"panels-control"});t.moveToRight(a,{agent:"panels-control"}),n=a}},n.expandPanelsToLeft=function(e,n){for(;e.length>0&&0!==n;){var t=e.shift(),a=t.expandToLeft(n,{agent:"panels-control"});t.moveToLeft(a,{agent:"panels-control"}),n=a}},n.expandPanelsToRight=function(e,n){for(;e.length>0&&0!==n;){var t=e.pop(),a=t.expandToRight(n,{agent:"panels-control"});t.moveToRight(a,{agent:"panels-control"}),n=a}}}),define("backbone-panels",["require","exports","module","lowercase-backbone","lodash","./__backbone-panels/panel-builder","./__backbone-panels/iterators","./__backbone-panels/panel-config","./__backbone-panels/event-handlers","./__backbone-panels/actions"],function(e,n,t){var a=e("lowercase-backbone"),i=e("lodash"),s=t.exports=a.view.extend({initialize:function(){a.view.prototype.initialize.apply(this,arguments),this.initializePanels.apply(this,arguments)},initializePanels:function(){i.bindAll(this,"handlePanelResize","handlePanelResizeStart","handlePanelResizeStop"),this.$el.css(this.css),this.panels=[],i.each(this.$el.children(),function(e,n){var t=$(e),a=t.data();a.el=t,this.addPanel(n,a)},this),this.arrange()},panelBuilder:e("./__backbone-panels/panel-builder"),panelTemplate:"<div></div>",panelClass:"panel",addPanel:function(e,n){var t;if(n.el)t=n.el;else{var s=i.isFunction(this.panelTemplate)?this.panelTemplate(n):this.panelTemplate;t=$(s)}t.addClass(this.panelClass).appendTo(this.$el);var o=this.panelBuilder(i.extend(n,{el:t,model:a.model(n)}));this.listenTo(o,"resizestart",this.handlePanelResizeStart).listenTo(o,"resize-x",this.handlePanelResize).listenTo(o,"resizestop",this.handlePanelResizeStop),this.panels.splice(e,1,o)},css:{position:"relative"}});s.proto(e("./__backbone-panels/iterators")),s.proto(e("./__backbone-panels/panel-config")),s.proto(e("./__backbone-panels/event-handlers")),s.proto(e("./__backbone-panels/actions"))});