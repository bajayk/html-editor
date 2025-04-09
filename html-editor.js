export default class HTMLEditor extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
        this.init();
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    set html(value) {
        this.editor.innerHTML = value;
    }
    
    get html() {
        return this.editor.innerHTML;
    }

    init() {
        this.tools = this.shadow.querySelectorAll('.tool');
        this.editor = this.shadow.querySelector('.editor');
        //this.preview = this.shadow.querySelector('.preview');
        //this.tabs = this.shadow.querySelectorAll('.tab');

        this.applyToolEvents();
        //this.applyTabEvents();
    }

    applyToolEvents() {
        this.tools.forEach(tool => {
            tool.addEventListener('click', (e) => {
                this.format(tool.dataset.command, tool.dataset.value); // Pass potential value
            });
        });
    }

    applyTabEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(tab);
            });
        });
        this.updatePreview(); // Initial preview render
    }

    switchTab(clickedTab) {
        this.tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        if (clickedTab.classList.contains('tab-editor')) {
            this.editor.style.display = 'block';
            this.preview.style.display = 'none';
        } else if (clickedTab.classList.contains('tab-preview')) {
            this.editor.style.display = 'none';
            this.preview.style.display = 'block';
            this.updatePreview();
        }
    }

    format(command, value = null) {
        if (command === 'createLink') {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const imageUrl = prompt('Enter the image URL:');
            if (imageUrl) {
                document.execCommand(command, false, imageUrl);
            }
        }
         else {
            document.execCommand(command, false, value);
        }
        this.editor.focus(); // Keep focus on the editor after formatting
        //this.updatePreview();
    }

    updatePreview() {
        this.preview.innerHTML = this.editor.innerHTML;
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                .html-editor{
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    border:1px solid gray;
                }
                .toolbar{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 5px;
                    background-color: #f2f2f2;
                    padding:4px;                                    
                }

                .tool-icon{
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding:8px;
                    pointer-events: none; 
                }
                .tool{                    
                    cursor: pointer;                    
                }
                .tool:hover{
                    background-color: #e0e0e0;
                }

                .editor-preview-tabs{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-start;                    
                }

                .tab{
                    width:100px;
                    text-align: center;
                    padding: 8px;
                    cursor: pointer;
                    border: 1px solid #e0e0e0;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;                    
                }

                .tab.active{
                    background-color: #e0e0e0;
                    color: #000;
                }

                svg{
                    pointer-events: none;                    
                }

                #editor{
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    background-color: #fff;
                    min-height: 200px;
                    overflow-y: auto;                    
                }
            </style>
            <div class="html-editor">
                <div class="toolbar">
                
                    <button class="tool tool-bold" title="Bold" data-command="bold">
                        <div class="tool-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 46.3 14.3 32 32 32l48 0 16 0 128 0c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128L96 480l-16 0-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-160L48 96 32 96C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64L112 96l0 128 112 0zM112 288l0 128 144 0c35.3 0 64-28.7 64-64s-28.7-64-64-64l-32 0-112 0z"/></svg>
                        </div>
                    </button>

                    <button class="tool tool-italic" title="Italic" data-command="italic">                    
                        <div class="tool-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0L160 416l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0L224 96l-64 0c-17.7 0-32-14.3-32-32z"/></svg>
                        </div>
                    </button>
                        <button class="tool tool-underline" title="Underline" data-command="underline">
                            <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 64c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 128c0 53 43 96 96 96s96-43 96-96l0-128-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 128c0 88.4-71.6 160-160 160s-160-71.6-160-160L64 96 48 96C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-strike" title="Strikethrough" data-command="strikethrough">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l448 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-209.9 0-.4-.1-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3c0 0 0 0 0 0s0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6c0 0 0 0 0 0l.2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1l-75.7 0c7 5.6 11.4 11.2 13.9 17.2z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-ordered-list" title="Ordered List" data-command="insertOrderedList">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M24 56c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24l0 120 16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l16 0 0-96-8 0C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432l33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-88 0c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-unordered-list" title="Unordered List" data-command="insertUnorderedList">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-left-align" title="Left Align" data-command="justifyLeft">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-center-align" title="Center Align" data-command="justifyCenter">
                        <div class="tool-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-right-align" title="Right Align" data-command="justifyRight">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 64c0 17.7-14.3 32-32 32L192 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-justify" title="Justify" data-command="justifyFull">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-link" title="Link" data-command="createLink">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>
                        </div>
                    </button>
                    <button class="tool tool-image" title="Insert Image" data-command="insertImage">
                        <div class="tool-icon">                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                        </div>
                    </button>
                </div>
                <!--<div class="editor-preview-tabs">
                    <div class="tab tab-editor active">
                        Editor
                    </div>
                    <div class="tab tab-preview">
                        Preview
                    </div>
                </div>-->
                <div id="editor" class="editor" contenteditable="true">
                    <p>Please type here</p>
                </div>
                <!--<div class="preview" contenteditable="true">
                </div>-->
            </div>
        `;
    }
}

customElements.define('html-editor', HTMLEditor);

//