#include <iostream>
using namespace std;

int main() {
    int x = 2;

    switch (x) {
        case 1:
            cout << "Case 1\n";
            break;
        case 2:
            cout << "Case 2\n";
            break;
        case 3:
            cout << "Case 3\n";
            break;
        default:
            cout << "Default\n";
    }

    return 0;
}