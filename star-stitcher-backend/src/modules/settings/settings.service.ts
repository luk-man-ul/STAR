import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSettings() {
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

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.getSettings();

    return this.prismaService.shopSettings.update({
      where: { id: 'default-settings' },
      data: dto,
      include: {
        businessHours: true,
        holidays: true,
      },
    });
  }

  async updateBusinessHours(hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[]) {
    await this.getSettings();

    return this.prismaService.$transaction(
      hours.map((h) =>
        this.prismaService.businessHour.upsert({
          where: {
            settingsId_dayOfWeek: {
              settingsId: 'default-settings',
              dayOfWeek: h.dayOfWeek,
            },
          },
          update: {
            isOpen: h.isOpen,
            openTime: h.openTime,
            closeTime: h.closeTime,
          },
          create: {
            settingsId: 'default-settings',
            dayOfWeek: h.dayOfWeek,
            isOpen: h.isOpen,
            openTime: h.openTime,
            closeTime: h.closeTime,
          },
        })
      )
    );
  }

  async createHoliday(date: string, name: string, description?: string) {
    await this.getSettings();
    const holidayDate = new Date(date);
    holidayDate.setUTCHours(0, 0, 0, 0);

    return this.prismaService.holiday.upsert({
      where: {
        settingsId_holidayDate: {
          settingsId: 'default-settings',
          holidayDate,
        },
      },
      update: { name, description },
      create: {
        settingsId: 'default-settings',
        holidayDate,
        name,
        description,
      },
    });
  }

  async deleteHoliday(id: string) {
    return this.prismaService.holiday.delete({
      where: { id },
    });
  }
}
