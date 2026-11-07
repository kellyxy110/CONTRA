import {ApiError} from './store.mjs';

export class RateLimiter{
 constructor({now=()=>Date.now(),maximumKeys=10000}={}){this.now=now;this.maximumKeys=maximumKeys;this.windows=new Map();}
 consume(key,{limit,windowMs}){
  const now=this.now(),start=now-windowMs,prior=(this.windows.get(key)||[]).filter(value=>value>start);
  if(prior.length>=limit){const retryAfterMs=Math.max(1,prior[0]+windowMs-now);throw new ApiError(429,'Rate limit exceeded', {retryAfterMs});}
  prior.push(now);this.windows.set(key,prior);
  if(this.windows.size>this.maximumKeys){for(const [candidate,values]of this.windows){if(values.at(-1)<=start)this.windows.delete(candidate);if(this.windows.size<=this.maximumKeys)break;}if(this.windows.size>this.maximumKeys)this.windows.delete(this.windows.keys().next().value);}
  return {remaining:limit-prior.length,resetAt:prior[0]+windowMs};
 }
}
