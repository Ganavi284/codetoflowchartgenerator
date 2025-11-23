program hello
    implicit none
    integer :: x = 10
    
    ! Simple if statement
    if (x > 0) then
        print *, 'x is positive'
    else
        print *, 'x is not positive'
    end if
    
    ! While loop
    do while (x > 5)
        print *, 'x is greater than 5: ', x
        x = x - 1
    end do
    
    ! For loop
    do x = 1, 5
        print *, 'For loop iteration: ', x
    end do
    
end program hello