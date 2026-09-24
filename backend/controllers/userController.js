const userService = require("../services/userService");
const asyncHandler = require("../middleware/asyncHandler");


const index = asyncHandler(async(req,res)=>{

    const data = await userService.getAll();

    res.json({
        success:true,
        total:data.length,
        data
    });

});

const show = asyncHandler(async(req,res)=>{

    const data = await userService.getById(req.params.id);

    res.json({
        success:true,
        data
    });

});

const store = asyncHandler(async(req,res)=>{

    const data = await userService.create(req.body);

    res.status(201).json({
        success:true,
        message:"User berhasil ditambahkan",
        data
    });

});

const update = asyncHandler(async(req,res)=>{

    const data = await userService.update(
        req.params.id,
        req.body
    );

    res.json({
        success:true,
        message:"User berhasil diupdate",
        data
    });

});

const changePassword = asyncHandler(async(req,res)=>{

    await userService.changePassword(
        req.params.id,
        req.body.password
    );

    res.json({
        success:true,
        message:"Password berhasil diubah"
    });

});

const destroy = asyncHandler(async(req,res)=>{

    await userService.remove(req.params.id);

    res.json({
        success:true,
        message:"User berhasil dihapus"
    });

});

module.exports={
    index,
    show,
    store,
    update,
    changePassword,
    destroy
};