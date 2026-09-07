import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const FALLBACK = {
  whatsapp: '5491133218175',
  hero_title: 'Piezas para momentos que permanecen.',
  hero_text: 'Joyas y relojes seleccionados con atención personalizada. Descubrí nuestras colecciones y consultanos por tu próxima pieza.',
  about_text: 'M&M nace de Montero & Montero. Desde 1990, la joyería y relojería acompaña a sus clientes con atención personalizada.',
  contact_title: '¿Ya viste algo que te gustó?',
  contact_text: 'Consultanos por WhatsApp y te ayudamos a encontrar la pieza indicada.'
};
const esc = v => String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const wa = (phone, text) => `https://wa.me/${String(phone).replace(/\D/g,'')}?text=${encodeURIComponent(text)}`;
const money = v => Number(v || 0).toLocaleString('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0});

async function load(){
  const [{data: settings}, {data: cats}, {data: brands}, {data: products}] = await Promise.all([
    sb.from('site_settings').select('*'),
    sb.from('categories').select('*').order('sort_order'),
    sb.from('brands').select('*').eq('active',true).order('sort_order'),
    sb.from('products').select('id,name,brand,category,description,stock,display_price,image_urls,featured').eq('published',true).order('featured',{ascending:false}).order('sort_order')
  ]);
  const sm = Object.fromEntries((settings||[]).map(r=>[r.key,r.value]));
  return { settings:{...FALLBACK,...sm}, categories:cats||[], brands:brands||[], products:products||[] };
}

function render(d){
  const s=d.settings; const phone=s.whatsapp || FALLBACK.whatsapp;
  document.querySelector('#heroTitle').textContent=s.hero_title;
  document.querySelector('#heroText').textContent=s.hero_text;
  document.querySelector('#aboutText').textContent=s.about_text;
  document.querySelector('#contactTitle').textContent=s.contact_title;
  document.querySelector('#contactText').textContent=s.contact_text;
  ['headerWhatsapp','heroWhatsapp','seikoWhatsapp','contactWhatsapp'].forEach(id=>{const e=document.getElementById(id); if(e)e.href=wa(phone);});

  const cats=d.categories.length?d.categories:[
    {name:'Relojes',description:'Selecciones de relojería para todos los días.',class_name:'category-dark',number:'01'},
    {name:'Joyas',description:'Piezas para regalar, celebrar o disfrutar.',class_name:'category-green',number:'02'},
    {name:'Seiko',description:'Nuestra marca protagonista.',class_name:'category-cream',number:'03'}
  ];
  document.querySelector('#categories').innerHTML=cats.map(c=>`<a class="category-card ${esc(c.class_name||'category-green')}" href="#catalogo"><div><span class="category-kicker">${esc(c.number||'')}</span><h3>${esc(c.name)}</h3><p>${esc(c.description||'')}</p></div><span class="arrow">↗</span></a>`).join('');

  const products=d.products;
  document.querySelector('#products').innerHTML=products.length?products.map(p=>{
    const imgs=Array.isArray(p.image_urls)?p.image_urls:[];
    const image=imgs[0];
    const stock=p.stock>0?'Disponible':'Consultar disponibilidad';
    const brand=p.brand||p.category||'M&M';
    return `<article class="product-card">
      <div class="product-photo">${image?`<img src="${esc(image)}" alt="${esc(p.name)}">`:`<div class="product-empty-photo"><span>${esc(brand)}</span></div>`}</div>
      <div class="product-info"><span class="muted">${esc(brand)}</span><h3>${esc(p.name)}</h3><p>${esc(p.description||'')}</p><div class="product-meta"><strong class="price">${money(p.display_price)}</strong><span>${esc(stock)}</span></div><a href="${wa(phone,`Hola, quiero consultar por ${p.name}.`)}" target="_blank" rel="noopener">Consultar →</a></div>
    </article>`;
  }).join(''):`<div class="empty-catalog"><span>CATÁLOGO</span><h3>Estamos preparando nuestras piezas.</h3><p>Pronto vas a poder ver los productos disponibles.</p></div>`;

  document.querySelector('#brandRail').innerHTML=d.brands.map(b=>`<span class="brand-pill ${b.featured?'featured':''}">${esc(b.name)}</span>`).join('');
}
load().then(render).catch(err=>{console.error(err);render({settings:FALLBACK,categories:[],brands:[],products:[]});});
