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

const sort = document.querySelectorAll("[sort]");
if(sort.length > 0){
    const selectSort = document.querySelector("[select-sort]");
    const selectClear = document.querySelector("[select-clear]");
    const url = new URL(window.location.href);
    selectSort.addEventListener("change", (e)=>{
        const [sortKey, sortValue] = e.target.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        window.location.href = url.href;
    })
    selectClear.addEventListener("click", ()=>{
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if(sortKey && sortValue){
    const position = selectSort.querySelector(`[value="${sortKey}-${sortValue}"]`);
    position.selected = true;
  }
}