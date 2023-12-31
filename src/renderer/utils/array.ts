interface IArray<T, K, V> {
    empty(arr: T, pop: K): V;
}

export namespace GenericArray {
    /**
     * @internal
     */
    class ArrayUtil implements IArray<any, boolean, number | any[]> {
        /**
         *
         * @param arr Array to empty
         * @param pop Option to empty array by popping the stack instead of setting length
         * @returns Emptied array
         */
        public empty<T, K, V>(arr: T[], pop: K): V {
            let empty: number | V[] = {} as number | V[];

            if (!pop && ((arr.length !== 0 && arr.length !== -1) || arr.length !== undefined || arr.length !== null)) {
                empty = arr.length = 0 as number;
            } else if (pop) {
                while (arr.length > 0) {
                    empty = arr.pop() as V[];
                }
            }

            return empty as V;
        }

        /**
         * Deep copy array based on `JSON.parse(JSON.stringify(...))`
         *
         * @param arr Array to deep copy
         * @returns New deep copied array
         * @throws Exception if array cannot be deep copied
         */
        public deepCopy<T, K>(arr: T[]): K {
            let deep: K[] = [];

            try {
                deep = JSON.parse(JSON.stringify(arr));
            } catch (e) {
                throw console.error(e);
            }

            return deep as K;
        }

        /**
         * Shallow copy array based on `Array.from(...)`
         *
         * @param arr Array to shallow copy
         * @returns New shallow copied array
         */
        public shallowCopy<T, K>(arr: T[]): K {
            const shallow = Array.from(arr);

            return shallow as K;
        }
    }

    //eslint-disable-next-line
    export const use: ArrayUtil = new ArrayUtil();
}
