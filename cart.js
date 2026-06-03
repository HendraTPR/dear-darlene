/* ===== DEAR DARLENE — Cart System (tambahan, tidak mengubah desain asli) =====
   Multi-produk keranjang + popup drawer. Pakai variabel & gaya dari styles.css.
   Data keranjang disimpan di memory (sessionStorage) supaya jalan lintas halaman. */
(function(){
  // ---------- DATA PRODUK (sesuai CATALOG 2026) ----------
  var CATALOG = {
    classic: { label:'Classic', base:190000, addon:20000,
      variants:[
        {v:'Lite',  design:'Rosie',  price:190000, colors:['Red','Brown','Yellow','Blue'], custom:false},
        {v:'Bloom', design:'Jasmine',price:290000, custom:true},
        {v:'Bloom', design:'Orchid', price:290000, custom:true},
        {v:'Bloom', design:'Lily',   price:290000, custom:true}
      ]},
    grande: { label:'Grande', base:490000, addon:30000,
      variants:[
        {v:'Lite',  design:'Rosie',  price:490000, colors:['Red','Brown','Yellow','Blue'], custom:false},
        {v:'Bloom', design:'Jasmine',price:590000, custom:true},
        {v:'Bloom', design:'Orchid', price:590000, custom:true},
        {v:'Bloom', design:'Lily',   price:590000, custom:true}
      ]},
    royale: { label:'Royale', base:680000, addon:40000,
      variants:[
        {v:'Lite',  design:'Rosie',  price:680000, colors:['Red','Brown','Yellow','Blue'], custom:false}
      ]},
    outdoor:{ label:'Outdoor', base:500000, addon:0,
      variants:[
        {v:'Basic',  design:'2 titik', price:500000, sizes:[['Regular 2×1.2m',500000],['Medium 2×1.5m',600000]]},
        {v:'Deluxe', design:'4 titik', price:650000, sizes:[['Regular 2×1.2m',650000],['Medium 2×1.5m',750000]]}
      ]}
  };

  function rupiah(n){return 'Rp '+Number(n).toLocaleString('id-ID');}
  function loadCart(){try{return JSON.parse(sessionStorage.getItem('dd_cart')||'[]');}catch(e){return [];}}
  function saveCart(c){sessionStorage.setItem('dd_cart',JSON.stringify(c));updateBadge();}
  function cartCount(){return loadCart().reduce(function(s,i){return s+(i.qty||1);},0);}

  // ---------- INJECT CSS (scoped, pakai variabel styles.css) ----------
  var css = `
  .cart-icon{position:relative;background:none;border:none;cursor:pointer;color:var(--maroon);display:inline-flex;align-items:center;padding:4px;margin-left:4px}
  .cart-icon svg{width:23px;height:23px}
  .cart-badge{position:absolute;top:-5px;right:-7px;background:var(--wine);color:#fff;font-size:10px;font-weight:600;min-width:17px;height:17px;border-radius:50%;display:none;align-items:center;justify-content:center;padding:0 4px;line-height:1}
  .cart-overlay{position:fixed;inset:0;background:rgba(53,40,37,.5);z-index:1000;opacity:0;visibility:hidden;transition:.3s}
  .cart-overlay.on{opacity:1;visibility:visible}
  .cart-drawer{position:fixed;top:0;right:0;width:92%;max-width:400px;height:100%;background:var(--cream);z-index:1001;transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,0,0,.15)}
  .cart-drawer.on{transform:translateX(0)}
  .cart-head{background:var(--maroon);color:#fff;padding:20px 22px;display:flex;justify-content:space-between;align-items:center}
  .cart-head h3{font-family:var(--pf);font-size:21px;color:#fff;font-weight:600;margin:0}
  .cart-close{background:none;border:none;color:#fff;font-size:26px;cursor:pointer;line-height:1;padding:0}
  .cart-body{flex:1;overflow-y:auto;padding:18px}
  .cart-item{background:#fff;border:1px solid var(--line);border-radius:12px;padding:13px;margin-bottom:12px;display:flex;gap:12px}
  .cart-item img{width:62px;height:78px;object-fit:cover;border-radius:8px;flex-shrink:0;background:var(--paper2)}
  .ci-body{flex:1;min-width:0}
  .ci-name{font-family:var(--pf);font-size:15px;color:var(--ink);font-weight:600;line-height:1.25;margin-bottom:2px}
  .ci-meta{font-size:11px;color:var(--taupe);line-height:1.5;margin-bottom:6px}
  .ci-bot{display:flex;justify-content:space-between;align-items:center}
  .ci-price{font-size:13px;font-weight:600;color:var(--maroon)}
  .ci-qty{display:flex;align-items:center;gap:8px}
  .ci-qty button{width:24px;height:24px;border:1px solid var(--line);background:#fff;border-radius:6px;cursor:pointer;color:var(--maroon);font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center}
  .ci-qty span{font-size:13px;min-width:18px;text-align:center}
  .ci-del{background:none;border:none;color:#a32d2d;cursor:pointer;font-size:16px;align-self:flex-start;padding:2px}
  .cart-empty{text-align:center;color:var(--taupe);padding:60px 24px}
  .cart-empty .ic{font-size:46px;color:var(--taupe-soft);margin-bottom:14px}
  .cart-empty p{font-size:14px}
  .cart-empty small{font-size:12px;color:var(--taupe-soft)}
  .cart-foot{border-top:1px solid var(--line);padding:18px;background:#fff}
  .cf-row{display:flex;justify-content:space-between;font-size:13px;color:var(--taupe);margin-bottom:6px}
  .cf-row.free b{color:#1faa59}
  .cf-total{display:flex;justify-content:space-between;font-family:var(--pf);font-size:19px;font-weight:700;color:var(--maroon);margin:8px 0 14px;padding-top:10px;border-top:1px solid var(--line)}
  .cart-co-btn{width:100%;background:var(--maroon);color:#fff;border:none;border-radius:50px;padding:15px;font-family:var(--body);font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.3s}
  .cart-co-btn:hover{background:var(--wine)}
  .cart-co-btn:disabled{background:var(--taupe-soft);cursor:not-allowed}
  /* tombol add-to-cart di kartu produk */
  .buy-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:4px}
  .variant-picker{margin:14px 0 18px}
  .vp-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--wine);font-weight:600;margin-bottom:8px;display:block}
  .vp-opts{display:flex;gap:8px;flex-wrap:wrap}
  .vp-opt{border:1.5px solid var(--line);background:var(--cream);border-radius:50px;padding:7px 16px;font-size:12px;color:var(--maroon);cursor:pointer;transition:.2s;font-weight:500;letter-spacing:.3px}
  .vp-opt:hover{border-color:var(--wine)}
  .vp-opt.sel{border-color:var(--maroon);background:var(--maroon);color:#fff}
  .bg-paper .vp-opt{background:#fff}
  .vp-sub{margin-top:10px}
  .toast-cart{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--ink);color:#fff;font-size:13px;padding:13px 24px;border-radius:50px;z-index:1100;opacity:0;transition:.3s;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.25)}
  .toast-cart.on{opacity:1;transform:translateX(-50%) translateY(0)}
  .board-size{font-size:12.5px;color:var(--taupe);margin:-6px 0 14px;letter-spacing:.3px}
  .board-size b{color:var(--maroon);font-weight:600}
  `;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  // ---------- INJECT cart icon ke nav ----------
  function injectCartIcon(){
    var navLinks=document.querySelector('.nav-links');
    if(!navLinks||document.querySelector('.cart-icon'))return;
    var btn=document.createElement('button');
    btn.className='cart-icon';btn.setAttribute('aria-label','Keranjang');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.3 12.5a1.5 1.5 0 001.5 1.2h8.8a1.5 1.5 0 001.5-1.1L21 7H5.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="cart-badge" id="ddCartBadge">0</span>';
    btn.onclick=openCart;
    // taruh sebelum tombol "Pesan Sekarang"
    var orderBtn=navLinks.querySelector('a.btn-primary');
    if(orderBtn)navLinks.insertBefore(btn,orderBtn);
    else navLinks.appendChild(btn);
  }

  // ---------- INJECT drawer markup ----------
  function injectDrawer(){
    if(document.querySelector('.cart-drawer'))return;
    var ov=document.createElement('div');ov.className='cart-overlay';ov.id='ddCartOverlay';ov.onclick=closeCart;
    var dr=document.createElement('div');dr.className='cart-drawer';dr.id='ddCartDrawer';
    dr.innerHTML=''+
      '<div class="cart-head"><h3>Keranjang</h3><button class="cart-close" aria-label="Tutup">&times;</button></div>'+
      '<div class="cart-body" id="ddCartBody"></div>'+
      '<div class="cart-foot">'+
        '<div class="cf-row free"><span>Ongkir (Jkt &amp; Tgr)</span><b>FREE</b></div>'+
        '<div class="cf-total"><span>Total</span><span id="ddCartTotal">Rp 0</span></div>'+
        '<button class="cart-co-btn" id="ddCheckoutBtn">Lanjut ke Checkout</button>'+
      '</div>';
    document.body.appendChild(ov);document.body.appendChild(dr);
    dr.querySelector('.cart-close').onclick=closeCart;
    document.getElementById('ddCheckoutBtn').onclick=function(){
      if(cartCount()===0)return;
      window.location.href='order.html';
    };
    var t=document.createElement('div');t.className='toast-cart';t.id='ddToast';document.body.appendChild(t);
  }

  function toast(msg){var t=document.getElementById('ddToast');if(!t)return;t.textContent=msg;t.classList.add('on');setTimeout(function(){t.classList.remove('on');},1600);}

  function updateBadge(){var b=document.getElementById('ddCartBadge');if(!b)return;var n=cartCount();b.textContent=n;b.style.display=n>0?'flex':'none';}

  function openCart(){renderCart();document.getElementById('ddCartOverlay').classList.add('on');document.getElementById('ddCartDrawer').classList.add('on');}
  function closeCart(){document.getElementById('ddCartOverlay').classList.remove('on');document.getElementById('ddCartDrawer').classList.remove('on');}

  function renderCart(){
    var cart=loadCart(),body=document.getElementById('ddCartBody'),total=0;
    if(!cart.length){
      body.innerHTML='<div class="cart-empty"><div class="ic">🛒</div><p>Keranjang masih kosong</p><small>Yuk pilih papan bunga favoritmu</small></div>';
      document.getElementById('ddCartTotal').textContent='Rp 0';
      document.getElementById('ddCheckoutBtn').disabled=true;
      return;
    }
    var html='';
    cart.forEach(function(it,i){
      var unit=(it.price||0)+(it.addon?(it.addonPrice||0):0);
      total+=unit*(it.qty||1);
      var meta=[it.design,it.color,it.size].filter(Boolean).join(' · ');
      if(it.addon)meta+=(meta?' · ':'')+'+Logo3D&Lampu';
      html+='<div class="cart-item">'+
        '<img src="'+(it.img||'images/brand/icon.png')+'" alt="">'+
        '<div class="ci-body">'+
          '<div class="ci-name">'+it.label+' '+(it.v||'')+'</div>'+
          '<div class="ci-meta">'+meta+'</div>'+
          '<div class="ci-bot">'+
            '<div class="ci-price">'+rupiah(unit*(it.qty||1))+'</div>'+
            '<div class="ci-qty"><button onclick="ddCart.qty('+i+',-1)">−</button><span>'+(it.qty||1)+'</span><button onclick="ddCart.qty('+i+',1)">+</button></div>'+
          '</div>'+
        '</div>'+
        '<button class="ci-del" onclick="ddCart.del('+i+')" aria-label="Hapus">🗑</button>'+
      '</div>';
    });
    body.innerHTML=html;
    document.getElementById('ddCartTotal').textContent=rupiah(total);
    document.getElementById('ddCheckoutBtn').disabled=false;
  }

  // ---------- PUBLIC API ----------
  window.ddCart={
    add:function(item){
      var cart=loadCart();
      cart.push(item);saveCart(cart);
      toast('✓ Ditambahkan ke keranjang');openCart();
    },
    del:function(i){var c=loadCart();c.splice(i,1);saveCart(c);renderCart();},
    qty:function(i,d){var c=loadCart();if(!c[i])return;c[i].qty=Math.max(1,(c[i].qty||1)+d);saveCart(c);renderCart();},
    open:openCart,close:closeCart,
    get:loadCart,clear:function(){sessionStorage.removeItem('dd_cart');updateBadge();},
    CATALOG:CATALOG,rupiah:rupiah
  };


  // ---------- VARIANT PICKER (halaman koleksi) ----------
  // ---------- MAPPING FOTO per variasi (foto besar ganti otomatis) ----------
  var PHOTO_MAP = {
    classic: {
      'Lite|Red':'images/products/classic-rosie-red.jpg',
      'Lite|Brown':'images/products/classic-rosie-brown.jpg',
      'Lite|Yellow':'images/products/classic-rosie-yellow.jpg',
      'Lite|Blue':'images/products/classic-rosie-blue.jpg',
      'Bloom|Jasmine':'images/products/classic-bloom-jasmine-1.jpg',
      'Bloom|Lily':'images/products/classic-bloom-lily-1.jpg',
      'Bloom|Orchid':'images/products/classic-bloom-orchid-1.jpg'
    },
    grande: {
      'Lite|Red':'images/products/grande-rosie-red.jpg',
      'Lite|Brown':'images/products/grande-rosie-brown.jpg',
      'Lite|Yellow':'images/products/grande-rosie-yellow.jpg',
      'Lite|Blue':'images/products/grande-rosie-blue.jpg',
      'Bloom|Jasmine':'images/products/grande-bloom-jasmine.jpg',
      'Bloom|Lily':'images/products/grande-bloom-lily.jpg',
      'Bloom|Orchid':'images/products/grande-bloom-orchid.jpg'
    },
    royale: {
      'Lite|Red':'images/products/royale-rosie-red.jpg',
      'Lite|Brown':'images/products/royale-rosie-brown.jpg',
      'Lite|Yellow':'images/products/royale-rosie-yellow.jpg',
      'Lite|Blue':'images/products/royale-rosie-blue.jpg'
    },
    outdoor: {
      'Basic|2 titik':'images/products/outdoor-basic-elegant.jpg',
      'Deluxe|4 titik':'images/products/outdoor-deluxe-elegant.jpg'
    }
  };
  // galeri foto (>1 foto bisa di-geser) per variasi
  var GALLERY_MAP = {
    classic: {
      'Bloom|Jasmine':['images/products/classic-bloom-jasmine-1.jpg','images/products/classic-bloom-jasmine-2.jpg'],
      'Bloom|Lily':['images/products/classic-bloom-lily-1.jpg','images/products/classic-bloom-lily-2.jpg'],
      'Bloom|Orchid':['images/products/classic-bloom-orchid-1.jpg','images/products/classic-bloom-orchid-2.jpg']
    }
  };

  function initPickers(){
    document.querySelectorAll('.variant-picker').forEach(function(picker){
      var series=picker.getAttribute('data-series');
      var card=picker.closest('.s-text')||picker.parentElement;
      var bigImg=document.getElementById('m-'+series);
      var addBtn=card.querySelector('.add-cart-btn');
      var priceEl=card.querySelector('.s-price');

      function selectedState(){
        var st={series:series,label:CATALOG[series].label};
        var designGrp=picker.querySelector('[data-group="design"]');
        var otypeGrp=picker.querySelector('[data-group="otype"]');
        var colorGrp=picker.querySelector('[data-group="color"]');
        var sizeGrp=picker.querySelector('[data-group="size"]');
        var addonGrp=picker.querySelector('[data-group="addon"]');
        if(designGrp){
          var d=designGrp.querySelector('.vp-opt.sel');
          st.v=d.getAttribute('data-v');st.design=d.getAttribute('data-design');
          st.price=parseInt(d.getAttribute('data-price'));st.custom=d.getAttribute('data-custom')==='1';
        }
        if(otypeGrp){
          var o=otypeGrp.querySelector('.vp-opt.sel');
          st.v=o.getAttribute('data-v');st.design=o.getAttribute('data-design');
        }
        if(colorGrp){var c=colorGrp.querySelector('.vp-opt.sel');if(c)st.color=c.getAttribute('data-color');}
        var bvGrp=picker.querySelector('[data-group="bloomvar"]');
        if(bvGrp && st.v && st.v!=='Lite'){var bv=bvGrp.querySelector('.vp-opt.sel');if(bv)st.color=bv.getAttribute('data-var');}
        if(sizeGrp){
          var s=sizeGrp.querySelector('.vp-opt.sel');
          if(s){st.size=s.getAttribute('data-size');
            if(series==='outdoor'){var key=st.v==='Deluxe'?'data-price-deluxe':'data-price-basic';st.price=parseInt(s.getAttribute(key));}
          }
        }
        // Add-On
        st.addon=false;st.addonPrice=0;
        if(addonGrp){
          var a=addonGrp.querySelector('.vp-opt.sel');
          if(a&&a.getAttribute('data-addon')==='1'){st.addon=true;st.addonPrice=parseInt(a.getAttribute('data-addon-price'))||0;}
        }
        return st;
      }

      // state galeri foto (untuk geser kiri/kanan)
      var galleryImgs=[], galleryIdx=0;

      // key foto: Rosie(Lite) pakai WARNA, Bloom pakai DESIGN
      function photoKey(st){
        if(st.v==='Lite' && st.color) return 'Lite|'+st.color;
        return (st.v||'')+'|'+(st.design||'');
      }

      function currentPhoto(st){
        var key=photoKey(st);
        var map=PHOTO_MAP[series];
        if(map&&map[key])return map[key];
        return addBtn?addBtn.getAttribute('data-img'):null;
      }

      function updateGallery(st){
        var key=photoKey(st);
        var g=(GALLERY_MAP[series]||{})[key];
        galleryImgs = g && g.length ? g.slice() : (currentPhoto(st)?[currentPhoto(st)]:[]);
        galleryIdx=0;
        renderPhoto();
        // tampilkan/sembunyikan panah geser
        var nav=card.querySelector('.gal-nav');
        if(nav)nav.style.display=galleryImgs.length>1?'flex':'none';
      }

      function renderPhoto(){
        if(bigImg&&galleryImgs.length){bigImg.src=galleryImgs[galleryIdx];}
        var dots=card.querySelector('.gal-dots');
        if(dots){
          dots.innerHTML=galleryImgs.map(function(_,i){return '<span class="gd'+(i===galleryIdx?' on':'')+'"></span>';}).join('');
        }
      }

      function refresh(){
        var st=selectedState();
        var colorSub=picker.querySelector('[data-group="color"]');
        if(colorSub && series!=='royale'){
          colorSub.style.display=(st.v==='Lite')?'block':'none';
        }
        var bvSub=picker.querySelector('[data-group="bloomvar"]');
        if(bvSub){ bvSub.style.display=(st.v==='Lite')?'none':'block'; }
        if(priceEl){
          priceEl.innerHTML=rupiah(st.price)+' <small>'+(st.custom?'Custom min H-2':(series==='outdoor'?'By request':'Mulai dari'))+'</small>';
        }
        var _bs=card.querySelector('.bsize-val');
        if(_bs){var _dg=picker.querySelector('[data-group="design"] .vp-opt.sel');var _sz=_dg&&_dg.getAttribute('data-size-cm');if(_sz)_bs.textContent=_sz;}
        updateGallery(st);
        if(addBtn) addBtn.setAttribute('data-current',JSON.stringify(st));
      }

      picker.querySelectorAll('.vp-opts').forEach(function(grp){
        grp.querySelectorAll('.vp-opt').forEach(function(opt){
          opt.addEventListener('click',function(){
            grp.querySelectorAll('.vp-opt').forEach(function(o){o.classList.remove('sel');});
            opt.classList.add('sel');
            refresh();
          });
        });
      });

      // panah geser galeri (kalau ada)
      var navPrev=card.querySelector('.gal-prev'), navNext=card.querySelector('.gal-next');
      if(navPrev)navPrev.addEventListener('click',function(e){e.preventDefault();if(galleryImgs.length){galleryIdx=(galleryIdx-1+galleryImgs.length)%galleryImgs.length;renderPhoto();}});
      if(navNext)navNext.addEventListener('click',function(e){e.preventDefault();if(galleryImgs.length){galleryIdx=(galleryIdx+1)%galleryImgs.length;renderPhoto();}});

      if(addBtn){
        addBtn.addEventListener('click',function(e){
          e.preventDefault();
          var st=selectedState();
          st.img=currentPhoto(st)||addBtn.getAttribute('data-img');
          st.qty=1;
          window.ddCart.add(st);
        });
      }
      var directBtn=card.querySelector('.buy-row a[href*="order.html"]');
      if(directBtn){
        directBtn.addEventListener('click',function(e){
          e.preventDefault();
          var st=selectedState();
          var q=new URLSearchParams();
          q.set('series',st.series);
          if(series==='outdoor'){
            if(st.v)q.set('otype',st.v);
            q.set('osize',(st.size&&st.size.indexOf('Medium')===0)?'Medium':'Regular');
          }else{
            if(st.v)q.set('v',st.v);
            if(st.design)q.set('design',st.design);
            if(st.color)q.set('color',st.color);
            if(st.addon)q.set('addon','1');
          }
          window.location.href='order.html?'+q.toString();
        });
      }
      refresh();
    });
  }

  // ---------- INIT ----------
  function init(){injectCartIcon();injectDrawer();updateBadge();initPickers();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
