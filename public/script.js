
let App = { uid: "", pass: "", aid: "", nick: "", reg: "", items: [], itemDb: {} };
const rarityBase = { "WHITE": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-white.jpg", "GREEN": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-GREEN.jpg", "BLUE": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-BLUE.jpg", "PURPLE": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-PURPLE.jpg", "ORANGE": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-ORANGE.jpg", "RED": "https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/heads/main/Others/Preview-RED.jpg" };

(async function init() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/MACBRUH-OFC/FreeFire-Resources/refs/heads/main/data/ItemData.json');
        const data = await res.json();
        data.forEach(i => App.itemDb[i.id] = i.rare.toUpperCase());
    } catch (e) { }
})();

const kellyFrames = [];
for (let i = 1; i <= 10; i++) kellyFrames.push(`https://freefiremobile-a.akamaihd.net/common/Local/PK/FF_UI_Icon/UI_loading_kelly_${String(i).padStart(2, '0')}.png`);
let kIdx = 0; setInterval(() => {
    const el = document.getElementById('kelly');
    if (el) el.style.backgroundImage = `url(${kellyFrames[kIdx]})`;
    kIdx = (kIdx + 1) % kellyFrames.length;
}, 80);

const SVGS = { process: `<i class="fa-solid fa-spinner animate-spin text-zinc-500"></i>`, success: `<i class="fa-solid fa-check-circle text-[#00ffa3]"></i>`, error: `<i class="fa-solid fa-triangle-exclamation text-red-500"></i>` };

function switchTab(t) {
    document.getElementById('t-file').className = `flex-1 py-3 text-[10px] font-black rounded-full flex items-center justify-center gap-2 ${t === 'file' ? 'text-white bg-zinc-800' : 'text-zinc-600'}`;
    document.getElementById('t-manual').className = `flex-1 py-3 text-[10px] font-black rounded-full flex items-center justify-center gap-2 ${t === 'manual' ? 'text-white bg-zinc-800' : 'text-zinc-600'}`;
    document.getElementById('box-file').style.display = t === 'file' ? 'block' : 'none';
    document.getElementById('box-manual').style.display = t === 'manual' ? 'block' : 'none';
    App.tab = t;
}

accInp.onchange = e => {
    const r = new FileReader();
    r.onload = ev => {
        const d = JSON.parse(ev.target.result);
        App.uid = d.guest_account_info["com.garena.msdk.guest_uid"];
        App.pass = d.guest_account_info["com.garena.msdk.guest_password"];
        document.getElementById('f-label').innerText = e.target.files[0].name.toUpperCase();
    }; r.readAsText(e.target.files[0]);
};

async function performAuth() {
    if (App.tab === 'manual') { App.uid = document.getElementById('in-uid').value; App.pass = document.getElementById('in-pass').value; }
    if (!App.uid) return;
    toggleLoader(true, "Getting account login");
    try {
        const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "login",
                uid: App.uid,
                pass: App.pass
            })
        });
        const data = await res.json();
        if (data.status === "success") {
            App.aid = data.account_info.account_id;
            App.nick = data.account_info.nickname;
            App.reg = data.account_info.region;
            document.getElementById('res-nick').innerText = App.nick;
            document.getElementById('res-uid').innerText = App.aid;
            document.getElementById('res-reg').innerText = App.reg;
            document.getElementById('view-login').classList.add('hidden');
            document.getElementById('view-info').classList.remove('hidden');
        }
    } catch (e) { }
    toggleLoader(false);
}

async function toDash() {
    toggleLoader(true, "Getting wishlist info");
    await refreshGridData();
    document.getElementById('view-info').classList.add('hidden');
    document.getElementById('view-dash').classList.remove('hidden');
    document.getElementById('d-nick').innerText = App.nick;
    document.getElementById('d-uid-ghost').innerText = App.aid;
    toggleLoader(false);
}

async function refreshGridData() {
    try {
        const res = await (await fetch(`/api/wish/${App.reg.toLowerCase()}/uid=${App.aid}/OB52`)).json();
        App.items = res.wishlist_items || [];
        document.getElementById('wish-grid').innerHTML = App.items.map(i => renderItemCard(i.itemId)).join('');
        updateCount();
    } catch (e) { }
}

function renderItemCard(id) {
    let rare = App.itemDb[id] || "WHITE";
    let isPlus = rare.includes("PLUS");
    let cleanRare = rare.replace("_PLUS", "");
    let bg = rarityBase[cleanRare] || rarityBase["WHITE"];
    return `<div class="reward-card ${isPlus ? 'rare-plus' : ''}" id="card-${id}" style="background-image: url('${bg}')">
            <img src="https://freefire-iconlibrary.vercel.app/api/get-image?type=item&value=${id}">
            <div class="id-bar"><span class="id-label">${id}</span></div>
            <div class="deleting-overlay"><i class="fa-solid fa-trash-can"></i></div>
        </div>`;
}

function updateCount() { document.getElementById('d-count').innerText = `${App.items.length.toString().padStart(2, '0')}/80`; }

async function secureRequest(mode, id, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const r = await fetch(`/api/wishlist/${App.reg.toLowerCase()}/${mode}/${id}/${App.uid}/${App.pass}/OB52`);
            const data = await r.json();
            if (data.status === "success") return true;
        } catch (e) { }
        await new Promise(res => setTimeout(res, 400));
    }
    return false;
}

async function processRequest(mode) {
    const val = document.getElementById('item-id').value;
    const targets = parseSmartInput(val);
    if (!targets.length) return;
    if (mode === 'add' && App.items.length + targets.length > 80) { updateStatus('error', 'WISHLIST IS FULL'); return; }
    updateStatus('process', 'Processing request');
    let completed = 0;
    for (let id of targets) {
        if (mode === 'rem') document.getElementById(`card-${id}`)?.classList.add('is-deleting');
        (async () => {
            const success = await secureRequest(mode, id);
            if (success) {
                if (mode === 'add') {
                    if (!App.items.some(it => String(it.itemId) === id)) {
                        document.getElementById('wish-grid').insertAdjacentHTML('afterbegin', renderItemCard(id));
                        App.items.push({ itemId: id });
                    }
                } else {
                    document.getElementById(`card-${id}`)?.remove();
                    App.items = App.items.filter(it => String(it.itemId) !== id);
                }
                updateCount();
            } else { document.getElementById(`card-${id}`)?.classList.remove('is-deleting'); }
            completed++;
            document.getElementById('p-fill').style.width = `${(completed / targets.length) * 100}%`;
            if (completed === targets.length) updateStatus('success', 'Request Successful');
        })();
        await new Promise(r => setTimeout(r, 40));
    }
}

function parseSmartInput(v) {
    let ids = [];
    v.split(',').forEach(p => {
        p = p.trim();
        if (p.includes('-')) {
            let parts = p.split('-');
            let start = parts[0], rangeVal = parts[1];
            if (rangeVal.length < 5) {
                let prefix = start.substring(0, start.length - rangeVal.length);
                let sNum = parseInt(start.substring(start.length - rangeVal.length)), eNum = parseInt(rangeVal);
                for (let i = Math.min(sNum, eNum); i <= Math.max(sNum, eNum); i++) ids.push(prefix + i.toString().padStart(rangeVal.length, '0'));
            } else { for (let i = parseInt(start); i <= parseInt(rangeVal); i++) ids.push(i.toString()); }
        } else if (p) ids.push(p);
    });
    return [...new Set(ids)];
}

async function fullPurge() {
    closeModal('modal-wipe');
    const ids = [...App.items];
    updateStatus('process', 'Processing request');
    let done = 0;
    for (let item of ids) {
        document.getElementById(`card-${item.itemId}`)?.classList.add('is-deleting');
        (async () => {
            await secureRequest('rem', item.itemId);
            done++;
            document.getElementById('p-fill').style.width = `${(done / ids.length) * 100}%`;
            if (done === ids.length) { refreshGridData(); updateStatus('success', 'Request Successful'); }
        })();
        await new Promise(r => setTimeout(r, 30));
    }
}

function toggleLoader(s, text = "Processing") { document.getElementById('kelly-loader').style.display = s ? 'flex' : 'none'; document.getElementById('kelly-text').innerText = text; }
function openWipeModal() { if (App.items.length) document.getElementById('modal-wipe').style.display = 'flex'; }
function openLogoutModal() { document.getElementById('modal-logout').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function updateStatus(type, msg) {
    const box = document.getElementById('status-box');
    box.classList.add('active');
    document.getElementById('status-text').innerText = msg;
    document.getElementById('status-icon').innerHTML = SVGS[type];
    if (type !== 'process') setTimeout(() => { box.classList.remove('active'); document.getElementById('p-fill').style.width = '0%'; }, 3500);
}
switchTab('file');
