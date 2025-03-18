console.log("fail ühendatud");

//idee sain stackoverflow-st, muutsin enda koodi jaoks selle funktsiooniks
//https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
function formatDate(dateString) {
    const date = new Date(dateString);
    let day = String(date.getDate() );
    let month = String(date.getMonth() + 1);
    if (month.length < 2) {
        month = "0" + month;
    }
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

class Entry {
    constructor(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
    }
}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()});
        document.querySelector("#sortButton").addEventListener("click", () => {
            this.sortEntriesByDate();
        });
    }

    sortEntriesByDate() {
        this.entries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        this.save();
    }

    addEntry() {
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue));
        console.log(this.entries);
        this.save();
    }

    render() {
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";
    
        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            editButton.innerText = "Muuda";
            doneButton.innerText = "✔"
            deleteButton.innerText = "X";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";
            
            //selle osa sain tehtud ise, kuid kasutasin github copiloti abi
            //et mitte kõike käsitsi välja kirjutada
            const priorityDropdown = document.createElement("select");
            priorityDropdown.className = "priority";
            const option1 = document.createElement("option");
            option1.value = "1";
            option1.text = "Kõrge";
            const option2 = document.createElement("option");
            option2.value = "2";
            option2.text = "Keskmine";
            const option3 = document.createElement("option");
            option3.value = "3";
            option3.text = "Madal";

            priorityDropdown.add(option1);
            priorityDropdown.add(option2);
            priorityDropdown.add(option3);
            priorityDropdown.value = entryValue.priority || "2";
        
            priorityDropdown.addEventListener("change", () => {
                this.entries[entryIndex].priority = priorityDropdown.value;
                this.save();
            });

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
            });

            doneButton.addEventListener("click", () => {
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                this.save();
            });
            
            //contentdivi lasi chatgpt mul teha, sest ma ei saanud prioriteetide
            //dropdown menust valikuid valida
            //kuna ise ei suutnud aru saada, milles viga seisnes lasin lõpuks chatgpt-l
            //kogu oma js faili üle vaadata ja sealt lasigi ta div.innerhtmli muuta contentdiviks

            //prompt: can you tell me what prevents me from selecting options from the dropdown menu

            const contentDiv = document.createElement("div");
            contentDiv.className = "task-content";
            const formattedDate = formatDate(entryValue.date);
            contentDiv.innerHTML = `${entryValue.title} - ${entryValue.description} (${formattedDate})`;

            editButton.addEventListener("click", () => {
                contentDiv.innerHTML = "";
                //siin aitas chatgpt lahenduse idee ja ka koodi kirjutamisega

                //esialgne prompt: I have a page for todo lists, how to create editButton in js
                //which would allow to edit the task title, description and date

                //sealt hakkas ta mulle nullist kogu html, js ja css koode kirjutama
                //et eeldada milline mu kood võiks olla seega pidin teda natuke suunama

                //teise promptina andsin talle selle: editButton.addEventListener("click", () => {
                //mille olin ise kirjutanud ja sealt edasi oskas ta päris kenasti mu koodi edasi teha

                //mingeid muudatusi tegin siin aga suures osas on chatgpt kirjutatud kood
                const titleInput = document.createElement("input");
                titleInput.value = entryValue.title;
                const descInput = document.createElement("input");
                descInput.value = entryValue.description;
                const dateInput = document.createElement("input");
                dateInput.type = "date";
                dateInput.value = entryValue.date;
            
                const saveButton = document.createElement("button");
                saveButton.innerText = "Save";
                saveButton.className = "save";
            
                saveButton.addEventListener("click", () => {
                    const newTitle = titleInput.value;
                    const newDesc = descInput.value;
                    const newDate = dateInput.value;
            
                    this.entries[entryIndex].title = newTitle;
                    this.entries[entryIndex].description = newDesc;
                    this.entries[entryIndex].date = newDate;
            
                    this.save();
                });
            
                div.appendChild(titleInput);
                div.appendChild(descInput);
                div.appendChild(dateInput);
                div.appendChild(saveButton);
            });

            div.className = "task";
            div.appendChild(contentDiv);

            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }

            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(priorityDropdown);
        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

const todo = new Todo();
