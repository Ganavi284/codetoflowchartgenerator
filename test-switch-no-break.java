public class TestSwitchNoBreak {
    public static void main(String[] args) {
        int day = 5;
        
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            default:
                System.out.println("Weekday");
                // No break statement here - fallthrough behavior
        }
        
        System.out.println("After switch statement");
    }
}