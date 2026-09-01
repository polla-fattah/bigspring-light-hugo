import { z } from 'zod';

export const EquipmentReservationSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  userName: z.string().min(2, 'User name must be at least 2 characters'),
  userEmail: z.string().email('Invalid email address'),
  userType: z.enum(['student', 'staff', 'external']).default('student'),
  purpose: z.string().min(5, 'Purpose description must be at least 5 characters'),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start time' }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end time' }),
});

export const EquipmentFeedbackSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  reservationId: z.number().optional().nullable(),
  userName: z.string().min(2, 'User name must be at least 2 characters'),
  userEmail: z.string().email('Invalid email address'),
  rating: z.number().min(1).max(5),
  benefitStatement: z.string().min(10, 'Impact statement must be at least 10 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
