import path from 'node:path';
import {Store} from '../services/api/store.mjs';

const directory=path.resolve(process.argv[2]||process.env.CONTRA_DATA_DIR||'.data'),store=new Store(directory);
try{console.log(JSON.stringify(store.prepareBackup(),null,2));}
finally{store.close();}
