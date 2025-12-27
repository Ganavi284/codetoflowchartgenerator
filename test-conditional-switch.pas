program TestConditionals;
var
  score: integer;
  grade: char;
begin
  write('Enter your score: ');
  readln(score);
  
  // Simple if statement
  if score >= 90 then
    writeln('Excellent!');
  
  // If-else statement
  if score >= 60 then
    writeln('Passed')
  else
    writeln('Failed');
  
  // If-else-if ladder
  if score >= 90 then
    grade := 'A'
  else if score >= 80 then
    grade := 'B'
  else if score >= 70 then
    grade := 'C'
  else if score >= 60 then
    grade := 'D'
  else
    grade := 'F';
  
  writeln('Your grade is: ', grade);
  
  // Case statement
  case grade of
    'A': writeln('Outstanding performance!');
    'B': writeln('Good job!');
    'C': writeln('Satisfactory');
    'D': writeln('Needs improvement');
    'F': writeln('Failed - please try again');
  else
    writeln('Invalid grade');
  end;
  
  // Nested if statement
  if score >= 60 then
  begin
    if score >= 90 then
      writeln('You got an A!')
    else
      writeln('You passed but can do better');
  end;
end.