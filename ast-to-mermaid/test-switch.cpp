int main() {
    int x = 2;
    switch (x) {
        case 1:
            cout << "Case 1" << endl;
        case 2: // fall-through
            cout << "Case 2" << endl;
        case 3:
            cout << "Case 3" << endl;
        default:
            cout << "Default" << endl;
    }
    return 0;
}