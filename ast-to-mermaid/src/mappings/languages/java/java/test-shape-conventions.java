public class TestShapeConventions {
    public static void main(String[] args) {
        // Variable declarations/assignments (Rectangle)
        int a = 5;
        a = a + 10;
        
        // Print statements (Parallelogram)
        System.out.println("Hello");
        
        // Input statements (Parallelogram)
        java.util.Scanner sc = new java.util.Scanner(System.in);
        int n = sc.nextInt();
        
        // If conditions (Diamond)
        if (a > 10) {
            System.out.println("Greater than 10");
        } else {
            System.out.println("Not greater than 10");
        }
        
        // For loops (Diamond)
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteration: " + i);
        }
        
        // Switch statements (Diamond)
        switch(n) {
            case 1:
                System.out.println("One");
                break;
            default:
                System.out.println("Other");
        }
        
        // Function calls (Rectangle)
        // Note: We're not showing function definitions, just calls
        
        // Return statement (Oval - End)
        // Note: This is implicitly handled as the end node
    }
}