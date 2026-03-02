import LabOrder, { ILabOrder, LabStatus } from '../models/labOrder.model';
import { AuditService } from './audit.service';
import { AppError } from '../middleware/error.middleware';
import { UserRole } from '../types/role.enum';

export class LabService {
    static async orderLab(data: Partial<ILabOrder>, userId: string, role: UserRole, ipAddress?: string) {
        if (role !== UserRole.Doctor && role !== UserRole.Admin) {
            throw new AppError('Only Doctors can order lab tests', 403);
        }

        const order = await LabOrder.create({ ...data, orderedByDoctor: userId, status: LabStatus.ORDERED });

        await AuditService.log({
            entityType: 'LAB_ORDER',
            entityId: (order._id as any).toString(),
            action: 'ORDER_LAB',
            newValue: order.toObject(),
            performedBy: userId,
            ipAddress
        });

        return order;
    }

    static async updateStatus(id: string, targetStatus: LabStatus, user: { id: string; role: UserRole }, metadata: any = {}, ipAddress?: string) {
        const order = await LabOrder.findById(id);
        if (!order) throw new AppError('Lab order not found', 404);

        const previousValue = order.toObject();

        // 1. Role Validation
        if (user.role !== UserRole.Admin) {
            if (targetStatus === LabStatus.PROCESSING && user.role !== UserRole.LabTechnician) {
                throw new AppError('Only Lab Technicians can process samples', 403);
            }
            if (targetStatus === LabStatus.RESULTS_UPLOADED && user.role !== UserRole.LabTechnician) {
                throw new AppError('Only Lab Technicians can upload results', 403);
            }
            if (targetStatus === LabStatus.REVIEWED && user.role !== UserRole.Doctor) {
                throw new AppError('Only Doctors can review lab results', 403);
            }
        }

        // 2. State specific updates
        if (targetStatus === LabStatus.PROCESSING) {
            order.processedAt = new Date();
            order.labTechnician = user.id as any;
        } else if (targetStatus === LabStatus.RESULTS_UPLOADED) {
            order.resultsUploadedAt = new Date();
            if (metadata.url) order.resultDocumentUrl = metadata.url;
            if (metadata.data) order.resultsData = metadata.data;
        } else if (targetStatus === LabStatus.REVIEWED) {
            order.reviewedAt = new Date();
            order.reviewedByDoctor = user.id as any;
        }

        order.status = targetStatus;
        await order.save();

        await AuditService.log({
            entityType: 'LAB_ORDER',
            entityId: id,
            action: `STATUS_UPDATE_${targetStatus}`,
            previousValue,
            newValue: order.toObject(),
            performedBy: user.id,
            ipAddress
        });

        return order;
    }

    static async getPendingResults() {
        return LabOrder.find({ status: { $in: [LabStatus.ORDERED, LabStatus.PROCESSING] } })
            .populate('patientId', 'name email')
            .sort({ orderedAt: 1 });
    }
}
