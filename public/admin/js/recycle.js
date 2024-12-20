// xóa vĩnh viễn 
const deleteRecycle = document.querySelectorAll("[delete-recycle-item]");
console.log(deleteRecycle);

if(deleteRecycle.length > 0){
    deleteRecycle.forEach(button => {
        const recycle = document.querySelector("#recycle");
        const path = recycle.getAttribute("path");
        button.addEventListener("click", ()=>{
            const id = button.getAttribute("data-id")
            const action = path + `/${id}?_method=DELETE`;
            console.log(action);
            
            recycle.action = action;
            recycle.submit();
        })
    })
}

// cap nhat lai san pham khi san pham bi xoa vao thung rac 
const updateItem = document.querySelectorAll("[update-recycle-item]");
if(updateItem.length > 0){
    updateItem.forEach(button => {
        const getForm = document.querySelector("#update");
        const path = getForm.getAttribute("path");
        console.log(path);
        button.addEventListener("click", ()=>{
            const id = button.getAttribute("data-id")
            console.log(id);
            const action = path + `/${id}?_method=PATCH`
            getForm.action = action;
            getForm.submit();
        })
    })
}

// thay trạng thái cho thùng rác recycle
const buttonStatusChange = document.querySelectorAll("[button-status-change]")
if (buttonStatusChange.length > 0){
    buttonStatusChange.forEach(button=>{
       const formChangeStatus = document.querySelector("#status");
       const path = formChangeStatus.getAttribute("path");
       button.addEventListener("click", ()=>{
            const currentStatus = button.getAttribute("change-status")
            const id = button.getAttribute("change-id");
            console.log(currentStatus);
            const changeStatus = currentStatus == "active" ? "inactive" : "active";
            console.log(changeStatus);
            const action = path + `/${changeStatus}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
       })
        
    })
} 

