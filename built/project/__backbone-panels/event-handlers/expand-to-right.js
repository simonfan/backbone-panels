define(["require","exports","module","lodash"],function(e,t,n){var r=e("lodash");n.exports=function(t,n){while(t.length>0&&n!==0){var r=t.pop(),i=r.expandToRight(n);r.moveToRight(i),n=i}}});