program TestThreeConditions;

var
  score: integer;

begin
  write('Enter score: ');
  readln(score);

  if score >= 90 then
    writeln('Excellent')
  else if score >= 70 then
    writeln('Good')
  else if score >= 50 then
    writeln('Pass')
  else
    writeln('Fail');
end.