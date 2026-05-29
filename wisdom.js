const HORSE_WISDOMS = [
    "Не смотри на бочку — смотри на фермера. Бочка лишь средство.",
    "Чем сильнее оттянешь — тем дальше полетишь. В жизни и в игре.",
    "Лошадь не спрашивает разрешения, чтобы пнуть. Будь как лошадь.",
    "Если бочка не разбилась с первого раза — это не провал, это разминка.",
    "Фермер думает, что он главный. Пока не прилетит бочка.",
    "Мудрая лошадь не тратит все удары на первом уровне.",
    "Задние ноги — это не баг, это фича.",
    "Каждая бочка учит тебя траектории. Каждый промах — терпению.",
    "Шляпа на лошади — это не мода. Это аэродинамика.",
    "Если ты упал — встань, отряхнись и пни ещё раз.",
    "Настоящая лошадь никогда не извиняется за свой удар.",
    "Бочки приходят и уходят. Фермеры тоже. Лошадь остаётся.",
    "Траектория — это путь воина. Парабола — это судьба.",
    "Не бойся промахнуться. Бойся не пнуть вообще.",
    "Сено вкуснее после победы. Проверено.",
    "Угол 45 градусов — оптимальный. Для бочек и для жизни.",
    "Фермер носит шляпу, чтобы защитить голову. Но это не помогает.",
    "Лучший совет: просто пни. Остальное — физика.",
    "Лошадиная мудрость №19: иго-го.",
    "Когда сомневаешься — увеличь силу удара."
];

class HorseWisdom {
    constructor() {
        this.btn = document.getElementById('wisdomBtn');
        this.modal = document.getElementById('wisdomModal');
        this.textEl = document.getElementById('wisdomText');
        this.closeBtn = document.getElementById('wisdomClose');
        this.nextBtn = document.getElementById('wisdomNext');
        this.lastIndex = -1;

        if (this.btn && this.modal) {
            this.btn.addEventListener('click', () => this.show());
            this.closeBtn.addEventListener('click', () => this.hide());
            this.nextBtn.addEventListener('click', () => this.showRandom());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.hide();
            });
        }
    }
    showRandom() {
        let idx;
        do { idx = Math.floor(Math.random() * HORSE_WISDOMS.length); }
        while (idx === this.lastIndex && HORSE_WISDOMS.length > 1);
        this.lastIndex = idx;
        if (this.textEl) this.textEl.textContent = HORSE_WISDOMS[idx];
    }
    show() {
        this.showRandom();
        this.modal.classList.remove('hidden');
        audio.init();
    }
    hide() {
        this.modal.classList.add('hidden');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HorseWisdom());
} else {
    new HorseWisdom();
}
