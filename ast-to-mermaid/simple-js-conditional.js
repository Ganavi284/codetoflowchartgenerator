let x = 10;
let y = 5;

// Simple if statement
if (x > 5) {
  console.log("x is greater than 5");
}

// If-else statement
if (y > 10) {
  console.log("y is greater than 10");
} else {
  console.log("y is not greater than 10");
}

// If-else-if chain
if (x > 20) {
  console.log("x is greater than 20");
} else if (x > 15) {
  console.log("x is between 15 and 20");
} else if (x > 5) {
  console.log("x is between 5 and 15");
} else {
  console.log("x is not greater than 5");
}

// Switch statement
switch (x) {
  case 5:
    console.log("x is 5");
    break;
  case 10:
    console.log("x is 10");
    break;
  default:
    console.log("x is something else");
}