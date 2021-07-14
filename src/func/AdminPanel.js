import { renderContent } from "../utils";
import { appState } from "../app";
import { CanBan } from "./CanBan";
import { BaseModel } from "../models/BaseModel";

export class AdminPanel {

    constructor(cpnListUser, cpnTaskUser) {
        this.currentUser = 'test1';
        this.componentListUser = cpnListUser;
        this.componentTaskUser = cpnTaskUser;
        this._renderUsersList();
    }

    _renderUsersList() {
        console.log(appState)
        renderContent(this.componentListUser);
        document.querySelector('.users').innerHTML = this._createUserList();

        const buttonMoreDetails = document.querySelectorAll('.users__button-more');
        console.log(buttonMoreDetails)
        buttonMoreDetails.forEach(el => {
            el.addEventListener('click', this._showTaskUser.bind(this))
        })

        const buttonDeleteDetails = document.querySelectorAll('.users__button-delete');
        buttonDeleteDetails.forEach(el => {
            el.addEventListener('click', this._deleteUser.bind(this))
        })

        document.querySelectorAll('.users__button-more')
            .forEach(el => el.addEventListener('click', (e) => this._renderTaskListUser(e.currentTarget.dataset.login)));

        document.querySelector('.add-user').addEventListener('click', this._addUser.bind(this));
    }

    _addUser() {

        this._renderFormAddUser();
        
        
    }

    _renderFormAddUser() {
        const htmlCodeForm = `
            <form class="form-add-user">
                <div class="form-add-user__user-login">
                    <label>Login:</label>
                    <input type="text" name="login" placeholder="Enter username">
                </div>
                <div class="form-add-user__user-login">
                    <label>Enter user password:</label>
                    <input type="text" name="password" placeholder="Enter user password">
                </div>
                <button class="form-add-user__add-button">Add user</button>
            </form>
        `;

        if(!document.querySelector('.form-add-user')) {

            document.querySelector('.users').insertAdjacentHTML('afterend', htmlCodeForm);
            document.querySelector('.form-add-user').addEventListener('submit', this._saveUser.bind(this));

        }

        
    }

    _saveUser(e) {

        e.preventDefault();
        let {userName, password} = this._validateForm(e.target);
        let userArray = JSON.parse(this._getDataLocalStorage('users'));
        let userCabinetArray = JSON.parse(this._getDataLocalStorage('userCabinet'));
        let userID = new BaseModel;


        userArray.push(
            {
                id: userID.id, 
                login: userName, 
                password: password, 
                role: "user", 
                storageKey: "users"
            }
        );

        this._setDataLocalStorage('users', JSON.stringify(userArray));
        console.log(JSON.parse(this._getDataLocalStorage('users')), 'local storage Data');


        userCabinetArray.push(
            {
                userLogin: userName,
                data: [
                    {
                        Backlog: [
                        'Задача 1'
                        ]
                    }, 
                    {
                        Ready: [
                        'Задача 2'
                        ]
                    },
                    {
                        'In progress': [
                        'Задача 3'
                        ]
                    },
                    {
                        Finished: [
                        'Задача 4'
                        ]
                    }
                ], 
                storageKey: "userCabinet"
            }
        )

        this._setDataLocalStorage('userCabinet', JSON.stringify(userCabinetArray));

        this._renderUsersList();
    }

    _validateForm(formElem) {

        let result = false;
        let data = {
            userName: null,
            password: null
        }

        formElem.querySelectorAll('input').forEach((el, index) => {
            
            try {
                el.classList.remove('border-error');
                el.previousElementSibling.remove();
            } catch(e) {}

            

            if(el.value.length < 3) {
                el.classList.add('border-error');
                el.insertAdjacentHTML('beforebegin', `<div class="error-text">${el.name == 'login' ? 'Login length must be 3 or more characters': 'Password length must be 3 or more characters'}</div>`)
            } else if(index == 0 && this._checkUser(el.value)) {
                el.classList.add('border-error');
                el.insertAdjacentHTML('beforebegin', `<div class="error-text">This login is already taken, please use another</div>`)
            }
            else {
                console.log(index)
                index == 0 ? data.userName = el.value : data.password = el.value;
                result = true;
            }
        });

        

        if(result) {
            return data;
        }

    }

    _checkUser(userLogin) {
        let result = false;

        const userList = JSON.parse(this._getDataLocalStorage('users'));
        userList.forEach(el => {
            console.log(el.login, userLogin)
            if(el.login == userLogin) {
                result = true;
            } 
        })
        
        return result;
    }

    _renderTaskListUser(user = 'test1') {
        console.log(appState)
        console.log(JSON.parse(this._getDataLocalStorage('users')))
        this.currentUser = user;
        const dataTask = JSON.parse(this._getDataLocalStorage('userCabinet'));
        const filterUser = dataTask.filter(el => el.userLogin == user ? el : false);
        // console.log(filterUser)
        renderContent(this.componentTaskUser);

        const allBlockTask = document.querySelectorAll('.admin-panel__tasks-wrapper');
        allBlockTask.forEach((el, index) => {
                el.querySelector('.admin-panel__task-items').innerHTML = this._getUserTasks(el.dataset.type, filterUser, index);
        });

        // _addEventAll(arrElem, event, callback);

        this._addEventAll(
            document.querySelectorAll('.admin-panel__edit-task'), 
            'click', 
            this._editTask);

        this._addEventAll(
            document.querySelectorAll('.admin-panel__delete-task'), 
            'click', 
            this._deleteTask);

        document.querySelector('.back-to-user-list').addEventListener('click', this._renderUsersList.bind(this));
        document.querySelector('.user-name').textContent = user;
    }

    _editTask(e) {
        e.currentTarget.parentElement.parentElement.querySelector('.admin-panel__task-text').classList.add('edit-text');
        const elem = e.currentTarget.parentElement.parentElement;
        const editText = e.currentTarget.parentElement.parentElement.querySelector('.admin-panel__task-text').innerText;

        this._addEditForm(elem, editText);

        document.querySelector('.task__save-editor').addEventListener('click', this._saveEditText.bind(this));
        document.querySelector('.overlay').addEventListener('click', () => {
            CanBan.closeOverlay(document.querySelector('.task__editor'));
        })
    }

    _saveEditText(e) {
        document.querySelector('.edit-text').innerText = e.target.parentElement.querySelector('.task__textarea-editor').value;

        console.log(e.target.parentElement.querySelector('.task__textarea-editor').value);

        CanBan.closeOverlay(document.querySelector('.task__editor'));

        document.querySelector('.edit-text').classList.remove('edit-text');

        this._saveStateTask();
        // console.log(this)
    }

    _saveStateTask() {

        const stateArray = [
            { 'Backlog': [] },
            { 'Ready': [] },
            { 'In progress': [] },
            { 'Finished': [] }
        ];

        const taskBlock = document.querySelectorAll('.admin-panel__tasks-wrapper');

        // console.log(stateArray);

        taskBlock.forEach((el, index) => {
            const typeElem = el.dataset.type;
            el.querySelectorAll('.admin-panel__task-text').forEach(el => {
                stateArray[index][typeElem].push(el.innerText);
                // console.log(el.innerText)
            })
            // 
        });

        const storageData = JSON.parse(this._getDataLocalStorage('userCabinet'));

        storageData.forEach(el => {
            if(el.userLogin == this.currentUser) {
                el.data = stateArray;
            }
        })

        console.log(storageData);

        this._setDataLocalStorage('userCabinet', JSON.stringify(storageData));
        console.log(JSON.parse(this._getDataLocalStorage('userCabinet')));

    }

    _addEditForm(elem, editText) {

        const overlayCode = `<div class="overlay"></div>`;

        const editForm = `
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
                    <textarea class="task__textarea-editor">${editText}</textarea>
                    <button class="task__save-editor">Сохранить</button>
                </div>
            </div>
        `;

        elem.insertAdjacentHTML('beforeend', editForm);
        document.body.insertAdjacentHTML('beforeend', overlayCode);
    }

    _deleteTask(e) {
        e.currentTarget.parentElement.parentElement.remove();
        this._saveStateTask();
    }

    _getUserTasks(typeTask, obj, index) {
        let htmlTasks = '';

        obj[0].data[index][typeTask].forEach(el => {
            
            htmlTasks += `
            <div class="admin-panel__task-item">
                <div class="admin-panel__control-block">
                    <button class="admin-panel__edit-task">
                        <svg height="512pt" viewBox="0 0 512 511" width="512pt" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m405.332031 256.484375c-11.796875 0-21.332031 9.558594-21.332031 21.332031v170.667969c0 11.753906-9.558594 21.332031-21.332031 21.332031h-298.667969c-11.777344 0-21.332031-9.578125-21.332031-21.332031v-298.667969c0-11.753906 9.554687-21.332031 21.332031-21.332031h170.667969c11.796875 0 21.332031-9.558594 21.332031-21.332031 0-11.777344-9.535156-21.335938-21.332031-21.335938h-170.667969c-35.285156 0-64 28.714844-64 64v298.667969c0 35.285156 28.714844 64 64 64h298.667969c35.285156 0 64-28.714844 64-64v-170.667969c0-11.796875-9.539063-21.332031-21.335938-21.332031zm0 0" />
                            <path
                                d="m200.019531 237.050781c-1.492187 1.492188-2.496093 3.390625-2.921875 5.4375l-15.082031 75.4375c-.703125 3.496094.40625 7.101563 2.921875 9.640625 2.027344 2.027344 4.757812 3.113282 7.554688 3.113282.679687 0 1.386718-.0625 2.089843-.210938l75.414063-15.082031c2.089844-.429688 3.988281-1.429688 5.460937-2.925781l168.789063-168.789063-75.414063-75.410156zm0 0" />
                            <path
                                d="m496.382812 16.101562c-20.796874-20.800781-54.632812-20.800781-75.414062 0l-29.523438 29.523438 75.414063 75.414062 29.523437-29.527343c10.070313-10.046875 15.617188-23.445313 15.617188-37.695313s-5.546875-27.648437-15.617188-37.714844zm0 0" />
                            </svg>
                    </button>
                    <button class="admin-panel__delete-task">
                        <svg id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512"
                            width="512" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path
                                    d="m424 64h-88v-16c0-26.51-21.49-48-48-48h-64c-26.51 0-48 21.49-48 48v16h-88c-22.091 0-40 17.909-40 40v32c0 8.837 7.163 16 16 16h384c8.837 0 16-7.163 16-16v-32c0-22.091-17.909-40-40-40zm-216-16c0-8.82 7.18-16 16-16h64c8.82 0 16 7.18 16 16v16h-96z" />
                                <path
                                    d="m78.364 184c-2.855 0-5.13 2.386-4.994 5.238l13.2 277.042c1.22 25.64 22.28 45.72 47.94 45.72h242.98c25.66 0 46.72-20.08 47.94-45.72l13.2-277.042c.136-2.852-2.139-5.238-4.994-5.238zm241.636 40c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16zm-80 0c0-8.84 7.16-16 16-16s16 7.16 16 16v208c0 8.84-7.16 16-16 16s-16-7.16-16-16z" />
                            </g>
                        </svg>
                    </button>
                </div>
                <div class="admin-panel__task-wrapper">
                    <p class="admin-panel__task-text">${el}</p>
                </div>
            </div>
            `;
        });

        return htmlTasks;
    }

    _showTaskUser(e) {
        console.log('click More Details');
    }

    _deleteUser(e) {
        const deleteUser = e.target.dataset.login;
        let users = JSON.parse(this._getDataLocalStorage('users'));
        let resultUsers = users.filter(el => (el.login != deleteUser) ? el : false);
        // console.log(users);
        users = resultUsers;
        console.log(JSON.stringify(users));
        this._setDataLocalStorage('users', JSON.stringify(users));
        e.target.parentElement.parentElement.remove();
        console.log(JSON.parse(this._getDataLocalStorage('users')))
    }

    _getDataLocalStorage(key) { // Получаем данные из локального хранилища
        return localStorage.getItem(key);
    }

    _setDataLocalStorage(key, data) { // Записываем данные в локальное хранилище
        localStorage.setItem(key, data);
        // console.log('localStorage.getItem', localStorage.getItem('users'));
    }

    _createUserList() {
        let listUserHTML = '';
        const userArray = JSON.parse(this._getDataLocalStorage('users'));
        userArray.forEach(el => {
            if(el.role == 'user') {
                listUserHTML += `
                    <li class="users__item">
                        <div class="users__name">
                            ${el.login}
                        </div>
                        <div class="users__more">
                            <button class="users__button-more" data-login="${el.login}">More details</button>
                        </div>
                        <div class="users__delete">
                            <button class="users__button-delete" data-login="${el.login}">Delete user</button>
                        </div>
                    </li>
                `;
            }
            
        });

        return listUserHTML;
    }

    _addEventAll(arrElem, event, callback) {
        arrElem.forEach(el => {
            el.addEventListener(event, callback.bind(this))
        });
    }

}