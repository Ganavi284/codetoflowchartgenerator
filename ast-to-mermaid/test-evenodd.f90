program EvenOdd

    implicit none

    integer :: num

    print *, "Enter a number:"
    read *, num

    if (mod(num, 2) == 0) then
        print *, "The number is Even"
    else
        print *, "The number is Odd"
    end if

end program EvenOdd