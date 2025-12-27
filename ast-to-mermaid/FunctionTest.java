public class FunctionTest {
    public static void main(String[] args) {
        int result = calculateSum(5, 3);
        System.out.println("Result: " + result);
        displayResult(result);
    }
    
    public static int calculateSum(int a, int b) {
        int sum = a + b;
        return sum;
    }
    
    public static void displayResult(int value) {
        System.out.println("The value is: " + value);
    }
}