program RepeatUntilTest;

var
  j: integer;

begin
  j := 10;
  
  // Repeat-until loop
  repeat
    j := j - 1;
  until j <= 0;
  
  writeln('j = ', j);
end.