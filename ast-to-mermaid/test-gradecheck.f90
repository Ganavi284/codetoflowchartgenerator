program GradeCheck

    implicit none

    integer :: marks

    print *, "Enter marks:"
    read *, marks

    if (marks >= 90) then
        print *, "Grade A"
    else if (marks >= 75) then
        print *, "Grade B"
    else if (marks >= 50) then
        print *, "Grade C"
    else
        print *, "Fail"
    end if

end program GradeCheck