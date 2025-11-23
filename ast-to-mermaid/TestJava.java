public class TestJava {
    public static void main(String[] args) {
        int x = 10;
        int y = 5;
        
        // Nested if statement
        if (x > 0) {
            if (y > 0) {
                System.out.println("Both x and y are positive");
            } else {
                System.out.println("x is positive but y is not");
            }
        } else {
            System.out.println("x is not positive");
        }
        
        // While loop with if statement
        int result = 0;
        while (result < 3) {
            if (result == 1) {
                System.out.println("Result is one");
            } else {
                System.out.println("Result is not one");
            }
            
            result = result + 1;
        }
        
        // For loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("For loop iteration: " + i);
        }
    }
}