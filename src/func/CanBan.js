import { appState } from "../app";
import progressTasks from "../templates/progressTask.html";

export class CanBan {

    constructor(selector) {
        this.elem = document.querySelector(selector);
        // this.appState = 'test1';
        this.appState = appState.currentUser.login;
        this.stateCanBan = null;
        this.selectDragElem = null;
        this.activeElement = null;
        
        
    }

    _createTaskObject() {

        const stateArray = [
            { 'Backlog': [] },
            { 'Ready': [] },
            { 'In progress': [] },
            { 'Finished': [] }
        ]

        const taskBlock = this.elem.querySelectorAll('.task__item');

        taskBlock.forEach((el, index) => {

            const typeBlock = el.querySelector('.task__drop-field').dataset.type;

            el.querySelectorAll('.task__drop-elem').forEach(el => {
                
                let task = el.querySelector('p').innerText;
                stateArray[index][typeBlock].push(task)
            })

        })

        console.log(JSON.stringify(stateArray))
        const dataStorage = JSON.parse(localStorage.getItem('userCabinet'));

        dataStorage.forEach(el => {
            if(el.userLogin == this.appState) {
                el.data = stateArray;
            }
        })

        localStorage.setItem('userCabinet', JSON.stringify(dataStorage));
        
    }

    start() {
        console.log(this.appState)
        this._getStorage();
        // console.log(this.stateCanBan[0]['Backlog'])
        const dragElem = this.elem.querySelectorAll('.task__item');
        dragElem.forEach((el, index) => {
            const tasks = this._pushTasks(index);
            el.querySelector('.task__drop-field').insertAdjacentHTML('afterbegin', tasks);
        });

        this._createTaskObject();

        this._renderProgressTemplate();


        this._addEventAll(
            document.querySelectorAll('.task__drop-field'), 
            'dragenter', 
            this._dragEnter // Захват элемента для перемещения
        )

        this._addEventAll(
            document.querySelectorAll('.task__drop-field'), 
            'dragover', 
            this._dragOver // Находится над областью сброса
        )

        this._addEventAll(
            document.querySelectorAll('.task__drop-elem'), 
            'dragstart', 
            this._dragStart // Захват элемента для перемещения
        )

        this._addEventAll(
            document.querySelectorAll('.task__drop-elem'), 
            'dragend', 
            this._dragEnd // Завершается перетаскивание
        )

        this._addEventAll(
            document.querySelectorAll('.task__drop-elem'), 
            'drop', 
            this._dragDrop // Завершается перетаскивание
        )

        this._addEventAll(
            document.querySelectorAll('.task__add-button'), 
            'click', 
            this._addTask // Получаем кнопки открытия текстареи
        )

        this._addEventAll(
            document.querySelectorAll('.task__close-button'), 
            'click', 
            this._hideTextarea // Получаем кнопки закрытия текстарея
        )

        this._addEventAll(
            document.querySelectorAll('.task__add-task-button'), 
            'click', 
            this._addNewTask // Получаем кнопки добавления задачи
        )

        this._addEventAll(
            document.querySelectorAll('.task__edit'), 
            'click', 
            this._editTask // Подвешиваем событие на редактирование задачи
        )

        
        
    }

    _renderProgressTemplate() {

        const progressBlock = document.querySelector('.footer__progress-content')
        progressBlock.innerHTML = progressTasks;

        const getLocalStorageUserCabinet = JSON.parse(localStorage.getItem('userCabinet'));
        getLocalStorageUserCabinet.forEach(el => {

            if(this.appState == el.userLogin) {
                
                progressBlock.querySelector('.footer__active-tasks').innerHTML = el.data[0]['Backlog'].length;
                progressBlock.querySelector('.footer__finished-tasks').innerHTML = el.data[3]['Finished'].length;
            }
            
        });
    }


    _editTask(e) {

        const textElem = e.currentTarget.previousElementSibling;
        textElem.classList.add('edit-task');

        textElem.parentElement.setAttribute('draggable', 'false');

        this._appendEditor(e.currentTarget.parentElement); // Добавляем редактор для задачи

        const editorBlock = document.querySelector('.task__editor');
        editorBlock.querySelector('.task__textarea-editor').value = textElem.innerText;
        editorBlock.querySelector('.task__save-editor').addEventListener('click', () => {
            this._saveTaskText(editorBlock, textElem);
        });

        const overlay = document.querySelector('.overlay');
        overlay.addEventListener('click', () => {
            textElem.parentElement.setAttribute('draggable', 'true');
            CanBan.closeOverlay(editorBlock);
        });

    }

    _saveTaskText(htmlCodeEditor, blockEditText) {

        const newText = document.querySelector('.task__textarea-editor').value;
        blockEditText.innerHTML = newText;
        blockEditText.parentElement.setAttribute('draggable', 'true');
        CanBan.closeOverlay(htmlCodeEditor);

        this._createTaskObject();

    }

    static closeOverlay(removeElem = null) {
        // console.log('overlay')
        document.querySelector('.overlay').remove();
        if(removeElem) {
            removeElem.remove();
        }
    }

    _appendEditor(elem) {

        const overlayCode = `<div class="overlay"></div>`;

        const htmlCodeEditor = `
        <div class="task__editor">
            <div class="task__editor-wrapper">
                <div class="task__destroy-editor">
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;"
                        xml:space="preserve">
                        <g>
                            <g>
                                <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
        L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
        c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
        l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
        L284.286,256.002z" />
                            </g>
                        </g>
                    </svg>
                </div>
                <textarea class="task__textarea-editor"></textarea>
                <button class="task__save-editor">Сохранить</button>
            </div>
        </div>
        `;

        elem.insertAdjacentHTML('beforeend', htmlCodeEditor);
        document.body.insertAdjacentHTML('beforeend', overlayCode);

    }


// Методы добавления новой задачи (Начало)
    _addTask(e) {
        this._showCloseButton(e.target.nextElementSibling);
        this._showTextarea(e.target);
        e.target.classList.add('display-none')
        e.target.previousElementSibling.classList.remove('display-none');
        e.target.previousElementSibling.classList.add('display-block');
    }

    _showTextarea(elem) {
        elem.parentNode.previousElementSibling.querySelector('.task__textarea').classList.add('display-block');
    }

    _hideTextarea(e) {
        e.currentTarget.parentNode.previousElementSibling.querySelector('.task__textarea').classList.remove('display-block');
        e.currentTarget.classList.remove('display-block');
        console.log(e.currentTarget.parentNode.querySelector('.task__add-button').classList.remove('display-none'))
        e.currentTarget.parentNode.querySelector('.task__add-task-button').classList.add('display-none')
    }

    _showCloseButton(elem) {
        elem.classList.add('display-block');
    }

    _addNewTask(e) {
        const taskBlock = e.target.parentNode.parentNode.previousElementSibling;
        const newTask = e.target.parentNode.previousElementSibling.querySelector('.task__textarea').value;
        e.target.parentNode.previousElementSibling.querySelector('.task__textarea').value = '';
        taskBlock.insertAdjacentHTML('beforeend', `
                                                <div class="task__drop-elem new-drop-elem" draggable="true">
                                                    <p>${newTask}</p>
                                                    <div class="task__edit task__edit-new">
                                                        <svg height="512pt" viewBox="0 0 512 511" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0"/><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0"/><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0"/></svg>
                                                    </div>
                                                </div>
                                                `);

        this._addEventAll(
            document.querySelectorAll('.new-drop-elem'), 
            'dragstart', 
            this._dragStart // Захват элемента для перемещения
        )

        this._addEventAll(
            document.querySelectorAll('.new-drop-elem'), 
            'dragend', 
            this._dragEnd // Завершается перетаскивание
        )

        this._addEventAll(
            document.querySelectorAll('.task__edit-new'), 
            'click', 
            this._editTask // Подвешиваем событие на редактирование задачи
        )

        this._createTaskObject();

        this._renderProgressTemplate();
    }

// Методы добавления новой задачи (Конец)

    
// Методы для Drag & Drop (Начало)

    _dragStart(e) {
        setTimeout(() => {
            e.target.classList.add('selected')
        }, 0)
        
        this.activeElement = e.target;
    }

    _dragOver(e) {
        e.preventDefault();

        if(this.activeElement != e.target && e.target.classList.contains('task__drop-elem') ) {
            
            if(e.target.nextElementSibling == this.activeElement) {
                e.target.parentNode.insertBefore(this.activeElement, this.activeElement.previousElementSibling)
            } else {
                e.target.parentNode.insertBefore(this.activeElement, e.target.nextElementSibling)
            }
            
        }

        if(e.target.classList.contains('task__drop-field') && !e.target.querySelector('.task__drop-elem')) {
            e.target.appendChild(this.activeElement)
        }
    }

    _dragEnter(e) {
        
        if(e.target.classList[0] == 'task__drop-field') {
            e.target.classList.add('colorDrop');
        } else {
            document.querySelectorAll('.colorDrop').forEach(el => el.classList.remove('colorDrop'));
        }
    }

    _dragEnd(e) {
        document.querySelector('.selected').classList.remove('selected');
        document.querySelectorAll('.colorDrop').forEach(el => el.classList.remove('colorDrop'))
    }

    _dragDrop(e) {
        console.log('Drop Drop');
        this._createTaskObject();
        this._renderProgressTemplate();
    }

// Методы для Drag & Drop (Конец)


    _addEventAll(arrElem, event, callback) {
        arrElem.forEach(el => {
            el.addEventListener(event, callback.bind(this))
        });
    }

    _pushTasks(index) {
        let tasks = '';
        const key = Object.keys(this.stateCanBan[index])[0];
        this.stateCanBan[index][key].forEach(el => {
            tasks += `
                <div class="task__drop-elem" draggable="true">
                    <p>${el}</p>
                    <div class="task__edit">
                    <svg height="512pt" viewBox="0 0 512 511" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0"/><path d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0"/><path d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0"/></svg>
                    </div>
                    
                </div>
            `;
        })

        return tasks;
    }

    _getStorage() {
        const cabinet = JSON.parse(localStorage.getItem('userCabinet'));
        cabinet.forEach(el => {
            if(el.userLogin == this.appState) {
                this.stateCanBan = el.data;
            }
        })
    }

}