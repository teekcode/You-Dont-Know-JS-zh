function stripUrlParams(url, paramsToStrip) {
  var domain = url.split('?')[0];
  var query = url.split('?')[1];
  var obj = {};
  var pairKey;
  var pairValue;
  var newQueryStr;

  if (!query) return domain;

  query.split('&').forEach(function(pair) {
    pairKey = pair.split('=')[0];
    pairValue = pair.split('=')[1];
    //if has filter array:
    //  if this key need filter
    //    return 
    //  else 
    //      if already have
    //        return
    //      else 
    //        add
    //else 
    //  if already have   
    //    return 
    //  else 
    //    add
    if (paramsToStrip ? paramsToStrip.some(function(param) {
        return param === pairKey
      }) : null || obj.hasOwnProperty(pairKey)) return;
    obj[pairKey] = pairValue;
  });

  newQueryStr = Object.keys(obj).map(function(key) {
    return key + '=' + obj[key];
  }).join('&');

  return domain + (newQueryStr ? '?' + newQueryStr : '');
}
//from : https://www.codewars.com/users/jimmy-ringo