import java.util.Scanner;

public class TestDoWhile {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int sum = 0, num;
        
        do {
            System.out.print("Enter number (0 to stop): ");
            num = sc.nextInt();
            sum += num;
        } while (num != 0);
        
        System.out.println("Sum: " + sum);
        sc.close();
    }
}