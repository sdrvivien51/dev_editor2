/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import EditorJs from './editor-js'

import { EDITOR_JS_TOOLS } from './Tool'

class App extends Component {
  async onSave() {
    const outputData = await this.editorInstance.save()
    console.log('outputData', outputData)
  }

  render() {
    return (
      <div className="app">
        <h1>
          <a
            href="https://github.com/natterstefan/react-editor-js"
            target="_blank"
          >
            react-editor-js{' '}
            <span role="img" aria-label="link">
              🔗
            </span>{' '}
            <span role="img" aria-label="react">
              ⚛️
            </span>
          </a>
        </h1>
        <div className="actions">
          <button onClick={this.onSave.bind(this)} type="button">
            Log Content to Console
          </button>
        </div>
        <EditorJs
          editorInstance={instance => (this.editorInstance = instance)}
          tools={EDITOR_JS_TOOLS}
          data={data}
        />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
