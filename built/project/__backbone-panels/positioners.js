define(["require","exports","module"],function(e,t,n){t.postitionPanel=function(t){var n=this.calculateLeftPos(t);t.model.set({left:n,top:0})},t.arrange=function(){this.each(this.postitionPanel,this)}});