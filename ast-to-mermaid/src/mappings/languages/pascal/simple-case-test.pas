program SimpleCaseTest;
var
  x: integer;
begin
  case x of
    1: begin
         writeln('Case 1');
         if x > 0 then
           writeln('Positive');
       end;
    2: begin
         writeln('Case 2');
         for i := 1 to 3 do
           writeln('Iteration: ', i);
       end;
  end;
end.