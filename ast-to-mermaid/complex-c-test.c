#include <stdio.h>

int main() {
    int x = 10;
    int y = 5;
    
    // Nested if statement
    if (x > 0) {
        if (y > 0) {
            printf("Both x and y are positive\n");
        } else {
            printf("x is positive but y is not\n");
        }
    } else {
        printf("x is not positive\n");
    }
    
    // While loop with if statement
    int result = 0;
    while (result < 3) {
        if (result == 1) {
            printf("Result is one\n");
        } else {
            printf("Result is not one\n");
        }
        
        result = result + 1;
    }
    
    // For loop
    for (int i = 1; i <= 5; i++) {
        printf("For loop iteration: %d\n", i);
    }
    
    return 0;
}