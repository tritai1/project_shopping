let count = 0
function create_tree(arr, parentId = ""){
        const tree = [];
        arr.forEach(item => {
            if(item.parent_id === parentId){
                count++;
                const newItem = item;
                newItem.index = count; // giúp chỉnh sửa lại vị trí trong danh mục
                const children = create_tree(arr, item.id);
                if (children.length > 0){
                    newItem.children = children;
                }
                tree.push(newItem)
            }
            
        });
        return tree;
    }
module.exports.tree = (arr, parentId = "")=>{
    count = 0;
    const tree = create_tree(arr, parentId = "");
    return tree;
}