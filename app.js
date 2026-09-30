
const M360 = {
  init(){
    if(!localStorage.getItem('m360_balance')) localStorage.setItem('m360_balance','10000');
    if(!localStorage.getItem('m360_skin')) localStorage.setItem('m360_skin','السعودي الرسمي');
    if(!localStorage.getItem('m360_cart')) localStorage.setItem('m360_cart','[]');
    this.refresh();
  },
  balance(){ return Number(localStorage.getItem('m360_balance')||10000); },
  setBalance(v){ localStorage.setItem('m360_balance', String(Math.max(0,v))); this.refresh(); },
  cart(){ try{return JSON.parse(localStorage.getItem('m360_cart')||'[]')}catch(e){return[]} },
  saveCart(c){ localStorage.setItem('m360_cart',JSON.stringify(c)); this.refresh(); },
  add(item){
    const c=this.cart(); c.push(item); this.saveCart(c); this.toast('أضيف إلى السلة: '+item.name);
  },
  refresh(){
    document.querySelectorAll('[data-balance]').forEach(x=>x.textContent=this.balance().toLocaleString('en-US')+' M360');
    document.querySelectorAll('[data-cartcount]').forEach(x=>x.textContent=this.cart().length);
    document.querySelectorAll('[data-skin]').forEach(x=>x.textContent=localStorage.getItem('m360_skin')||'السعودي الرسمي');
  },
  toast(t){
    let el=document.querySelector('.toast'); if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}
    el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1800);
  },
  modal(id,show=true){document.getElementById(id)?.classList.toggle('show',show)},
  checkout(){
    const c=this.cart(), total=c.reduce((a,b)=>a+Number(b.price||0),0);
    if(!c.length) return this.toast('السلة فارغة');
    if(total>this.balance()) return this.toast('الرصيد التجريبي غير كافٍ');
    this.setBalance(this.balance()-total);
    localStorage.setItem('m360_last_receipt', JSON.stringify({id:'M360-'+Date.now(),total,items:c,date:new Date().toLocaleString('ar-SA')}));
    this.saveCart([]);
    this.toast('تمت عملية الشراء التجريبية بنجاح');
    setTimeout(()=>location.href='receipt.html',650);
  },
  resetDemo(){
    localStorage.setItem('m360_balance','10000');
    localStorage.setItem('m360_cart','[]');
    this.refresh(); this.toast('تمت إعادة الديمو');
  },
  voice(){
    const on=localStorage.getItem('m360_voice')==='1';
    localStorage.setItem('m360_voice',on?'0':'1');
    this.toast(on?'تم إغلاق الصوت':'تم تشغيل وضع الصوت التجريبي');
  },
  ai(){
    const q=(document.getElementById('aiq')?.value||'').trim();
    if(!q) return;
    let ans='أقدر أوصلك للمتاجر، المطاعم، المجلس، البلوت أو أبحث لك عن منتج.';
    if(/جهاز|تقن|سماعة|جوال/.test(q)) ans='أقرب خيار لك TECH360. افتح المتاجر ثم قسم التقنية.';
    else if(/جاكيت|ملابس|فستان|ثوب/.test(q)) ans='LUXORA مناسب لك. عندنا منتجات تبدأ من 180 M360.';
    else if(/بلوت/.test(q)) ans='Baloot Arena جاهزة. تقدر تنشئ طاولة وترسل كود دعوة.';
    else if(/قهو|مطعم|اكل|أكل/.test(q)) ans='COFFEE HOUSE للهدوء، وGRILL360 للوجبات السريعة.';
    else if(/صديق|اصحاب|أصحاب/.test(q)) ans='عندك 3 أصدقاء داخل المول الآن. افتح صفحة الأصدقاء للانضمام.';
    document.getElementById('aianswer').textContent=ans;
  }
};
document.addEventListener('DOMContentLoaded',()=>M360.init());
