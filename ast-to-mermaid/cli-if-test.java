public class CliIfTest {
    public static void main(String[] args) {
        int number = 15;
        
        // Test simple if statement
        if (number > 10) {
            System.out.println("Number is greater than 10");
        }
        
        // Test if-else statement
        if (number % 2 == 0) {
            System.out.println("Number is even");
        } else {
            System.out.println("Number is odd");
        }
        
        // Test if-else-if chain
        if (number < 0) {
            System.out.println("Number is negative");
        } else if (number < 10) {
            System.out.println("Number is single digit");
        } else if (number < 100) {
            System.out.println("Number is double digit");
        } else {
            System.out.println("Number is large");
        }
        
        // Test nested if
        if (number > 0) {
            if (number > 10) {
                System.out.println("Positive and greater than 10");
            } else {
                System.out.println("Positive but 10 or less");
            }
        }
        
        System.out.println("Test completed");
    }
}