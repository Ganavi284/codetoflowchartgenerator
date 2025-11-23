#include <iostream>
using namespace std;

int main() {
    int x = 10;
    
    if (x > 5) {
        cout << "x is greater than 5" << endl;
    } else if (x == 5) {
        cout << "x is equal to 5" << endl;
    } else {
        cout << "x is less than 5" << endl;
    }
    
    return 0;
}