/**
 * ME GUIA VIAGENS — EDITOR VISUAL v4
 * Clique em qualquer elemento destacado para editar.
 * Suporte a: adicionar pacotes, remover cards, editar textos/imagens/links/cores.
 */
(function () {
    'use strict';

    const CMS_KEY     = 'meguia_cms_v1';
    const AUTH_KEY    = 'lovisa_auth';
    const SECRET_KEY  = 'lovisa_secret';
    const CONTENT_URL = '/api/content';
    const isLocal     = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    /* ─── AUTH ─────────────────────────────────────────────── */
    const auth     = JSON.parse(sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin  = auth && auth.expires > Date.now();
    const params   = new URLSearchParams(location.search);
    const editMode = isAdmin && (params.get('editor') === '1' || sessionStorage.getItem('editor_active') === '1');

    /* ─── APLICAR CONTEÚDO ──────────────────────────────────── */
    function applyContent(cms) {
        if (!cms || typeof cms !== 'object' || !Object.keys(cms).length) return;

        // CRÍTICO: aplica __db_overrides ao DB ANTES de qualquer render
        if (cms.__db_overrides && typeof DB !== 'undefined') {
            Object.entries(cms.__db_overrides).forEach(([pkgId, overrides]) => {
                if (DB[pkgId]) Object.assign(DB[pkgId], overrides);
            });
        }

        if (cms.colors && typeof cms.colors === 'object') {
            const aliases = { '--primary': '--navy', '--primary-dark': '--navy-dark', '--text-dark': '--text' };
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
                if (aliases[k]) document.documentElement.style.setProperty(aliases[k], v);
            });
        }
        if (cms.whatsapp) {
            document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cms.whatsapp);
            });
        }
        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.html   != null) el.innerHTML = d.html;
            if (d.text   != null) el.textContent = d.text;
            if (d.src    != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href   != null) el.setAttribute('href', d.href);
            if (d.target != null) el.setAttribute('target', d.target);
            if (d.style && typeof d.style === 'object') Object.assign(el.style, d.style);
        });

        // Mesclar pacotes novos no DB
        if (cms.__new_packages && typeof cms.__new_packages === 'object' && typeof DB !== 'undefined') {
            Object.entries(cms.__new_packages).forEach(([id, pkg]) => {
                if (!pkg.category) pkg.category = 'nacional';
                DB[id] = pkg;
            });
        }

        // Remover cards marcados para remoção
        if (Array.isArray(cms.__removed_cards)) {
            cms.__removed_cards.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        }

        // Injetar cards de novos pacotes na home (index.html)
        if (cms.__new_packages && typeof cms.__new_packages === 'object') {
            const grid = document.getElementById('cards-grid') || document.querySelector('.cards-grid');
            if (grid && typeof buildCard === 'function') {
                const removed = Array.isArray(cms.__removed_cards) ? cms.__removed_cards : [];
                Object.entries(cms.__new_packages).forEach(([pkgId, pkg]) => {
                    const cardId = 'card-' + pkgId;
                    if (removed.includes(cardId)) return;
                    if (document.getElementById(cardId)) return;
                    if (!pkg.category) pkg.category = 'nacional';
                    DB[pkgId] = pkg;
                    const card = buildCard(pkgId, pkg);
                    grid.appendChild(card);
                });
            }
        }
    }

    async function fetchContent() {
        if (location.protocol === 'file:') return {};
        try {
            const r = await fetch(CONTENT_URL + '?_=' + Date.now());
            return r.ok ? await r.json() : {};
        } catch (_) { return {}; }
    }

    async function loadAndApply(srv) {
        let merged = (srv && typeof srv === 'object') ? { ...srv } : {};
        // Expõe __SRV_CMS sempre (não só quando tem __new_packages)
        window.__SRV_CMS = srv || {};
        if (editMode) {
            try {
                const draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');
                merged = { ...merged, ...draft };
            } catch (_) {}
        }
        applyContent(merged);
        return merged;
    }

    /* ─── CSS ───────────────────────────────────────────────── */
    function injectCSS() {
        if (document.getElementById('ld-css')) return;
        const s = document.createElement('style');
        s.id = 'ld-css';
        s.textContent = `
        #ld-bar{position:fixed;top:0;left:0;right:0;z-index:99999;height:52px;background:#111827;display:flex;align-items:center;gap:6px;padding:0 14px;box-shadow:0 2px 16px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;}
        #ld-bar *{box-sizing:border-box;}
        .ld-brand{color:#fff;font-weight:700;display:flex;align-items:center;gap:7px;padding-right:14px;border-right:1px solid rgba(255,255,255,.12);white-space:nowrap;margin-right:4px;font-size:13px;}
        .ld-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;flex-shrink:0;animation:ldpulse 1.5s infinite;}
        @keyframes ldpulse{0%,100%{opacity:1}50%{opacity:.3}}
        .ld-hint-text{color:rgba(255,255,255,.55);font-size:12px;white-space:nowrap;}
        .ld-btn{padding:7px 14px;border:none;border-radius:8px;background:transparent;color:rgba(255,255,255,.75);cursor:pointer;font-size:12.5px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap;outline:none;}
        .ld-btn:hover{background:rgba(255,255,255,.12);color:#fff;}
        .ld-btn.blue{background:#1565C0;color:#fff;}
        .ld-btn.blue:hover{background:#0D47A1;}
        .ld-btn.green{background:#16A34A;color:#fff;}
        .ld-btn.green:hover{background:#15803D;}
        .ld-btn.orange{background:#F97316;color:#fff;}
        .ld-btn.orange:hover{background:#EA6C0A;}
        .ld-btn.red{color:rgba(255,255,255,.45);font-size:12px;}
        .ld-btn.red:hover{color:#F87171;background:rgba(248,113,113,.1);}
        .ld-sep{width:1px;height:28px;background:rgba(255,255,255,.12);margin:0 4px;flex-shrink:0;}
        .ld-spacer{flex:1;}

        body.ld-on{padding-top:52px!important;}
        body.ld-on [data-eid]{cursor:pointer!important;position:relative;transition:outline .1s;}
        body.ld-on [data-eid]:hover{outline:2px dashed #F97316!important;outline-offset:3px;}
        body.ld-on [data-eid]:hover::after{content:attr(data-elabel);position:absolute;top:-26px;left:0;background:#F97316;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;z-index:99997;pointer-events:none;font-family:-apple-system,sans-serif;}
        body.ld-on [data-eid].ld-sel{outline:2px solid #1565C0!important;outline-offset:3px;}
        body.ld-on .card-overlay,body.ld-on .card-flag{pointer-events:none!important;}

        .ld-panel{position:fixed;top:62px;right:18px;width:320px;background:#fff;border-radius:16px;z-index:99998;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;}
        .ld-ph{background:#111827;color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;}
        .ld-ph h3{font-size:13px;font-weight:700;margin:0;}
        .ld-px{background:none;border:none;color:rgba(255,255,255,.55);font-size:18px;cursor:pointer;padding:0 2px;line-height:1;}
        .ld-px:hover{color:#fff;}
        .ld-pb{padding:16px;max-height:calc(100vh - 130px);overflow-y:auto;}
        .ld-f{margin-bottom:13px;}
        .ld-f label{display:block;font-size:11px;font-weight:700;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
        .ld-f input[type=text],.ld-f input[type=url],.ld-f textarea,.ld-f select{width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;font-family:inherit;resize:vertical;transition:border .15s;}
        .ld-f input:focus,.ld-f textarea:focus,.ld-f select:focus{border-color:#1565C0;}
        .ld-rich{min-height:70px;padding:9px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;transition:border .15s;line-height:1.5;}
        .ld-rich:focus{border-color:#1565C0;}
        .ld-fmts{display:flex;gap:5px;margin-top:6px;}
        .ld-fmts button{padding:4px 11px;border:1.5px solid #E5E7EB;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;font-weight:700;transition:background .1s;}
        .ld-fmts button:hover{background:#F3F4F6;}
        .ld-cr{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
        .ld-cr label{flex:1;font-size:12.5px;color:#374151;}
        .ld-cr input[type=color]{width:40px;height:32px;padding:2px;border:1.5px solid #E5E7EB;border-radius:6px;cursor:pointer;}
        .ld-prev{width:100%;height:110px;object-fit:cover;border-radius:9px;margin-bottom:10px;background:#F3F4F6;display:block;}
        .ld-acts{display:flex;gap:8px;margin-top:14px;}
        .ld-ok{flex:1;padding:9px;background:#1565C0;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:background .15s;}
        .ld-ok:hover{background:#0D47A1;}
        .ld-ko{padding:9px 14px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:13px;cursor:pointer;}
        .ld-ko:hover{background:#E5E7EB;}
        .ld-hint{font-size:11px;color:#9CA3AF;margin-top:4px;line-height:1.5;}
        .ld-hr{border:none;border-top:1px solid #F3F4F6;margin:12px 0;}
        .ld-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .ld-info{font-size:12px;color:#6B7280;background:#F9FAFB;border-radius:8px;padding:10px;margin-bottom:12px;line-height:1.5;}

        .ld-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#111827;color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:999999;opacity:0;transition:all .28s;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:-apple-system,sans-serif;}
        .ld-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .ld-toast.ok{background:#16A34A;}
        .ld-toast.err{background:#DC2626;}

        .ld-pub-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px;font-size:13px;color:#166534;line-height:1.6;}
        .ld-pub-err{background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:14px;font-size:13px;color:#991B1B;line-height:1.6;}
        .ld-spin{font-size:26px;animation:ldspin 1s linear infinite;display:block;margin-bottom:8px;}
        @keyframes ldspin{to{transform:rotate(360deg)}}
        .ld-loading{text-align:center;padding:24px 16px;color:#6B7280;font-size:13px;}
        .ld-dirty-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#FCD34D;margin-right:4px;flex-shrink:0;}
        .ld-last-pub{color:rgba(255,255,255,.35);font-size:11px;white-space:nowrap;}

        @media(max-width:600px){
            #ld-bar{padding:0 8px;gap:2px;height:52px;}
            .ld-hint-text,.ld-sep,.ld-last-pub{display:none;}
            .ld-brand{padding-right:8px;font-size:12px;}
            .ld-btn{padding:7px 10px;font-size:14px;}
            .ld-btn-label{display:none;}
            .ld-panel{left:6px;right:6px;width:auto;top:58px;max-height:calc(100dvh - 66px);overflow-y:auto;}
            .ld-pb{max-height:none;padding:14px;}
            .ld-ph{cursor:default;}
            .ld-f input[type=text],.ld-f input[type=url],.ld-f textarea,.ld-f select,.ld-f input[type=password],.ld-rich{font-size:16px;}
            .ld-cr input[type=color]{width:44px;height:38px;}
            .ld-ok,.ld-ko{font-size:15px;padding:11px;}
        }
        `;
        document.head.appendChild(s);
    }

    /* ─── EDITOR ─────────────────────────────────────────────── */
    const ED = {
        cms: {},
        panel: null,

        async start(srv) {
            injectCSS();
            let draft = {};
            try { draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}'); } catch (_) {}
            this.cms = { ...(srv || {}), ...draft };

            document.body.classList.add('ld-on');
            // Também adiciona go-on para que os cards não naveguem ao clicar
            document.body.classList.add('go-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildBar();
            this.bindAll();
            // Aguarda cards dinâmicos serem renderizados antes de injetar botões
            setTimeout(() => this.injectRemoveButtons(), 800);
            if (Object.keys(draft).length > 0) this.markDirty();
        },

        buildBar() {
            if (document.getElementById('ld-bar')) return;
            const bar = document.createElement('div');
            bar.id = 'ld-bar';
            const lastPub = localStorage.getItem('meguia_last_pub') || '';
            bar.innerHTML = `
            <div class="ld-brand"><span class="ld-dot"></span>Me Guia Editor</div>
            <span class="ld-hint-text">👆 Clique em qualquer elemento para editar</span>
            <div class="ld-spacer"></div>
            ${lastPub ? `<span class="ld-last-pub">Pub: ${lastPub}</span><div class="ld-sep"></div>` : ''}
            <button class="ld-btn" id="ld-add-pkg">➕ <span class="ld-btn-label">Pacote</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn orange" id="ld-colors">🎨 <span class="ld-btn-label">Cores</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn green" id="ld-pub">🚀 <span class="ld-btn-label">Publicar</span></button>
            <div class="ld-sep"></div>
            <button class="ld-btn" id="ld-revert" title="Descartar rascunho não publicado">↩ <span class="ld-btn-label">Reverter</span></button>
            <button class="ld-btn red" id="ld-exit">✕ <span class="ld-btn-label">Sair</span></button>`;
            document.body.prepend(bar);
            document.getElementById('ld-add-pkg').onclick = () => this.pAddPacote();
            document.getElementById('ld-colors').onclick  = () => this.pColors();
            document.getElementById('ld-pub').onclick     = () => this.publish();
            document.getElementById('ld-revert').onclick  = () => this.revert();
            document.getElementById('ld-exit').onclick    = () => this.exit();
        },

        bindAll() {
            if (this._ldDelegated) return;
            this._ldDelegated = true;
            document.addEventListener('click', e => {
                const el = e.target.closest('[data-eid]');
                if (el && document.body.classList.contains('ld-on')) {
                    if (e.target.closest('.ld-panel') || e.target.closest('#ld-bar')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    document.querySelectorAll('.ld-sel').forEach(x => x.classList.remove('ld-sel'));
                    el.classList.add('ld-sel');
                    this.dispatch(el);
                }
            }, true);
        },

        dispatch(el) {
            if (el.tagName === 'IMG')      this.pImage(el);
            else if (el.tagName === 'A')   this.pLink(el);
            else                           this.pText(el);
        },

        /* ── TEXTO ── */
        pText(el) {
            const origHTML  = el.innerHTML;
            const origStyle = el.getAttribute('style') || '';
            const cs = getComputedStyle(el);
            let colorChanged = false, sizeChanged = false;
            const p = this.panel_('✏️ Editar Texto — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-f"><label>Conteúdo</label>
                    <div class="ld-rich" contenteditable="true" id="ldr">${el.innerHTML}</div>
                    <div class="ld-fmts">
                        <button onmousedown="event.preventDefault();document.execCommand('bold')"><b>N</b></button>
                        <button onmousedown="event.preventDefault();document.execCommand('italic')"><i>I</i></button>
                        <button onmousedown="event.preventDefault();document.execCommand('underline')"><u>S</u></button>
                    </div>
                </div>
                <div class="ld-g2">
                    <div class="ld-f"><label>Cor do texto</label><input type="color" id="ldtc" value="${this.hex(cs.color)}"></div>
                    <div class="ld-f"><label>Tamanho (px)</label><input type="text" id="ldfs" value="${parseInt(cs.fontSize)||16}"></div>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            const rich = p.querySelector('#ldr');
            const tc   = p.querySelector('#ldtc');
            const fs   = p.querySelector('#ldfs');
            rich.oninput = () => el.innerHTML = rich.innerHTML;
            tc.oninput   = () => { colorChanged = true; el.style.color = tc.value; };
            fs.oninput   = () => { sizeChanged  = true; el.style.fontSize = fs.value + 'px'; };
            p.querySelector('#lda').onclick = () => {
                const styleOverride = {};
                if (colorChanged) styleOverride.color = tc.value;
                if (sizeChanged)  styleOverride.fontSize = fs.value + 'px';
                const entry = { html: el.innerHTML };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Texto salvo no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                this.closePanel();
            };
        },

        /* ── IMAGEM ── */
        pImage(el) {
            const origSrc = el.src;
            const origAttr = el.getAttribute('src') || el.src;
            const origFit = el.style.objectFit || getComputedStyle(el).objectFit || 'cover';
            const origPos = el.style.objectPosition || 'center';

            const p = this.panel_('🖼️ Trocar Imagem — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <div style="position:relative;width:100%;height:120px;border-radius:9px;overflow:hidden;background:#F3F4F6;margin-bottom:10px;">
                    <img id="ldprev" src="${origSrc}" style="width:100%;height:100%;object-fit:${origFit};object-position:${origPos};display:block;">
                </div>
                <div class="ld-f">
                    <label>Ajuste da imagem</label>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:4px;">
                        <button id="fit-cover"    style="padding:8px 4px;border:2px solid ${origFit==='cover'?'#1565C0':'#E5E7EB'};border-radius:8px;background:${origFit==='cover'?'#EFF6FF':'#fff'};cursor:pointer;font-size:11px;font-weight:700;color:#374151;transition:all .15s;">
                            ⬛ Preencher
                        </button>
                        <button id="fit-contain"  style="padding:8px 4px;border:2px solid ${origFit==='contain'?'#1565C0':'#E5E7EB'};border-radius:8px;background:${origFit==='contain'?'#EFF6FF':'#fff'};cursor:pointer;font-size:11px;font-weight:700;color:#374151;transition:all .15s;">
                            🔲 Centralizar
                        </button>
                        <button id="fit-initial"  style="padding:8px 4px;border:2px solid ${origFit==='initial'||origFit==='auto'?'#1565C0':'#E5E7EB'};border-radius:8px;background:${origFit==='initial'||origFit==='auto'?'#EFF6FF':'#fff'};cursor:pointer;font-size:11px;font-weight:700;color:#374151;transition:all .15s;">
                            📐 Original
                        </button>
                    </div>
                    <p class="ld-hint">Preencher = ocupa todo o espaço · Centralizar = imagem inteira visível · Original = tamanho real</p>
                </div>
                <div class="ld-f">
                    <label>Enviar do computador</label>
                    <button id="ldbtn" style="width:100%;padding:10px;border:2px dashed #E5E7EB;border-radius:8px;background:#F9FAFB;cursor:pointer;font-size:13px;color:#374151;transition:border .15s;">
                        📂 Escolher arquivo (JPG, PNG, WEBP)
                    </button>
                    <input type="file" id="ldfile" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none">
                    <div id="ldupstatus" class="ld-hint" style="margin-top:6px;"></div>
                </div>
                <div class="ld-f">
                    <label>Ou cole uma URL de imagem</label>
                    <input type="url" id="ldiu" value="${origAttr}" placeholder="https://site.com/foto.jpg">
                    <p class="ld-hint">Cole qualquer URL de imagem da internet (JPG, PNG, WEBP)</p>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;

            const ui     = p.querySelector('#ldiu');
            const pv     = p.querySelector('#ldprev');
            const btn    = p.querySelector('#ldbtn');
            const file   = p.querySelector('#ldfile');
            const status = p.querySelector('#ldupstatus');
            let debounce;
            let currentFit = origFit === 'initial' || origFit === 'auto' ? 'initial' : origFit;

            // Botões de object-fit
            const fitBtns = { cover: p.querySelector('#fit-cover'), contain: p.querySelector('#fit-contain'), initial: p.querySelector('#fit-initial') };
            function setFit(fit) {
                currentFit = fit;
                pv.style.objectFit = fit === 'initial' ? 'initial' : fit;
                el.style.objectFit = fit === 'initial' ? 'initial' : fit;
                Object.entries(fitBtns).forEach(([k, b]) => {
                    const active = k === fit;
                    b.style.borderColor = active ? '#1565C0' : '#E5E7EB';
                    b.style.background  = active ? '#EFF6FF' : '#fff';
                });
            }
            fitBtns.cover.onclick   = () => setFit('cover');
            fitBtns.contain.onclick = () => setFit('contain');
            fitBtns.initial.onclick = () => setFit('initial');

            // Botão abre seletor de arquivo
            btn.onclick = () => file.click();
            btn.onmouseenter = () => btn.style.borderColor = '#1565C0';
            btn.onmouseleave = () => btn.style.borderColor = '#E5E7EB';

            // Upload quando arquivo selecionado
            file.onchange = async () => {
                const f = file.files[0];
                if (!f) return;
                if (f.size > 3 * 1024 * 1024) {
                    status.textContent = '❌ Arquivo muito grande (máx 3MB). Comprima a imagem antes.';
                    status.style.color = '#DC2626';
                    return;
                }
                // Preview imediato com data URL
                const reader = new FileReader();
                reader.onload = async ev => {
                    const dataUrl = ev.target.result;
                    el.src = dataUrl;
                    pv.src = dataUrl;
                    btn.textContent = '⏳ Enviando…';
                    btn.disabled = true;
                    status.textContent = 'Enviando para o servidor…';
                    status.style.color = '#6B7280';
                    try {
                        const b64 = dataUrl.split(',')[1];
                        const secret = sessionStorage.getItem(SECRET_KEY) || localStorage.getItem(SECRET_KEY) || '';
                        const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ filename: f.name, base64: b64, secret })
                        });
                        const data = await res.json();
                        if (res.ok && data.url) {
                            // Atualiza slide + miniaturas com mesmo data-eid
                            document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                                if (e.tagName === 'IMG') e.src = data.url;
                            });
                            pv.src = data.url;
                            ui.value = data.url;
                            btn.textContent = '✅ Imagem enviada!';
                            status.textContent = 'Clique em ✓ Aplicar para salvar.';
                            status.style.color = '#16A34A';
                        } else {
                            throw new Error(data.error || 'Erro no upload');
                        }
                    } catch (err) {
                        el.src = origSrc;
                        pv.src = origSrc;
                        btn.textContent = '📂 Escolher arquivo';
                        btn.disabled = false;
                        status.textContent = '❌ ' + err.message;
                        status.style.color = '#DC2626';
                    }
                };
                reader.readAsDataURL(f);
            };

            // Preview por URL digitada
            ui.oninput = () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const v = ui.value.trim();
                    if (v) { el.src = v; pv.src = v; }
                }, 500);
            };
            p.querySelector('#lda').onclick = () => {
                clearTimeout(debounce);
                const src = ui.value.trim() || origSrc;
                pv.src = src;
                // Atualiza TODOS os elementos com o mesmo data-eid (ex: slide + miniatura)
                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                    if (e.tagName === 'IMG') {
                        e.src = src;
                        e.style.objectFit = currentFit === 'initial' ? 'initial' : currentFit;
                    }
                });
                const entry = { src };
                if (currentFit !== origFit) {
                    entry.style = { objectFit: currentFit === 'initial' ? 'initial' : currentFit };
                }
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Imagem salva no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.src = origSrc;
                el.style.objectFit = origFit;
                this.closePanel();
            };
        },

        /* ── LINK ── */
        pLink(el) {
            const origHTML   = el.innerHTML;
            const origStyle  = el.getAttribute('style') || '';
            const origHref   = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const cs = getComputedStyle(el);
            const p = this.panel_('🔗 Editar Botão/Link — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-f"><label>Texto</label><input type="text" id="ldbt" value="${el.textContent.trim()}"></div>
                <div class="ld-f"><label>Link (URL)</label><input type="url" id="ldbh" value="${origHref}" placeholder="https://wa.me/..."></div>
                <div class="ld-f"><label>Abrir em</label>
                    <select id="ldtgt">
                        <option value="_self" ${origTarget!=='_blank'?'selected':''}>Mesma aba</option>
                        <option value="_blank" ${origTarget==='_blank'?'selected':''}>Nova aba</option>
                    </select>
                </div>
                <div class="ld-g2">
                    <div class="ld-f"><label>Cor de fundo</label><input type="color" id="ldbbg" value="${this.hex(cs.backgroundColor)}"></div>
                    <div class="ld-f"><label>Cor do texto</label><input type="color" id="ldbfg" value="${this.hex(cs.color)}"></div>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            const bt  = p.querySelector('#ldbt');
            const bh  = p.querySelector('#ldbh');
            const tgt = p.querySelector('#ldtgt');
            const bbg = p.querySelector('#ldbbg');
            const bfg = p.querySelector('#ldbfg');
            let bgChanged = false, fgChanged = false;
            bt.oninput  = () => { const ic = el.querySelector('i'); el.textContent = bt.value; if(ic) el.prepend(ic.cloneNode(true)); };
            bbg.oninput = () => { bgChanged = true; el.style.backgroundColor = bbg.value; };
            bfg.oninput = () => { fgChanged = true; el.style.color = bfg.value; };
            p.querySelector('#lda').onclick = () => {
                el.setAttribute('href', bh.value);
                el.setAttribute('target', tgt.value);
                const styleOverride = {};
                if (bgChanged) styleOverride.backgroundColor = bbg.value;
                if (fgChanged) styleOverride.color = bfg.value;
                const entry = { html: el.innerHTML, href: bh.value, target: tgt.value };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Botão salvo no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                el.setAttribute('href', origHref);
                this.closePanel();
            };
        },

        /* ── BOTÕES DE REMOÇÃO NOS CARDS DA HOME ── */
        injectRemoveButtons() {
            document.querySelectorAll('article.card[id], a.card-link[id], article.card-link[id]').forEach(card => {
                if (!card.id) return;
                if (card.querySelector('.ld-remove-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'ld-remove-btn';
                btn.title = 'Remover este pacote';
                btn.innerHTML = '✕';
                btn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:99990;width:28px;height:28px;border-radius:50%;background:#DC2626;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.4);transition:all .15s;';
                btn.onmouseenter = () => btn.style.transform = 'scale(1.15)';
                btn.onmouseleave = () => btn.style.transform = '';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.confirmRemoveCard(card);
                };
                card.style.position = 'relative';
                card.appendChild(btn);
            });
        },

        confirmRemoveCard(article) {
            const title = article.querySelector('h3')?.textContent || article.id || 'este pacote';
            const p = this.panel_('🗑️ Remover Pacote');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-pub-err" style="margin-bottom:14px;">
                    ⚠️ Tem certeza que deseja <strong>remover</strong> o card <em>"${title}"</em> da página inicial?<br><br>
                    <span style="font-size:11px;opacity:.8;">Pode ser desfeito clicando em "Reverter" antes de publicar.</span>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda" style="background:#DC2626;">🗑️ Sim, remover</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = () => {
                article.style.transition = 'all .3s';
                article.style.opacity = '0';
                article.style.transform = 'scale(.95)';
                setTimeout(() => article.remove(), 320);

                const removed = this.cms.__removed_cards || [];
                if (!removed.includes(article.id)) removed.push(article.id);
                this.store('__removed_cards', removed);

                if (article.id.startsWith('card-new-')) {
                    const pkgId = article.id.replace('card-new-', '');
                    const newPkgs = this.cms.__new_packages || {};
                    if (newPkgs[pkgId]) {
                        delete newPkgs[pkgId];
                        this.store('__new_packages', newPkgs);
                    }
                }

                this.closePanel();
                this.toast('✓ Card removido do rascunho', 'ok');
            };
        },

        /* ── ADICIONAR NOVO PACOTE ── */
        pAddPacote() {
            const p = this.panel_('➕ Adicionar Novo Pacote');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Preencha os dados. O pacote será adicionado à lista e ficará disponível via <code>pacote.html?id=SEU_ID</code>.</div>
                <div class="ld-f"><label>ID do pacote (sem espaços)</label>
                    <input type="text" id="lp-id" placeholder="ex: cancun, dubai, paris2026">
                    <p class="ld-hint">Letras minúsculas, números e _ (underline). Ex: cancun, porto_galinhas</p>
                </div>
                <div class="ld-f"><label>Título</label><input type="text" id="lp-title" placeholder="Ex: Cancún All Inclusive"></div>
                <div class="ld-f"><label>Subtítulo</label><input type="text" id="lp-sub" placeholder="Ex: Paraíso caribenho com tudo pago"></div>
                <div class="ld-f"><label>Localização</label><input type="text" id="lp-loc" placeholder="Ex: Cancún, México"></div>
                <div class="ld-f"><label>Duração</label><input type="text" id="lp-dur" placeholder="Ex: 7 dias / 6 noites"></div>
                <div class="ld-f"><label>Preço (R$)</label><input type="text" id="lp-price" placeholder="Ex: 5.990,00"></div>
                <div class="ld-f"><label>Parcelas</label><input type="text" id="lp-parc" placeholder="Ex: 10x de R$ 599"></div>
                <div class="ld-f"><label>Flag / País</label><input type="text" id="lp-flag" placeholder="Ex: México 🇲🇽"></div>
                <div class="ld-f"><label>Imagem 1 — Principal (URL)</label>
                    <input type="url" id="lp-img" placeholder="https://images.unsplash.com/...">
                </div>
                <div class="ld-f"><label>Imagem 2 (URL) — opcional</label>
                    <input type="url" id="lp-img2" placeholder="https://images.unsplash.com/...">
                </div>
                <div class="ld-f"><label>Imagem 3 (URL) — opcional</label>
                    <input type="url" id="lp-img3" placeholder="https://images.unsplash.com/...">
                    <p class="ld-hint">As 3 imagens aparecem no carrossel da página do pacote.</p>
                </div>
                <div class="ld-f"><label>Descrição do destino</label>
                    <textarea id="lp-desc" rows="4" placeholder="Descreva o destino e os destaques do pacote…"></textarea>
                </div>
                <div class="ld-f"><label>O que está incluso</label>
                    <textarea id="lp-incluso" rows="5" placeholder="Um item por linha. Ex:&#10;Passagem aérea ida e volta&#10;Hotel com café da manhã&#10;Transfer In/Out"></textarea>
                    <p class="ld-hint">Um item por linha.</p>
                </div>
                <div class="ld-f"><label>Não incluso</label>
                    <textarea id="lp-nao" rows="3" placeholder="Um item por linha. Ex:&#10;Almoços e jantares&#10;Gorjetas"></textarea>
                </div>
                <div class="ld-f"><label>Roteiro (um dia por linha)</label>
                    <textarea id="lp-rot" rows="6" placeholder="Formato: Título do dia | Descrição&#10;Ex:&#10;Chegada a Cancún | Transfer ao resort. Check-in e tarde livre.&#10;Praia + Piscina | Dia de relaxamento no resort all inclusive."></textarea>
                    <p class="ld-hint">Separe título e descrição com <strong>|</strong>. Um dia por linha.</p>
                </div>
                <div class="ld-acts" style="margin-top:16px;">
                    <button class="ld-ok" id="lda">✓ Criar Pacote</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = () => {
                const id    = p.querySelector('#lp-id').value.trim().replace(/[^a-z0-9_]/gi,'_').toLowerCase();
                const title = p.querySelector('#lp-title').value.trim();
                const img1  = p.querySelector('#lp-img').value.trim();
                const img2  = p.querySelector('#lp-img2').value.trim();
                const img3  = p.querySelector('#lp-img3').value.trim();

                if (!id)    { p.querySelector('#lp-id').focus();    p.querySelector('#lp-id').style.borderColor='#DC2626';    return; }
                if (!title) { p.querySelector('#lp-title').focus(); p.querySelector('#lp-title').style.borderColor='#DC2626'; return; }

                const incluso  = p.querySelector('#lp-incluso').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const nao      = p.querySelector('#lp-nao').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const rotLines = p.querySelector('#lp-rot').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const roteiro  = rotLines.map((line, i) => {
                    const [t, d] = line.split('|').map(s=>s.trim());
                    return { dia: (i+1) + 'º Dia', title: t || ('Dia ' + (i+1)), desc: d || '' };
                });

                const images = [img1, img2, img3].filter(Boolean);
                if (!images.length) images.push('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80');

                const novoPacote = {
                    title,
                    subtitle:    p.querySelector('#lp-sub').value.trim(),
                    location:    p.querySelector('#lp-loc').value.trim(),
                    duration:    p.querySelector('#lp-dur').value.trim(),
                    price:       p.querySelector('#lp-price').value.trim(),
                    parcelas:    p.querySelector('#lp-parc').value.trim(),
                    flag:        p.querySelector('#lp-flag').value.trim(),
                    images,
                    desc:        p.querySelector('#lp-desc').value.trim(),
                    incluso,
                    nao_incluso: nao,
                    roteiro
                };

                const existing = this.cms.__new_packages || {};
                existing[id] = novoPacote;
                this.store('__new_packages', existing);

                // Injetar card imediatamente na home
                applyContent({ __new_packages: { [id]: novoPacote } });
                // Adicionar botão de remoção no novo card
                setTimeout(() => this.injectRemoveButtons(), 100);

                this.closePanel();
                this.toast('✓ Pacote "' + title + '" criado! Acesse: pacote.html?id=' + id, 'ok');

                setTimeout(() => {
                    const info = document.createElement('div');
                    info.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0F2460;color:#fff;padding:14px 22px;border-radius:12px;font-size:13px;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,.4);text-align:center;border:1px solid rgba(255,255,255,.15);';
                    info.innerHTML = `📦 Pacote criado!<br><a href="pacote.html?id=${id}" style="color:#E8B84B;font-weight:700;" target="_blank">→ Abrir pacote.html?id=${id}</a><br><span style="font-size:11px;opacity:.6;margin-top:4px;display:block;">Publique para tornar permanente.</span>`;
                    document.body.appendChild(info);
                    setTimeout(() => info.remove(), 7000);
                }, 400);
            };
        },

        /* ── CORES GLOBAIS ── */
        pColors() {
            const root = document.documentElement;
            const g = v => getComputedStyle(root).getPropertyValue(v).trim() || '#000000';
            const p = this.panel_('🎨 Cores Globais do Site');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info">Altera as cores em todo o site de uma vez.</div>
                <div class="ld-cr"><label>🔵 Azul principal (navy)</label><input type="color" id="ldg1" value="${this.hex(g('--navy'))||'#1B3A8C'}"></div>
                <div class="ld-cr"><label>🔵 Azul escuro</label><input type="color" id="ldg2" value="${this.hex(g('--navy-dark'))||'#0F2460'}"></div>
                <div class="ld-cr"><label>🟡 Dourado destaque</label><input type="color" id="ldg3" value="${this.hex(g('--accent'))||'#E8B84B'}"></div>
                <div class="ld-cr"><label>⬛ Texto principal</label><input type="color" id="ldg4" value="${this.hex(g('--text'))||'#1A1F2E'}"></div>
                <div class="ld-cr"><label>🟩 WhatsApp verde</label><input type="color" id="ldg5" value="${this.hex(g('--wa'))||'#25D366'}"></div>
                <hr class="ld-hr">
                <div class="ld-f"><label>📱 Número do WhatsApp</label>
                    <input type="text" id="ldgwa" value="${this.cms.whatsapp||''}" placeholder="554299732517">
                    <p class="ld-hint">Somente números com código do país. Atualiza todos os botões do site.</p>
                </div>
                <div class="ld-acts">
                    <button class="ld-ok" id="lda">✓ Aplicar cores</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;
            const vars   = ['--navy','--navy-dark','--accent','--text','--wa'];
            const inputs = ['ldg1','ldg2','ldg3','ldg4','ldg5'].map(id => p.querySelector('#'+id));
            const waInp  = p.querySelector('#ldgwa');
            inputs.forEach((inp, i) => {
                inp.oninput = () => root.style.setProperty(vars[i], inp.value);
            });
            waInp.oninput = () => {
                const num = waInp.value.replace(/\D/g, '');
                if (num) document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + num);
                });
            };
            p.querySelector('#lda').onclick = () => {
                const colors = {};
                vars.forEach((v, i) => colors[v] = inputs[i].value);
                this.cms.colors = { ...(this.cms.colors || {}), ...colors };
                const num = waInp.value.replace(/\D/g, '');
                if (num) this.cms.whatsapp = num;
                localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
                this.markDirty();
                this.closePanel();
                this.toast('✓ Cores salvas no rascunho', 'ok');
            };
            p.querySelector('#ldc').onclick = () => {
                vars.forEach(v => root.style.removeProperty(v));
                applyContent(this.cms);
                this.closePanel();
            };
        },

        /* ── REVERTER ── */
        revert() {
            const hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0;
            if (!hasDraft) { this.toast('Não há rascunho para descartar', ''); return; }
            if (!confirm('Descartar todas as alterações não publicadas? O site voltará ao conteúdo que está publicado.')) return;
            localStorage.removeItem(CMS_KEY);
            document.querySelectorAll('.ld-dirty-dot').forEach(d => d.remove());
            this.toast('Rascunho descartado. Recarregando…', '');
            setTimeout(() => location.reload(), 900);
        },

        /* ── PUBLICAR ── */
        async publish() {
            // Resumo do que será publicado
            const elems   = Object.keys(this.cms).filter(k => k !== 'colors' && k !== 'whatsapp');
            const hasCols = this.cms.colors && Object.keys(this.cms.colors).length > 0;
            const hasWA   = !!this.cms.whatsapp;
            const total   = elems.length + (hasCols ? 1 : 0) + (hasWA ? 1 : 0);

            if (total === 0) {
                this.toast('Nenhuma alteração para publicar', '');
                return;
            }

            let items = '';
            if (elems.length) items += `<li>${elems.length} elemento(s) de texto/imagem editados</li>`;
            if (hasCols) items += `<li>Cores globais do site</li>`;
            if (hasWA)   items += `<li>Número do WhatsApp: ${this.cms.whatsapp}</li>`;

            const hasSavedSecret = !!sessionStorage.getItem(SECRET_KEY);
            const p = this.panel_('🚀 Publicar no Site');
            p.innerHTML += `<div class="ld-pb">
                <div class="ld-info" style="background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:10px;padding:14px;margin-bottom:14px;line-height:1.8;">
                    <strong>O que será publicado:</strong><ul style="margin:8px 0 0 16px;">${items}</ul>
                </div>
                ${!hasSavedSecret ? `<div class="ld-f"><label>🔑 Senha de acesso</label>
                    <input type="password" id="ldpwd" placeholder="Digite sua senha" style="width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;">
                </div>` : ''}
                <p class="ld-hint">Estas mudanças ficarão visíveis para todos os visitantes imediatamente.</p>
                <div class="ld-acts" style="margin-top:14px;">
                    <button class="ld-ok" id="lda">✓ Confirmar e publicar</button>
                    <button class="ld-ko" id="ldc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#ldc').onclick = () => this.closePanel();
            p.querySelector('#lda').onclick = async () => {
                const pwdEl = p.querySelector('#ldpwd');
                let secret = sessionStorage.getItem(SECRET_KEY) || localStorage.getItem(SECRET_KEY) || '';
                if (pwdEl) {
                    if (!pwdEl.value) { pwdEl.focus(); pwdEl.style.borderColor='#DC2626'; return; }
                    secret = pwdEl.value;
                    sessionStorage.setItem(SECRET_KEY, secret);
                    localStorage.setItem(SECRET_KEY, secret);
                }
                p.querySelector('.ld-pb').innerHTML = `<div class="ld-loading"><span class="ld-spin">⏳</span>Publicando alterações…</div>`;
                try {
                    const res = await fetch('/api/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: this.cms, secret })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        localStorage.removeItem(CMS_KEY);
                        const now = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
                        localStorage.setItem('meguia_last_pub', now);
                        document.querySelectorAll('.ld-dirty-dot').forEach(d => d.remove());
                        const lp = document.querySelector('.ld-last-pub');
                        if (lp) lp.textContent = 'Pub: ' + now;
                        applyContent(this.cms);
                        p.querySelector('.ld-pb').innerHTML = `
                            <div class="ld-pub-box">✅ <strong>Publicado com sucesso!</strong><br>
                            Visitantes verão as mudanças em alguns segundos.</div>
                            <button class="ld-ok" style="width:100%;margin-top:12px" onclick="this.closest('.ld-panel').remove()">✓ OK</button>`;
                        this.toast('✅ Publicado!', 'ok');
                    } else {
                        throw new Error(data.error || 'Erro desconhecido');
                    }
                } catch (err) {
                    p.querySelector('.ld-pb').innerHTML = `
                        <div class="ld-pub-err">❌ <strong>Erro:</strong> ${err.message}</div>
                        <button class="ld-ko" style="width:100%;margin-top:12px" onclick="this.closest('.ld-panel').remove()">Fechar</button>`;
                    this.toast('❌ Erro ao publicar', 'err');
                }
            };
        },

        /* ── SAIR ── */
        exit() {
            let hasDraft = false;
            try { hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0; } catch (_) {}
            if (hasDraft && !confirm('Sair do editor? Você tem alterações não publicadas (rascunho salvo).')) return;
            sessionStorage.removeItem('editor_active');
            sessionStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(SECRET_KEY);
            const u = new URL(location.href);
            u.searchParams.delete('editor');
            location.replace(u.toString());
        },

        /* ── HELPERS ── */
        panel_(title) {
            this.closePanel();
            const p = document.createElement('div');
            p.className = 'ld-panel';
            p.innerHTML = `<div class="ld-ph"><h3>${title}</h3><button class="ld-px" title="Fechar">✕</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.ld-px').onclick = () => this.closePanel();
            this.drag_(p);
            this.panel = p;
            return p;
        },

        closePanel() {
            document.querySelectorAll('.ld-panel').forEach(x => x.remove());
            document.querySelectorAll('.ld-sel').forEach(x => x.classList.remove('ld-sel'));
            this.panel = null;
        },

        drag_(el) {
            if (window.matchMedia('(max-width:600px)').matches) return; // sem drag em mobile
            const h = el.querySelector('.ld-ph');
            let d=false, sx=0, sy=0, ox=0, oy=0;
            h.onmousedown = e => { d=true; sx=e.clientX; sy=e.clientY; ox=el.offsetLeft; oy=el.offsetTop; e.preventDefault(); };
            document.addEventListener('mousemove', e => { if(!d) return; el.style.left=ox+e.clientX-sx+'px'; el.style.top=oy+e.clientY-sy+'px'; });
            document.addEventListener('mouseup', () => d=false);
        },

        store(key, val) {
            // ── Mapeamento: campo do CMS → campo do DB ──
            const DB_FIELDS = {
                'pkg-price':        'price',
                'pkg-price-cartao': 'priceCartao',
                'pkg-parcelas':     'parcelas',
                'pkg-title':        'title',
                'pkg-subtitle':     'subtitle',
                'pkg-badge':        'badge',
                'pkg-desc':         'desc',
            };
            const HOME_FIELDS = {
                'pix':    'priceCartao',
                'parcel': 'parcelas',
                'titulo': 'title',
                'dest':   'location',
                'badge':  'badge',
            };

            // Extrai valor limpo — "No cartão: <strong>R$ 2.550,00</strong>" → "2.550,00"
            function extractValue(html, dbField) {
                if (!html) return '';
                const plain = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
                if (dbField === 'priceCartao' || dbField === 'price') {
                    const m = plain.match(/R\$\s*([\d.,]+)/);
                    return m ? m[1] : plain;
                }
                return plain;
            }

            // Detecta padrão da PÁGINA DO PACOTE: "gramado-pkg-price"
            const pkgMatch = key.match(/^([a-z0-9_]+)-pkg-(.+)$/);
            if (pkgMatch) {
                const [, pkgId, field] = pkgMatch;
                const dbField = DB_FIELDS['pkg-' + field];
                if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
                    const overrides = this.cms.__db_overrides || {};
                    if (!overrides[pkgId]) overrides[pkgId] = {};
                    const rawVal = val.html != null
                        ? extractValue(val.html, dbField)
                        : (val.text || '');
                    if (rawVal) overrides[pkgId][dbField] = rawVal;
                    this.cms.__db_overrides = overrides;
                    Object.assign(DB[pkgId], overrides[pkgId]);
                }
            }

            // Detecta padrão da HOME: "pix-gramado"
            const homeMatch = key.match(/^(pix|parcel|titulo|dest|badge)-([a-z0-9_]+)$/);
            if (homeMatch) {
                const [, field, pkgId] = homeMatch;
                const dbField = HOME_FIELDS[field];
                if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
                    const overrides = this.cms.__db_overrides || {};
                    if (!overrides[pkgId]) overrides[pkgId] = {};
                    const rawVal = val.html != null
                        ? extractValue(val.html, dbField)
                        : (val.text || '');
                    if (rawVal) overrides[pkgId][dbField] = rawVal;
                    this.cms.__db_overrides = overrides;
                    Object.assign(DB[pkgId], overrides[pkgId]);
                }
            }

            // Salva normalmente também
            this.cms[key] = val;
            localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
            this.markDirty();
        },

        markDirty() {
            const btn = document.getElementById('ld-pub');
            if (btn && !btn.querySelector('.ld-dirty-dot')) {
                const dot = document.createElement('span');
                dot.className = 'ld-dirty-dot';
                btn.prepend(dot);
            }
        },

        toast(msg, type='') {
            document.querySelectorAll('.ld-toast').forEach(t => t.remove());
            const t = document.createElement('div');
            t.className = 'ld-toast' + (type?' '+type:'');
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 320); }, 3000);
        },

        hex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
            if (rgb.startsWith('#')) return rgb;
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return '#ffffff';
            return '#' + m.slice(0,3).map(n => (+n).toString(16).padStart(2,'0')).join('');
        }
    };

    /* ─── BOOT ──────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', async () => {
        const srv = await fetchContent();   // 1 único fetch para toda a sessão
        await loadAndApply(srv);
        if (editMode) {
            await ED.start(srv);            // reutiliza dados já carregados
            setTimeout(() => ED.bindAll(), 500);
        }
    });

    window._LD = ED;
})();
