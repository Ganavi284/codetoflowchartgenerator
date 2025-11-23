#include <iostream>

int main() {
    int choice = 2;
    
    std::cout << "Program start" << std::endl;
    
    switch(choice) {
        case 1:
            std::cout << "Executing case 1" << std::endl;
            break;
        case 2:
            std::cout << "Executing case 2" << std::endl;
            break;
        case 3:
            std::cout << "Executing case 3" << std::endl;
            break;
        default:
            std::cout << "Executing default case" << std::endl;
            break;
    }
    
    std::cout << "After switch block" << std::endl;
    std::cout << "Program end" << std::endl;
    
    return 0;
}