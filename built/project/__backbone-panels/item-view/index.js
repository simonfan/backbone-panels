define(["require","exports","module","model-dock","backbone-ui-resizable","collection-dock","lowercase-backbone","./move","./contract","./expand"],function(e,t,n){var r=e("model-dock"),i=e("backbone-ui-resizable"),s=e("collection-dock"),o=e("lowercase-backbone"),u=s.prototype.itemView,a=n.exports=u.extend(r.prototype).extend(i.prototype).extend({html:'<div class="panel"></div>',initialize:function(t){o.view.prototype.initialize.apply(this,arguments),this.initializeItemView.apply(this,arguments),this.initializeModelDock.apply(this,arguments),this.initializeResizableDock.apply(this,arguments),this.initializePanel.apply(this,arguments)},initializePanel:function(t){this.on("resize",this.collectionView.handleResize),this.$el.css(this.css)},css:{position:"absolute"},resizableOptions:{handles:"w,e"}});a.proto(e("./move")),a.proto(e("./contract")),a.proto(e("./expand"))});