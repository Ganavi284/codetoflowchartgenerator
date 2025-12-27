let result: number = 0;

// For loop
for (let i: number = 0; i < 3; i++) {
  result += i;
}

// While loop
let j: number = 0;
while (j < 3) {
  result += j;
  j++;
}

// Do-while loop
let k: number = 0;
do {
  result += k;
  k++;
} while (k < 3);

console.log("Result: " + result);