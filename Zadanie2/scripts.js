import {API_KEY, BIN_ID} from './keys.js'

"use strict"
let toDoList = [];
const HTTP_OK = 200;

class toDoObject {
    constructor(title, description, place, category, dueDate){
        this.title = title;
        this.description = description;
        this.place = place;
        this.category = category;
        this.dueDate = dueDate;
    }

}

let filterInput = document.getElementById("inputSearch");
let startDateFilter = document.getElementById("startDateFilter");
let endDateFilter = document.getElementById("endDateFilter");
filterInput.addEventListener("input", function(event) {
    updateTodoList();
});
startDateFilter.addEventListener("input", function(event) {
    updateTodoList();
});
endDateFilter.addEventListener("input", function(event) {
    updateTodoList();
});

let initList = function() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_OK) {
            const response = JSON.parse(req.responseText);
            toDoList = response.record;
            updateTodoList();
        }
    };

    req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
    req.setRequestHeader("X-Master-Key", API_KEY);
    req.send();
}



let updateJSONbin = function(toDoList) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_OK) {
            console.log(req.responseText);
        }
    };

    req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", API_KEY);
    req.send(toDoList);
}

let checkBetweenDates = function(todo) {
    let startDate = new Date(startDateFilter.value);
    let endDate = new Date(endDateFilter.value);
    if (startDate.toString() !== 'Invalid Date' && endDate.toString() !== 'Invalid Date') {
        let dueDate = new Date(todo.dueDate);
        return dueDate >= startDate && dueDate <= endDate;
    } else {
        return true;
    }
}

let updateTodoList = function() {
    let toDoTable = document.getElementById("toDoTable");

    let toDoTableBody = toDoTable.getElementsByTagName("tbody")[0];

    //remove all elements
    while (toDoTableBody.firstChild) {
        toDoTableBody.removeChild(toDoTableBody.firstChild);
    }

    //add all elements
    let filterInput = document.getElementById("inputSearch");

    toDoList.filter(checkBetweenDates).forEach(todo => {
        if (
            (filterInput.value.toLowerCase() === "") ||
            (todo.title.toLowerCase().includes(filterInput.value.toLowerCase())) ||
            (todo.description.toLowerCase().includes(filterInput.value.toLowerCase()))
        ) {
            let row = toDoTableBody.insertRow();

            let cellTitile = row.insertCell(0);

            cellTitile.innerHTML = todo.title;

            let cellDescription = row.insertCell(1);

            cellDescription.innerHTML = todo.description;

            let cellPlace = row.insertCell(2);

            cellPlace.innerHTML = todo.place;

            let cellCategory = row.insertCell(3);

            cellCategory.innerHTML = todo.category;

            let cellDate = row.insertCell(4);

            const dueDate = new Date(todo.dueDate);

            const day = String(dueDate.getDate()).padStart(2, '0');
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const year = dueDate.getFullYear();

            const formattedDate = `${day}-${month}-${year}`;
            //cellDate.innerHTML = formattedDate;
            cellDate.innerHTML = dueDate.toLocaleDateString();





            // let newElement = document.createElement("p");
            // let newContent = document.createTextNode(toDoList[todo].title + " " +
            //                                         toDoList[todo].description);



            let newDeleteButton = document.createElement("button");
            let icon = document.createElement("i");
            icon.className = "fas fa-trash";
            newDeleteButton.className = "btn btn-danger danger";
            newDeleteButton.appendChild(icon);
            newDeleteButton.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });

            let cellDelete = row.insertCell(5);
            cellDelete.appendChild(newDeleteButton);

            // newElement.appendChild(newContent);
            // newElement.appendChild(newDeleteButton);
            // todoListDiv.appendChild(newElement);
        }
    });
}

let deleteTodo = function(todo) {
    toDoList.splice(toDoList.indexOf(todo), 1);
    updateTodoList();
    updateJSONbin(JSON.stringify(toDoList));
}


let addTodo = async function() {
    //get the elements in the form
      let inputTitle = document.getElementById("inputTitle");
      let inputDescription = document.getElementById("inputDescription");
      let inputPlace = document.getElementById("inputPlace");
      let inputDate = document.getElementById("inputDate");
    //get the values from the form
      let newTitle = inputTitle.value;
      let newDescription = inputDescription.value;
      let newPlace = inputPlace.value;
      let newDate = new Date(inputDate.value);

      //pseudo data validation
      if (!newTitle || !newDescription || !newPlace || newDate.toString() === 'Invalid Date') {
          alert("Wprowadź wszystkie dane!");
          return;
      }

      let form = document.getElementById("addElement");
      form.reset();

    // Wysyłanie zapytania do serwera o kategoryzację
    let newCategory;
    try {
        const response = await fetch('http://localhost:3000/categorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        });
        const data = await response.json();
        newCategory = data.category || 'Uncategorized';
    } catch (error) {
        console.error('Błąd podczas kategoryzacji:', error);
        newCategory = 'Uncategorized'; // Domyślna kategoria w przypadku błędu
}

    //create new item
      let newTodo = new toDoObject(newTitle, newDescription, newPlace, newCategory, newDate)
    //add item to the list
      toDoList.push(newTodo);
      updateTodoList();
      updateJSONbin(JSON.stringify(toDoList));
  }

document.getElementById("submitButton").addEventListener("click", addTodo);

initList();
updateTodoList();
