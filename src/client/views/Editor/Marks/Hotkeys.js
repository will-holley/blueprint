import React from 'react';
import { Bold, Code, Italic, Strikethrough, Underline } from './UI';

const MarkHotkey = options => {
  const { type, key } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, editor, next) {
      // If it doesn't match our `key`, let other plugins handle it.
      if (!event.ctrlKey || event.key != key) return next();

      // Prevent the default characters from being inserted.
      event.preventDefault();

      // Toggle the mark `type`.
      editor.toggleMark(type);
    }
  };
};

// Create Base Hotkeys
const hotkeyPlugin = [
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: '1', type: 'code' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 's', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' })
];

const hotkeyRenderer = {
  bold: props => <Bold>{props.children}</Bold>,
  code: props => <Code>{props.children}</Code>,
  italic: props => <Italic>{props.children}</Italic>,
  strikethrough: props => <Strikethrough>{props.children}</Strikethrough>,
  underline: props => <Underline>{props.children}</Underline>
};

export { hotkeyPlugin, hotkeyRenderer };
