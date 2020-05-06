module.exports = {
    ifeq: function(a, b, options){
      return a == b;
    },
    noteq: function(a, b, options){
        return a!=b;
    },
    
    greaterThan: function(a, b, options){
        return a > b;
    },
    increment: function(a, options){
        return parseInt(a)+1;
    },
    decrement: function(a, options){
        return parseInt(a)-1;
    }
  }