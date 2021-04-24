import React from "react";
import { Provider, TypedUseSelectorHook, useSelector } from "react-redux"
import { LD48State, store } from "../store";

import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    HashRouter
} from "react-router-dom";
import { KM_PER_TICK, KM_TO_TRAVEL, TICKS_TO_WIN } from "../constants";

const useGameState: TypedUseSelectorHook<LD48State> = useSelector

export function GamePrompt(props: {}) {
    const activity = useGameState(state => state.activity);

    if (!activity || activity.type !== 'prompt') {
        return (<></>);
    }

    return (
        <div>
            <p>{activity.message}</p>
            {activity.options.map((opt, ix) => (
                <button key={ix} onClick={() => {
                    store.dispatch({
                        type: 'resolve-prompt',
                        result: opt.result
                    });
                }}>
                    {opt.message}
                </button>
            ))}
        </div>
    )
}

function toKm(tick: number) {
    return Math.floor(tick * KM_PER_TICK);
}

export function UIPanel(props: {
    children?: JSX.Element;
    style?: React.CSSProperties
}) {
    return (
        <div style={{
            padding: 10,
            backgroundColor: 'white',
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            borderRadius: 5,
            borderBottom: '4px solid black',
            ...props.style
        }}>
            {props.children}
        </div>
    )
}

export function Game() {
    const state = useGameState(state => state)

    return (
        <div style={{
            margin: 10
        }}>
            <div style={{ display: 'flex', width: '100%' }}>
                <UIPanel style={{ flex: 1, marginRight: 10 }}>
                    <div style={{
                        textAlign: 'center',
                        height: 40,
                        backgroundColor: state.paused ? '#f1aaaa' : '#aaaaf1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pointerEvents: 'all',
                        cursor: 'pointer',
                        borderRadius: 40
                    }} onClick={ev => {
                        store.dispatch({
                            type: 'pause',
                            value: !state.paused
                        });
                    }}>
                        <p style={{
                            fontSize: 24,
                            flex: 1
                        }}>
                            {state.paused ? 'Un-Pause' : 'Pause'}
                        </p>
                        <p style={{
                            fontSize: 14,
                            flex: 1
                        }}>
                            (Space)
                        </p>
                    </div>
                </UIPanel>
                <UIPanel style={{ flex: 9 }}>
                    <div style={{
                        backgroundColor: '#f1f1f1',
                        height: 40,
                        width: 'calc(100%-12px)',
                        padding: 4,
                        margin: 0,
                        textAlign: 'center',
                        position: 'relative',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            height: 40,
                            backgroundColor: '#00aaff',
                            borderRadius: 4,
                            top: 0,
                            borderTop: '4px solid #44ccff',
                            width: ((state.tick / TICKS_TO_WIN) * 100).toString() + '%'
                        }}>
                        </div>
                        <p style={{
                            color: 'black',
                            fontSize: 24,
                            lineHeight: 40,
                            width: '100%',
                            zIndex: 100,
                            position: 'relative'
                        }}>{toKm(state.tick)} km / {KM_TO_TRAVEL} km</p>
                    </div>
                </UIPanel>
            </div>
            <div style={{
                // border: '1px solid white',
                // background: '#ffffff',
                // padding: 20,
                // pointerEvents: 'all'
            }}>
                <h4>{state.tick * 1000} km</h4>
                <p style={{ color: 'black', }}>{state.money.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                <p style={{ color: 'black', }}>{state.fuel} kgs</p>
                {/* <GamePrompt /> */}
            </div>

            <div style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                width: '20vw',
                height: '30vh',
                display: 'flex'
            }}>
                <UIPanel style={{
                    flex: 1
                }}>
                    <div></div>
                </UIPanel>
            </div>
        </div>
    );
}

export function App() {
    return (
        <Provider store={store}>
            <Game />
        </Provider>
    );
}