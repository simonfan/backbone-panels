//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

define(["require","exports","module"],function(e,t,n){t.before=function(t){return this.first(t)},t.after=function(t){return this.rest(t+1)},t.reduceBefore=function(t,n,r,i){var s=this.before(t);return _.reduce(s,n,r,i)},t.reduceAfter=function(t,n,r,i){var s=this.after(t);return _.reduce(s,n,r,i)},t.calculateLeftPos=function(t){var n=this.collection.indexOf(t.model);return this.reduceBefore(n,function(e,t){return e+t.model.get("width")},0)},t.postitionPanel=function(t){var n=this.calculateLeftPos(t);t.model.set({left:n,top:0})},t.arrange=function(){this.each(this.postitionPanel,this)}});