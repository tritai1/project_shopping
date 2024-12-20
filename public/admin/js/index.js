const buttonStatus = document.querySelectorAll('[button-status]');
if(buttonStatus.length > 0){

    buttonStatus.forEach((button)=>{
        // let url = window.location.href; // lấy ra url hiện tại của trang
        let url = new URL(window.location.href); // HÀM URL ở đây giúp chúng ta có thể thêm các key vao hay pram vào url
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status");
            console.log(status);
            
            if(status){ // kiếm tra status nếu là acive hay inactive thì lấy ra url chứa nó 
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status") // kiêm tra nếu status rổng thì sẽ delete đi các pram thêm vào trước đó 
            }

            window.location.href = url.href; // điểm hướng dến một url mới hay một trang khác
            
        })
    })
    
}

// form-search
const formControl = document.querySelector("#form-search");
if(formControl){
    let url = new URL(window.location.href); // lấy ra url hiện tại sử dụng Hàm URL ĐỂ BÓC TÁCH
    formControl.addEventListener("submit", (e)=>{
        e.preventDefault(); // loại bỏ sự kiện load lại của trang
        const keyword = e.target.keyword.value;
        if(e.target.keyword.value){
            url.searchParams.set("keyword", keyword);
        }else {
            url.searchParams.delete("keyword")
        }
        
        window.location.href = url.href; // trả ra url sau khi submit
        
    })
}

// panigation  xủ lý phân trang cho phần sản phẩm giao diên admin

const panigation = document.querySelectorAll("[button-pagination]");

if(panigation){
    panigation.forEach(button=>{
        let url = new URL(window.location.href);
        button.addEventListener("click", ()=>{

            const currentPage = button.getAttribute("button-pagination")
            if (currentPage){
                url.searchParams.set("page", currentPage);
            }else {
                url.searchParams.delete("page");
            }

            window.location.href = url.href;
                
            
        })
    })
}

// xử lí tính năng thay đổi tràn thái với nhiều sản phẩm 
const changeMulti = document.querySelector("[check-box-multi]");
console.log(changeMulti);
if(changeMulti){
    const inputCheckAll = changeMulti.querySelector("input[name=checkAll]");
    const inputIds = changeMulti.querySelectorAll("input[name=id]")
    inputCheckAll.addEventListener("click", ()=>{
        console.log(inputCheckAll.checked);
        if(inputCheckAll.checked){
           inputIds.forEach(input => {
            input.checked = true;
           })
        }else {
            inputIds.forEach(input => {
             input.checked = false;
            })
        }
        
    })
    inputIds.forEach(input => {
        input.addEventListener("click", ()=>{
            const currentchecked = document.querySelectorAll("input[name=id]:checked").length; // ở đây lúc này chúng ta check qua tường phần tử xem có đước tích hay chưa và lấy ra độ dài các ô đã tích cào
            console.log(currentchecked);
            console.log(inputIds.length);
            if(currentchecked == inputIds.length){
                inputCheckAll.checked = true;
            }else {
                inputCheckAll.checked = false;
            }
            
        })
    })
}
// xử lí change-multi 
const formChangeMulti = document.querySelector("[form-change-multi]");
console.log(formChangeMulti);
if (formChangeMulti){
    formChangeMulti.addEventListener("submit", (e)=>{
        e.preventDefault();
        const checkBoxMulti = document.querySelector("[check-box-multi]");
        const inputCheckedIds = checkBoxMulti.querySelectorAll("input[name='id']:checked");
         
        // xóa nhiều sản phẩm
        const changeType = e.target.elements.type.value;
        if(changeType == "deleted-All"){
            const confirms = confirm("Bạn có muốn xóa sản phẩm này")
            if(!confirms){
                return
            }
        }

        if (inputCheckedIds.length > 0){
            const inputIds = document.querySelector("input[name='ids']");
            const ids = [];
            inputCheckedIds.forEach(input=>{
                const id = input.getAttribute("value");
                if(changeType == "change-position"){
                   const position = input.closest("tr").querySelector("input[name='position']").value;
                   ids.push(`${id}-${position}`)
                   console.log(`${id}-${position}`);
                   
                } else {
                    ids.push(id) 
                }
                 
            }) 
            
            inputIds.value = ids.join(", ")
            formChangeMulti.submit();
            
        }        
    })
}

// sử lý giao diện thông báo 
const showAlert = document.querySelector("[show-alert]");
if (showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    }, time)
    closeAlert.addEventListener("click", ()=>{
        showAlert.classList.add("alert-hidden");
    })
}

// xử lý giao diện upload ảnh 
const formChangeMultiS = document.querySelector("[form-change-multi]");
if(formChangeMultiS){
    const updateImg = document.querySelector("[update-img]");
    const uploadImgPreview = document.querySelector("[uploads-img-preview]");
    updateImg.addEventListener("change", (e)=>{
        const file = e.target.files[0];
        if(file){
          uploadImgPreview.src = URL.createObjectURL(file);
        }
    })
}
// xử lí giao diện xóa ảnh trong tạo mới sản phẩm có nghĩa là có thể xóa anh trên giao diện khi upload lên
const formChangeMultis = document.querySelector("[form-change-multi]")
if (formChangeMultis){
    const updateImg = document.querySelector("[update-img]");
    const uploadImgPreview = document.querySelector("[uploads-img-preview]");
    const deleteImg = document.querySelector("[delete-img]");
    deleteImg.addEventListener("click", ()=>{
        updateImg.value = "";
        uploadImgPreview.src = "";
    })
}