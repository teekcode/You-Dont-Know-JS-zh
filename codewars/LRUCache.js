function LRUCache(capacity, init) {

  var self = this, counter = 0, time = {}, values={};
  //move the init value to cache

  Object.defineProperty(this, 'cache', {value: cache});
  Object.defineProperty(this, 'delete', {value: remove});
  Object.defineProperty(this, 'size', { get: function() {return Object.keys(self).length;} });
  Object.defineProperty(this, 'capacity', {get: function() {return capacity;}, set: updateCapacity });
  
  function cache(k, v) {
    if(self.size >= capacity) { remove(findleastused())}
    values[k] = v;
    time[k] = ++counter;
    Object.defineProperty(self, k, {enumerable: true, configurable: true, get: get(k), set: set(k) })
    return self;
  }

  function get(k) {
    return function() { time[k] = ++counter; return values[k];}
  }

  function set(k) {
    return function(v) { time[k] = ++ counter; values[k] = v; }
  }

  function remove(k) {
    delete values[k];
    delete time[k]; 
    return delete self[k];
  }

  //helper function
  function findleastused() {
    return Object.keys(self).sort(function(a,b) { return time[a] > time[b]; })[0];
  }

  function updateCapacity(c){
    capacity = c; while (self.size > capacity) self.delete(findleastused()); 
  }

  Object.keys(init||{}).forEach(function(key){self.cache(key, init[key])});
}