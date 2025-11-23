#include <iostream>

using namespace std;

int main() {
    int x = 2;

    switch (x) {
        case 1:
            cout << "Case 1\n";
        case 2: // fall-through
            cout << "Case 2\n";
        case 3:
            cout << "Case 3\n";
        default:
            cout << "Default\n";
    }

    return 0;
}