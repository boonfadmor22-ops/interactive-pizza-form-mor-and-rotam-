// === Pizza Form Logic — ===


// נקראת בכל שינוי בטופס: מעדכנת שכבות ותצוגות, ומצב כפתור הסיכום
function updatePizza(){
    const sauceEl  = document.querySelector('input[name="sauce"]:checked');
    const sauceVal = sauceEl ? sauceEl.value : null;
    const cheeseOn = document.getElementById("cheese").checked;

    // תוספות מסומנות בלולאת for בסיסית
    const checked = document.querySelectorAll('input[name="topping"]:checked');
    const tops = [];
    for (let i = 0; i < checked.length; i++){
        tops[tops.length] = checked[i].value;
    }

    showSauce(sauceVal);
    showCheese(cheeseOn);
    showToppings(tops);
    updateThumbs(sauceVal, cheeseOn, tops);
    updateSubmitState();
}

// מציגה רוטב אחד ומסתירה את השאר (layer-sauce-*)
function showSauce(type){
    const sauces = ["tomato","cream","pesto"];
    for (let i = 0; i < sauces.length; i++){
        const s  = sauces[i];
        const el = document.getElementById("layer-sauce-" + s);
        if (el){
            el.classList.toggle("hidden", s !== type);
        }
    }
}

// מציגה/מסתירה שכבת הגבינה (layer-cheese)
function showCheese(on){
    const el = document.getElementById("layer-cheese");
    if (el){
        el.classList.toggle("hidden", !on);
    }
}

// מציגה/מסתירה שכבות התוספות לפי הרשימה (layer-top-*)
function showToppings(list){
    const keys = ["olives","mushrooms","onion","pepper"];
    for (let i = 0; i < keys.length; i++){
        const k  = keys[i];
        const el = document.getElementById("layer-top-" + k);
        if (el){
            let selected = false;
            for (let j = 0; j < list.length; j++){
                if (list[j] === k){ selected = true; break; }
            }
            el.classList.toggle("hidden", !selected);
        }
    }
}

// מעדכנת הדגשה של תמונות-מיני (thumbnails) בהתאם לבחירות
function updateThumbs(sauceVal, cheeseOn, tops){
    const sauces = ["tomato","cream","pesto"];
    for (let i = 0; i < sauces.length; i++){
        const s  = sauces[i];
        const th = document.getElementById("thumb-sauce-" + s);
        if (th){ th.classList.toggle('active', s === sauceVal); }
    }

    const thCheese = document.getElementById("thumb-cheese");
    if (thCheese){ thCheese.classList.toggle('active', cheeseOn ? true : false); }

    const keys = ["olives","mushrooms","onion","pepper"];
    for (let k = 0; k < keys.length; k++){
        const key   = keys[k];
        const thTop = document.getElementById("thumb-" + key);
        if (thTop){
            let isOn = false;
            for (let t = 0; t < tops.length; t++){
                if (tops[t] === key){ isOn = true; break; }
            }
            thTop.classList.toggle('active', isOn);
        }
    }
}

// מפעילה/משביתה את כפתור "הצג סיכום" לפי שדות חובה (שם + רוטב)
function updateSubmitState(){
    let nameVal  = (document.getElementById("chefName").value || "").trim();
    const hasName  = nameVal.length > 0;
    const sauceEl  = document.querySelector('input[name="sauce"]:checked');
    const hasSauce = (sauceEl !== null);
    const btn      = document.getElementById("showSummaryBtn");
    btn.disabled = !(hasName && hasSauce);
}

// ולידציה לפני פתיחת הסיכום (אם הכפתור מושבת — לא לעשות כלום)
function openSummaryValidated(){
    const btn = document.getElementById("showSummaryBtn");
    if (btn.disabled){ return; }
    openSummary();
}

// פותחת את חלון הסיכום (מודאל) עם תוכן הבחירות
function openSummary(){
    document.getElementById("modalContent").innerHTML = buildSummaryHTML();
    document.getElementById("modalBackdrop").classList.remove("hidden");
}

// סוגרת את חלון הסיכום (מודאל)
function closeSummary(){
    document.getElementById("modalBackdrop").classList.add("hidden");
}

// בונה HTML של סיכום ההזמנה להצגה במודאל (ללא map/join)
function buildSummaryHTML(){
    let name = (document.getElementById("chefName").value || "").trim();
    if (name === ""){ name = "לא נמסר"; }

    const sauceEl = document.querySelector('input[name="sauce"]:checked');
    const sauceHe = sauceEl ? sauceToHe(sauceEl.value) : "לא נבחר";

    const cheese = document.getElementById("cheese").checked ? "עם גבינה" : "בלי גבינה";

    const checked = document.querySelectorAll('input[name="topping"]:checked');
    let topsHe = "";
    for (let i = 0; i < checked.length; i++){
        const val = checked[i].value;
        const he  = topToHe(val);
        if (topsHe !== ""){ topsHe += ", "; }
        topsHe += he;
    }
    if (topsHe === ""){ topsHe = "ללא תוספות"; }

    return (
        '<p><strong>שם:</strong> '     + name    + '</p>' +
        '<p><strong>רוטב:</strong> '   + sauceHe + '</p>' +
        '<p><strong>גבינה:</strong> '  + cheese  + '</p>' +
        '<p><strong>תוספות:</strong> ' + topsHe  + '</p>'
    );
}

// ממירה מזהה רוטב לשם בעברית עבור הסיכום
function sauceToHe(v){
    if (v === "tomato") return "עגבניות";
    if (v === "cream")  return "שמנת";
    if (v === "pesto")  return "פסטו";
    return "—";
}

// ממירה מזהה תוספת לשם בעברית עבור הסיכום
function topToHe(v){
    if (v === "olives")    return "זיתים";
    if (v === "mushrooms") return "פטריות";
    if (v === "onion")     return "בצל";
    if (v === "pepper")    return "פלפל";
    return v;
}

// מאפס הכל למצב התחלתי
function resetPizza(){
    // 1) קלטים
    const nameEl = document.getElementById("chefName");
    if (nameEl) nameEl.value = "";

    const sauceRadios = document.querySelectorAll('input[name="sauce"]');
    for (let i = 0; i < sauceRadios.length; i++){ sauceRadios[i].checked = false; }

    const cheeseCb = document.getElementById("cheese");
    if (cheeseCb) cheeseCb.checked = false;

    const toppingCbs = document.querySelectorAll('input[name="topping"]');
    for (let i = 0; i < toppingCbs.length; i++){ toppingCbs[i].checked = false; }

    // 2) שכבות תצוגה
    const sauces = ["tomato","cream","pesto"];
    for (let i = 0; i < sauces.length; i++){
        const el = document.getElementById("layer-sauce-" + sauces[i]);
        if (el) el.classList.add("hidden");
    }
    const cheeseLayer = document.getElementById("layer-cheese");
    if (cheeseLayer) cheeseLayer.classList.add("hidden");

    const tops = ["olives","mushrooms","onion","pepper"];
    for (let i = 0; i < tops.length; i++){
        const el = document.getElementById("layer-top-" + tops[i]);
        if (el) el.classList.add("hidden");
    }

    // 3) thumbnails – הסרת הדגשות
    function deact(id){ const el = document.getElementById(id); if (el) el.classList.remove("active"); }
    for (let i = 0; i < sauces.length; i++) deact("thumb-sauce-" + sauces[i]);
    deact("thumb-cheese");
    for (let i = 0; i < tops.length; i++) deact("thumb-" + tops[i]);

    // 4) כפתור סיכום – למצב מושבת + חצי שקיפות
    const showBtn = document.getElementById("showSummaryBtn");
    if (showBtn){ showBtn.disabled = true; showBtn.classList.add("semi-transparent"); }

    // 5) סגירת מודאל אם פתוח
    const backdrop = document.getElementById("modalBackdrop");
    if (backdrop) backdrop.classList.add("hidden");
}