define(["require","exports","module","lodash","backbone-ui-resizable"],function(e,t,n){var r=e("lodash"),i=e("backbone-ui-resizable"),s=n.exports=i.extend({initialize:function(t){i.prototype.initialize.call(this,t),this.$el.addClass(this.panelClass),this.id=this.$el.prop("id"),t.disabled||this.enablePanel()},handles:"w,e",handleOptions:{clss:"handle",ratio:0,thickness:25},panelClass:"panel",enablePanel:function(){return this.panelEnabled=!0,this.$el.addClass(this.panelClass+"-enabled").removeClass(this.panelClass+"-disabled"),this.model.set(this.__minmax__),this},disablePanel:function(){var t=this.model;this.panelEnabled=!1,this.__minmax__={minWidth:t.get("minWidth"),maxWidth:t.get("maxWidth")},t.set({minWidth:t.get("width"),maxWidth:t.get("width")}),this.$el.addClass(this.panelClass+"-disabled").removeClass(this.panelClass+"-enabled")}})});