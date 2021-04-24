interface XY { x: number; y: number; }

export function xy(input: XY): XY {
    return {
        x: input.x,
        y: input.y
    };
}

export function left(p1: XY, p2: XY) {
    return p1.x < p2.x;
}

export function right(p1: XY, p2: XY) {
    return p1.x < p2.x;
}

export function midpoint(p1: XY, p2: XY): XY {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    }
}

export function addxy(p: XY, x: number | XY, y?: number): XY {
    if (typeof x === "number") {
        if (!y) y = 0;
        return {
            x: p.x + x,
            y: p.y + y,
        };
    } else {
        return {
            x: p.x + x.x,
            y: p.y + x.y
        }
    }
}

export function timesxy(p: XY, c: number): XY {
    return {
        x: p.x * c,
        y: p.y * c,
    };
}

export function assignPos(
    copyFrom: XY,
    copyTo: XY,
    deltaX: number = 0,
    deltaY: number = 0
) {
    copyTo.x = copyFrom.x + deltaX;
    copyTo.y = copyFrom.y + deltaY;
}

export function lerp(value1: number, value2: number, amount: number) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}

export function depthSet(obj: { depth: number; setDepth(v: number): void; }, baseDepth: number, objY: number, compY: number, delta: number, deltaRange: number) {
    let targetDepth = obj.depth;

    if (objY > compY) {
        targetDepth = baseDepth + delta;
    } else {
        targetDepth = baseDepth - (deltaRange - delta);
    }

    if (targetDepth !== obj.depth) {
        obj.setDepth(targetDepth);
    }
}

export function lerpPos(
    src: XY,
    dest: XY,
    delta: number
) {
    src.x = lerp(src.x, dest.x, delta);
    src.y = lerp(src.y, dest.y, delta);
}

// Stolen from
// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function sqr(x: number) { return x * x }
export function dist2(v: XY, w: XY) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p: XY, v: XY, w: XY) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    });
}
export function distToSegment(p: XY, v: XY, w: XY) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

export interface Line {
    p1: XY;
    p2: XY
}

export function getLineSegmentIntersection(line1: Line, line2: Line): XY | null {
    let s1_x, s1_y, s2_x, s2_y;

    s1_x = line1.p2.x - line1.p1.x; s1_y = line1.p2.y - line1.p1.y;
    s2_x = line2.p2.x - line2.p1.x; s2_y = line2.p2.y - line2.p1.y;

    let s, t;
    s = (-s1_y * (line1.p1.x - line2.p1.x) + s1_x * (line1.p1.y - line2.p1.y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (line1.p1.y - line2.p1.y) - s2_y * (line1.p1.x - line2.p1.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected
        return {
            x: line1.p1.x + (t * s1_x),
            y: line1.p1.y + (t * s1_y)
        }
    }

    return null;
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export type DiceConfig = {
    nDice: number,
    nSides: number,
    modifier?: number,
    rollModifier?: number,
}

export function rollDice(config: DiceConfig) {
    let result = 0;

    for (let i = 0; i < config.nDice; i++) {
        result += 1 + Math.ceil(Math.random() * config.nSides);
        result += config.rollModifier;
    }

    result += config.modifier;
    return result;
}

export type CheckDiceConfig = DiceConfig & {
    value: number;
    type: 'lt' | 'lte' | 'gt' | 'gte';
}
export function checkDice(config: CheckDiceConfig) {
    const roll = rollDice(config);
    switch(config.type) {
        case 'lt': return roll < config.value;
        case 'lte': return roll <= config.value;
        case 'gt': return roll > config.value;
        case 'gte': return roll <= config.value;
    }
}