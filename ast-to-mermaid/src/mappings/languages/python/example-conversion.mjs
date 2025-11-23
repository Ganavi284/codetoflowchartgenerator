/**
 * Example Python code conversion to Mermaid diagram
 */

// The Python code we want to convert:
/*
def main():
    i = 0
    sum = 0
    
    # For loop example (Python doesn't have traditional for loops like C, but we'll simulate with range)
    for i in range(5):
        sum += i
        
        # Nested if statement
        if i > 2:
            print("i is greater than 2: " + str(i))
        else:
            print("i is less than or equal to 2: " + str(i))
    
    # While loop example
    j = 0
    while j < 3:
        print("While loop iteration: " + str(j))
        j += 1
    
    # Python doesn't have a direct do-while loop, but we can simulate it
    k = 0
    while True:
        print("Do-while loop iteration: " + str(k))
        k += 1
        if not (k < 2):
            break
    
    # Match statement example (Python 3.10+)
    match sum:
        case 0:
            print("Sum is zero")
        case 10:
            print("Sum is ten")
        case _:
            print("Sum is something else: " + str(sum))

main()
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
    S10[Match Statement]
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

export function getPythonExampleCode() {
  return `def main():
    i = 0
    sum = 0
    
    # For loop example (Python doesn't have traditional for loops like C, but we'll simulate with range)
    for i in range(5):
        sum += i
        
        # Nested if statement
        if i > 2:
            print("i is greater than 2: " + str(i))
        else:
            print("i is less than or equal to 2: " + str(i))
    
    # While loop example
    j = 0
    while j < 3:
        print("While loop iteration: " + str(j))
        j += 1
    
    # Python doesn't have a direct do-while loop, but we can simulate it
    k = 0
    while True:
        print("Do-while loop iteration: " + str(k))
        k += 1
        if not (k < 2):
            break
    
    # Match statement example (Python 3.10+)
    match sum:
        case 0:
            print("Sum is zero")
        case 10:
            print("Sum is ten")
        case _:
            print("Sum is something else: " + str(sum))

main()`;
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
    S10[Match Statement]
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