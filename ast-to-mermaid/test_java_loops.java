public class test_java_loops {
    public static void main(String[] args) {
        // For loop
        for (int i = 0; i < 3; i++) {
            System.out.println("For loop: " + i);
        }
        
        // While loop
        int j = 0;
        while (j < 2) {
            System.out.println("While loop: " + j);
            j++;
        }
        
        // Do-while loop
        int k = 0;
        do {
            System.out.println("Do-while loop: " + k);
            k++;
        } while (k < 2);
        
        System.out.println("End");
    }
}