function add (a, b) {
  var res = '', c = 0
  a = a.split('')
  b = b.split('')
  while (a.length || b.length || c) {
    c += ~~a.pop() + ~~b.pop()
    res = c % 10 + res
    c = c > 9
  }
  return res
}

/*
c += ~~a.pop() + ~~b.pop()

It's a double bitwise not operator.

What is going on:

When an array becomes empty, .pop() return undefined.
When performing a bitwise operation, operand is converted by ToInt32:
ToNumber for undefined return NaN.
If number is NaN, +0, −0, +∞, or −∞, ToInt32 return +0.
Bitwise NOTing any number x yields -(x + 1), so ~0 return -1.
~-1 return 0.

*/

//https://www.codewars.com/kata/adding-big-numbers