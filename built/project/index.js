//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

define(["require","exports","module","jquery","lowercase-backbone","lodash","./__backbone-panels/panel-builder","./__backbone-panels/panel-data-parser","./__backbone-panels/iterators","./__backbone-panels/panel-config","./__backbone-panels/event-handlers","./__backbone-panels/actions","./__backbone-panels/enable-disable"],function(e,t,n){var r=e("jquery"),i=e("lowercase-backbone"),s=e("lodash"),o=n.exports=i.view.extend({initialize:function(t){i.view.prototype.initialize.apply(this,arguments),this.initializePanels.apply(this,arguments)},initializePanels:function(t){s.bindAll(this,"handlePanelResize","handlePanelResizeStart","handlePanelResizeStop"),this.$el.css(this.css),this.panels=[],s.each(this.$el.children(),function(e,t){var n=r(e),i=this.panelDataParser(n.data());i.el=n,this.addPanel(t,i)},this),this.arrange()},panelBuilder:e("./__backbone-panels/panel-builder"),panelTemplate:"<div></div>",panelClass:"panel",panelDataParser:e("./__backbone-panels/panel-data-parser"),addPanel:function(t,n){var o;if(n.el)o=n.el;else{var u=s.isFunction(this.panelTemplate)?this.panelTemplate(n):this.panelTemplate;o=r(u)}o.addClass(this.panelClass).appendTo(this.$el);var a=this.panelBuilder(s.extend({},this.handleOptions,n,{el:o,model:i.model(n)}));this.listenTo(a,"resizestart",this.handlePanelResizeStart).listenTo(a,"resize-x",this.handlePanelResize).listenTo(a,"resizestop",this.handlePanelResizeStop),this.listenTo(a.model,"change:minWidth change:maxWidth",this.arrange),this.panels.splice(t,1,a)},getPanelById:function(t){return this.find(function(e){return e.id===t})},getPanelAt:function(t){return this.panels[t]},css:{position:"relative"}});o.proto(e("./__backbone-panels/iterators")),o.proto(e("./__backbone-panels/panel-config")),o.proto(e("./__backbone-panels/event-handlers")),o.proto(e("./__backbone-panels/actions")),o.proto(e("./__backbone-panels/enable-disable"))});