import { getAllTestResources,uploadTestResource } from "./api/resource-api.js";

// Initialize Firebase



let master_resource_list = [];
let fullFilterList = [];
async function populateResourceList(){
    let results = await getAllTestResources();
    for(let i=0;i<results.length;i++){
        let tempObj = results[i];
        master_resource_list.push(tempObj);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("filterWrapper").style.display = "none";
    console.log("Content Loaded");
    populateResourceList().then(res =>{
        fullFilterList = [].concat(master_resource_list);
        removeResourceCards();
        drawResourceCards(master_resource_list);
    });   
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
            drawResourceCards(fullFilterList);
        }
        else{
            let tempResourceList = fullFilterList.filter(item => item.name.toUpperCase().indexOf(searchText)>-1);
            removeResourceCards();
            drawResourceCards(tempResourceList);
        }
    }
});

document.getElementById("resourceFilterButton").addEventListener("click",function(event) {

    let filterBlock = document.getElementById("filterWrapper");
    if (filterBlock.style.display == "none"){
        filterBlock.style.display = "block";
    }
    else{
        filterBlock.style.display = "none";
    }
});

document.getElementById("clearFilter").addEventListener("click",function(event) {
    document.getElementById("filterSubject").value = "";
    document.getElementById("filterCourse").value = "";
    document.getElementById("filterUploader").value = "";
    fullFilterList = [].concat(master_resource_list);
    removeResourceCards();
     drawResourceCards(master_resource_list);
});

document.getElementById("applyFilter").addEventListener("click",function(event) {
    let subjectText = document.getElementById("filterSubject").value.toUpperCase();
    let courseText = document.getElementById("filterCourse").value.toUpperCase();
    let uploaderText = document.getElementById("filterUploader").value.toUpperCase();
    let subjectList;
    let courseList;
    let uploaderList;
    if (subjectText === ""){
        subjectList = master_resource_list;
    }
    else{
        subjectList = master_resource_list.filter(item => item.subject.toUpperCase().indexOf(subjectText)>-1);
    }
    if (courseText === ""){
        courseList = master_resource_list;
    }
    else{
        courseList = master_resource_list.filter(item => item.course.toUpperCase().indexOf(courseText)>-1);
    }
    if (uploaderText === ""){
        uploaderList = master_resource_list;
    }
    else{
        uploaderList = master_resource_list.filter(item => item.uploader.toUpperCase().indexOf(uploaderText)>-1);
    }
    let tempFilterList = subjectList.filter(element => courseList.includes(element));
    fullFilterList = tempFilterList.filter(element => uploaderList.includes(element))
    removeResourceCards();
    drawResourceCards(fullFilterList);
});

document.getElementById("uploadResourceButton").addEventListener("click",function(event) {
    document.getElementById("uploadResourceDialog").showModal();
});

document.getElementById("cancelUploadBtn").addEventListener("click",function(event) {
    document.getElementById("uploadResourceDialog").close();
});

document.getElementById("confirmUploadBtn").addEventListener("click",function(event) {
    let tempObj = {
        name: document.getElementById("uploadName").value,
        subject: document.getElementById("uploadSubject").value,
        course: document.getElementById("uploadCourse").value,
        owner: document.getElementById("uploadUploader").value,
        link: document.getElementById("uploadLink").value
    }
    uploadTestResource(tempObj).then(res =>{
        if (res !== "error"){
            populateResourceList().then(res1 =>{
                master_resource_list = [];
                fullFilterList = [].concat(master_resource_list);
                removeResourceCards();
                drawResourceCards(master_resource_list);});
            document.getElementById("resourceUploadDlgText").innerText = "Upload Successful";
            console.log("Upload Successful");
            document.getElementById("uploadName").value = "";
        document.getElementById("uploadSubject").value = "";
        document.getElementById("uploadCourse").value = "";
         document.getElementById("uploadUploader").value = "";
         document.getElementById("uploadLink").value = "";
            document.getElementById("resourceUploadDlgInfo").showModal();
            //document.getElementById("uploadResourceDialog").close();
        }
        else{
            document.getElementById("resourceUploadDlgText").innerText = "Upload Unsuccessful";
            document.getElementById("resourceUploadDlgInfo").showModal();
        }
        
    });
});

document.getElementById("resourceUploadDlgOk").addEventListener("click",function(event) {
    document.getElementById("resourceUploadDlgInfo").close();
});