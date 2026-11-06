(function(){
  var btn=document.querySelector('.menu-btn'), nav=document.querySelector('.main-nav');
  if(btn&&nav){btn.addEventListener('click',function(){
    var o=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',o);
  });}
  document.querySelectorAll('.sub-toggle').forEach(function(b){
    b.addEventListener('click',function(){
      var li=b.parentElement, o=li.classList.toggle('open'); b.textContent=o?'\u2212':'+';
    });
  });
  // hitung angka statistik sekali saat terlihat
  var els=document.querySelectorAll('.count');
  function fmt(v,dec,sep){
    var s=v.toFixed(dec).replace('.',',');
    if(sep){s=s.replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
    return s;
  }
  function run(el){
    var to=parseFloat(el.dataset.to), dec=parseInt(el.dataset.dec||0), sep=el.dataset.sep;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=fmt(to,dec,sep);return;}
    var t0=null,d=1400;
    function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/d,1); el.textContent=fmt(to*(1-Math.pow(1-p,3)),dec,sep); if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io.unobserve(e.target);}});},{threshold:.4});
    els.forEach(function(e){io.observe(e);});
  } else { els.forEach(run); }

  // Navigasi cepat antarseksi pada halaman selain Beranda.
  if(document.body.classList.contains('inner-page')){
    var main=document.querySelector('main');
    var hero=main&&main.querySelector('.page-hero');
    var sections=main?Array.prototype.slice.call(main.querySelectorAll(':scope > section.section')):[];
    var targets=[];
    sections.forEach(function(section,index){
      var heading=section.querySelector('h2');
      if(!heading) return;
      if(!section.id){
        var slug=heading.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
        section.id=slug||('bagian-'+(index+1));
      }
      targets.push({id:section.id,label:heading.textContent.trim()});
    });
    if(hero&&targets.length>1){
      var quick=document.createElement('nav');
      quick.className='section-nav';
      quick.setAttribute('aria-label','Navigasi bagian halaman');
      targets.forEach(function(item){
        var a=document.createElement('a');
        a.href='#'+item.id;
        a.textContent=item.label;
        quick.appendChild(a);
      });
      hero.insertAdjacentElement('afterend',quick);
    }
  }

  // Kirim form kontak lewat AJAX (FormSubmit)
  var form=document.getElementById('form');
  var statusEl=document.getElementById('form-status');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var submitBtn=form.querySelector('button[type="submit"]');
      if(submitBtn) submitBtn.disabled=true;
      if(statusEl) statusEl.textContent='Mengirim...';

      fetch(form.action,{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:new FormData(form)
      })
      .then(function(res){return res.json().then(function(data){return {ok:res.ok,data:data};});})
      .then(function(r){
        if(r.ok && (r.data.success===true || r.data.success==='true')){
          form.reset();
          if(statusEl) statusEl.textContent='Pesan berhasil dikirim. Terima kasih!';
        } else {
          if(statusEl) statusEl.textContent='Gagal mengirim: '+(r.data.message||'coba lagi.');
        }
      })
      .catch(function(){
        if(statusEl) statusEl.textContent='Terjadi kesalahan jaringan. Coba lagi.';
      })
      .then(function(){ if(submitBtn) submitBtn.disabled=false; });
    });
  }
})();