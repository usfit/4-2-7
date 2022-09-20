// Поле ввода
let input = document.querySelector('.input-text');

// Вывод результатов поиска
let ul = document.querySelector('.search-list');
// ul.classList.toggle('hide');

// Вывод выбранных репо
let ulAnswer = document.querySelector('.answer-list');

// Создание словаря
// let repoAnswer = {};

// Пустые значения в словаре
function nullAnswer(repo) {
    let repoAnswer = {};
    for (let i = 0; i < repo.length; i++) {
        repoAnswer[i] = {};
    }
    return repoAnswer;
}

// Получение репозиториев через API
async function getRepositories(qInput) {
    let url = `https://api.github.com/search/repositories?q=${qInput}&page=1&per_page=5&sort=stars&order=desc}`;
    let repos = await fetch(url);
    let answer = await repos.json();
    // if (answer.message === 'Validation Failed')
    let repositories = answer.items;
    return repositories;
}

// Добавляение репозиториев в словарь
function createAnswer(repositories) {
    repositories.forEach((elem, id) => {
        repoAnswer[id]['name'] = elem.name;
        repoAnswer[id]['owner'] = elem.owner.login;
        repoAnswer[id]['stars'] = elem['stargazers_count'];
    })
    return repoAnswer;
}

// Функция очистки

function clearInfo() {
    while (ul.firstChild) {
        ul.removeChild(ul.lastChild);
    }
    ul.classList.toggle('hide');
}

// Функция добавление информации в список на страницу

function addInfoPage(repoAnswer) {
    let fragment = new DocumentFragment();
    Object.keys(repoAnswer).forEach(key => {
        let li = document.createElement('li');
        li.textContent = repoAnswer[key]['name'];
        li.classList.add('search-list__element');
        li.id = key;
        fragment.append(li);
    })
    ul.append(fragment);
}

// Получение информации из репозиториев Основная функция
async function getRepositoriesInfo() {
    if (qInput.length !== 0 && qInput.trim()) {
        clearInfo();
        let repositories = await getRepositories(qInput);
        repoAnswer = nullAnswer(repositories);
        repoAnswer = createAnswer(repositories);
    
        // Добавляем информацию в список на страницу

        addInfoPage(repoAnswer);
    
        if (ul.classList.contains('hide')) {
            ul.classList.toggle('hide');
        }
        return repoAnswer;
    } else {
        input.value = '';
        clearInfo();
    }

}

// Схлопывание запросов
const debounce = (fn, debounceTime) => {
    let time;
    return function (...args) {
        clearTimeout(time);
        time = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    };
};
const debouncedFn = debounce(getRepositoriesInfo, 500);

// Cлучатель событий в инпут
input.addEventListener('input', () => {
    qInput = input.value;
    debouncedFn();
})

// Слушатель клика на список с делегированием
ul.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.value === 'search-list__element' && target.textContent !== '') {
        let liAnswer = document.createElement('li');
        liAnswer.classList.add('answer-list__element');
        // Блок значка удаления
        let close = document.createElement('div');
        close.classList.add('close');
        Object.keys(repoAnswer[target.id]).forEach(key => {
            // Текстовое содержимое
            let p = document.createElement('p');
            p.textContent = `${key[0].toUpperCase() + key.slice(1) }: ${repoAnswer[target.id][key]}`;
            liAnswer.append(p);
            liAnswer.append(close);
        })

        ulAnswer.append(liAnswer);

        // Чистим данные после клиека
        input.value = '';
        clearInfo();
    }
})

// Удаление элемента

ulAnswer.addEventListener('click', (event) => {
    let target = event.target;
    if (target.classList.value == 'close') {
        target.parentNode.remove();
    }
})
