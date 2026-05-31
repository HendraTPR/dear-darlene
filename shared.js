/* Shared footer + reveal + lightbox — dipakai semua halaman */
(function(){
  var f=document.getElementById("footer");
  if(f){
    f.innerHTML='<div class="wrap"><div class="footer-grid">'+
      '<div><div class="dd">DD</div><div class="wm">DARLENE</div><p>Indo\'s First Timeless Elegance Flower Board. Papan bunga modern, elegan & timeless untuk setiap momen berarti.</p></div>'+
      '<div><h5>Navigasi</h5><ul><li><a href="index.html">Home</a></li><li><a href="koleksi.html">Koleksi</a></li><li><a href="about.html">About</a></li><li><a href="news.html">News</a></li><li><a href="order.html">Pesan Sekarang</a></li></ul></div>'+
      '<div><h5>Kontak</h5><ul><li><a href="https://wa.me/628111344911" target="_blank">WhatsApp +62 811 1344 911</a></li><li><a href="mailto:deardarlene.co@gmail.com">deardarlene.co@gmail.com</a></li><li><a href="https://instagram.com/deardarlene.co" target="_blank">Instagram @deardarlene.co</a></li><li><a href="https://tiktok.com/@deardarlene.co" target="_blank">TikTok @deardarlene.co</a></li></ul></div>'+
      '</div><div class="foot-bottom"><span>© 2026 Dear Darlene · deardarlene.co · Free delivery Jakarta & Tangerang</span>'+
      '<div class="foot-social"><a href="https://instagram.com/deardarlene.co" target="_blank">Instagram</a><a href="https://tiktok.com/@deardarlene.co" target="_blank">TikTok</a><a href="https://wa.me/628111344911" target="_blank">WhatsApp</a></div></div></div>';
  }
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
