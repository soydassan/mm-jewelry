const KEY='mmj_cart_v1';
export function getCart(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function saveCart(c){localStorage.setItem(KEY,JSON.stringify(c));updateCartCount();}
export function addToCart(product){
  if(Number(product.stock||0)<=0)return getCart();
  const cart=getCart();
  const i=cart.findIndex(x=>x.id===product.id);
  if(i>=0) cart[i].qty=Math.min((cart[i].qty||1)+1, Math.max(1, Number(product.stock)||99));
  else cart.push({id:product.id,name:product.name,brand:product.brand,display_price:Number(product.display_price)||0,image:(Array.isArray(product.image_urls)?product.image_urls[0]:'')||'',stock:Number(product.stock)||0,qty:1});
  saveCart(cart); return cart;
}
export function removeFromCart(id){saveCart(getCart().filter(x=>x.id!==id));}
export function setQty(id,qty){
  const cart=getCart(); const i=cart.findIndex(x=>x.id===id); if(i<0)return;
  const max=Math.max(1,Number(cart[i].stock)||99); cart[i].qty=Math.max(1,Math.min(Number(qty)||1,max)); saveCart(cart);
}
export function cartTotal(){return getCart().reduce((s,x)=>s+(Number(x.display_price)||0)*(x.qty||1),0)}
export function updateCartCount(){const n=getCart().reduce((s,x)=>s+(x.qty||1),0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n)}
export const money=v=>Number(v||0).toLocaleString('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0});
