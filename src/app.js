import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "./styles/media.css";

// Шаблоны HTML
import startContent from "./templates/startContent.html";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import formLogin from "./templates/formLogin.html";
import userNav from "./templates/userNav.html";
import AdminPage from "./templates/adminPage.html";
import adminPage from "./templates/adminPage.html";
import adminListUserCanBan from "./templates/adminListUserCanBan.html";


// Функции, классы
import { User } from "./models/User";
import { generateTestUser, 
         renderFormLogin, 
         deleteDOMElement, 
         renderLoginNav, 
         renderContent, 
         generateUserCabinet, 
         mobileNav 
} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { Cabinet } from "./models/Cabinet"
import { CanBan } from "./func/CanBan";
import { AdminPanel } from "./func/AdminPanel";

// Данные 
import users from './data/users';
import cabinet from './data/cabinet';



export const appState = new State();

renderContent(startContent);

// document.querySelector("#content").innerHTML = taskFieldTemplate; // Показать блок с задачами
// document.querySelector("#content").innerHTML = AdminPage; // Показать Админ панель

// const ap = new AdminPanel(adminPage, adminListUserCanBan);


renderFormLogin(formLogin); // Выводим форму логина
mobileNav();
// renderLoginNav(userNav, 'test1');


const loginForm = document.querySelector("#app-login-form"); // Получаем форму логина в переменную

generateTestUser(User, users); // Генерируем пользователей
generateUserCabinet(cabinet, Cabinet);

loginForm.addEventListener("submit", processingForm);

function processingForm(e) {
  e.preventDefault();

  const login = this.querySelector('[name="login"]').value;
  const password = this.querySelector('[name="password"]').value;

  if(authUser(login, password)) {
    // console.log(appState)
    

    deleteDOMElement('#app-login-form');
    renderLoginNav(userNav, appState.currentUser.login);

    if(appState._currentUser.role == 'user') {
      renderContent(taskFieldTemplate);
      const cb = new CanBan('.task');
      cb.start();
    } else if(appState._currentUser.role == 'admin') {
      // renderContent(AdminPage);
      new AdminPanel(adminPage, adminListUserCanBan);
    }
    

    console.log("ROLE", appState._currentUser.role);

    document.querySelector('.logout-user').addEventListener('click', () => {
      appState.clearCurrentUser();
      // console.log(appState);
      deleteDOMElement('.user-login-wrapper');
      renderFormLogin(formLogin);
      const loginForm = document.querySelector("#app-login-form");
      // console.log(loginForm)
      loginForm.addEventListener("submit", processingForm);
      renderContent(startContent);


      document.querySelector('.footer__progress-list') ? document.querySelector('.footer__progress-list').remove() : false;
    });

  } else {
    renderContent(noAccessTemplate);
  }
}


const cb = new CanBan('.task');
    cb.start()