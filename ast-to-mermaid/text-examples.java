public class TextExamples {
    public static void main(String[] args) {
        // Example 1: Simple string literal
        System.out.println("Welcome to the program");
        
        // Example 2: String with variable concatenation
        String userName = "Alice";
        System.out.println("Hello, " + userName + "!");
        
        // Example 3: Numeric output with variable
        int score = 95;
        System.out.println("Your score is: " + score + " points");
        
        // Example 4: Multiple variables in output
        int attempts = 3;
        System.out.println("Attempt " + attempts + " of " + score);
        
        // Example 5: Input prompts
        java.util.Scanner input = new java.util.Scanner(System.in);
        System.out.print("Enter your age: ");
        int age = input.nextInt();
        
        // Example 6: Conditional messages
        if (age >= 18) {
            System.out.println("You are eligible to vote");
        } else {
            System.out.println("You are not eligible to vote");
        }
        
        // Example 7: Loop output
        for (int i = 1; i <= 3; i++) {
            System.out.println("Processing item " + i);
        }
        
        input.close();
    }
}