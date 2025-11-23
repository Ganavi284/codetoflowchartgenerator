// Comprehensive test of JavaScript flowchart generation
let number = 42;
console.log("Starting program with number: " + number);

// Simple conditional
if (number > 0) {
  console.log("Number is positive");
} else {
  console.log("Number is not positive");
}

// If-else-if chain
if (number > 100) {
  console.log("Number is large");
} else if (number > 50) {
  console.log("Number is medium");
} else if (number > 0) {
  console.log("Number is small but positive");
} else {
  console.log("Number is zero or negative");
}

// Loop
for (let i = 0; i < 3; i++) {
  console.log("Loop iteration: " + i);
}

// Switch statement
switch (number) {
  case 42:
    console.log("The answer to life, the universe, and everything");
    break;
  case 0:
    console.log("Zero");
    break;
  default:
    console.log("Some other number");
}

// Assignment
number = number * 2;
console.log("Doubled number: " + number);

return number;