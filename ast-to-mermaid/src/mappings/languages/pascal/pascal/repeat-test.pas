program RepeatTest;
var
  i: integer;
begin
  i := 5;
  repeat
    writeln('Repeat loop iteration: ', i);
    i := i - 1;
  until i = 0;
end.