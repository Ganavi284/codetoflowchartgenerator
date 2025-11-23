#include <stdio.h>

int main() {
    int i, sum = 0;
    
    // Complex nested loops and conditionals
    for (i = 0; i < 5; i++) {
        sum += i;
        
        if (i > 2) {
            printf("i is greater than 2: %d\n", i);
        } else if (i == 2) {
            printf("i is equal to 2: %d\n", i);
        } else {
            printf("i is less than 2: %d\n", i);
        }
        
        // Nested loop
        int j = 0;
        while (j < 2) {
            if (j == 1) {
                printf("  Inner loop j=1: %d\n", j);
            }
            j++;
        }
    }
    
    // Switch statement
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
    
    return 0;
}