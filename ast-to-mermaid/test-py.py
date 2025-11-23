def main():
    x = 10
    y = 5
    
    # Nested if statement
    if x > 0:
        if y > 0:
            print("Both x and y are positive")
        else:
            print("x is positive but y is not")
    else:
        print("x is not positive")
    
    # While loop with if statement
    result = 0
    while result < 3:
        if result == 1:
            print("Result is one")
        else:
            print("Result is not one")
        
        result = result + 1
    
    # For loop
    for i in range(1, 6):
        print("For loop iteration: " + str(i))

if __name__ == "__main__":
    main()