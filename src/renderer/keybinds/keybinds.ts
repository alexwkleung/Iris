import { EKeyMap } from "./constants"
import { GenericEvent } from "../src/event-listeners/event"

interface IFn {
    fn: (...args: any[]) => any,
    key: string
}

export namespace KeyBinds {
    class KeyMapper {
        /**
         * Array of objects to hold key binds and their corresponding functions
         * 
         * @private
         */
        private map: IFn[] = [
            {
                fn: {} as (...args: any[]) => any,
                key: ""
            },
            {
                fn: {} as (...args: any[]) => any,
                key: ""
            }
        ];

        /**
         * Reset map list
         * 
         * @public
         */
        public resetMapList(): void {
            GenericEvent.use.setEventCallbackTimeout(() => {
                this.map = [
                    {
                        fn: {} as (...args: any[]) => any,
                        key: ""
                    },
                    {
                        fn: {} as (...args: any[]) => any,
                        key: ""
                    }
                ];

                console.log("Reset map");
            }, 500);
        }

        /**
         * Set bind
         * 
         * @param key Type of key to execute corresponding function (`Escape`, `Enter`)
         * 
         * @public
         */
        public setBind(key: string): void {
            console.log(this.map.length);

            if(key === 'Escape') {
                GenericEvent.use.setEventCallbackTimeout(this.map[0].fn, 20);
            } else if(key === 'Enter') {
                GenericEvent.use.setEventCallbackTimeout(this.map[1].fn, 20);
            }
        }

        /**
         * Bind callback
         *  
         * @param e KeyboardEvent
         * 
         * @public
         */
        public bindCb: (e: KeyboardEvent) => any = (e: KeyboardEvent): any => {
            console.log(this.map);
            console.log(this.map.length);

            switch(e.code) {
                case EKeyMap.ESCAPE: {
                    if(this.map[0].key === 'Escape') {
                        console.log("Escape bind");
    
                        this.setBind("Escape");
                    }
                    break;
                }
                case EKeyMap.ENTER: {
                    if(this.map[1].key === 'Enter') {
                        console.log("Enter bind");
    
                        this.setBind("Enter");
                    }
                    break;
                }
            }
        }

        /**
         * Bind a key
         * 
         * @param fn Function
         * @param key Key type (`Escape`, `Enter`)
         */
        public bind(fn: (...args: any[]) => any, key: string, singleKey: boolean): void {
            if(singleKey) {
                if(key === 'Escape') {
                    this.map.length = 0;

                    this.map = [
                        {
                            fn: fn,
                            key: key
                        }
                    ]
                } else if(key === 'Enter') {
                    this.map.length = 0;
                    
                    this.map = [
                        {
                            fn: fn,
                            key: key
                        }
                    ]
                }

                GenericEvent.use.createDisposableEvent(window, 'keydown', this.bindCb, undefined, "Created disposable event for bind (keydown)");

                return;
            } else if(!singleKey) {
                if(key === 'Escape') {
                    this.map[0].fn = fn;
                    this.map[0].key = key
                } else if(key === 'Enter') {
                    this.map[1].fn = fn;
                    this.map[1].key = key;
                }

                GenericEvent.use.createDisposableEvent(window, 'keydown', this.bindCb, undefined, "Created disposable event for bind (keydown)");

                return;
            }
        }
    }

    /**
     * KeyMapper object
     */
    export const map: KeyMapper = new KeyMapper();
}