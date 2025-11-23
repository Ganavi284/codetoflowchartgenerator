// Variable declaration with value (should be included)
let a = 5;

// Assignment (should be included)
a = a + 10;

// Output (should be parallelogram)
console.log("Hello World");

// Condition (should be diamond)
if (a > 0) {
  console.log("Positive");
} else {
  console.log("Non-positive");
}

// Loop (should be diamond)
for (let i = 0; i < 3; i++) {
  console.log("Loop: " + i);
}

// Switch-case (should be diamond with branches)
switch (a) {
  case 5:
    console.log("Value is 5");
    break;
  case 15:
    console.log("Value is 15");
    break;
  default:
    console.log("Other value");
}

// Function call (should be rectangle)
someFunction();

// Return (should connect to end)
return;