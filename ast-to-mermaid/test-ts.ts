let x: number = 10;
let y: number = 5;

// Nested if statement
if (x > 0) {
    if (y > 0) {
        console.log("Both x and y are positive");
    } else {
        console.log("x is positive but y is not");
    }
} else {
    console.log("x is not positive");
}

// While loop with if statement
let result: number = 0;
while (result < 3) {
    if (result === 1) {
        console.log("Result is one");
    } else {
        console.log("Result is not one");
    }
    
    result = result + 1;
}

// For loop
for (let i: number = 1; i <= 5; i++) {
    console.log("For loop iteration: " + i);
}