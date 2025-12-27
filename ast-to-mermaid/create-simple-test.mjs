import { writeFileSync } from 'fs';

const javaCode = `public class SimpleTest {
    public static void main(String[] args) {
        add(5, 10);
        printMessage("Hello");
    }
    
    public static int add(int x, int y) {
        return x + y;
    }
    
    public static void printMessage(String message) {
        System.out.println(message);
    }
}`;

writeFileSync('simple-test.java', javaCode, 'utf8');
console.log('Simple test file created successfully');