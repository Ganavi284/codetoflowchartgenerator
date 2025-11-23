public class ComprehensiveIfTest {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        
        // Simple if with multiple statements
        if (a < b) {
            System.out.println("a is less than b");
            a = a + 1;
            System.out.println("a is now: " + a);
        }
        
        // If-else with complex conditions
        if (a > b && b > 0) {
            System.out.println("Complex condition true");
        } else {
            System.out.println("Complex condition false");
            b = b - 1;
        }
        
        // Nested if
        if (a > 0) {
            if (b > 0) {
                System.out.println("Both a and b are positive");
            } else {
                System.out.println("a is positive but b is not");
            }
        }
        
        // If-else-if chain
        if (a == b) {
            System.out.println("a equals b");
        } else if (a > b) {
            System.out.println("a is greater than b");
        } else {
            System.out.println("a is less than b");
        }
        
        System.out.println("End of program");
    }
}