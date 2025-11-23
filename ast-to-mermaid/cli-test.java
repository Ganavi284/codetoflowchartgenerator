public class CLITest {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        
        // Simple if statement
        if (a > 5) {
            System.out.println("a is greater than 5");
        }
        
        // If-else statement
        if (a > b) {
            System.out.println("a is greater than b");
        } else {
            System.out.println("a is not greater than b");
        }
        
        // If-else if-else statement
        if (a < 0) {
            System.out.println("a is negative");
        } else if (a < 10) {
            System.out.println("a is less than 10");
        } else if (a == 10) {
            System.out.println("a is equal to 10");
        } else {
            System.out.println("a is greater than 10");
        }
        
        // Nested if statement
        if (a > 5) {
            if (b > 15) {
                System.out.println("Both conditions are true");
            }
        }
        
        System.out.println("End of program");
    }
}