


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