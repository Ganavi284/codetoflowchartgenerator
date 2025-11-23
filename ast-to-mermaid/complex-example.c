#include <stdio.h>
#include <stdlib.h>

#define MAX 100

int factorial(int n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    int num = 5;
    int result = factorial(num);
    
    printf("Factorial of %d is %d\n", num, result);
    
    // Dynamic memory allocation
    int *arr = (int*)malloc(MAX * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\n");
        return -1;
    }
    
    // Initialize array
    for (int i = 0; i < MAX; i++) {
        arr[i] = i * 2;
    }
    
    // Print some values
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    // Free memory
    free(arr);
    
    return 0;
}