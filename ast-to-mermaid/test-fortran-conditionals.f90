program test_conditionals
    implicit none
    integer :: x = 5
    integer :: y = 10
    integer :: score = 85
    
    ! Simple if statement
    if (x > 0) then
        print *, 'x is positive'
    end if
    
    ! If-else statement
    if (y > 0) then
        print *, 'y is positive'
    else
        print *, 'y is not positive'
    end if
    
    ! If-elseif-else statement
    if (score >= 90) then
        print *, 'Grade: A'
    else if (score >= 80) then
        print *, 'Grade: B'
    else if (score >= 70) then
        print *, 'Grade: C'
    else
        print *, 'Grade: F'
    end if
    
    ! Nested if statements
    if (x > 0) then
        if (y > 0) then
            print *, 'Both x and y are positive'
        else
            print *, 'x is positive but y is not'
        end if
    else
        print *, 'x is not positive'
    end if
    
end program test_conditionals