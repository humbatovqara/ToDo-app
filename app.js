// Elementləri seçmək
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

// Bütün hadisələri bir funksiya daxilində yığırıq
function eventListeners () {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

// Səhifə yükləndikdə yaddaşdan tapşırıqları ekrana çəkən funksiya
function loadAllTodosToUI () {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
}

// Tapşırığı əlavə etmək - yoxlamadan keçirərək
function addTodo (e) {
    // İnput-dan alınan dəyərdəki boşluqları qaldırmaq üçün
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger", "Bu sahə boş buraxıla bilməz!");
    }
    else if (getTodosFromStorage().includes(newTodo)) {
        showAlert("danger", "Artıq daxil edilib!");
        todoInput.value = "";
    }
    else {
        // Tapşırığı ekrana yazma
        addTodoToUI(newTodo);  

        // Tapşırığı yaddaşa yazma
        addTodoToStorage(newTodo);
        showAlert("success", "Tapşırıq daxil edildi!");      
    }

    e.preventDefault();
}

// Xəbərdarlıq mesajlarının çıxması üçün ümumi funksiya
function showAlert (type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // 2 saniyə ərzində ekranda görünmə
    setTimeout(function () {
        alert.remove();
    }, 2000);
}

// Tapşırıqları əlavə etmək üçün array yaradan funksiya - array şəklində geri alır
function getTodosFromStorage () {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } 
    else {
        todos = JSON.parse(localStorage.getItem("todos")); // String to Array
    }

    return todos;
}

// Tapşırığı yaddaşa əlavə edən funksiya - arraydan string-ə çevirir
function addTodoToStorage (newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));
}

// Tapşırığı ekrana çıxaran funksiya - li elementini yaradaraq
function addTodoToUI (newTodo) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo)); // Create Text Node
    listItem.appendChild(link);
    todoList.appendChild(listItem);

    todoInput.value = "";
}

// Tapşırığı silən funksiya
function deleteTodo (e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Tapşırıq silindi!");
    }
}

// Tapşırığı yaddaşdan silmək
function deleteTodoFromStorage (deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1);
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

// Filterləmə əməliyyatı
function filterTodos (e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            // Tapşırıq tapılmadı
            listItem.setAttribute("style","display : none !important");
        }
        else {
            listItem.setAttribute("style","display : block");
        }
    });
}

// Bütün tapşırıqları təmizlə
function clearAllTodos (e) {
    if (confirm("Hamısı silinsin?")) {
        // Ekranda Tapşırıqları təmizlə
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}