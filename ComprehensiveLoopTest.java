// Comprehensive Loop Comparison: Java vs C vs C++
// This program demonstrates how loops are handled in Java compared to C and C++

public class ComprehensiveLoopTest {
    public static void main(String[] args) {
        System.out.println("=== COMPREHENSIVE LOOP COMPARISON: JAVA vs C vs C++ ===\n");

        // 1. FOR LOOP - Java Implementation
        System.out.println("1. FOR LOOP - JAVA IMPLEMENTATION");
        for (int i = 0; i < 3; i++) {
            System.out.println("   Java for loop iteration: " + i);
        }
        System.out.println();

        // 2. WHILE LOOP - Java Implementation
        System.out.println("2. WHILE LOOP - JAVA IMPLEMENTATION");
        int j = 0;
        while (j < 3) {
            System.out.println("   Java while loop iteration: " + j);
            j++;
        }
        System.out.println();

        // 3. DO-WHILE LOOP - Java Implementation
        System.out.println("3. DO-WHILE LOOP - JAVA IMPLEMENTATION");
        int k = 0;
        do {
            System.out.println("   Java do-while loop iteration: " + k);
            k++;
        } while (k < 3);
        System.out.println();

        // 4. ENHANCED FOR LOOP (FOR-EACH) - Java Specific
        System.out.println("4. ENHANCED FOR LOOP (FOR-EACH) - JAVA SPECIFIC");
        String[] languages = {"Java", "C", "C++"};
        for (String lang : languages) {
            System.out.println("   Language: " + lang);
        }
        System.out.println();

        // 5. NESTED LOOPS - Java Implementation
        System.out.println("5. NESTED LOOPS - JAVA IMPLEMENTATION");
        for (int row = 0; row < 2; row++) {
            for (int col = 0; col < 2; col++) {
                System.out.println("   Java nested loop (" + row + "," + col + ")");
            }
        }
        System.out.println();

        // 6. LOOP CONTROL (break and continue) - Java Implementation
        System.out.println("6. LOOP CONTROL (break and continue) - JAVA IMPLEMENTATION");
        for (int i = 0; i < 5; i++) {
            if (i == 1) {
                System.out.println("   Skipping iteration " + i + " (continue)");
                continue;
            }
            if (i == 3) {
                System.out.println("   Breaking at iteration " + i + " (break)");
                break;
            }
            System.out.println("   Java control loop iteration: " + i);
        }
        System.out.println();

        // 7. LABELED LOOPS - Java Specific Feature
        System.out.println("7. LABELED LOOPS - JAVA SPECIFIC FEATURE");
        outerLoop: for (int i = 0; i < 2; i++) {
            for (int m = 0; m < 3; m++) {
                if (i == 1 && m == 1) {
                    System.out.println("   Breaking from outer loop at (" + i + "," + m + ")");
                    break outerLoop;
                }
                System.out.println("   Java labeled loop (" + i + "," + m + ")");
            }
        }
        System.out.println();

        // Summary of differences
        System.out.println("=== SUMMARY OF LOOP HANDLING DIFFERENCES ===");
        System.out.println("JAVA:");
        System.out.println("  - Uses for, while, do-while loops similar to C/C++");
        System.out.println("  - Has enhanced for-each loops for arrays/collections");
        System.out.println("  - Supports labeled loops for complex control flow");
        System.out.println("  - Memory management is automatic");
        System.out.println("  - Type-safe with strong runtime checks");
        
        System.out.println("\nC/C++:");
        System.out.println("  - Uses for, while, do-while loops with similar syntax");
        System.out.println("  - No built-in for-each loops (C++11+ has range-based for)");
        System.out.println("  - Uses goto for complex control flow (not recommended)");
        System.out.println("  - Manual memory management required");
        System.out.println("  - More direct hardware/memory control but less safe");

        System.out.println("\n=== LOOP USAGE RECOMMENDATION ===");
        System.out.println("- Use for loops when the number of iterations is known");
        System.out.println("- Use while loops when condition is checked before each iteration");
        System.out.println("- Use do-while loops when condition is checked after each iteration");
        System.out.println("- Use enhanced for loops for iterating over collections/arrays");
        System.out.println("- Only use loops when repetition is required (as per project spec)");
    }
}