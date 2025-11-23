/**
 * Example C++ code conversion to Mermaid diagram
 */

// The C++ code we want to convert:
/*
#include <stdio.h>

int main() {
    int i, sum = 0;
    
    // For loop example
    for (i = 0; i < 5; i++) {
        sum += i;
        
        // Nested if statement
        if (i > 2) {
            printf("i is greater than 2: %d\n", i);
        } else {
            printf("i is less than or equal to 2: %d\n", i);
        }
    }
    
    // While loop example
    int j = 0;
    while (j < 3) {
        printf("While loop iteration: %d\n", j);
        j++;
    }
    
    // Do-while loop example
    int k = 0;
    do {
        printf("Do-while loop iteration: %d\n", k);
        k++;
    } while (k < 2);
    
    // Switch statement example
    switch (sum) {
        case 0:
            printf("Sum is zero\n");
            break;
        case 10:
            printf("Sum is ten\n");
            break;
        default:
            printf("Sum is something else: %d\n", sum);
            break;
    }
    
    // Return statement
    return 0;
}
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
    Fmain --> R20
    R20[Return Statement]
*/

export function getCppExampleCode() {
  return `#include <stdio.h>

int main() {
    int i, sum = 0;
    
    // For loop example
    for (i = 0; i < 5; i++) {
        sum += i;
        
        // Nested if statement
        if (i > 2) {
            printf("i is greater than 2: %d\\n", i);
        } else {
            printf("i is less than or equal to 2: %d\\n", i);
        }
    }
    
    // While loop example
    int j = 0;
    while (j < 3) {
        printf("While loop iteration: %d\\n", j);
        j++;
    }
    
    // Do-while loop example
    int k = 0;
    do {
        printf("Do-while loop iteration: %d\\n", k);
        k++;
    } while (k < 2);
    
    // Switch statement example
    switch (sum) {
        case 0:
            printf("Sum is zero\\n");
            break;
        case 10:
            printf("Sum is ten\\n");
            break;
        default:
            printf("Sum is something else: %d\\n", sum);
            break;
    }
    
    // Return statement
    return 0;
}`;
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
    CASE17 --> B19
    Fmain --> R20
    R20[Return Statement]`;
}