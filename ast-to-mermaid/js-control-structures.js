let value = 2;

// Switch-case (should be diamond with branches)
switch (value) {
  case 1:
    console.log("One");
    break;
  case 2:
    console.log("Two");
    break;
  default:
    console.log("Other");
}

// Loop (should be diamond)
for (let i = 0; i < 2; i++) {
  console.log("Iteration: " + i);
}

// Function call
doSomething();