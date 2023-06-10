//base taken from: https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/menu.ts
//disabling eslint is a temp workaround
//the code will properly adhere to eslint rules at a later time

import { 
  wrapItem, 
  blockTypeItem, 
  Dropdown, 
  DropdownSubmenu, 
  joinUpItem, 
  liftItem, 
  undoItem, 
  redoItem, 
  icons, 
  MenuItem,
  MenuElement, 
  MenuItemSpec 
} from "prosemirror-menu"
import { EditorState, Command } from "prosemirror-state"
import { Schema, NodeType, MarkType } from "prosemirror-model"
import { toggleMark } from "prosemirror-commands"
import { wrapInList } from "prosemirror-schema-list"

// Helpers to create specific types of items

//eslint-disable-next-line
function canInsert(state: EditorState, nodeType: NodeType) {
const $from = state.selection.$from
for (let d = $from.depth; d >= 0; d--) {
 const index = $from.index(d)
 if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
}
return false
}

//eslint-disable-next-line
function cmdItem(cmd: Command, options: Partial<MenuItemSpec>) {
const passedOptions: MenuItemSpec = {
 label: options.title as string | undefined,
 run: cmd
}
//eslint-disable-next-line
for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop]
if (!options.enable && !options.select)
//eslint-disable-next-line
 passedOptions[options.enable ? "enable" : "select"] = (state: any) => cmd(state)

return new MenuItem(passedOptions)
}

//eslint-disable-next-line
function markActive(state: EditorState, type: MarkType) {
const {from, $from, to, empty} = state.selection
if (empty) return !!type.isInSet(state.storedMarks || $from.marks())
else return state.doc.rangeHasMark(from, to, type)
}

//eslint-disable-next-line
function markItem(markType: MarkType, options: Partial<MenuItemSpec>) {
const passedOptions: Partial<MenuItemSpec> = {
//eslint-disable-next-line
 active(state: any) { return markActive(state, markType) }
}
//eslint-disable-next-line
for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop]
return cmdItem(toggleMark(markType), passedOptions)
}

//eslint-disable-next-line
function wrapListItem(nodeType: NodeType, options: Partial<MenuItemSpec>) {
//eslint-disable-next-line
return cmdItem(wrapInList(nodeType, (options as any).attrs), options)
}

type MenuItemResult = {
/// A menu item to toggle the [strong mark](#schema-basic.StrongMark).
toggleStrong?: MenuItem

/// A menu item to toggle the [emphasis mark](#schema-basic.EmMark).
toggleEm?: MenuItem

/// A menu item to toggle the [code font mark](#schema-basic.CodeMark).
toggleCode?: MenuItem

/// A menu item to wrap the selection in a [bullet list](#schema-list.BulletList).
wrapBulletList?: MenuItem

/// A menu item to wrap the selection in an [ordered list](#schema-list.OrderedList).
wrapOrderedList?: MenuItem

/// A menu item to wrap the selection in a [block quote](#schema-basic.BlockQuote).
wrapBlockQuote?: MenuItem

/// A menu item to set the current textblock to be a normal
/// [paragraph](#schema-basic.Paragraph).
makeParagraph?: MenuItem

/// A menu item to set the current textblock to be a
/// [code block](#schema-basic.CodeBlock).
makeCodeBlock?: MenuItem

/// Menu items to set the current textblock to be a
/// [heading](#schema-basic.Heading) of level _N_.
makeHead1?: MenuItem
makeHead2?: MenuItem
makeHead3?: MenuItem
makeHead4?: MenuItem
makeHead5?: MenuItem
makeHead6?: MenuItem

/// A menu item to insert a horizontal rule.
insertHorizontalRule?: MenuItem

/// A dropdown containing the `insertImage` and
/// `insertHorizontalRule` items.
insertMenu: Dropdown

/// A dropdown containing the items for making the current
/// textblock a paragraph, code block, or heading.
typeMenu: Dropdown

/// Array of block-related menu items.
blockMenu: MenuElement[][]

/// Inline-markup related menu items.
inlineMenu: MenuElement[][]

/// An array of arrays of menu elements for use as the full menu
/// for, for example the [menu
/// bar](https://github.com/prosemirror/prosemirror-menu#user-content-menubar).
fullMenu: MenuElement[][]
}

/// Given a schema, look for default mark and node types in it and
/// return an object with relevant menu items relating to those marks.
export function buildMenuItems(schema: Schema): MenuItemResult {
const r: MenuItemResult = {} as any
let mark: MarkType | undefined
//eslint-disable-next-line
if (mark = schema.marks.strong)
 r.toggleStrong = markItem(mark, {title: "Bold", icon: icons.strong})
 //eslint-disable-next-line
if (mark = schema.marks.em)
 r.toggleEm = markItem(mark, {title: "Italic", icon: icons.em})
 //eslint-disable-next-line
if (mark = schema.marks.code)
 r.toggleCode = markItem(mark, {title: "Inline code", icon: icons.code})

let node: NodeType | undefined
 //eslint-disable-next-line
if (node = schema.nodes.bullet_list)
 r.wrapBulletList = wrapListItem(node, {
   title: "Bullet list",
   icon: icons.bulletList
 })
 //eslint-disable-next-line
if (node = schema.nodes.ordered_list)
 r.wrapOrderedList = wrapListItem(node, {
   title: "Ordered list",
   icon: icons.orderedList
 })
 //eslint-disable-next-line
if (node = schema.nodes.blockquote)
 r.wrapBlockQuote = wrapItem(node, {
   title: "Blockquote",
   icon: icons.blockquote
 })
 //eslint-disable-next-line
if (node = schema.nodes.paragraph)
 r.makeParagraph = blockTypeItem(node, {
   title: "Paragraph",
   label: "Paragraph"
 })
 //eslint-disable-next-line
if (node = schema.nodes.code_block)
 r.makeCodeBlock = blockTypeItem(node, {
   title: "Code block",
   label: "Code block"
 })
 //eslint-disable-next-line
if (node = schema.nodes.heading)
 for (let i = 1; i <= 10; i++)
    //eslint-disable-next-line
   (r as any)["makeHead" + i] = blockTypeItem(node, {
     title: "Change to heading " + i,
     label: i.toString(), //display number only
     attrs: {level: i}
   })
   //eslint-disable-next-line
if (node = schema.nodes.horizontal_rule) {
 const hr = node
 r.insertHorizontalRule = new MenuItem({
   title: "Horizontal line",
   label: "Horizontal line",
   //eslint-disable-next-line
   enable(state: any) { return canInsert(state, hr) },
   //eslint-disable-next-line
   run(state: any, dispatch: any) { dispatch(state.tr.replaceSelectionWith(hr.create())) }
 })
}
//eslint-disable-next-line
const cut = <T>(arr: T[]) => arr.filter(x => x) as NonNullable<T>[]
r.insertMenu = new Dropdown(cut([r.insertHorizontalRule]), {label: "Insert"})
r.typeMenu = new Dropdown(cut([r.makeParagraph, r.makeCodeBlock, r.makeHead1 && new DropdownSubmenu(cut([
 r.makeHead1, r.makeHead2, r.makeHead3, r.makeHead4, r.makeHead5, r.makeHead6
]), {label: "Heading"})]), {label: "Add"})

r.inlineMenu = [cut([r.toggleStrong, r.toggleEm, r.toggleCode])]
r.blockMenu = [cut([r.wrapBulletList, r.wrapOrderedList, r.wrapBlockQuote, joinUpItem, liftItem])]
r.fullMenu = r.inlineMenu.concat([[r.insertMenu, r.typeMenu]], [[undoItem, redoItem]], r.blockMenu)

return r
}