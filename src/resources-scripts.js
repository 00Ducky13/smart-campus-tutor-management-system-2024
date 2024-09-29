import { getAllTestResources } from "./api/resource-api.js";

// Initialize Firebase



let master_resource_list = [{
    name: "The Cosmic Perspective",
    subject: "Astronomy",
    course: "PHYS1026",
    owner: "Danielle Smal",
    link: "https://drive.google.com/file/d/1CjPhSHJYIjKw07LUF-D6k9MP-meEUkE5/view?usp=drive_link"
},
{name: "Statistical Physics",
    subject: "Physics",
    course: "PHYS3001",
    owner: "Danielle Smal",
    link: "https://drive.google.com/file/d/1CjPhSHJYIjKw07LUF-D6k9MP-meEUkE5/view?usp=drive_link"}];

document.addEventListener('DOMContentLoaded', function () {
    console.log("Content Loaded");
    removeResourceCards();
    drawResourceCards(master_resource_list);
    let resourceTestData = getAllTestResources();
    console.log(resourceTestData);
});

function drawResourceCards(resource_list){
    const resourceGrid = document.getElementById("resourceGrid");
    for (let i=0;i<resource_list.length;i++){
        //console.log("Item found");    
        let resourceCard = document.createElement("a");
        resourceCard.setAttribute("class","resource-item");
        resourceCard.setAttribute("href",resource_list[i].link);
        resourceCard.setAttribute("id","resourceCard-"+i.toString())
        resourceCard.setAttribute("display","");
        let resourceName = document.createElement("p");
        resourceName.innerHTML = "<strong>" + resource_list[i].name + "</strong>";
        resourceCard.appendChild(resourceName);
        let resourceSubject = document.createElement("p");
        resourceSubject.innerHTML = "<strong>Subject:</strong> " + resource_list[i].subject;
        resourceCard.appendChild(resourceSubject);
        let resourceCourse = document.createElement("p");
        resourceCourse.innerHTML = "<strong>Course:</strong> " + resource_list[i].course;
        resourceCard.appendChild(resourceCourse);
        let resourceOwner = document.createElement("p");
        resourceOwner.innerHTML = "<strong>Uploader:</strong> " + resource_list[i].owner;
        resourceCard.appendChild(resourceOwner);
        resourceGrid.appendChild(resourceCard);
    }    
}
function removeResourceCards(){
    for (let i=0;i<master_resource_list.length;i++){
        let tempCard = document.getElementById("resourceCard-"+i.toString());
        if (tempCard !== null){
            tempCard.remove();
        }
    }
}

document.getElementById("resourceSearchBar").addEventListener("keypress",function(event) {

    if ( event.key === "Enter" ) {
        let searchBar = document.getElementById("resourceSearchBar");
        let searchText = searchBar.value.toUpperCase();
        if (searchText === ""){
            removeResourceCards();
            drawResourceCards(master_resource_list);
        }
        else{
            let tempResourceList = master_resource_list.filter(item => item.name.toUpperCase().indexOf(searchText)>-1);
            removeResourceCards();
            drawResourceCards(tempResourceList);
        }
    }
});