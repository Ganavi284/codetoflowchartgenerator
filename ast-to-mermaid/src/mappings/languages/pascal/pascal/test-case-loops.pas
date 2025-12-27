program TestCaseLoops;
var
  x, i: integer;
begin
  case x of
    1: begin
         writeln('Case 1');
         // Simple if statement inside case
         if x > 0 then
           writeln('Positive number');
       end;
    2: begin
         writeln('Case 2');
         // For loop inside case
         for i := 1 to 5 do
           writeln('Iteration: ', i);
       end;
    3: begin
         writeln('Case 3');
         // While loop inside case
         i := 0;
         while i < 3 do
         begin
           writeln('While iteration: ', i);
           i := i + 1;
         end;
       end;
    else begin
           writeln('Default case');
           // Nested if-else
           if x > 10 then
             writeln('Greater than 10')
           else
             writeln('Less than or equal to 10');
         end;
  end;
end.