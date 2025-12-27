public class TestSwitchFallthrough {
    public static void main(String[] args) {
        int number = 2;
        
        switch (number) {
            case 1:
                System.out.println("One");
                // Fall through
            case 2:
                System.out.println("Two");
                // Fall through
            case 3:
                System.out.println("Three");
                break;
            case 4:
                System.out.println("Four");
                break;
            default:
                System.out.println("Other number");
                break;
        }
        
        System.out.println("After switch statement");
        return;
    }
}