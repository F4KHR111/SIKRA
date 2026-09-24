const roleService = require("../services/roleService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async(req,res)=>{

    const data = await roleService.getAll();

    res.json({
        success:true,
        total:data.length,
        data
    });

});

const show = asyncHandler(async(req,res)=>{

    const data = await roleService.getById(req.params.id);

    res.json({
        success:true,
        data
    });

});

const store = asyncHandler(async(req,res)=>{

    const data = await roleService.create(req.body);

    res.status(201).json({
        success:true,
        message:"Role berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async(req,res)=>{

    const data = await roleService.update(req.params.id,req.body);

    res.json({
        success:true,
        message:"Role berhasil diupdate",
        data
    });

});

const destroy = asyncHandler(async(req,res)=>{

    await roleService.remove(req.params.id);

    res.json({
        success:true,
        message:"Role berhasil dihapus"
    });

});

module.exports={
    index,
    show,
    store,
    update,
    destroy
};