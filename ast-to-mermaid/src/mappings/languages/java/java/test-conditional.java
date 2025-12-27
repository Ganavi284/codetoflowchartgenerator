public class TestConditional {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        
        // Simple if statement
        if (x > 5) {
            System.out.println("x is greater than 5");
        }
        
        // If-else statement
        if (x > y) {
            System.out.println("x is greater than y");
        } else {
            System.out.println("x is not greater than y");
        }
        
        // If-else if-else statement
        if (x < 0) {
            System.out.println("x is negative");
        } else if (x < 10) {
            System.out.println("x is less than 10");
        } else if (x == 10) {
            System.out.println("x is equal to 10");
        } else {
            System.out.println("x is greater than 10");
        }
        
        // Nested if statement
        if (x > 5) {
            if (y > 15) {
                System.out.println("Both conditions are true");
            }
        }
        
        System.out.println("End of program");
    }
}