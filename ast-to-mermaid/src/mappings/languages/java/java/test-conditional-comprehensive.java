public class TestComprehensive {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        int c = 15;
        
        // Simple if statement
        if (a > 0) {
            System.out.println("a is positive");
        }
        
        // If-else statement
        if (b > 10) {
            System.out.println("b is greater than 10");
        } else {
            System.out.println("b is not greater than 10");
        }
        
        // If-else if-else statement
        if (c < 10) {
            System.out.println("c is less than 10");
        } else if (c < 20) {
            System.out.println("c is between 10 and 20");
        } else {
            System.out.println("c is 20 or greater");
        }
        
        // Nested if statement
        if (a > 0) {
            if (b > 0) {
                if (c > 0) {
                    System.out.println("All variables are positive");
                }
            }
        }
        
        // Complex condition
        if (a > 0 && b > 0 || c > 0) {
            System.out.println("At least one variable is positive");
        }
        
        System.out.println("End of program");
    }
}