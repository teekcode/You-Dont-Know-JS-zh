function Dictionary(words) {
  this.words = words;
}

Dictionary.prototype.findMostSimilar = function(term) {
  //record the similarity between term & each word in dictionary
  var simi = [];
  
  this.words.forEach(function(i){
    simi.push(ccl(i, term));
  });
  
  return this.words[simi.indexOf(Math.min.apply(null, simi))];
}

function ccl(a, b) {
  var a = a.split("");
  a.unshift(0);
  var b = b.split("");
  b.unshift(0);
  var matrix = [], sub;

  for(var i = 0; i<=a.length; i++){
  	matrix[i] = [];
    for(var j = 0; j<=b.length; j++)
  	  matrix[i][j] = 0;
  }

  for(var i = 1; i<=a.length; i++)
    matrix[i][0] = i;
  for(var j = 1; j<=b.length; j++)
    matrix[0][j] = j;
    
  for(var j = 1; j<=b.length; j++)
  {
    for(var i = 1; i<=a.length; i++) 
    {
      if(a[i] == b[j]){
        sub = 0;
      }
      else { 
        sub = 1;
      }
      matrix[i][j] = Math.min(matrix[i-1][j] + 1,                   // deletion
                             matrix[i][j-1] + 1,                   // insertion
                             matrix[i-1][j-1] + sub)  // substitution
    }
  }
  return matrix[a.length][b.length];
}

/*
function ccl(a, alen, b, blen){
  var diff;
  if(alen == 0) return blen;
  if(blen == 0) return alen;
  
  if(a[alen-1] == b[blen-1])
    diff = 0;
  else 
    diff = 1;
    
  return Math.min(ccl(a, alen-1, b, blen) + 1,
  								ccl(a, alen,   b, blen-1) + 1,
  								ccl(a, alen-1, b, blen-1) + diff);
}
*/
