const deletedItem = document.querySelectorAll("[delete-item]");
console.log(deletedItem);

if (deletedItem.length > 0) {
    const deleted = document.querySelector("#deleted"); // Lấy form một lần
    const path = deleted.getAttribute("path");

    deletedItem.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            
            if (isConfirmed) {
                const action = `${path}/${id}?_method=PATCH`;
                deleted.action = action;
                deleted.submit();
            }
        });
    });
}


// tính năng thay đổi trạng thái danh mục 1 sản phẩm 
const buttonStatusChange = document.querySelectorAll("[button-status-change]");
console.log(buttonStatusChange.length > 0);
if(buttonStatusChange){
    buttonStatusChange.forEach(button=>{
        const formChangeMulti = document.querySelector("#form-changeMulti");
        const path = formChangeMulti.getAttribute("path")
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("change-status");
            const id = button.getAttribute("change-id");
            const changeStatus = status == "active" ? "inactive" : "active";
            const action = path + `/${changeStatus}/${id}?_method=PATCH`;
            console.log(action);
            
            formChangeMulti.action = action;
            formChangeMulti.submit();
        })
    })
}
