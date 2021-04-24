import { createStore } from 'redux'
import { getActivity } from './activities';

export type LD48Action = {
    type: 'advance'
} | {
    type: 'pause';
    value: boolean;
} | {
    type: 'resolve-prompt';
    result: PromptResult;
} | {
    type: 'submit-battle-move';
    move: BattleMove
}

export type BattleMove = {
    type: 'flee'
} | {
    type: 'attack'
}

export type LD48State = {
    money: number;
    fuel: number;
    tick: number;
    paused: boolean;
    gameOver: boolean;
    activity?: Activity;
    shipStats: {
        agility: number;
        offense: number;
    }
};

export type Activity = {
    type: 'prompt';
    title: string;
    message: string;
    options: {
        message: string;
        result: PromptResult
    }[]
} | {
    type: 'battle',
    enemy: {
        name: string;
        description: string;
        fleeChance: number;
        chanceToHit: number;
    }
}

export type PromptResult = {
    resources: {
        money?: number;
        fuel?: number;
    }
}

const initialState: LD48State = {
    money: 1000,
    fuel: 100,
    tick: 0,
    paused: false,
    gameOver: false,
    shipStats: {
        agility: 1,
        offense: 0
    }
}

type BaseShipObject<TType extends string, TProps> = {
    position: XY;
    type: TType;
} & TProps;

function appReducer(state = initialState, action: LD48Action): LD48State {
    // console.log("----------------------------");
    // console.log('action:', action);
    const newState = _appReducer(state, action);
    // console.log('state', newState);
    // console.log("----------------------------");
    return newState;
}

function resolvePrompt(state: LD48State, result: PromptResult): LD48State {
    const ret: LD48State = {
        ...state,
        activity: undefined
    };

    ret.fuel += result.resources.fuel || 0;
    ret.money += result.resources.money || 0;

    if (ret.money < 0) {
        return { ...state };
    }

    return ret;
}

function handleBattleMove(state: LD48State, move: BattleMove) {
    if (state.activity?.type !== "battle") {
        return {
            ...state
        }
    }

    switch(move.type) {
        case 'attack':
            break;
        case 'flee':
            break;
    }
}

function advanceToNextSector(state: LD48State): LD48State {
    if (state.activity) {
        return { ...state };
    }

    const ret: LD48State = {
        ...state,
        tick: state.tick + 1,
        fuel: state.fuel - 1,
        activity: undefined
    };

    if (ret.fuel < 0) {
        return {
            ...ret,
            fuel: 0,
            gameOver: true
        };
    }

    ret.activity = getActivity(state.tick)

    return ret;
}


function _appReducer(state = initialState, action: LD48Action): LD48State {
    switch (action.type) {
        case 'advance':
            return advanceToNextSector(state);
        case 'resolve-prompt':
            return resolvePrompt(state, action.result);
        case 'submit-battle-move':
            return handleBattleMove(state, action.move);
        case 'pause':
            return {
                ...state,
                paused: action.value
            };
    }

    return state;
}

export const store = createStore(appReducer)
