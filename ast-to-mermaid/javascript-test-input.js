
function example() {
  let x = 10;
  
  // Simple if statement
  if (x > 5) {
    console.log("Greater than 5");
  }
  
  // If-else statement
  if (x > 15) {
    console.log("Greater than 15");
  } else {
    console.log("Not greater than 15");
  }
  
  // If-else-if chain
  if (x > 20) {
    console.log("Greater than 20");
  } else if (x > 15) {
    console.log("Between 15 and 20");
  } else if (x > 5) {
    console.log("Between 5 and 15");
  } else {
    console.log("Not greater than 5");
  }
  
  // Switch statement
  switch (x) {
    case 5:
      console.log("Value is 5");
      break;
    case 10:
      console.log("Value is 10");
      break;
    case 15:
      console.log("Value is 15");
      break;
    default:
      console.log("Value is something else");
  }
}
