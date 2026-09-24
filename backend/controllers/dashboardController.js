const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../middleware/asyncHandler");

const index = asyncHandler(async (req, res) => {

    const data = await dashboardService.getDashboard();

    res.json({
        success: true,
        data
    });

});

module.exports = {
    index
};