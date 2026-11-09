import path from 'node:path';
import {createBackup,verifyBackup} from '../services/operations/backup.mjs';

const [command,first,second]=process.argv.slice(2);
let result;
if(command==='create'&&first&&second)result=createBackup(path.resolve(first),path.resolve(second));
else if(command==='verify'&&first&&!second)result=verifyBackup(path.resolve(first));
else throw Error('Usage: node scripts/backup-storage.mjs create <data-directory> <backup-directory> | verify <backup-directory>');
console.log(JSON.stringify(result,null,2));
