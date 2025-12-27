program GradeCheck;

var
  marks: integer;

begin
  write('Enter marks: ');
  readln(marks);

  if marks >= 90 then
    writeln('Grade A')
  else if marks >= 75 then
    writeln('Grade B')
  else if marks >= 50 then
    writeln('Grade C')
  else
    writeln('Fail');

end.