// Level definitions - barrel positions, farmer position, shots allowed
const LEVELS = [
    {
        // Level 1: Simple direct shot
        barrels: [],
        farmer: { x: 600, y: null }, // y set dynamically based on ground
        shots: 3,
        name: "Первый удар"
    },
    {
        // Level 2: One obstacle barrel in the way
        barrels: [
            { x: 400, y: null, r: 25 }
        ],
        farmer: { x: 700, y: null },
        shots: 3,
        name: "Препятствие"
    },
    {
        // Level 3: Farmer behind two barrels
        barrels: [
            { x: 350, y: null, r: 25 },
            { x: 500, y: null, r: 30 }
        ],
        farmer: { x: 750, y: null },
        shots: 4,
        name: "Двойная защита"
    },
    {
        // Level 4: Elevated farmer (on barrels)
        barrels: [
            { x: 550, y: null, r: 25 },
            { x: 550, y: null, r: 25, stackOn: 0 },
            { x: 300, y: null, r: 20 }
        ],
        farmer: { x: 700, y: null, elevated: true },
        shots: 4,
        name: "Высотная цель"
    },
    {
        // Level 5: Chain reaction challenge
        barrels: [
            { x: 300, y: null, r: 22 },
            { x: 420, y: null, r: 28 },
            { x: 520, y: null, r: 22 },
            { x: 620, y: null, r: 25 }
        ],
        farmer: { x: 800, y: null },
        shots: 3,
        name: "Цепная реакция"
    }
];
