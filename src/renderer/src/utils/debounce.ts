//base taken from: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce

/**
 * 
 * @param fn Function to debounce
 * @param wait Number of milliseconds to delay (`>= 0` and `<= Infinity`)
 * @param immediate Option to execute function immediately 
 * @returns Function
 * 
 * @example
 * import { debounce } from './debounce'
 * 
 * document.body.addEventListener('click', debounce(() => {
 *  console.log("Executed!");
 * }))
 */
export function debounce(fn: () => any, wait: number | undefined, immediate?: boolean): () => any {
    let timeout: string | number | NodeJS.Timeout | undefined;

    return function(this: any, ...args: []) {
        clearTimeout(timeout as string | number | NodeJS.Timeout | undefined);

        timeout = setTimeout(() => {
            timeout = undefined;

            if(!immediate) {
                fn.apply(this, args as any);
            }
        }, (wait as number) >= 0 && (wait as number) <= Infinity ? wait : undefined);

        if(immediate && !timeout) {
            fn.apply(this, args as any);
        }
    };
}