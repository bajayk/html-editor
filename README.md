# HTML Editor

## Demo Link 
### [Click Here](https://components.ajaybadgujar.in/html-editor/).

## Installation

```
npm install @bajayk/html-editor
```

## How to use in Vanila JS.
### index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="script.js" type="module"></script>
</head>

<body>
    <html-editor id="html-editor"></html-editor>
    <br />
    <button id="btn-output">Editor Output</button>
    <br/>
    <textarea id="output">

    </textarea>
</body>

</html>
```

### script.js
```js
import HTMLEditor from "./html-editor/html-editor.js";

const htmlEditor = document.querySelector("#html-editor");
htmlEditor.html = `<h1>Hello World</h1>`;

const btnOutput = document.querySelector("#btn-output");
btnOutput.addEventListener("click", showOutput);

function showOutput(){
    console.log("showOutput");
    console.log(htmlEditor.html);
    const output = document.querySelector("#output");
    const html = htmlEditor.html;
    output.innerHTML = html;
}
```

## How to use in React

```js
import { useEffect, useRef, useState } from 'react'
import HTMLEditor from '@bajayk/html-editor';


function App() {
  const htmlRef = useRef();

  const [html, setHtml] = useState('<h1>Hello World</h1>')

  useEffect(() => {
    htmlRef.current.html = html;
  },[html])

  return (
    <>
      <h1>HTML Editor Demo</h1>
      <html-editor ref={htmlRef}></html-editor>
      <br/>
      <button onClick={() => {
        setHtml(htmlRef.current.html)
      }}>Get HTML</button>
      <br/>
      <br/>
      <textarea value={html} style={{width:'100%', height:100}}></textarea>
    </>
  )
}

export default App;

```
