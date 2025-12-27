public class TestDoWhile {
    public static void main(String[] args) {
        int i = 0;
        
        // Simple do-while loop
        do {
            System.out.println("Value of i: " + i);
            i++;
        } while (i < 5);
        
        // Another do-while with different condition
        int j = 10;
        do {
            System.out.println("Value of j: " + j);
            j--;
        } while (j > 5);
    }
}