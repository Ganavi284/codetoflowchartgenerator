public class FunctionWithIf {

    static String checkEvenOdd(int n) {
        if (n % 2 == 0)
            return "Even";
        else
            return "Odd";
    }

    public static void main(String[] args) {
        System.out.println(checkEvenOdd(7));
    }
}