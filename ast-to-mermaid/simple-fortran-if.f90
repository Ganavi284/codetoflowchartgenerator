program simple_test
    implicit none
    integer :: x = 5
    
    if (x > 0) then
        print *, 'x is positive'
    else
        print *, 'x is not positive'
    end if
    
end program simple_test