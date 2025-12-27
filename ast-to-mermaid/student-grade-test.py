def evaluate_student(marks_list):
    total = 0

    for marks in marks_list:          # LOOP
        total += marks

    average = total / len(marks_list)

    if average >= 90:                 # CONDITIONALS
        grade = "A"
    elif average >= 75:
        grade = "B"
    elif average >= 50:
        grade = "C"
    else:
        grade = "Fail"

    return average, grade             # RETURN VALUES


# ---- Main Program ----
marks = []

n = int(input("Enter number of subjects: "))

for i in range(n):
    marks.append(int(input(f"Enter marks of subject {i+1}: ")))

avg, result = evaluate_student(marks)

print("Average =", avg)
print("Grade =", result)