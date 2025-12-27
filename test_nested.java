public class TestNested {
    public static void main(String[] args) {
        int i = 0;
        
        while (i < 2) {
            System.out.println("Outer: " + i);
            
            for (int j = 0; j < 2; j++) {
                System.out.println("Inner: " + j);
            }
            
            i++;
        }
        
        System.out.println("Done");
    }
}