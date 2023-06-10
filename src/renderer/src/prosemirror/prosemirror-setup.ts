//base taken from: https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/index.ts

import { keymap } from "prosemirror-keymap"
import { history } from "prosemirror-history"
import { baseKeymap } from "prosemirror-commands"
import { Plugin } from "prosemirror-state"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { Schema } from "prosemirror-model"
import { buildKeymap } from "./keymap"
import { buildInputRules } from "./inputrules"
import pasteLinkPlugin from 'prosemirror-paste-link'
import { menuBar, MenuItem } from "prosemirror-menu"
import { buildMenuItems } from "./menu"

//eslint-disable-next-line
export function pmSetup(options: {
  schema: Schema,
  mapKeys?: { [key: string]: string | false },
  history?: boolean,
  menuBar?: boolean,
  floatingMenu: boolean
  menuContent?: MenuItem[][]
}) {
  const plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    pasteLinkPlugin
  ];

  if(options.menuBar !== false) {
    plugins.push(menuBar({floating: options.floatingMenu !== false, content: options.menuContent || buildMenuItems(options.schema).fullMenu}))
  }

  if(options.history !== false) {
    plugins.push(history());
  }

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-Setup"}
    }
  }));
}