export function planFastForwardBlocks(remainingNs,observedNsPerBlock){
 const remaining=BigInt(remainingNs),perBlock=BigInt(observedNsPerBlock);
 if(remaining<=0n||perBlock<=0n)return 1;
 const belowTarget=(remaining-1n)/perBlock;
 return Number(belowTarget<1n?1n:belowTarget>1000n?1000n:belowTarget);
}
