public class ComplexFunctionTest {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        
        if (a > 0) {
            int result = calculateSum(a, b);
            displayResult(result);
        } else {
            int result = calculateDifference(a, b);
            displayResult(result);
        }
        
        System.out.println("Done");
    }
    
    public static int calculateSum(int x, int y) {
        return x + y;
    }
    
    public static int calculateDifference(int x, int y) {
        return x - y;
    }
    
    public static void displayResult(int value) {
        System.out.println("Result: " + value);
    }
}