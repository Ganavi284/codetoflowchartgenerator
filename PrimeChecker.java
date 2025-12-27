// Java implementation of prime number checking program
// Demonstrates how Java handles loops similar to C

import java.util.Scanner;

public class PrimeChecker {
    
    // Method to check if a number is prime (same logic as C version)
    public static boolean isPrime(int n) {
        int i;
        
        if (n <= 1)
            return false;
        
        for (i = 2; i <= n / 2; i++) {
            if (n % i == 0)
                return false;
        }
        
        return true;
    }
    
    public static void main(String[] args) {
        int num;
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter a number: ");
        num = scanner.nextInt();
        
        if (isPrime(num))
            System.out.println("Prime number");
        else
            System.out.println("Not a prime number");
        
        scanner.close();
    }
}