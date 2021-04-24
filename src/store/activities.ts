import { Activity } from ".";
export function getActivity(tick: number): Activity | undefined {
    const r = Math.random()*100;

    if (r < 30) {
        return {
            type: 'prompt',
            title: 'Fueling Station',
            message: 'There is a fueling station here. Do you want to buy some fuel for the journey?',
            options: [
                {
                    message: '1 kg',
                    result: {
                        resources: {
                            money: -100,
                            fuel: 1
                        }
                    }
                },
                {
                    message: '5 kg',
                    result: {
                        resources: {
                            money: -450,
                            fuel: 5
                        }
                    }
                },
                {
                    message: '10 kg',
                    result: {
                        resources: {
                            money: -850,
                            fuel: 10
                        },
                    }
                },
                {
                    message: 'Decline',
                    result: {
                        resources: {},
                    }
                },
            ]
        }
    }
}