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

// tinh nang xap xep theo tieu chi
const sort = document.querySelectorAll("[sort]");
if(sort.length > 0){
   const selectSort = document.querySelector("[select-sort]");
   const selecClear = document.querySelector("[select-clear]"); 
   
   const url = new URL(window.location.href);
   selectSort.addEventListener("change", (e)=>{
     const [sortKey, sortValue] = e.target.value.split("-");
     url.searchParams.set("sortKey", sortKey);
     url.searchParams.set("sortValue", sortValue);

     window.location.href = url.href;
     
   })
   selecClear.addEventListener("click", ()=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
         window.location.href = url.href;
    } 
    )
    // truong mac dinh khi chon truong nao thi se hien thi truong do la mac dinh
   const sortKey = url.searchParams.get("sortKey");
   const sortValue = url.searchParams.get("sortValue");
   if(sortKey && sortValue){
    const option = selectSort.querySelector(`option[value="${sortKey}-${sortValue}"]`);
    option.selected = true;
   }
}



