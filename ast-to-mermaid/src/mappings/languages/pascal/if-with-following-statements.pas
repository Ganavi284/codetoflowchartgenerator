program TestIfWithFollowing;
var
  n: integer;
begin
  writeln('Before if');
  
  if (n >= 0) then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
    
  writeln('After if');
end.