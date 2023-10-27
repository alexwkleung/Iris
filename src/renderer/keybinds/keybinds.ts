import { EKeyMap } from "./constants"
import { GenericEvent } from "../src/event-listeners/event"

export namespace KeyBinds {
    class KeyMapper {
        private fn: Array<() => any> = [];
        private key: string[] = [];

        public bindCb: (e: KeyboardEvent) => any = (e: KeyboardEvent): any => {
            console.log(this.key.length);
            console.log(this.key);
            console.log(this.fn);
            console.log(this.fn.length);

            switch(e.code) {
                case EKeyMap.ESCAPE: {
                    if(this.key[0] === 'Escape') {
                        console.log("Escape bind");
    
                        setTimeout(this.fn[0], 20);
                    }

                    if(this.fn.length >= 2 || this.fn[0] !== this.fn[1]) {
                        this.fn.length = 0;
                    }
                
                    if(this.key.length >= 2) {
                        this.key.length = 0;
                    }
                    break;
                }
                case EKeyMap.ENTER: {
                    if(this.key[1] === 'Enter') {
                        console.log("Enter bind");
    
                        setTimeout(this.fn[1], 20);

                        if(this.fn.length >= 2 || this.fn[0] !== this.fn[1]) {
                            this.fn.length = 0;
                        }
                    
                    }
                    break;
                }
            }
        }

        public bind(fn: (...args: any[]) => any, key: string): void {
            this.fn.push(fn);
            this.key.push(key);

            console.log(this.key.length);
            console.log(this.key);
            console.log(this.fn);
            console.log(this.fn.length);
            
            GenericEvent.use.createDisposableEvent(window, 'keydown', this.bindCb, undefined, "Created disposable event for bind (keydown)");
        }
    }

    export const map: KeyMapper = new KeyMapper();
}