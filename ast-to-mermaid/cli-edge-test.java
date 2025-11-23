public class CLIEdgeTest {
    public static void main(String[] args) {
        int x = 5;
        
        // Empty if statement
        if (x > 0) {
            // Empty body
        }
        
        // If-else with empty else
        if (x > 10) {
            System.out.println("Greater than 10");
        } else {
            // Empty else
        }
        
        // If with single statement (no braces)
        if (x > 0)
            System.out.println("Single statement if");
            
        System.out.println("End");
    }
}