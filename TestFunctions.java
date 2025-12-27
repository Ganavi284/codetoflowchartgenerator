public class TestFunctions {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        int result = add(a, b);
        System.out.println("Result: " + result);
        printMessage("Hello World");
    }
    
    public static int add(int x, int y) {
        return x + y;
    }
    
    public static void printMessage(String message) {
        System.out.println(message);
    }
}