
//recursive way 

var palindromeChainLength_r1  = function(n) {  
  var x = parseInt( (""+n).split('').reverse().join('') );
  if(n != x){
    return 1 + palindromeChainLength (n + x);
  }
  return 0;
};

var palindromeChainLength_r2 = function(n) {
  var r = 1 * n.toString().split('').reverse().join('');
  return n - r && 1 + palindromeChainLength(r + n);
};

//loop way & not using string feature to judge & reverse a number
var palindromeChainLength_l = function(n) {
  var steps = 0;
  while(!isPalindromic(n)) {
    steps++;
    n+=reverseNum(n);
  }
  return steps;
};

function isPalindromic(n) {
  if (n < 0) throw 'isPalindromic only works for positive numbers.';
  if (Math.floor(n / 10) === 0) return true; // Single digit numbers are palindromic.
  if (n % 10 === 0) return false; // n > 0, without leading 0s cannot be palindromic if ending in 0.
  return reverseNum(n) === n;
}

function reverseNum(n) {
  var r = 0;
  while (n) {
    r *= 10;
    r += n % 10;
    n = Math.floor(n / 10);
  }
  return r;
}

//using for mocha & chai test
module.exports.fr1 = palindromeChainLength_r1;
module.exports.fr2 = palindromeChainLength_r2;
module.exports.fl = palindromeChainLength_l;

