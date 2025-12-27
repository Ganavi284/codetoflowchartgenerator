program ComprehensiveTest;
var
  x, i: integer;
begin
  case x of
    1: begin
         writeln('Case 1');
         if x > 0 then
           writeln('Positive number');
       end;
    2: begin
         writeln('Case 2');
         for i := 1 to 5 do
           writeln('Iteration: ', i);
       end;
    3: begin
         writeln('Case 3');
         i := 0;
         while i < 3 do
         begin
           writeln('While iteration: ', i);
           i := i + 1;
         end;
       end;
    4: begin
         writeln('Case 4');
         if x > 10 then
           writeln('Greater than 10')
         else
           writeln('Less than or equal to 10');
       end;
    else begin
           writeln('Default case');
           if x < 0 then
             writeln('Negative number')
           else if x = 0 then
             writeln('Zero')
           else
             writeln('Positive number');
         end;
  end;
end.