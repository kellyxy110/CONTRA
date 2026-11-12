import {createHash} from 'node:crypto';

export const sha256=value=>createHash('sha256').update(value).digest('hex');
export class ApiError extends Error{constructor(status,message,details={}){super(message);this.status=status;Object.assign(this,details);}}
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';return JSON.stringify(value);}
