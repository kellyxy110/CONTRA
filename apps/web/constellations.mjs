import {coverage, coverageDepth, coverageValue} from './coverage.mjs';
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
 const controls=node('div');controls.className='constellation-controls';panel.append(controls);
 const originalAppend=panel.append.bind(panel);panel.append=(...items)=>controls.append(...items);
 const primary=selector('Primary case','Select a case');
 const comparison=selector('Comparison case','No comparison');
 panel.append=originalAppend;
 if(cases.some(record=>record.case_id===selectedCase))primary.value=selectedCase;
 const result=node('div');
 result.setAttribute('aria-live','polite');
 panel.append(result);
 const ns='http://www.w3.org/2000/svg';
 const point=(index,radius)=>{
  const angle=index*Math.PI/4-Math.PI/2;
  return [260+radius*Math.cos(angle),215+radius*Math.sin(angle)];
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
   svg.setAttribute('viewBox','0 0 520 430');
   svg.setAttribute('role','img');
   svg.setAttribute('aria-label','Eight-axis evidence coverage comparison. Exact metric values and sources follow in the table.');
   const shape=(tag,attributes,parent=svg)=>{
    const child=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attributes))child.setAttribute(key,value);
    parent.append(child);
    return child;
   };
   for(const ratio of [.25,.5,.75,1]){
    const ring=Array.from({length:8},(_,index)=>point(index,150*ratio).join(',')).join(' ');
    shape('polygon',{points:ring,fill:'none',stroke:'var(--state-neutral)','stroke-opacity':ratio===1?.7:.35,'stroke-width':ratio===1?1.5:1});
    const label=shape('text',{x:265,y:215-150*ratio+12,'font-size':11,fill:'currentColor','fill-opacity':.7});label.textContent=`${ratio*100}%`;
   }
   series[0].forEach((metric,index)=>{
    const [x,y]=point(index,150),[lx,ly]=point(index,184);
    shape('line',{x1:260,y1:215,x2:x,y2:y,stroke:'var(--state-neutral)','stroke-opacity':.45});
    const label=shape('text',{x:lx,y:ly,'text-anchor':'middle','dominant-baseline':'middle','font-size':13,'font-weight':650,fill:'currentColor'});label.textContent=metric.label;
   });
   const colours=['var(--mint)','var(--coral)'];
   series.forEach((metrics,index)=>{
    const colour=colours[index];
    const points=metrics.map((metric,axis)=>{
     return metric.status==='measured'&&metric.denominator>0?point(axis,coverageDepth(metric)*150):null;
    });
    if(points.every(Boolean))shape('polygon',{points:points.map(pair=>pair.join(',')).join(' '),fill:colour,'fill-opacity':index?.08:.13,stroke:colour,'stroke-width':3,'stroke-linejoin':'round'});
    else{
     let segment=[];
     const flush=()=>{if(segment.length>1)shape('polyline',{points:segment.map(pair=>pair.join(',')).join(' '),fill:'none',stroke:colour,'stroke-width':3,'stroke-linejoin':'round'});segment=[];};
     for(const value of points){if(value)segment.push(value);else flush();}flush();
    }
    points.forEach(value=>{if(value)shape('circle',{cx:value[0],cy:value[1],r:5,fill:colour,stroke:'var(--panel)','stroke-width':2});});
   });
   const legend=node('ul');legend.className='constellation-legend';
   ids.forEach((id,index)=>{const item=node('li'),key=node('i'),identity=node('span',id.length>18?`${id.slice(0,12)}…${id.slice(-6)}`:id);key.className='constellation-key';key.style.background=colours[index];identity.title=id;item.append(key,node('strong',index?'Comparison':'Primary'),identity);legend.append(item);});
   const table=node('table');table.className='constellation-table';
   const head=node('thead'),headRow=node('tr');['Metric',...ids.map((_,index)=>index?'Comparison':'Primary'),'Calculation source'].forEach(label=>{const cell=node('th',label);cell.scope='col';headRow.append(cell);});head.append(headRow);table.append(head);
   const body=node('tbody');
   series[0].forEach((metric,metricIndex)=>{const row=node('tr'),name=node('td',metric.label);row.append(name);series.forEach(metrics=>{const current=metrics[metricIndex],value=node('td',coverageValue(current));value.title=current.status==='measured'?`${current.numerator}/${current.denominator}`:current.reason||current.status;row.append(value);});const source=node('td',metric.source);source.append(node('small',metric.reason?` ${metric.reason}`:''));row.append(source);body.append(row);});
   table.append(body);
   const plot=node('div');plot.className='constellation-plot';plot.append(svg,node('p','Missing, locked and unavailable axes are shown as gaps, never as zero.'));plot.lastElementChild.className='constellation-note';
   const details=node('div');details.append(legend,table);
   const figure=node('div');figure.className='constellation-figure';figure.append(plot,details);
   result.replaceChildren(figure);
  }catch{
   if(current===generation)result.textContent='Coverage is unavailable for the selected cases.';
  }
 }
 primary.addEventListener('change',render);
 comparison.addEventListener('change',render);
 void render();
}
