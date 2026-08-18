
document.addEventListener("DOMContentLoaded",()=>{
 const input=document.querySelector("#productSearch"), box=document.querySelector("#suggestions"); if(!input||!box)return;
 let idx=-1, matches=[];
 const draw=()=>{
   const q=input.value.trim().toLowerCase(); if(!q){box.classList.remove("show");box.innerHTML="";return;}
   matches=PRODUCTS.filter(p=>(p.name+" "+p.category+" "+p.capacity).toLowerCase().includes(q)).slice(0,8); idx=-1;
   const esc=q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
   box.innerHTML=matches.map((p,i)=>`<div class="suggestion" role="option" data-i="${i}">${p.name.replace(new RegExp(`(${esc})`,"ig"),'<span class="mark">$1</span>')}</div>`).join("");
   box.classList.toggle("show",matches.length>0);
 };
 input.addEventListener("input",draw);
 input.addEventListener("keydown",e=>{
   const items=[...box.querySelectorAll(".suggestion")];
   if(e.key==="ArrowDown"){e.preventDefault();idx=Math.min(idx+1,items.length-1);}
   if(e.key==="ArrowUp"){e.preventDefault();idx=Math.max(idx-1,0);}
   if(e.key==="Enter"&&idx>=0){e.preventDefault();input.value=matches[idx].name;box.classList.remove("show");input.dispatchEvent(new Event("input"));}
   items.forEach((x,i)=>x.classList.toggle("active",i===idx));
 });
 box.addEventListener("click",e=>{const s=e.target.closest(".suggestion");if(!s)return;input.value=matches[Number(s.dataset.i)].name;box.classList.remove("show");input.dispatchEvent(new Event("input"));});
 document.addEventListener("click",e=>{if(!box.contains(e.target)&&e.target!==input)box.classList.remove("show");});
});
