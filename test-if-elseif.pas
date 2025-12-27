program TestIfElseIf;
var
  score: integer;
begin
  write('Enter your score: ');
  readln(score);
  
  if score >= 90 then
    writeln('Grade: A')
  else if score >= 80 then
    writeln('Grade: B')
  else if score >= 70 then
    writeln('Grade: C')
  else if score >= 60 then
    writeln('Grade: D')
  else
    writeln('Grade: F');
end.