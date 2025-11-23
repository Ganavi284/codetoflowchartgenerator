// This file tests the JavaScript flowchart generation guidelines
import fs from "fs"; // Should be ignored

// Comment - Should be ignored
/* Multi-line comment - Should be ignored */

class TestClass { // Class declaration - Should be ignored
  constructor() { // Constructor - Should be ignored
    this.value = 0;
  }
  
  method() { // Method signature - Should be ignored
    // Method body - Should process executable statements
    let x; // Variable declaration without value - Should be ignored
    let y = 10; // Variable declaration with value - Should be included
    "use strict"; // Directive - Should be ignored
    
    // Executable statements - Should be included
    console.log("Hello, World!"); // Output - Should be parallelogram
    x = y + 5; // Assignment - Should be rectangle
    
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
    switch (y) {
      case 5:
        console.log("Value is 5");
        break;
      case 10:
        console.log("Value is 10");
        break;
      default:
        console.log("Other value");
    }
    
    return x; // Return - Should be oval
  }
}

// Function declaration - Should be ignored until first executable line
function testFunction() {
  console.log("Function execution"); // Should be included
}

// Function call - Should be included
testFunction();

// Export - Should be ignored
export { TestClass };