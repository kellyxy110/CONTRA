import {coverage, coverageDepth} from './coverage.mjs';
import {readProtectedCaseRecords} from './contract-operations.mjs';

export function mountConstellations(panel, {cases, selectedCase, request, view}) {
 const node=(tag,text='')=>Object.assign(document.createElement(tag),{textContent:text});
 const selector=(title,empty)=>{
  const label=node('label',title), select=node('select');
  select.append(new Option(empty,''),...cases.map(record=>new Option(record.case_id,record.case_id)));
  label.append(select);
  panel.append(label);
  return select;
 };
 const primary=selector('Primary case','Select a case');
 const comparison=selector('Comparison case','No comparison');
 if(cases.some(record=>record.case_id===selectedCase))primary.value=selectedCase;
 const result=node('div');
 result.setAttribute('aria-live','polite');
 panel.append(result);
 const ns='http://www.w3.org/2000/svg';
 const point=(index,radius)=>{
  const angle=index*Math.PI/4-Math.PI/2;
  return [150+radius*Math.cos(angle),150+radius*Math.sin(angle)];
 };
 async function measure(id){
  const record=cases.find(item=>item.case_id===id);
  const [[availability],...rounds]=await Promise.all([
   readProtectedCaseRecords(request,id),
   ...[0,1].map(round_id=>view('get_round',{case_id:id,round_id}).catch(()=>null)),
  ]);
  return coverage({...record,rounds:rounds.map(round=>round?.slots??null)},'Overall',availability);
 }
 let generation=0;
 async function render(){
  const current=++generation;
  if(!primary.value){result.textContent='Select a case to compare evidence coverage.';return;}
  result.textContent='Loading evidence coverage…';
  try{
   const ids=[...new Set([primary.value,comparison.value].filter(Boolean))];
   const series=await Promise.all(ids.map(measure));
   if(current!==generation)return;
   const svg=document.createElementNS(ns,'svg');
   svg.setAttribute('viewBox','0 0 300 300');
   svg.setAttribute('width','100%');
   svg.style.maxWidth='360px';
   svg.setAttribute('role','img');
   svg.setAttribute('aria-label','Eight-axis evidence coverage comparison. Exact values and sources follow.');
   const shape=(tag,attributes)=>{
    const child=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attributes))child.setAttribute(key,value);
    svg.append(child);
   };
   for(const radius of [24,48,72,96])shape('circle',{cx:150,cy:150,r:radius,fill:'none',stroke:'var(--state-neutral)'});
   series[0].forEach((metric,index)=>{
    const [x,y]=point(index,96),[lx,ly]=point(index,124);
    shape('line',{x1:150,y1:150,x2:x,y2:y,stroke:'var(--state-neutral)'});
    shape('text',{x:lx,y:ly,'text-anchor':'middle','dominant-baseline':'middle','font-size':10,fill:'currentColor'});
    svg.lastElementChild.textContent=metric.label;
   });
   const equivalent=node('div');
   series.forEach((metrics,index)=>{
    const colour=index?'var(--state-committed)':'var(--surface-review)';
    const points=metrics.map((metric,axis)=>{
     return metric.status==='measured'&&metric.denominator>0?point(axis,coverageDepth(metric)*96):null;
    });
    if(points.every(Boolean))shape('polygon',{points:points.map(pair=>pair.join(',')).join(' '),fill:'none',stroke:colour,'stroke-width':2});
    else points.forEach((value,axis)=>{
     if(value)shape('circle',{cx:value[0],cy:value[1],r:3,fill:colour});
    });
    const heading=node('h3',`${index?'Comparison':'Primary'} · ${ids[index]}`);
    heading.style.overflowWrap='anywhere';
    heading.style.borderInlineStart=`4px solid ${colour}`;
    const list=node('ul');
    metrics.forEach(metric=>list.append(node('li',`${metric.label}: ${metric.status==='measured'?`${metric.numerator}/${metric.denominator}`:metric.status}. ${metric.source}${metric.reason?' '+metric.reason:''}`)));
    equivalent.append(heading,list);
   });
   result.replaceChildren(svg,node('p','Missing axes appear as gaps. A complete series is outlined.'),equivalent);
  }catch{
   if(current===generation)result.textContent='Coverage is unavailable for the selected cases.';
  }
 }
 primary.addEventListener('change',render);
 comparison.addEventListener('change',render);
 void render();
}
