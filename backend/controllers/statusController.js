const statusService = require("../services/statusService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await statusService.getAll();

    res.status(200).json({
        success: true,
        total: data.length,
        data
    });

});

const show = asyncHandler(async (req, res) => {

    const data = await statusService.getById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

});

module.exports = {
    index,
    show
};