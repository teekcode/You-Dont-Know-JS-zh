function undoRedo(obj) {
  var u = [], r = [];
  
  function set(k, v) {
    r = [], u.push(k in obj ? [k, obj[k]] : [k]);
    if (arguments.length > 1) obj[k] = v;
    else delete obj[k];
  }
  function undo(u, r, a) {
    if (a = u.pop()) {
      r.push(a[0] in obj ? [a[0], obj[a[0]]] : [a[0]]);
      if (a.length == 1) delete obj[a[0]];
      else obj[a[0]] = a[1];
    }
    return a;
  }
  
  return {
    set: function(k, v) { set(k, v); },
    get: function(k) { return obj[k]; },
    del: function(k) { set(k); },
    undo: function() { if (!undo(u, r)) throw "Nothing to undo"; },
    redo: function() { if (!undo(r, u)) throw "Nothing to redo"; }
  };
}