// Loop Comparison: Java vs C/C++
// This file demonstrates different loop constructs in Java with their C/C++ equivalents

public class LoopComparison {

    public static void main(String[] args) {
        System.out.println("=== Loop Comparison: Java vs C/C++ ===\n");

        // 1. FOR LOOP
        System.out.println("1. FOR LOOP");
        System.out.println("Java:");
        for (int i = 0; i < 5; i++) {
            System.out.println("  Java iteration: " + i);
        }

        System.out.println("\nC/C++ equivalent:");
        System.out.println("  for (int i = 0; i < 5; i++) {");
        System.out.println("    printf(\"C/C++ iteration: %d\\n\", i);");
        System.out.println("  }");

        // 2. WHILE LOOP
        System.out.println("\n2. WHILE LOOP");
        System.out.println("Java:");
        int j = 0;
        while (j < 3) {
            System.out.println("  Java while iteration: " + j);
            j++;
        }

        System.out.println("\nC/C++ equivalent:");
        System.out.println("  int j = 0;");
        System.out.println("  while (j < 3) {");
        System.out.println("    printf(\"C/C++ while iteration: %d\\n\", j);");
        System.out.println("    j++;");
        System.out.println("  }");

        // 3. DO-WHILE LOOP
        System.out.println("\n3. DO-WHILE LOOP");
        System.out.println("Java:");
        int k = 0;
        do {
            System.out.println("  Java do-while iteration: " + k);
            k++;
        } while (k < 3);

        System.out.println("\nC/C++ equivalent:");
        System.out.println("  int k = 0;");
        System.out.println("  do {");
        System.out.println("    printf(\"C/C++ do-while iteration: %d\\n\", k);");
        System.out.println("    k++;");
        System.out.println("  } while (k < 3);");

        // 4. ENHANCED FOR LOOP (FOR-EACH) - UNIQUE TO JAVA
        System.out.println("\n4. ENHANCED FOR LOOP (FOR-EACH) - UNIQUE TO JAVA");
        System.out.println("Java:");
        String[] languages = {"Java", "C", "C++"};
        for (String lang : languages) {
            System.out.println("  Language: " + lang);
        }

        System.out.println("\nC++ equivalent (C++11 and later):");
        System.out.println("  std::string languages[] = {\"Java\", \"C\", \"C++\"};");
        System.out.println("  for (std::string lang : languages) {");
        System.out.println("    std::cout << \"Language: \" << lang << std::endl;");
        System.out.println("  }");
        
        System.out.println("\nC equivalent:");
        System.out.println("  char *languages[] = {\"Java\", \"C\", \"C++\"};");
        System.out.println("  int size = sizeof(languages) / sizeof(languages[0]);");
        System.out.println("  for (int i = 0; i < size; i++) {");
        System.out.println("    printf(\"Language: %s\\n\", languages[i]);");
        System.out.println("  }");

        // 5. BREAK AND CONTINUE
        System.out.println("\n5. BREAK AND CONTINUE");
        System.out.println("Java:");
        for (int i = 0; i < 5; i++) {
            if (i == 1) {
                continue; // Skip iteration when i is 1
            }
            if (i == 3) {
                break; // Exit loop when i is 3
            }
            System.out.println("  Java loop with control: " + i);
        }

        System.out.println("\nC/C++ equivalent:");
        System.out.println("  for (int i = 0; i < 5; i++) {");
        System.out.println("    if (i == 1) {");
        System.out.println("      continue; // Skip iteration when i is 1");
        System.out.println("    }");
        System.out.println("    if (i == 3) {");
        System.out.println("      break; // Exit loop when i is 3");
        System.out.println("    }");
        System.out.println("    printf(\"C/C++ loop with control: %d\\n\", i);");
        System.out.println("  }");

        // 6. NESTED LOOPS
        System.out.println("\n6. NESTED LOOPS");
        System.out.println("Java:");
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 3; col++) {
                System.out.print("  (" + row + "," + col + ") ");
            }
            System.out.println();
        }

        System.out.println("\nC/C++ equivalent:");
        System.out.println("  for (int row = 0; row < 3; row++) {");
        System.out.println("    for (int col = 0; col < 3; col++) {");
        System.out.println("      printf(\"(%d,%d) \", row, col);");
        System.out.println("    }");
        System.out.println("    printf(\"\\n\");");
        System.out.println("  }");

        // 7. LABELED LOOPS (Java-specific feature)
        System.out.println("\n7. LABELED LOOPS (Java-specific feature)");
        System.out.println("Java:");
        outerLoop: for (int i = 0; i < 3; i++) {
            for (int m = 0; m < 3; m++) {
                if (i == 1 && m == 1) {
                    System.out.println("  Breaking from outer loop at (1,1)");
                    break outerLoop;
                }
                System.out.println("  Java nested: (" + i + "," + m + ")");
            }
        }

        System.out.println("\nC/C++ equivalent (using goto - not recommended):");
        System.out.println("  for (int i = 0; i < 3; i++) {");
        System.out.println("    for (int m = 0; m < 3; m++) {");
        System.out.println("      if (i == 1 && m == 1) {");
        System.out.println("        printf(\"Breaking from outer loop at (1,1)\\n\");");
        System.out.println("        goto end_loop;");
        System.out.println("      }");
        System.out.println("      printf(\"C/C++ nested: (%d,%d)\\n\", i, m);");
        System.out.println("    }");
        System.out.println("  }");
        System.out.println("  end_loop: ;");

        System.out.println("\n=== Summary ===");
        System.out.println("Java loops are very similar to C/C++ loops in syntax and functionality.");
        System.out.println("Key differences:");
        System.out.println("1. Java has enhanced for-each loops for arrays and collections");
        System.out.println("2. Java has labeled loops for breaking out of nested loops");
        System.out.println("3. Java is type-safe and handles memory automatically");
        System.out.println("4. C/C++ has more direct memory manipulation but requires manual management");
    }
}