public class CLIExamples {
    public static void main(String[] args) {
        // Example 1: Basic input/output
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        
        // Example 2: Numeric input with prompt
        System.out.print("Enter a number: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        
        // Example 3: Conditional output
        if (number > 10) {
            System.out.println("Number is greater than 10");
        } else {
            System.out.println("Number is 10 or less");
        }
        
        // Example 4: Loop with output
        for (int i = 0; i < 3; i++) {
            System.out.println("Iteration: " + i);
        }
        
        // Example 5: Complex string output
        String message = "Processing complete";
        System.out.println(message + " at step " + number);
        
        scanner.close();
    }
}