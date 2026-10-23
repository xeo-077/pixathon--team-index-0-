export const W=12,H=8;
export const walls=[[2,1],[3,1],[2,2],[3,2],[6,1],[7,1],[6,2],[7,2],[3,5],[4,5],[3,6],[4,6],[7,5],[8,5],[7,6],[8,6]];
export const patrol=[[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[8,3],[7,3],[6,3],[5,3],[4,3]];
export const blocked=(x,y)=>x<0||y<0||x>=W||y>=H||walls.some(p=>p[0]===x&&p[1]===y);
export function sight(t){const a=patrol[t%patrol.length],b=patrol[(t+1)%patrol.length],dx=Math.sign(b[0]-a[0]);let out=[a];for(let d=1;d<=2;d++){const x=a[0]+dx*d,y=a[1];if(blocked(x,y))break;out.push([x,y]);}return out;}
export const visible=(x,y,t)=>sight(t).some(p=>p[0]===x&&p[1]===y);
export const newPatrol=()=>({x:1,y:6,t:0,status:'playing',moves:0});
export function movePatrol(s,dx,dy){if(s.status!=='playing')return s;if(![[0,0],[0,1],[0,-1],[1,0],[-1,0]].some(d=>d[0]===dx&&d[1]===dy))return s;const x=s.x+dx,y=s.y+dy;if(blocked(x,y))return s;const t=(s.t+1)%patrol.length;const caught=visible(x,y,s.t)||visible(x,y,t);return{x,y,t,moves:s.moves+1,status:caught?'lost':x===10&&y===1?'won':'playing'};}
export const taskOrder=['rename','attach','send'];
export function officeTask(step,action){return action===taskOrder[step]?{step:step+1,correct:true}:{step,correct:false};}
export const conversations=[{name:'PRIYA',role:'The quick-question specialist',line:'Tiny favour. Can you cover my 5:30 meeting? Mine overlaps with… leaving.',clue:'Her meeting only needs someone who has the sales dashboard.',choices:["Sure. I have absolutely no boundaries.","Dev has the sales dashboard. Shall I send him the invite?","I am actually a hologram."],correct:1,success:'“Oh, perfect. I’ll ask Dev.” One calendar ambush avoided.',failure:'“Great, let me explain the entire project…” Try using the clue.'},{name:'DEV',role:'Director of unnecessary catch-ups',line:'Before you go, can you walk me through the report? Just a quick 45 minutes.',clue:'The report is already attached. Dev only needs the summary.',choices:["Let’s circle back on circling back.","Look! An unpaid intern!","The three-line summary is in the email. Reply there if you need anything."],correct:2,success:'“Three lines? My favourite length.” The corridor is clear.',failure:'“Interesting. Let’s discuss that in a meeting.” Try a concrete alternative.'}];
export function answerConversation(index,choice){return conversations[index]?.correct===choice;}
export const safeLanes=[1,0,2,1,2,0,0,2,1,0,2,1,0,1,2];
export function wave(i){const safe=safeLanes[i%safeLanes.length];return{safe,low:(safe+1)%3,high:(safe+2)%3};}
export const newChase=()=>({lane:1,wave:0,strikes:0,status:'playing',jump:false});
export function resolveWave(s){if(s.status!=='playing')return s;const w=wave(s.wave),hit=s.lane!==w.safe&&!(s.lane===w.low&&s.jump);const strikes=s.strikes+(hit?1:0),n=s.wave+1;return{...s,wave:n,strikes,jump:false,status:strikes>=3?'lost':n>=safeLanes.length?'won':'playing',hit};}
