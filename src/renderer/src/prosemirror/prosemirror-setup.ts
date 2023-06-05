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

export { buildKeymap, buildInputRules }

/// Create an array of plugins pre-configured for the given schema.
/// The resulting array will include the following plugins:
///
///  * Input rules for smart quotes and creating the block types in the
///    schema using markdown conventions (say `"> "` to create a
///    blockquote)
/// 
///  * A keymap that defines keys to create and manipulate the nodes in the
///    schema
/// 
///  * A keymap binding the default keys provided by the
///    prosemirror-commands module
/// 
///  * The undo history plugin
/// 
///  * The drop cursor plugin
/// 
///  * The gap cursor plugin
/// 
///  * A custom plugin that adds a `menuContent` prop for the
///    prosemirror-menu wrapper, and a CSS class that enables the
///    additional styling defined in `style/style.css` in this package
///
/// Probably only useful for quickly setting up a passable
/// editor—you'll need more control over your settings in most
/// real-world situations.

//eslint-disable-next-line
export function pmSetup(options: {
  /// The schema to generate key bindings and menu items for.
  schema: Schema

  /// Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
  mapKeys?: {[key: string]: string | false}

  /// Set to false to disable the history plugin.
  history?: boolean
}) {
  const plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor()
  ]

  if (options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-Setup"}
    }
  }))
}