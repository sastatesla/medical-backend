import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";

class CaregiverService {
  async requestAccess(caregiverId, patientId, message) {
    if (caregiverId === patientId) {
      throw ApiError.BadRequest("Cannot request access to yourself", "INVALID_REQUEST");
    }

    const existingRequest = await prisma.caregiverRequest.findFirst({
      where: {
        caregiverId,
        patientId,
        status: "pending"
      }
    });

    if (existingRequest) {
      throw ApiError.AlreadyExists("A pending request already exists", "REQUEST_EXISTS");
    }

    return await prisma.caregiverRequest.create({
      data: {
        caregiverId,
        patientId,
        message
      }
    });
  }

  async approveRequest(requestId, patientId, approved) {
    const request = await prisma.caregiverRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.patientId !== patientId) {
      throw ApiError.Forbidden("You are not authorized to approve this request", "NOT_AUTHORIZED");
    }

    if (request.status !== "pending") {
      throw ApiError.BadRequest("Request has already been reviewed", "ALREADY_REVIEWED");
    }

    const status = approved ? "approved" : "rejected";

    const updatedRequest = await prisma.caregiverRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedAt: new Date()
      }
    });

    if (approved) {
      await prisma.caregiverAccess.create({
        data: {
          caregiverId: request.caregiverId,
          patientId: request.patientId
        }
      });
    }

    return updatedRequest;
  }

  async getUserRequests(userId, role) {
    if (role === "Caregiver") {
      return await prisma.caregiverRequest.findMany({
        where: { caregiverId: userId },
        include: { patient: true }
      });
    }

    return await prisma.caregiverRequest.findMany({
      where: { patientId: userId },
      include: { caregiver: true }
    });
  }
}

export default new CaregiverService();
