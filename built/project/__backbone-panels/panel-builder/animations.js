define(["require","exports","module","lodash"],function(e,t,n){var r=e("lodash");t.open=function(t,n){this.enablePanel();var r=parseFloat(this.panels.evalMeasureX(this.model.get("openWidth"))),i=parseFloat(this.model.get("width")),s=Math.abs(r-i);return t==="left"?this.aExpandToLeft(s,n):this.aExpandToRighr(s,n)},t.openToRight=function(t){return this.open("right",t)},t.openToLeft=function(t){return this.open("left",t)},t.close=function(t,n){n=n||{};var i=n.complete;n.complete=r.bind(function(){i&&i.apply(this.$el,arguments),this.disablePanel()},this);var s=parseFloat(this.panels.evalMeasureX(this.model.get("closeWidth")))||0,o=parseFloat(this.model.get("width")),u=Math.abs(s-o);return t==="left"?this.aContractToLeft(u,n):this.aContractToRight(u,n)},t.closeToRight=function(t){return this.close("right",t)},t.closeToLeft=function(t){return this.close("left",t)}});