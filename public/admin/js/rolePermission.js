// sửa lí giao diện phân quyền đăng nhập
const rolePermission = document.querySelector("[table-rolePermission]")
if(rolePermission){
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", ()=>{
        let permission = [];
        const rows = rolePermission.querySelectorAll("[data-name]") // lấy ra các thẻ data-name được checked
        // console.log(rows);
        rows.forEach(row=> { // lăp qua và lấy ra tên từng thẻ 
            const name = row.getAttribute("data-name")
            const inputs = row.querySelectorAll("input")
            if(name == "id"){
                inputs.forEach(item=>{
                    const id = item.value;                    
                    permission.push({
                        id: id,              // lấy ra id từ thẻ input và lưu vào mảng
                        permissions: []
                    })                    
                })                  
            } else {
                inputs.forEach((input, index) =>{
                    const checked = input.checked;
                    // console.log(name);
                    // console.log(index);     // lần lươt lưu lại cái quyền theo vị trí vào bảng
                    // console.log(checked);   // ví dụ index=0 là quyền quản trị viên index = 1 là quyền quản lý nội dung
                  if(checked){
                    permission[index].permissions.push(name);
                  }
                    
                })
            }
                       
        });
        console.log(permission); 
        if(permission.length > 0){
            const formChangePermission = document.querySelector("#form-change-permission");
            console.log(formChangePermission);
            const inputPermission = formChangePermission.querySelector("input[name='permission']");
            inputPermission.value = JSON.stringify(permission)
            formChangePermission.submit()
        }
    })
}

//  code hiển thụ tích phần của các checbox phần phân quyền 
const dataRecord = document.querySelector("[data-record]");

if (dataRecord) {
    const record = JSON.parse(dataRecord.getAttribute("data-record"));
    console.log(record);

    const rolePermission = document.querySelector("[table-rolePermission]");
    
    if (rolePermission) {
        record.forEach((record, index) => {
            const permission = record.rolePower;
            // console.log(permission);

            permission.forEach((permission) => {
                
                const row = rolePermission.querySelector(`[data-name="${permission}"]`);
                const inputs = row.querySelectorAll("input")[index];
                inputs.checked = true;                
                
            });
        });
    }
}
