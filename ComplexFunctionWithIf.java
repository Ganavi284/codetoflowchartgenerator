public class ComplexFunctionWithIf {

    static String checkEvenOdd(int n) {
        int result;
        if (n % 2 == 0) {
            result = 1;
            return "Even";
        } else {
            result = 0;
            return "Odd";
        }
    }

    public static void main(String[] args) {
        System.out.println(checkEvenOdd(7));
    }
}