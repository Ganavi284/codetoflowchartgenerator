class ComplexForLoop {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += i;
            if (sum > 20) {
                break;
            }
        }
        System.out.println("Sum: " + sum);
    }
}