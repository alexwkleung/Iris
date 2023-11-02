interface IArray<T, K, V> {
    empty(arr: T, pop: K): V
}

export namespace GenericArray {
    /**
     * @internal
     */
    class Array implements IArray<any, boolean, number> {
        /**
         * 
         * @param arr Array to empty
         * @param pop Option to empty array by popping the stack instead of setting length
         * @returns Emptied array
         */
        public empty(arr: any[], pop: boolean): number {
            let empty: number = 0;

            if(!pop && (arr.length !== 0 && arr.length !== -1 || arr.length !== undefined || arr.length !== null)) {
                empty = arr.length = 0;
            } else if(pop) {
                while(arr.length > 0) {
                    empty = arr.pop();
                }
            }

            return empty;
        }
    }

    //eslint-disable-next-line
    export const use: Array = new Array();
}