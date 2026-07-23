import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { BookingStatus, AppointmentStatus, OrderStatus, PaymentStatus, MeasurementSource } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateSlot(dateStr: string, excludeAppointmentId?: string) {
    const dateObj = new Date(dateStr);
    
    let settings = await this.prismaService.shopSettings.findUnique({
      where: { id: 'default-settings' },
      include: {
        businessHours: true,
        holidays: true,
      },
    });

    if (!settings) {
      settings = await this.prismaService.shopSettings.create({
        data: {
          id: 'default-settings',
          shopName: 'Star Stitcher',
          phone: '+91 7306417315',
          whatsapp: '+91 7306417315',
          email: 'starstitcherladiescentre@gmail.com',
          address: 'KRP Rao Road, Kasaragod, Kerala',
          deliveryCharges: 0.0,
          appointmentDuration: 30,
          maxAppointmentsPerSlot: 1,
        },
        include: {
          businessHours: true,
          holidays: true,
        },
      });

      const hoursData = [];
      for (let i = 0; i <= 6; i++) {
        hoursData.push({
          dayOfWeek: i,
          isOpen: i !== 0,
          openTime: '10:00',
          closeTime: '18:30',
          settingsId: 'default-settings',
        });
      }

      await this.prismaService.businessHour.createMany({
        data: hoursData,
      });

      settings = await this.prismaService.shopSettings.findUnique({
        where: { id: 'default-settings' },
        include: {
          businessHours: true,
          holidays: true,
        },
      }) as any;
    }

    const activeSettings = settings!;

    if (activeSettings.status === 'CLOSED') {
      throw new BadRequestException('Star Stitcher is currently closed for bookings. Please contact us via WhatsApp.');
    }

    const bufferBefore = new Date(dateObj.getTime() - 29 * 60 * 1000);
    const bufferAfter = new Date(dateObj.getTime() + 29 * 60 * 1000);

    const appointmentsCount = await this.prismaService.appointment.count({
      where: {
        appointmentDate: {
          gte: bufferBefore,
          lte: bufferAfter,
        },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.RESCHEDULED] },
        NOT: excludeAppointmentId ? { id: excludeAppointmentId } : undefined,
      },
    });

    if (appointmentsCount >= activeSettings.maxAppointmentsPerSlot) {
      throw new ConflictException('This appointment time slot is fully booked. Please select another slot.');
    }

    const startOfTargetDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const endOfTargetDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1);

    const holidayMatch = await this.prismaService.holiday.findFirst({
      where: {
        settingsId: 'default-settings',
        holidayDate: {
          gte: startOfTargetDay,
          lt: endOfTargetDay,
        },
      },
    });

    if (holidayMatch) {
      throw new BadRequestException(`Star Stitcher is closed on this date: ${holidayMatch.name}.`);
    }

    const dayOfWeek = dateObj.getDay();
    const daySchedule = activeSettings.businessHours.find((bh) => bh.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isOpen) {
      throw new BadRequestException('The boutique is closed on this day.');
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const [openH, openM] = daySchedule.openTime.split(':').map((x) => parseInt(x, 10));
    const [closeH, closeM] = daySchedule.closeTime.split(':').map((x) => parseInt(x, 10));

    const openTimeMinutes = openH * 60 + openM;
    const closeTimeMinutes = closeH * 60 + closeM;

    if (timeInMinutes < openTimeMinutes || timeInMinutes > closeTimeMinutes) {
      throw new BadRequestException(
        `Appointments must be scheduled within daily operating hours (${daySchedule.openTime} - ${daySchedule.closeTime}).`
      );
    }
  }

  async create(customerId: string, dto: CreateBookingDto) {
    await this.validateSlot(dto.appointmentDate);

    const design = await this.prismaService.design.findUnique({
      where: { id: dto.designId },
    });
    if (!design) {
      throw new NotFoundException('Design item not found');
    }

    const shortId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    return this.prismaService.$transaction(async (tx) => {
      let targetMeasurementId: string | null = null;

      if (dto.measurementMethod === MeasurementSource.ONLINE) {
        if (!dto.measurementId) {
          throw new BadRequestException('A measurement profile must be selected for online measurements.');
        }

        const profile = await tx.measurement.findUnique({
          where: { id: dto.measurementId },
        });

        if (!profile) {
          throw new NotFoundException('The selected measurement profile was not found or has been deleted. Please select another profile.');
        }

        if (profile.userId !== customerId) {
          throw new ForbiddenException('You do not own this measurement profile.');
        }

        targetMeasurementId = profile.id;
      } else {
        // SHOP measurement method: explicitly persist measurementId = null
        targetMeasurementId = null;
      }

      const booking = await tx.booking.create({
        data: {
          shortId,
          customerId,
          designId: dto.designId,
          measurementMethod: dto.measurementMethod,
          deliveryMethod: dto.deliveryMethod,
          addressId: dto.addressId,
          measurementId: targetMeasurementId,
          specialInstructions: dto.specialInstructions,
        },
      });

      const appointment = await tx.appointment.create({
        data: {
          bookingId: booking.id,
          appointmentDate: new Date(dto.appointmentDate),
          status: AppointmentStatus.SCHEDULED,
        },
      });

      return {
        ...booking,
        appointment,
      };
    });
  }

  async getCustomerBookings(customerId: string) {
    return this.prismaService.booking.findMany({
      where: { customerId },
      include: {
        design: true,
        appointment: true,
        shippingAddress: true,
        measurement: {
          select: {
            id: true,
            profileName: true,
            isDefault: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminQueue() {
    return this.prismaService.booking.findMany({
      include: {
        customer: true,
        design: true,
        appointment: true,
        shippingAddress: true,
        measurement: {
          select: {
            id: true,
            profileName: true,
            isDefault: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prismaService.booking.update({
      where: { id },
      data: { status: BookingStatus.APPROVED },
      include: { appointment: true },
    });
  }

  async reject(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { appointment: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prismaService.$transaction(async (tx) => {
      if (booking.appointment) {
        await tx.appointment.update({
          where: { id: booking.appointment.id },
          data: { status: AppointmentStatus.CANCELLED },
        });
      }

      return tx.booking.update({
        where: { id },
        data: { status: BookingStatus.REJECTED },
        include: { appointment: true },
      });
    });
  }

  async reschedule(id: string, dto: RescheduleAppointmentDto) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { appointment: true },
    });

    if (!booking || !booking.appointment) {
      throw new NotFoundException('Active booking or appointment not found');
    }

    await this.validateSlot(dto.appointmentDate, booking.appointment.id);

    return this.prismaService.$transaction(async (tx) => {
      const appointment = await tx.appointment.update({
        where: { id: booking.appointment!.id },
        data: {
          appointmentDate: new Date(dto.appointmentDate),
          status: AppointmentStatus.RESCHEDULED,
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.PENDING },
        include: { appointment: true },
      });

      return {
        ...updatedBooking,
        appointment,
      };
    });
  }

  async markCustomerArrived(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { appointment: true },
    });

    if (!booking || !booking.appointment) {
      throw new NotFoundException('Booking or appointment not found');
    }

    await this.prismaService.appointment.update({
      where: { id: booking.appointment.id },
      data: { status: AppointmentStatus.ARRIVED },
    });

    return { message: 'Customer marked as arrived' };
  }

  async convertToOrder(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: {
        customer: {
          include: { measurements: true },
        },
        design: true,
        appointment: true,
        measurement: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CONVERTED) {
      throw new BadRequestException('Booking has already been converted into an order.');
    }

    return this.prismaService.$transaction(async (tx) => {
      const orderShortId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      let snapshot: any = {};

      if (booking.measurementId) {
        // Priority 1: New booking with explicit profile
        const profile = await tx.measurement.findUnique({
          where: { id: booking.measurementId },
        });
        if (profile && profile.userId === booking.customerId) {
          snapshot = profile;
        } else {
          throw new BadRequestException('Associated measurement profile for this booking is missing or invalid.');
        }
      } else if (booking.measurementMethod === MeasurementSource.ONLINE) {
        // Priority 2: Legacy ONLINE booking fallback rule:
        // Use ONLY the customer's explicitly marked default measurement profile.
        const defaultMeasurement = booking.customer.measurements.find((m) => m.isDefault);
        if (defaultMeasurement) {
          snapshot = defaultMeasurement;
        } else if (booking.customer.measurements.length > 0) {
          throw new BadRequestException('Customer has saved measurements but no default profile is set for this legacy booking.');
        } else {
          throw new BadRequestException('No measurement profile found for this legacy online booking.');
        }
      } else {
        // Priority 3: SHOP measurement booking — snapshot empty without attaching unrelated default profile
        snapshot = {};
      }
      
      const order = await tx.order.create({
        data: {
          shortId: orderShortId,
          customerId: booking.customerId,
          designId: booking.designId,
          status: OrderStatus.BOOKED,
          appointmentDate: booking.appointment?.appointmentDate || new Date(),
          deliveryType: booking.deliveryMethod,
          addressId: booking.addressId,
          specialInstructions: booking.specialInstructions,
          finalPrice: booking.design.price,
          paymentStatus: PaymentStatus.UNPAID,
          paidAmount: 0.0,
          remainingAmount: booking.design.price,
          measurementSnapshot: (snapshot as any) || {},
        },
      });

      await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CONVERTED },
      });

      await tx.timelineEvent.create({
        data: {
          orderId: order.id,
          status: OrderStatus.BOOKED,
          notes: `Order created from booking reference: ${booking.shortId}`,
        },
      });

      return order;
    });
  }
}
