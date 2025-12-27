program IOExamples;
var
  x, y: integer;
  name: string;
begin
  // Basic writeln
  writeln('Hello World');
  
  // writeln with variables
  writeln('Value of x: ', x);
  
  // writeln with multiple variables
  writeln('x = ', x, ', y = ', y);
  
  // write (no newline)
  write('Enter your name: ');
  
  // readln
  readln(name);
  
  // write with variables
  write('Hello, ', name);
  
  // Complex writeln
  writeln('The sum of ', x, ' and ', y, ' is ', x + y);
  
  // writeln with formatting
  writeln('Formatted output: ', x:5, y:10);
end.