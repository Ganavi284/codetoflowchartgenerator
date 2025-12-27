public class TestIfBlocks {
    public static void main(String[] args) {
        int x = 10;
        
        // Simple if statement
        if (x > 5) {
            System.out.println("x is greater than 5");
        }
        
        // If-else statement
        if (x > 15) {
            System.out.println("x is greater than 15");
        } else {
            System.out.println("x is not greater than 15");
        }
        
        // If-else-if statement
        if (x > 15) {
            System.out.println("x is greater than 15");
        } else if (x > 5) {
            System.out.println("x is greater than 5 but not greater than 15");
        } else {
            System.out.println("x is 5 or less");
        }
        
        System.out.println("End");
    }
}