// This test focuses on executable statements only
let x = 10; // Variable declaration with value - Should be included
console.log("Hello, World!"); // Output - Should be parallelogram
x = x + 5; // Assignment - Should be rectangle

// Conditional - Should be diamond
if (x > 10) {
  console.log("Greater than 10");
} else {
  console.log("Not greater than 10");
}

// Loop - Should be diamond
for (let i = 0; i < 3; i++) {
  console.log("Loop iteration: " + i);
}

// Switch - Should be diamond with branches
switch (x) {
  case 15:
    console.log("Value is 15");
    break;
  default:
    console.log("Other value");
}

return x; // Return - Should be oval