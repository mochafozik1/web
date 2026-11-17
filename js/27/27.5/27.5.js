(async () => {
    const draw = document.getElementById('draw');
    const ctx = draw.getContext('2d');

   
    let languages;
    try {
        const r = await window.fetch('27.5.json');
        if (!r.ok)
            throw new Error(`Сервер ответил: ${r.status} ${r.statusText}`);
        languages = await r.json();
    } catch (e) {
        document.getElementById('error').textContent =
            'Не удалось загрузить данные: ' + e.message +
            '. Откройте страницу через веб-сервер (http://localhost:8080/27.5.html).';
        return;
    }

    
    const GAP = 5;
    const SCALE_W = 40;
    const LABEL_H = 25;
    const BOTTOM_PAD = 8;
    const MAX_VALUE = 20;
    const STEP = 2;

  
    ctx.font = '20px sans-serif';
    let bw = 0;
    for (const lang of languages) {
        const w = ctx.measureText(lang[0]).width;
        if (bw < w)
            bw = w;
    }
    bw = Math.ceil(bw);

    const n = languages.length;
    draw.width = SCALE_W + bw * n + GAP * (n - 1);
    

    const chartTop = LABEL_H;
    const chartBottom = draw.height - BOTTOM_PAD;
    const chartH = chartBottom - chartTop;
    const yOf = v => chartBottom - chartH * v / MAX_VALUE;

    
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(SCALE_W - 0.5, chartTop);
    ctx.lineTo(SCALE_W - 0.5, chartBottom);
    for (let v = 0; v <= MAX_VALUE; v += STEP) {
        const y = Math.round(yOf(v)) + 0.5;
        ctx.moveTo(SCALE_W - 5, y);
        ctx.lineTo(SCALE_W - 0.5, y);
        ctx.fillText(v, SCALE_W - 8, y);
    }
    ctx.stroke();

    
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    for (let i = 0; i < n; ++i) {
        const [name, rating] = languages[i];
        const h = chartH * rating / MAX_VALUE;
        const x = SCALE_W + i * (bw + GAP);
        const y = chartBottom - h;

      
        const grd = ctx.createLinearGradient(0, chartBottom, 0, y);
        grd.addColorStop(0, 'lightgrey');
        grd.addColorStop(1, 'black');
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, bw, h);

        
        ctx.fillStyle = 'black';
        ctx.fillText(name, x + bw / 2, y, bw);
    }
})();