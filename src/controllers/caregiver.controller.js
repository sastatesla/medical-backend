import { CaregiverService } from "../services/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class CaregiverController {
  constructor() {
    this.requestAccess = this.requestAccess.bind(this);
    this.approveRequest = this.approveRequest.bind(this);
    this.getRequests = this.getRequests.bind(this);
  }

  async requestAccess(req, res, next) {
    const apiResponse = new ApiResponse(res);
    const caregiverId = req.user.id; // assuming req.user is populated via auth middleware
    const { patientId, message } = req.body;

    try {
      const request = await CaregiverService.requestAccess(caregiverId, patientId, message);
      return apiResponse.successResponse({
        message: "Request submitted successfully",
        data: request
      });
    } catch (err) {
      next(err);
    }
  }

  async approveRequest(req, res, next) {
    const apiResponse = new ApiResponse(res);
    const patientId = req.user.id;
    const { requestId, approved } = req.body;

    try {
      const updatedRequest = await CaregiverService.approveRequest(requestId, patientId, approved);
      return apiResponse.successResponse({
        message: approved ? "Request approved" : "Request rejected",
        data: updatedRequest
      });
    } catch (err) {
      next(err);
    }
  }

  async getRequests(req, res, next) {
    const apiResponse = new ApiResponse(res);
    const { id, role } = req.user;

    try {
      const requests = await CaregiverService.getUserRequests(id, role?.roleName);
      return apiResponse.successResponse({
        message: "Requests fetched",
        data: requests
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CaregiverController();
