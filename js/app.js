
const PHONE = "254755032745";
const PHONE_DISPLAY = "0755 032 745";
const waUrl = msg => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if(menuBtn && nav){
    const closeMenu=()=>{nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";};
    menuBtn.addEventListener("click",()=>{
      const open=!nav.classList.contains("open");nav.classList.toggle("open",open);menuBtn.setAttribute("aria-expanded",String(open));document.body.style.overflow=open?"hidden":"";
    });
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
    document.addEventListener("click",e=>{if(nav.classList.contains("open")&&!nav.contains(e.target)&&!menuBtn.contains(e.target))closeMenu();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
  }

  const navGroups=[...document.querySelectorAll(".nav-group")];
  navGroups.forEach(group=>group.addEventListener("toggle",()=>{
    if(group.open) navGroups.forEach(other=>{if(other!==group) other.open=false;});
  }));
  document.addEventListener("click",e=>{
    navGroups.forEach(group=>{if(group.open&&!group.contains(e.target)) group.open=false;});
  });

  document.querySelectorAll("[data-wa]").forEach(el=>{
    el.addEventListener("click", e => {
      const msg=el.dataset.wa || "Hello, I would like information about Roto Tanks in Kenya.";
      el.href=waUrl(msg);
    });
  });

  document.querySelectorAll(".faq-q").forEach(btn=>btn.addEventListener("click",()=>{
    const item=btn.closest(".faq-item"); const open=item.classList.toggle("open"); btn.setAttribute("aria-expanded",String(open));
  }));

  const contactForm=document.querySelector("#contactForm");
  if(contactForm) contactForm.addEventListener("submit",e=>{
    e.preventDefault();
    const f=new FormData(contactForm);
    const msg=`Hello, my name is ${f.get("name")}. Phone: ${f.get("phone")}. Product: ${f.get("product")||"Not specified"}. Capacity: ${f.get("capacity")||"Not specified"}. Quantity: ${f.get("quantity")||"1"}. County: ${f.get("county")}. Town: ${f.get("town")}. Exact delivery location: ${f.get("deliveryLocation")||"Not specified"}. Landmark: ${f.get("landmark")||"Not specified"}. Property type: ${f.get("propertyType")||"Not specified"}. Preferred delivery date: ${f.get("deliveryDate")||"Not specified"}. Installation guidance: ${f.get("installationGuidance")||"No"}. Message: ${f.get("message")}`;
    window.open(waUrl(msg),"_blank","noopener");
  });

  const deliveryForm=document.querySelector("#deliveryForm");
  if(deliveryForm) deliveryForm.addEventListener("submit",e=>{
    e.preventDefault();
    const f=new FormData(deliveryForm);
    const msg=`Hello, I need delivery information for a ${f.get("capacity")||"Roto Tank"} to ${f.get("town")}, ${f.get("county")}.`;
    window.open(waUrl(msg),"_blank","noopener");
  });

  const calc=document.querySelector("#tankCalculator");
  if(calc) calc.addEventListener("submit",e=>{
    e.preventDefault();
    const f=new FormData(calc), use=f.get("use"), people=Number(f.get("people")||0), days=Number(f.get("days")||3), daily=Number(f.get("daily")||100), county=(f.get("county")||"").trim(), town=(f.get("town")||"").trim();
    let estimate = Math.max(1000, people*daily*days);
    if(use==="Apartment") estimate=Math.max(estimate,10000);
    if(use==="Farm"||use==="School"||use==="Business") estimate=Math.max(estimate,8000);
    if(use==="Construction") estimate=Math.max(estimate,5000);
    if(use==="Rainwater harvesting"||use==="Borehole storage") estimate=Math.max(estimate,5000);
    const tanks=(window.PRODUCTS||[]).filter(p=>p.category==="Roto Tanks").sort((a,b)=>a.capacity-b.capacity);
    const primary=tanks.find(p=>p.capacity>=estimate)||tanks[tanks.length-1];
    const idx=tanks.findIndex(p=>p.id===primary.id);
    const alternative=tanks[Math.min(idx+1,tanks.length-1)]||primary;
    const householdDaily=Math.max(1,people*daily);
    const duration=(primary.capacity/householdDaily).toFixed(1);
    const loc=[town,county].filter(Boolean).join(", ")||"my location";
    const out=document.querySelector("#calcResult");
    const msg=`Hello, I used the tank calculator. Use: ${use}. Users: ${people}. Estimated daily consumption: ${householdDaily}L. Reserve days: ${days}. Recommended tank: ${primary.capacity}L at indicative ${money(primary.price)}. Alternative: ${alternative.capacity}L. Delivery location: ${loc}. Please confirm current price, availability and delivery.`;
    out.innerHTML=`<div class="quote-box"><strong>Estimated storage target:</strong> ${estimate.toLocaleString()}L<br><strong>Recommended:</strong> ${primary.capacity.toLocaleString()}L, ${money(primary.price)} indicative price<br><strong>Alternative:</strong> ${alternative.capacity.toLocaleString()}L, ${money(alternative.price)}<br><strong>Estimated duration at entered daily use:</strong> about ${duration} days<br><strong>Delivery location:</strong> ${loc}<div class="actions"><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="${waUrl(msg)}">Get Current Quote on WhatsApp</a><a class="btn btn-outline" href="${primary.productPage||'water-tanks.html'}">View Recommended Tank</a></div><small>This recommendation is an estimate. Confirm actual consumption, dimensions and installation requirements before ordering.</small></div>`;
  });

  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
});
