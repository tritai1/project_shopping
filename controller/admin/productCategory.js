const ProductCategory = require('../../model/product-category.model');
const system = require("../../config/system");
const { request } = require('express');
const formSearch =  require("../../helper/search.helper")
const createTreeHelper = require("../../helper/category")
const filteringFeatureHelper = require("../../helper/hellper.button");
// trang danh muc sản phẩm 
module.exports.productCategory = async (req, res)=>{
    
    const filteringFeature = filteringFeatureHelper(req.query);

    const find  = {
        deleted: false  
    }

    if(req.query.status){
        find.status = req.query.status
    }

    let search = formSearch(req.query);
    if(search.regex){
       find.title = search.regex
    }

    const pageOject = {
        currentPage: 1,
        pageItem: 10
    }

    if(req.query.page){
        pageOject.currentPage = parseInt(req.query.page);
    }

    pageOject.skip = (pageOject.currentPage - 1)*10;    
    const productCategory = await ProductCategory.find(find);
    const totalPage = Math.ceil(productCategory.length/pageOject.pageItem)    
    pageOject.totalPage = totalPage;
    
    const record = await ProductCategory.find(find).sort({position: 'desc'}).limit(pageOject.pageItem).skip(pageOject.skip);
    const newRecord = createTreeHelper.tree(record)
    res.render("admin/page/product-category/product-category.pug", {
        title: "product-category",
        record: newRecord,
        pagination: pageOject,
        keyword: search.keyword,
        filteringFeature: filteringFeature
    })
}



// trang thêm mới một danh mục sản phẩm 
module.exports.createCategory = async (req, res)=>{
    try {
        const find  = {
            deleted: false
        }
        
        const records = await ProductCategory.find(find);
        const newRecord = createTreeHelper.tree(records);    
        res.render("admin/page/product-category/create-category.pug", {
            title: "createCategory",
            records: newRecord
        })
    } catch (error) {
        console.log("không thể tạo mới danh mục sản phẩm", error);
    }
}

module.exports.createPost = async (req, res)=>{
    
    try {
        if (req.body.position == ""){
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        }else {
            req.body.position = parseInt(req.body.position)
            console.log(req.body.position);
        }
    
        const record = new ProductCategory(req.body);
        await record.save();
        console.log(record);
        
        res.redirect(`${system.firstPath}/product-category`);
    } catch (error) {
        close.log("không thể tạo mới danh mục sản phẩm", error);
    }

}
// tính năng xóa mềm 1 danh mục
module.exports.createCategoryDeleted = async (req, res)=>{
   try {
    const id = req.params.id;
    await ProductCategory.updateOne({_id: id}, 
        {
            deleted: true,
            deletedAt: new Date()
        });
        res.redirect("back");
   } catch (error) {
        res.redirect(`${system.firstPath}/product-category`)
   }
}

// tính năng thay đổi trạng thái 
module.exports.changeStatusCategory = async(req, res)=>{
    const id = req.params.id;
    const status = req.params.status;
    try {
        await ProductCategory.updateOne({_id: id}, {status: status});
        res.redirect("back")
    } catch (error) {
        console.log("cập nhật không thành công");
        
    }
}

// tính năng chỉnh sửa một danh mục
module.exports.editCategory = async (req, res) => {

    const records = await ProductCategory.findOne({
        _id: req.params.id,
        deleted: false
    });
    const record = await ProductCategory.find({deleted: false});
    
    const newRecord = createTreeHelper.tree(record);
    
    res.render('admin/page/product-category/edit-category.pug',{
        title: "chinh sua danh muc",
        data: records,
        record: newRecord
    })
}

module.exports.editCategoryPost = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        
        await ProductCategory.updateOne({_id: id}, data);
        res.redirect('back');
        req.flash("success", "Chỉnh sửa danh mục sản phẩm thành công");
    } catch (error) {
        console.log("không thể chỉnh sửa danh mục sản phẩm", error);
    }
}

module.exports.detail = async (req, res) => {
    const id = req.params.id;  
    const record = await ProductCategory.findOne({_id: id, deleted: false});
    res.render("admin/page/product-category/detail.pug", {
        title: "detail",
        record: record
    })
}
