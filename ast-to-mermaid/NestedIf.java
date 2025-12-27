public class NestedIf {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        
        if (a > 0) {
            System.out.println("a is positive");
        }
        
        if (b > 5) {
            if (a < 20) {
                System.out.println("nested condition");
            }
        }
        
        System.out.println("End");
    }
}