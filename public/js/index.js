const formSearch = document.querySelector("#form-search");
if(formSearch){
    const url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e)=>{
        e.preventDefault();
        console.log(e.target.keyword.value);
        const keyword = e.target.keyword.value;
        if(keyword){
           url.searchParams.set("keyword", keyword);
        }else {
           url.searchParams.delete("keyword")
        }
        
        window.location.href = url.href;
    })
}


// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination.length > 0){
    buttonPagination.forEach(button=>{
        let url = new URL(window.location.href);
        button.addEventListener("click", ()=>{
            const page = button.getAttribute("button-pagination");
            if(page){
              url.searchParams.set("page", page);
            } else {
              url.searchParams.delete("page");
            }

            window.location.href = url.href;
            
        })
    })
}
