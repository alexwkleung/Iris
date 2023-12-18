interface IArray<T, K, V> {
    empty(arr: T, pop: K): V
}

export namespace GenericArray {
    /**
     * @internal
     */
    class Array implements IArray<any, boolean, number | any[]> {
        /**
         * 
         * @param arr Array to empty
         * @param pop Option to empty array by popping the stack instead of setting length
         * @returns Emptied array
         */
        public empty<T, K, V>(arr: T[], pop: K): V {
            let empty: number | any[] = {} as number | any[];

            if(!pop && (arr.length !== 0 && arr.length !== -1 || arr.length !== undefined || arr.length !== null)) {
                empty = (arr.length = 0 as number);
            } else if(pop) {
                while(arr.length > 0) {
                    empty = arr.pop() as any[];
                }
            }

            return empty as V;
        }
    }

    //eslint-disable-next-line
    export const use: Array = new Array();
}