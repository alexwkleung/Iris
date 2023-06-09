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

//eslint-disable-next-line
export function pmSetup(options: {
  schema: Schema,
  mapKeys?: { [key: string]: string | false },
  history?: boolean
}) {
  const plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    pasteLinkPlugin
  ]

  if(options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-Setup"}
    }
  }))
}