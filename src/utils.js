import navDropdown from "./script/nav-dropdown";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User, arrUser) {
  localStorage.clear();
  arrUser.forEach(el => {
    const { login, password, role } = el
    const testUser = new User(login, password, role);
    User.save(testUser);
  })
};

export const generateUserCabinet = function(data, Cabinet) {
  data.forEach(el => {
    const { user, taskList } = el
    const cabinet = new Cabinet(user, taskList);
    Cabinet.save(cabinet);
  })
}

export const renderFormLogin = function(formLogin) { // Рендерим форму логина
  document.querySelector('.navbar-collapse').innerHTML += formLogin;
}

export const deleteDOMElement = function(selector) { // Удаляем элемент со страницы
  document.querySelector(selector).remove();
}

export const renderLoginNav = function(userNav, userName) { // Рендерим навигацию для пользователя
  document.querySelector('.navbar-collapse').innerHTML += userNav;
  document.querySelector('.hello-user__name').innerText = userName;
  navDropdown('.user-login');
}

// export const logOutUser = function(appState) {
//   console.log('appState', appState = '');
// }

export const searchRoleUser = function(login) { // Получаем роль пользователя
  const users = JSON.parse(localStorage.getItem('users'));
  let role = '';
  users.forEach(el => {
    if(el.login === login) {
      role = el.role;
    }
  })
  return role;
}

export const renderContent = function(template) {
  document.querySelector("#content").innerHTML = template;
}

export const mobileNav = () => {
  const buttonNavToggler = document.querySelector('.navbar-toggler');
  buttonNavToggler.addEventListener('click', (e) => {
    e.currentTarget.nextElementSibling.classList.toggle('collapse');
  })
}