def calculate(x, y):
    sum_result = x + y
    print("Calculated sum:", sum_result)
    return sum_result

def main():
    a = 10
    b = 20
    result = calculate(a, b)  # This should execute the calculate function body
    print("Final result:", result)

if __name__ == "__main__":
    main()