public class ComprehensiveTextExample {
    public static void main(String[] args) {
        // 1. Simple string output
        System.out.println("Welcome to the application");
        
        // 2. Input prompt
        System.out.print("Please enter your username: ");
        
        // 3. Input operation
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        String username = scanner.nextLine();
        
        // 4. Output with variable
        System.out.println("Hello, " + username + "! Welcome.");
        
        // 5. Numeric input
        System.out.print("Enter your age: ");
        int age = scanner.nextInt();
        
        // 6. Conditional output based on input
        if (age >= 18) {
            System.out.println("You are eligible for all features");
        } else {
            System.out.println("Some features are restricted");
        }
        
        // 7. Loop with counter
        for (int i = 1; i <= 3; i++) {
            System.out.println("Loading module " + i + " of 3");
        }
        
        // 8. Complex message with multiple variables
        int score = 95;
        System.out.println(username + ", your final score is " + score + " points");
        
        // 9. Status update
        System.out.println("Application terminated successfully");
        
        scanner.close();
    }
}