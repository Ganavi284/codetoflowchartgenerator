public class TestBranching {
    public static void main(String[] args) {
        int x = 5;
        
        // Simple if with statements
        if (x > 0) {
            System.out.println("Positive");
            x = x + 1;
        }
        
        // If-else with statements in both branches
        if (x > 10) {
            System.out.println("Greater than 10");
            x = x - 1;
        } else {
            System.out.println("Not greater than 10");
            x = x + 1;
        }
        
        // Empty if
        if (x > 0) {
            // Empty body
        }
        
        // If-else with empty else
        if (x > 0) {
            System.out.println("Still positive");
        } else {
            // Empty else
        }
        
        System.out.println("End");
    }
}