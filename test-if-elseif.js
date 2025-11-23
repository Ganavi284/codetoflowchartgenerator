let x = prompt('Enter a number:');
x = Number(x);

if (x > 0) {
  console.log('Positive');
} else if (x < 0) {
  console.log('Negative');
} else {
  console.log('Zero');
}

console.log('Done');