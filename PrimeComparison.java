// Comprehensive Comparison: C vs Java Loop Handling
// Prime Number Checker in both languages

/*
C VERSION:
#include <stdio.h>

int isPrime(int n) {
    int i;
    
    if (n <= 1)
        return 0;
    
    for (i = 2; i <= n / 2; i++) {
        if (n % i == 0)
            return 0;
    }
    
    return 1;
}

int main() {
    int num;
    
    printf("Enter a number: ");
    scanf("%d", &num);
    
    if (isPrime(num))
        printf("Prime number");
    else
        printf("Not a prime number");
    
    return 0;
}
*/

// JAVA VERSION:
import java.util.Scanner;

public class PrimeComparison {
    
    // Java version of the prime checking function (equivalent to C version)
    public static boolean isPrime(int n) {
        // Loop handling is similar to C
        for (int i = 2; i <= n / 2; i++) {  // for loop syntax is nearly identical
            if (n % i == 0)
                return false;  // equivalent to return 0 in C
        }
        
        return true;  // equivalent to return 1 in C
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter a number: ");
        int num = scanner.nextInt();
        
        // Conditional logic is the same as C
        if (isPrime(num))
            System.out.println("Prime number");
        else
            System.out.println("Not a prime number");
        
        scanner.close();
    }
    
    // Additional demonstration of different loop types in Java vs C approach
    public static void demonstrateLoops() {
        System.out.println("\n--- LOOP COMPARISON ---");
        
        // FOR LOOP - nearly identical between C and Java
        System.out.println("For loop (1 to 5):");
        for (int i = 1; i <= 5; i++) {  // Same structure as C
            System.out.print(i + " ");
        }
        System.out.println();
        
        // WHILE LOOP - identical logic to C
        System.out.println("While loop (1 to 3):");
        int j = 1;
        while (j <= 3) {  // Same as C
            System.out.print(j + " ");
            j++;
        }
        System.out.println();
        
        // DO-WHILE LOOP - identical logic to C
        System.out.println("Do-while loop (1 to 3):");
        int k = 1;
        do {  // Same as C
            System.out.print(k + " ");
            k++;
        } while (k <= 3);
        System.out.println();
        
        // ENHANCED FOR LOOP - Java specific (not available in C)
        System.out.println("Enhanced for loop (Java specific):");
        int[] numbers = {10, 20, 30};
        for (int number : numbers) {  // Java-specific syntax
            System.out.print(number + " ");
        }
        System.out.println();
    }
    
    // Demonstration of how the prime checking loop works step by step
    public static void demonstratePrimeLogic(int n) {
        System.out.println("\n--- PRIME CHECKING LOGIC FOR " + n + " ---");
        
        if (n <= 1) {
            System.out.println(n + " <= 1, so it's not prime");
            return;
        }
        
        System.out.println("Checking divisors from 2 to " + (n/2) + ":");
        
        // This for loop is identical in structure to the C version
        for (int i = 2; i <= n / 2; i++) {
            System.out.println("  Checking if " + n + " % " + i + " == 0");
            if (n % i == 0) {
                System.out.println("  " + n + " % " + i + " == 0, so " + n + " is not prime");
                return;
            }
        }
        
        System.out.println(n + " has no divisors in range, so it's prime");
    }
    
    // Main method with extended demonstration
    public static void mainExtended() {
        demonstrateLoops();
        
        // Test the step-by-step demonstration
        demonstratePrimeLogic(7);
        demonstratePrimeLogic(8);
        
        System.out.println("\n--- KEY DIFFERENCES IN LOOP HANDLING ---");
        System.out.println("1. FOR LOOP: Identical syntax and behavior");
        System.out.println("2. WHILE LOOP: Identical syntax and behavior");
        System.out.println("3. DO-WHILE LOOP: Identical syntax and behavior");
        System.out.println("4. Additional: Java has enhanced for-each loops");
        System.out.println("5. Memory management: Automatic in Java, manual in C");
        System.out.println("6. Type safety: Java is more strict than C");
    }
}