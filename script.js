const PRODUCTS = [
  {id:1,name:"Chole Masala",price:110,type:"masala",icon:"🍛",desc:"Aromatic blend for rich, comforting chole."},
  {id:2,name:"Pav Bhaji Masala",price:110,type:"masala",icon:"🥘",desc:"Bold Mumbai-style flavour for pav bhaji."},
  {id:3,name:"Garam Masala",price:110,type:"masala",icon:"🌿",desc:"Warm, aromatic finishing masala for everyday cooking."},
  {id:4,name:"Chicken Masala",price:110,type:"masala",icon:"🍗",desc:"A fragrant blend made for hearty chicken dishes."},
  {id:5,name:"Fish Masala",price:90,type:"masala",icon:"🐟",desc:"Balanced spices for delicious fish preparations."},
  {id:6,name:"Chaha Masala",price:160,type:"masala",icon:"☕",desc:"A warming blend to elevate your daily chai."},
  {id:7,name:"Sunday Special Masala",price:100,type:"masala",icon:"🍲",desc:"Made for special family meals and weekend cooking."},
  {id:8,name:"Kashmiri Lal Masala",price:80,type:"powder",icon:"🌶️",desc:"Beautiful colour and balanced chilli warmth."},
  {id:9,name:"Sambar Masala",price:90,type:"masala",icon:"🥣",desc:"South Indian-inspired flavour for comforting sambar."},
  {id:10,name:"Kala Masala",price:100,type:"masala",icon:"🫘",desc:"Deep, roasted character for traditional dishes."},
  {id:11,name:"Kanda Lasun",price:60,type:"masala",icon:"🧄",desc:"A punchy Maharashtrian favourite."},
  {id:12,name:"Malvani Masala",price:110,type:"masala",icon:"🌶️",desc:"Bold coastal flavour for curries and seafood."},
  {id:13,name:"Lal Tikhat Medium",price:70,type:"powder",icon:"🔥",desc:"Everyday medium chilli heat for Indian cooking."}
];

// Replace this with SPICY DOTT's actual WhatsApp number in international format, without + or spaces.
const WHATSAPP_NUMBER = "918454929137";

let cart = JSON.parse(localStorage.getItem("spicyDottCart") || "[]");

const grid = document.getElementById("productGrid");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(){
  const q = search.value.trim().toLowerCase();
  const f = filter.value;
  const list = PRODUCTS.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (f === "all" || p.type === f)
  );
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product">
      <div class="product-art">${p.icon}</div>
      <div class="product-info">
        <span class="tag">${p.type === "masala" ? "MASALA" : "SPICE POWDER"} • 100G</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">Add +</button>
        </div>
      </div>
    </article>`).join("") : `<p>No products found. Try another search.</p>`;
}

function save(){ localStorage.setItem("spicyDottCart", JSON.stringify(cart)); }

function addToCart(id){
  const existing = cart.find(x => x.id === id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  save(); renderCart(); openCart();
}

function changeQty(id,delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  save(); renderCart();
}

function renderCart(){
  const items = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return {...p, qty:item.qty};
  });
  document.getElementById("cartCount").textContent = items.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartItems").innerHTML = items.length ? items.map(x => `
    <div class="cart-line">
      <div><b>${x.name}</b><small>${money(x.price)} × ${x.qty}</small></div>
      <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${x.id},1)">+</button></div>
    </div>`).join("") : `<p style="color:#756a62">Your cart is empty. Add a few favourites to get started.</p>`;
  document.getElementById("cartTotal").textContent = money(items.reduce((s,x)=>s+x.price*x.qty,0));
}

function openCart(){ cartEl.classList.add("open"); overlay.classList.add("show"); cartEl.setAttribute("aria-hidden","false"); }
function closeCart(){ cartEl.classList.remove("open"); overlay.classList.remove("show"); cartEl.setAttribute("aria-hidden","true"); }

function checkout(){
  if(!cart.length){ openCart(); return; }
  if(WHATSAPP_NUMBER.includes("X")){
    alert("Please add SPICY DOTT's WhatsApp number in script.js before using checkout.");
    return;
  }
  const lines = cart.map(item => {
    const p = PRODUCTS.find(x=>x.id===item.id);
    return `• ${p.name} — ${item.qty} × ${money(p.price)}`;
  });
  const total = cart.reduce((s,item)=>{
    const p=PRODUCTS.find(x=>x.id===item.id); return s+p.price*item.qty;
  },0);
  const text = `Hello SPICY DOTT!%0A%0AI would like to order:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(money(total))}%0A%0APlease confirm availability and delivery details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,"_blank");
}

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById("checkout").onclick=checkout;
document.getElementById("whatsappTop").onclick=checkout;
search.addEventListener("input",renderProducts);
filter.addEventListener("change",renderProducts);
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
