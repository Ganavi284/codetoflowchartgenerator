#include <stdio.h>

int helper() {
    return 42;
}

int another_function(int x) {
    if (x > 0) {
        return x;
    } else {
        return -x;
    }
}