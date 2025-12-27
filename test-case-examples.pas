program TestCaseExamples;

var
  choice: integer;
  ch: char;

begin
  // Test 1: Simple numeric cases
  write('Enter a number (1-3): ');
  readln(choice);
  
  case choice of
    1: writeln('You chose one');
    2: writeln('You chose two');
    3: writeln('You chose three');
  else
    writeln('Invalid choice');
  end;
  
  // Test 2: Cases with ranges
  write('Enter another number (1-10): ');
  readln(choice);
  
  case choice of
    1..5: writeln('Number is between 1 and 5');
    6..10: writeln('Number is between 6 and 10');
  else
    writeln('Number is out of range');
  end;
  
  // Test 3: Character cases with multiple values
  write('Enter a letter: ');
  readln(ch);
  
  case ch of
    'a', 'e', 'i', 'o', 'u':
      writeln('Vowel');
    'b', 'c', 'd', 'f', 'g':
      writeln('Consonant group 1');
    'h', 'j', 'k', 'l', 'm':
      writeln('Consonant group 2');
  else
    writeln('Other character');
  end;
  
  // Test 4: Mixed cases
  write('Enter final number (1-7): ');
  readln(choice);
  
  case choice of
    1, 3, 5, 7: 
      writeln('Odd number');
    2, 4, 6: 
      writeln('Even number');
  else
    writeln('Not in range');
  end;
end.