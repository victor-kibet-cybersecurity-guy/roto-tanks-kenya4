
document.addEventListener("DOMContentLoaded",()=>{
 const grid=document.querySelector("#productGrid"); if(!grid)return;
 const search=document.querySelector("#productSearch"), cat=document.querySelector("#categoryFilter"), cap=document.querySelector("#capacityFilter"), price=document.querySelector("#priceFilter"), app=document.querySelector("#applicationFilter"), sort=document.querySelector("#sortProducts");
 const apply=()=>{
   let list=[...PRODUCTS];
   const q=(search?.value||"").trim().toLowerCase();
   if(q) list=list.filter(p=>(p.name+" "+p.category+" "+p.capacity+" "+p.shortDescription+" "+p.keywords.join(" ")).toLowerCase().includes(q));
   if(cat?.value) list=list.filter(p=>p.category===cat.value);
   if(cap?.value){const [a,b]=cap.value.split("-").map(Number);list=list.filter(p=>p.capacity>=a&&p.capacity<=(b||999999));}
   if(price?.value){const [a,b]=price.value.split("-").map(Number);list=list.filter(p=>p.price>=a&&p.price<=(b||999999999));}
   if(app?.value) list=list.filter(p=>p.applications.join(" ").toLowerCase().includes(app.value.toLowerCase()));
   const s=sort?.value;
   if(s==="price-asc")list.sort((a,b)=>a.price-b.price); if(s==="price-desc")list.sort((a,b)=>b.price-a.price);
   if(s==="cap-asc")list.sort((a,b)=>a.capacity-b.capacity); if(s==="cap-desc")list.sort((a,b)=>b.capacity-a.capacity);
   renderProducts(list);
 };
 [search,cat,cap,price,app,sort].forEach(x=>x&&x.addEventListener(x===search?"input":"change",apply));
});
