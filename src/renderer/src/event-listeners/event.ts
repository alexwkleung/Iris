interface IEvent<
    T extends HTMLElement | Window & typeof globalThis | Element, 
    Z extends string, 
    K extends any | unknown, 
    X extends boolean | undefined, 
    Y extends string | undefined
    > {
    createDisposableEvent(el: T, type: Z, listener: K, useCapture?: X, log?: Y): void;
    disposeEvent(el: T, type: Z, fn: (...args: K[]) => K, capture?: X, log?: Y): void;
}

type TEvent = IEvent<HTMLElement | Window & typeof globalThis | Element, string, any | unknown, boolean | undefined, string | undefined>

export namespace GenericEvent {
    /**
     * Don't export 
     * 
     * @internal 
     */
    class Event implements TEvent {
        /**
         * Create dispoable event listener
         * 
         * @param el Element to add event listener to
         * @param type Event type
         * @param listener Reference function corresponding to event listener
         * @param useCapture - Optional - Default value is `false`. If `true`, it specifies that the event listener being removed is a capturing listener
         * @param log - Optional - Print a message to console
         */
        public createDisposableEvent(el: HTMLElement | Window & typeof globalThis | Element, type: string, listener: (...args: any[]) => any | unknown, useCapture?: boolean | undefined, log?: string | undefined): void {
            if(typeof listener === 'function') {
                el.addEventListener(type, listener, useCapture);
            }
    
            if(log) {
                console.log(log);
            } else {
                return;
            }
        }
    
        /**
         * Dispose event listener 
         * 
         * @param el Element to remove event listener from
         * @param type Event type 
         * @param fn Reference function corresponding to event listener
         * @param capture Optional - Default value is `false`. If `true`, it specifies that the event listener being removed is a capturing listener
         * @param log Optional - Print a message to console
         */
        public disposeEvent(el: HTMLElement | Window & typeof globalThis | Element, type: string, fn: (...args: any[]) => any | unknown, capture?: boolean | undefined, log?: string | undefined): void {
            if(typeof fn === 'function') {
                el.removeEventListener(type, fn, capture);
            }
    
            if(log) {
                console.log(log);
            } else {
                return;
            }
        }
    }

    /**
     * Use Event object
     * 
     * @example
     * 
     * GenericEvent.use.createDetachableEvent(args...)
     */
    export const use: Event = new Event();
}
