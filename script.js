// ==========================
// Google Sheet URL
// ==========================

const sheetURL = "";


// ==========================
// Load Data
// ==========================

let users = JSON.parse(localStorage.getItem("users")) || [];



const form = document.getElementById("form");

const table = document.getElementById("table");

const total = document.getElementById("total");

const today = document.getElementById("today");



// ==========================
// Update Dashboard + Table
// ==========================

function update(){

    total.innerText = users.length;

    today.innerText = users.length;


    table.innerHTML = "";


    users.forEach((user,index)=>{


        let row = document.createElement("tr");


        row.innerHTML = `

        <td>${user.name}</td>

        <td>${user.email}</td>

        <td>${user.college}</td>

        <td>${user.year}</td>

        <td>
        <button onclick="removeUser(${index})">
        Delete
        </button>
        </td>

        `;


        table.appendChild(row);


    });


}




// ==========================
// Registration
// ==========================


form.addEventListener("submit",function(e){


e.preventDefault();



const user = {


name: document.getElementById("name").value,


email: document.getElementById("email").value,


phone: document.getElementById("phone").value,


college: document.getElementById("college").value,


department: document.getElementById("department").value,


year: document.getElementById("year").value,


date:new Date().toLocaleString()


};




// Save Local Storage

users.push(user);


localStorage.setItem(
"users",
JSON.stringify(users)
);




// Send To Google Sheet

fetch(sheetURL,{

method:"POST",

body:JSON.stringify(user)

})

.then(response=>response.json())

.then(data=>{

console.log("Saved to Google Sheet");

showToast(
"Registration Saved Successfully ✅"
);

})


.catch(error=>{


console.log(error);


showToast(
"Google Sheet Error ❌"
);


});




// Update UI

update();


form.reset();


});




// ==========================
// Delete User
// ==========================


function removeUser(index){


users.splice(index,1);


localStorage.setItem(
"users",
JSON.stringify(users)
);


update();


showToast(
"Participant Deleted"
);


}




// ==========================
// Search
// ==========================


document
.getElementById("search")
.addEventListener("input",function(){


let value=this.value.toLowerCase();



document
.querySelectorAll("#table tr")
.forEach(row=>{


row.style.display =
row.innerText
.toLowerCase()
.includes(value)
?
""
:
"none";


});


});




// ==========================
// Toast
// ==========================


function showToast(message){


const toast =
document.getElementById("toast");


toast.innerHTML = message;


toast.style.display="block";



setTimeout(()=>{


toast.style.display="none";


},2500);



}



// ==========================
// Initial Load
// ==========================

update();
