program TestCaseElseConflict;

var
  choice: integer;
  x: integer;

begin
  choice := 1;
  x := 5;
  
  case choice of
    1: if x > 0 then
         writeln('Positive')
       else
         writeln('Non-positive');
  else
    writeln('Invalid choice');
  end;

end.