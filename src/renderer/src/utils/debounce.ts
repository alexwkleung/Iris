//base taken from: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce

export function debounce(func: () => any, wait: number | undefined, immediate?: boolean): () => any {
    let timeout: string | number | NodeJS.Timeout | undefined;

    return function(this: any) {
        //eslint-disable-next-line
        const context: any = this;

        //eslint-disable-next-line
        const args = arguments;

        clearTimeout(timeout as string | number | NodeJS.Timeout | undefined);

        timeout = setTimeout(() => {
            timeout = undefined;

            if(!immediate) {
                func.apply(context, args as any);
            }
        }, (wait as number) >= 0 && (wait as number) <= Infinity ? wait : undefined);

        if(immediate && !timeout) {
            func.apply(context, args as any);
        }
    };
}