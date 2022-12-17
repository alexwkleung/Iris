/* 
* file: `editor-objects.ts`
*
* this file is used to create any objects that are utilized in the `editor.ts` file
*
*/

import { DefaultInputRules } from '../../editor/inputrules/inputrules'
import { OverrideDefaultSchema } from '../../editor/schema/schema'

//EditorObjects class
export class EditorObjects {
    //Default Input Rules object
    static DefInputRules: DefaultInputRules = new DefaultInputRules() as DefaultInputRules;

    //Override Default Schema object
    static OvrDefSchema: OverrideDefaultSchema = new OverrideDefaultSchema() as OverrideDefaultSchema;
}