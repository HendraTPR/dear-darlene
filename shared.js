/* Shared footer + reveal + lightbox — dipakai semua halaman */
(function(){
  var f=document.getElementById("footer");
  if(f){
    f.innerHTML='<div class="wrap"><div class="footer-grid">'+
      '<div><img class="foot-wordmark" src="images/brand/logo-wordmark-white.png" alt="Dear Darlene"><p>Indo\'s First Timeless Elegance Flower Board.</p></div>'+
      '<div><h5>Navigasi</h5><ul><li><a href="index.html">Home</a></li><li><a href="koleksi.html">Our Products</a></li><li><a href="about.html">About Us</a></li><li><a href="faq.html">F.A.Q</a></li><li><a href="news.html">News</a></li><li><a href="order.html">Order Now</a></li></ul></div>'+
      '<div><h5>Contact Us</h5><ul><li><a href="https://wa.me/628111344911" target="_blank">WhatsApp +62 811 1344 911</a></li><li><a href="mailto:deardarlene.co@gmail.com">deardarlene.co@gmail.com</a></li><li><a href="https://instagram.com/deardarlene.co" target="_blank">Instagram @deardarlene.co</a></li><li><a href="https://tiktok.com/@deardarlene.co" target="_blank">TikTok @deardarlene.co</a></li></ul></div>'+
      '</div><div class="foot-bottom"><span>© 2026 Dear Darlene · deardarlene.co · Free delivery Jakarta & Tangerang</span>'+
      '<div class="foot-social"><a href="https://instagram.com/deardarlene.co" target="_blank" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg></a><a href="https://tiktok.com/@deardarlene.co" target="_blank" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8a4.3 4.3 0 01-1.05-2.8h-3.2v12.9a2.6 2.6 0 11-2.6-2.6c.27 0 .53.04.78.12V8.2a5.8 5.8 0 106.04 5.78V8.6a7.5 7.5 0 004.36 1.4V6.8a4.3 4.3 0 01-3.33-1z"/></svg></a><a href="https://wa.me/628111344911" target="_blank" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A8 8 0 1112 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.3.2-.4 0-.2 0-.3-.1-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.4c.1.2 1.6 2.5 4 3.4.5.2 1 .3 1.3.4.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z"/></svg></a></div></div></div>';
  }

  // Mobile menu (burger) — jalan paling awal biar gak ke-blok kode lain
  (function(){
    var b=document.querySelector(".burger"), nav=document.querySelector("nav.nav");
    if(!b||!nav)return;
    b.onclick=null; b.setAttribute("aria-label","Menu");
    b.addEventListener("click",function(e){e.stopPropagation();nav.classList.toggle("nav-open");});
    var ls=nav.querySelectorAll(".nav-links a");
    for(var i=0;i<ls.length;i++){ls[i].addEventListener("click",function(){nav.classList.remove("nav-open");});}
    document.addEventListener("click",function(e){if(nav.classList.contains("nav-open")&&!nav.contains(e.target))nav.classList.remove("nav-open");});
  })();

  // reveal + slide
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll(".reveal,.slide-l,.slide-r").forEach(function(el){io.observe(el);});

  // lightbox
  var lb=document.createElement("div");
  lb.className="lb";
  lb.innerHTML='<span class="lb-close">&times;</span><img alt="zoom"><div class="lb-hint">Klik di mana saja untuk menutup</div>';
  document.body.appendChild(lb);
  var lbImg=lb.querySelector("img");
  function openLB(src){lbImg.src=src;lb.classList.add("show");document.body.style.overflow="hidden";}
  function closeLB(){lb.classList.remove("show");document.body.style.overflow="";}
  lb.addEventListener("click",closeLB);
  lbImg.addEventListener("click",function(e){e.stopPropagation();closeLB();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeLB();});
  // expose for inline handlers
  window.ddZoom=function(src){openLB(src);};
  // any .zoomable opens its own src
  document.addEventListener("click",function(e){
    var z=e.target.closest(".zoomable");
    if(z&&z.tagName==="IMG"){openLB(z.getAttribute("data-full")||z.src);}
  });
})();

/* Thumbnail -> swap main image (dipakai di halaman Koleksi) */
function ddSwap(thumb, mainId){
  var main=document.getElementById(mainId);
  if(!main)return;
  var tmp=main.src; main.src=thumb.src; thumb.src=tmp;
}
