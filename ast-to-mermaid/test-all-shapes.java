public class TestAllShapes {
    public static void main(String[] args) {
        // Rectangle: Variable declaration
        int x = 10;
        
        // Rectangle: Assignment
        x = x * 2;
        
        // Parallelogram: Output
        System.out.println("Value of x: " + x);
        
        // Parallelogram: Input
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        System.out.print("Enter a number: ");
        int y = scanner.nextInt();
        
        // Diamond: If statement
        if (y > 0) {
            System.out.println("Positive number");
        } else {
            System.out.println("Non-positive number");
        }
        
        // Diamond: For loop
        for (int i = 0; i < 3; i++) {
            System.out.println("Loop iteration: " + i);
        }
        
        // Diamond: While loop
        int counter = 0;
        while (counter < 2) {
            System.out.println("While loop: " + counter);
            counter++;
        }
        
        // Diamond: Switch statement
        switch (y) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other number");
        }
        
        // Rectangle: Function call (simulated)
        performCalculation(x, y);
        
        // Rectangle: Increment operation
        x++;
    }
    
    // This won't appear in the flowchart since it's not in main()
    public static void performCalculation(int a, int b) {
        System.out.println("Calculation result: " + (a + b));
    }
}