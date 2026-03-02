import Rule, { IRule } from '../models/rule.model';
import { IIntake } from '../models/intake.model';
import { IntakePriority } from '../types/intake.types';

export interface EvaluationResult {
    priority: IntakePriority;
    doctorType?: string;
    isEscalated: boolean;
    appliedRules: string[];
}

export class RuleEngineService {
    /**
     * Evaluates an intake against all active business rules.
     */
    static async evaluateIntake(intake: any): Promise<EvaluationResult> {
        const activeRules = await Rule.find({ isActive: true }).sort({ priority: -1 });

        let resolvedPriority: IntakePriority = IntakePriority.LOW;
        let assignedDoctorType: string | undefined = undefined;
        let isEscalated = false;
        const appliedRules: string[] = [];

        const priorityWeights: Record<IntakePriority, number> = {
            [IntakePriority.HIGH]: 3,
            [IntakePriority.MEDIUM]: 2,
            [IntakePriority.LOW]: 1,
        };

        for (const rule of activeRules) {
            if (this.checkConditions(intake, rule.conditions)) {
                appliedRules.push(rule.name);

                for (const action of rule.actions) {
                    if (action.type === 'SET_PRIORITY') {
                        const currentWeight = priorityWeights[resolvedPriority];
                        const newWeight = priorityWeights[action.value as IntakePriority];
                        if (newWeight > currentWeight) {
                            resolvedPriority = action.value as IntakePriority;
                        }
                    } else if (action.type === 'ASSIGN_DOCTOR_TYPE') {
                        assignedDoctorType = action.value;
                    } else if (action.type === 'FLAG_ESCALATION') {
                        isEscalated = action.value === true;
                    }
                }
            }
        }

        return {
            priority: resolvedPriority,
            doctorType: assignedDoctorType,
            isEscalated,
            appliedRules,
        };
    }

    private static checkConditions(intake: any, conditions: any[]): boolean {
        return conditions.every(condition => {
            const actualValue = this.getNestedValue(intake, condition.field);

            switch (condition.operator) {
                case 'equals':
                    return actualValue === condition.value;
                case 'contains':
                    return Array.isArray(actualValue) && actualValue.includes(condition.value);
                case 'gt':
                    return actualValue > condition.value;
                case 'lt':
                    return actualValue < condition.value;
                case 'in':
                    return Array.isArray(condition.value) && condition.value.includes(actualValue);
                default:
                    return false;
            }
        });
    }

    private static getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
    }

    /**
     * Seeds initial triage rules if database is empty.
     */
    static async seedDefaultRules() {
        const count = await Rule.countDocuments();
        if (count > 0) return;

        const defaultRules = [
            {
                name: 'Urgent: Chest Pain',
                conditions: [{ field: 'symptoms', operator: 'contains', value: 'Chest Pain' }],
                actions: [
                    { type: 'SET_PRIORITY', value: IntakePriority.HIGH },
                    { type: 'ASSIGN_DOCTOR_TYPE', value: 'Emergency' },
                    { type: 'FLAG_ESCALATION', value: true }
                ],
                priority: 100
            },
            {
                name: 'High BP: Elderly',
                conditions: [
                    { field: 'patientId.age', operator: 'gt', value: 65 }, // Assuming age is in user model soon
                    { field: 'vitals.heartRate', operator: 'gt', value: 100 }
                ],
                actions: [{ type: 'SET_PRIORITY', value: IntakePriority.HIGH }],
                priority: 80
            },
            {
                name: 'Moderate: High Fever',
                conditions: [{ field: 'vitals.temperature', operator: 'gt', value: 102 }],
                actions: [{ type: 'SET_PRIORITY', value: IntakePriority.MEDIUM }],
                priority: 50
            }
        ];

        await Rule.insertMany(defaultRules);
        console.log('✅ Default Triage Rules Seeded');
    }
}
