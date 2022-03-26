import { LitElement, html, css, svg } from 'lit';
import { query, property, state } from 'lit/decorators.js';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { html as langHtml } from '@codemirror/lang-html';

const initialState = `
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
  </body>
</html>
`;

export class HtmlCodeEditor extends LitElement {
  static styles = css`
    :host {
      all: initial;
      display: block;
      height: 90vh;
    }

    [hidden] {
      display: none;
    }

    #container {
      display: flex;
      height: calc(100% - 2rem);
    }

    #container > * {
      flex: 1;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      background-color: white;
    }

    .cm-editor {
      height: 100%;
    }

    svg {
      height: 1rem;
      width: 1rem;
    }

    #toolbar {
      display: flex;
      justify-content: space-between;
      height: 1.5rem;
    }
  `;

  @query('iframe')
  iframe!: HTMLIFrameElement;

  @query('#editor')
  codemirror!: HTMLDivElement;

  @property()
  code = initialState;

  @state()
  shown = new Set(['editor', 'preview']);

  @state()
  editorButtonLabel = 'Hide editor';

  @state()
  previewButtonLabel = 'Hide preview';

  togglePart(part: 'editor' | 'preview') {
    return () => {
      if (this.shown.has(part)) {
        this.shown.delete(part);
      } else {
        this.shown.add(part);
      }
      this.requestUpdate('shown');
    };
  }

  editorView?: EditorView;

  renderIcon(part: 'editor' | 'preview') {
    if (!this.shown.has(part)) {
      return svg/* HTML */ `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        ></path>
      `;
    }
    return svg/* HTML */ `
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      ></path>
    `;
  }

  runCode() {
    this.code = this.editorView?.state.doc.toJSON().join('') || '';
  }

  handleEnter(event: KeyboardEvent) {
    if (!event.ctrlKey || event.key !== 'Enter') return;
    event.preventDefault();
    this.runCode();
  }

  firstUpdated() {
    this.editorView = new EditorView({
      state: EditorState.create({
        doc: initialState.trim(),
        extensions: [basicSetup, keymap.of([indentWithTab]), langHtml()],
      }),
      parent: this.codemirror,
    });
  }

  render() {
    return html`
      <div part="toolbar" id="toolbar">
        <button
          part="button"
          title="Toggle editor"
          @click=${this.togglePart('editor')}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderIcon('editor')}
          </svg>
        </button>
        <button part="button" title="Run" @click=${this.runCode}>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
        <button
          part="button"
          title="Toggle preview"
          @click=${this.togglePart('preview')}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderIcon('preview')}
          </svg>
        </button>
      </div>
      <div id="container" part="container">
        <div
          ?hidden=${!this.shown.has('editor')}
          part="editor"
          @keyup=${this.handleEnter}
          id="editor"
        ></div>
        <iframe
          ?hidden=${!this.shown.has('preview')}
          part="preview"
          id="preview"
          title="content"
          .srcdoc=${this.code}
        ></iframe>
      </div>
    `;
  }
}
