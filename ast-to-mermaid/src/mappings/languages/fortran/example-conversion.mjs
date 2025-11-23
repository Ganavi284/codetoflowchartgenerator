/**
 * Example Fortran code conversion to Mermaid diagram
 */

// The Fortran code we want to convert:
/*
program main
    implicit none
    integer :: i, sum = 0
    
    ! For loop example
    do i = 0, 4
        sum = sum + i
        
        ! Nested if statement
        if (i > 2) then
            print *, "i is greater than 2: ", i
        else
            print *, "i is less than or equal to 2: ", i
        end if
    end do
    
    ! While loop example
    integer :: j = 0
    do while (j < 3)
        print *, "While loop iteration: ", j
        j = j + 1
    end do
    
    ! Do-while loop example
    integer :: k = 0
    do
        print *, "Do-while loop iteration: ", k
        k = k + 1
        if (k >= 2) exit
    end do
    
    ! Select case example (Fortran's switch)
    select case (sum)
        case (0)
            print *, "Sum is zero"
        case (10)
            print *, "Sum is ten"
        case default
            print *, "Sum is something else: ", sum
    end select
    
    ! Stop statement
    stop
end program main
*/

// Expected Mermaid output:
/*
graph TD
    Fmain[Program: main]
    Fmain --> L1
    L1[Do Loop]
    L1 --> C2
    C2[If Statement]
    C2 --> I3
    C2 --> E4
    E4[Else]
    E4 --> I5
    Fmain --> L6
    L6[Do While Loop]
    L6 --> I7
    Fmain --> L8
    L8[Do Loop]
    L8 --> I9
    Fmain --> S10
    S10[Select Case]
    S10 --> CASE11
    CASE11[Case 0]
    CASE11 --> I12
    S10 --> CASE14
    CASE14[Case 10]
    CASE14 --> I15
    S10 --> CASE17
    CASE17[Default Case]
    CASE17 --> I18
    Fmain --> R20
    R20[Stop Statement]
*/

export function getFortranExampleCode() {
  return `program main
    implicit none
    integer :: i, sum = 0
    
    ! For loop example
    do i = 0, 4
        sum = sum + i
        
        ! Nested if statement
        if (i > 2) then
            print *, "i is greater than 2: ", i
        else
            print *, "i is less than or equal to 2: ", i
        end if
    end do
    
    ! While loop example
    integer :: j = 0
    do while (j < 3)
        print *, "While loop iteration: ", j
        j = j + 1
    end do
    
    ! Do-while loop example
    integer :: k = 0
    do
        print *, "Do-while loop iteration: ", k
        k = k + 1
        if (k >= 2) exit
    end do
    
    ! Select case example (Fortran's switch)
    select case (sum)
        case (0)
            print *, "Sum is zero"
        case (10)
            print *, "Sum is ten"
        case default
            print *, "Sum is something else: ", sum
    end select
    
    ! Stop statement
    stop
end program main`;
}

export function getExpectedMermaidOutput() {
  return `graph TD
    Fmain[Program: main]
    Fmain --> L1
    L1[Do Loop]
    L1 --> C2
    C2[If Statement]
    C2 --> I3
    C2 --> E4
    E4[Else]
    E4 --> I5
    Fmain --> L6
    L6[Do While Loop]
    L6 --> I7
    Fmain --> L8
    L8[Do Loop]
    L8 --> I9
    Fmain --> S10
    S10[Select Case]
    S10 --> CASE11
    CASE11[Case 0]
    CASE11 --> I12
    S10 --> CASE14
    CASE14[Case 10]
    CASE14 --> I15
    S10 --> CASE17
    CASE17[Default Case]
    CASE17 --> I18
    Fmain --> R20
    R20[Stop Statement]`;
}