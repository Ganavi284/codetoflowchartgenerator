/**
 * Example JavaScript code conversion to Mermaid diagram
 */

// The JavaScript code we want to convert:
/*
function main() {
    let i, sum = 0;
    
    // For loop example
    for (i = 0; i < 5; i++) {
        sum += i;
        
        // Nested if statement
        if (i > 2) {
            console.log("i is greater than 2: " + i);
        } else {
            console.log("i is less than or equal to 2: " + i);
        }
    }
    
    // While loop example
    let j = 0;
    while (j < 3) {
        console.log("While loop iteration: " + j);
        j++;
    }
    
    // Do-while loop example
    let k = 0;
    do {
        console.log("Do-while loop iteration: " + k);
        k++;
    } while (k < 2);
    
    // Switch statement example
    switch (sum) {
        case 0:
            console.log("Sum is zero");
            break;
        case 10:
            console.log("Sum is ten");
            break;
        default:
            console.log("Sum is something else: " + sum);
            break;
    }
}

main();
*/

// Expected Mermaid output:
/*
graph TD
    Fmain[Function: main]
    Fmain --> L1
    L1[For Loop]
    L1 --> C2
    C2[If Statement]
    C2 --> I3
    C2 --> E4
    E4[Else]
    E4 --> I5
    Fmain --> L6
    L6[While Loop]
    L6 --> I7
    Fmain --> L8
    L8[Do-While Loop]
    L8 --> I9
    Fmain --> S10
    S10[Switch Statement]
    S10 --> CASE11
    CASE11[Case 0]
    CASE11 --> I12
    CASE11 --> B13
    S10 --> CASE14
    CASE14[Case 10]
    CASE14 --> I15
    CASE14 --> B16
    S10 --> CASE17
    CASE17[Default Case]
    CASE17 --> I18
    CASE17 --> B19
*/

export function getJavaScriptExampleCode() {
  return `function main() {
    let i, sum = 0;
    
    // For loop example
    for (i = 0; i < 5; i++) {
        sum += i;
        
        // Nested if statement
        if (i > 2) {
            console.log("i is greater than 2: " + i);
        } else {
            console.log("i is less than or equal to 2: " + i);
        }
    }
    
    // While loop example
    let j = 0;
    while (j < 3) {
        console.log("While loop iteration: " + j);
        j++;
    }
    
    // Do-while loop example
    let k = 0;
    do {
        console.log("Do-while loop iteration: " + k);
        k++;
    } while (k < 2);
    
    // Switch statement example
    switch (sum) {
        case 0:
            console.log("Sum is zero");
            break;
        case 10:
            console.log("Sum is ten");
            break;
        default:
            console.log("Sum is something else: " + sum);
            break;
    }
}

main();`;
}

export function getExpectedMermaidOutput() {
  return `graph TD
    Fmain[Function: main]
    Fmain --> L1
    L1[For Loop]
    L1 --> C2
    C2[If Statement]
    C2 --> I3
    C2 --> E4
    E4[Else]
    E4 --> I5
    Fmain --> L6
    L6[While Loop]
    L6 --> I7
    Fmain --> L8
    L8[Do-While Loop]
    L8 --> I9
    Fmain --> S10
    S10[Switch Statement]
    S10 --> CASE11
    CASE11[Case 0]
    CASE11 --> I12
    CASE11 --> B13
    S10 --> CASE14
    CASE14[Case 10]
    CASE14 --> I15
    CASE14 --> B16
    S10 --> CASE17
    CASE17[Default Case]
    CASE17 --> I18
    CASE17 --> B19`;
}