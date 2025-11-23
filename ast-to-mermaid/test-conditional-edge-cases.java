public class TestEdgeCases {
    public static void main(String[] args) {
        int x = 10;
        
        // Empty if statement
        if (x > 5) {
            // Empty body
        }
        
        // If with single statement (no braces)
        if (x > 0)
            System.out.println("x is positive");
        
        // If-else with single statements (no braces)
        if (x > 20)
            System.out.println("x is large");
        else
            System.out.println("x is not large");
            
        // Multiple else-if statements
        if (x < 0) {
            System.out.println("Negative");
        } else if (x == 0) {
            System.out.println("Zero");
        } else if (x < 10) {
            System.out.println("Single digit");
        } else if (x == 10) {
            System.out.println("Ten");
        } else {
            System.out.println("Greater than 10");
        }
        
        System.out.println("End");
    }
}