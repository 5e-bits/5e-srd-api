import shell from 'shelljs';

shell.mkdir('-p', 'dist');

// Copy all the view templates
shell.cp('-R', 'src/css', 'dist/src');
shell.cp('-R', 'src/public', 'dist/src');
shell.cp('-R', 'src/views', 'dist/src');
shell.cp('-R', 'src/swagger/dist', 'dist/src/swagger');
