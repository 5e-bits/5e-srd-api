import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/views', 'dist/src');
shell.cp('-R', 'src/css', 'dist/src');
