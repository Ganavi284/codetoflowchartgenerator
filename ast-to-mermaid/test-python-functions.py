def greet(name):
    print("Hello, " + name + "!")
    return "Greeting complete"

def add_numbers(a, b):
    result = a + b
    print("Sum is: " + str(result))
    return result

def main():
    # Function call examples
    greet("Alice")
    x = 5
    y = 10
    sum_result = add_numbers(x, y)
    greet("Bob")
    
    # Nested function call
    another_sum = add_numbers(3, 7)
    print("Program finished")

if __name__ == "__main__":
    main()