#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
    float salary;
} Employee;

typedef enum {
    JANUARY = 1,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER
} Month;

int main() {
    // Create an employee
    Employee emp1;
    strcpy(emp1.name, "John Doe");
    emp1.age = 30;
    emp1.salary = 50000.50;
    
    // Print employee info
    printf("Employee: %s\n", emp1.name);
    printf("Age: %d\n", emp1.age);
    printf("Salary: %.2f\n", emp1.salary);
    
    // Work with enum
    Month currentMonth = MARCH;
    printf("Current month: %d\n", currentMonth);
    
    // Array of structs
    Employee employees[3];
    employees[0] = emp1;
    
    Employee emp2 = {"Jane Smith", 25, 45000.75};
    employees[1] = emp2;
    
    // Pointer to struct
    Employee *ptr = &emp1;
    printf("Employee via pointer: %s\n", ptr->name);
    
    return 0;
}