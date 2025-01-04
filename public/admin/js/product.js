const buttonStatusChange = document.querySelectorAll("[button-status-change]");
if(buttonStatusChange.length > 0){
    console.log(buttonStatusChange);
    buttonStatusChange.forEach(button => {
        const changeStatusPath = document.querySelector("#changeStatusPath");
        const path = changeStatusPath.getAttribute("path");
        button.addEventListener("click", ()=>{
            const statusCrrent = button.getAttribute("change-status");
            const id = button.getAttribute("change-id");
            console.log(statusCrrent);
            console.log(id);

            const changeStatus = statusCrrent == "active" ? "inactive" : "active";
            console.log(changeStatus);

            const action = path + `/${changeStatus}/${id}?_method=PATCH`;
            console.log(action);
            changeStatusPath.action = action;
            changeStatusPath.submit();
        })
    }) 
}

// tính năng xóa 
const deleteItem = document.querySelectorAll("[delete-item]");
if(deleteItem.length > 0 ){
   deleteItem.forEach(button => {
    const formDelete = document.querySelector("#form-delete");
    const path = formDelete.getAttribute("path");
    button.addEventListener("click", ()=>{
        const id = button.getAttribute("data-id");
        console.log(id);
        const action = path + `/${id}?_method=PATCH`;
        console.log(action);
        formDelete.action = action;
        formDelete.submit();
    })
   })
    
}



