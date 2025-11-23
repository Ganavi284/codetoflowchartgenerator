#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int y = 5;
    
    // Nested if statement
    if (x > 0) {
        if (y > 0) {
            cout << "Both x and y are positive" << endl;
        } else {
            cout << "x is positive but y is not" << endl;
        }
    } else {
        cout << "x is not positive" << endl;
    }
    
    // While loop with if statement
    int result = 0;
    while (result < 3) {
        if (result == 1) {
            cout << "Result is one" << endl;
        } else {
            cout << "Result is not one" << endl;
        }
        
        result = result + 1;
    }
    
    // For loop
    for (int i = 1; i <= 5; i++) {
        cout << "For loop iteration: " << i << endl;
    }
    
    return 0;
}