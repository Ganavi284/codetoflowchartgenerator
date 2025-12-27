program CaseChar;

var
  ch: char;

begin
  write('Enter a character: ');
  readln(ch);

  case ch of
    'a', 'e', 'i', 'o', 'u':
      writeln('Vowel');
  else
      writeln('Consonant');
  end;

end.