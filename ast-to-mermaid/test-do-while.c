#include <stdio.h>

int main() {
    int i = 0;
    
    // Simple do-while loop
    do {
        printf("Value of i: %d\n", i);
        i++;
    } while (i < 5);
    
    // Another do-while with different condition
    int j = 10;
    do {
        printf("Value of j: %d\n", j);
        j--;
    } while (j > 5);
    
    return 0;
}