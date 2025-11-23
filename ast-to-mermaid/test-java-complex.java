int number = 2;
int result = 0;

if (number > 0) {
    result = number * 2;
} else {
    result = number * -1;
}

switch (number) {
    case 1:
        System.out.println("One");
        // Fall through
    case 2:
        System.out.println("Two");
        // Fall through
    case 3:
        System.out.println("Three");
        result = result + 10;
        break;
    case 4:
        System.out.println("Four");
        break;
    default:
        System.out.println("Other number");
        result = -1;
        break;
}

for (int i = 0; i < 3; i++) {
    System.out.println("Loop iteration: " + i);
    result = result + i;
}

System.out.println("Final result: " + result);