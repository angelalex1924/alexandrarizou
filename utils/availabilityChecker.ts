import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, parse, isBefore, isAfter, isEqual } from "date-fns";

interface BlockedSlot {
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
}

interface Appointment {
  appointment_date: string;
  appointment_time: string;
  total_duration_minutes: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

const BUSINESS_HOURS = {
  start: "09:00",
  end: "20:00",
  slotInterval: 30, // minutes
  closedDays: [0, 1], // Sunday = 0, Monday = 1
  specialHours: {
    3: "18:00", // Wednesday closes at 18:00
    6: "18:00", // Saturday closes at 18:00
  }
};

export const generateTimeSlots = (date: Date): string[] => {
  const dayOfWeek = date.getDay();
  
  // Check if closed
  if (BUSINESS_HOURS.closedDays.includes(dayOfWeek)) {
    return [];
  }
  
  const slots: string[] = [];
  const startTime = parse(BUSINESS_HOURS.start, "HH:mm", date);
  
  // Use special closing time if applicable, otherwise use default
  const closingTime = BUSINESS_HOURS.specialHours[dayOfWeek] || BUSINESS_HOURS.end;
  const endTime = parse(closingTime, "HH:mm", date);
  
  let currentTime = startTime;
  while (isBefore(currentTime, endTime)) {
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, BUSINESS_HOURS.slotInterval);
  }
  
  return slots;
};

export const checkAvailability = async (
  selectedDate: Date,
  durationMinutes: number
): Promise<TimeSlot[]> => {
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dayOfWeek = selectedDate.getDay();
  
  // Check if salon is closed on this day
  if (BUSINESS_HOURS.closedDays.includes(dayOfWeek)) {
    return [{
      time: "00:00",
      available: false,
      reason: "Κλειστά"
    }];
  }
  
  const allSlots = generateTimeSlots(selectedDate);

  // Fetch blocked slots
  const { data: blockedSlots, error: blockedError } = await supabase
    .from("blocked_slots")
    .select("*")
    .lte("start_date", dateStr)
    .gte("end_date", dateStr);

  if (blockedError) {
    console.error("Error fetching blocked slots:", blockedError);
  }

  // Fetch existing appointments
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("appointment_date, appointment_time, total_duration_minutes")
    .eq("appointment_date", dateStr)
    .in("status", ["pending", "confirmed"]);

  if (appointmentsError) {
    console.error("Error fetching appointments:", appointmentsError);
  }

  const availability = allSlots.map(slot => {
    const slotTime = parse(slot, "HH:mm", selectedDate);
    const slotEndTime = addMinutes(slotTime, durationMinutes);

    // Check if slot is blocked
    const isBlocked = (blockedSlots || []).some((blocked: BlockedSlot) => {
      if (!blocked.start_time || !blocked.end_time) return false;
      
      const blockStart = parse(blocked.start_time, "HH:mm:ss", selectedDate);
      const blockEnd = parse(blocked.end_time, "HH:mm:ss", selectedDate);
      
      return (
        (isAfter(slotTime, blockStart) || isEqual(slotTime, blockStart)) &&
        isBefore(slotTime, blockEnd)
      );
    });

    if (isBlocked) {
      return {
        time: format(slotTime, "HH:mm"),
        available: false,
        reason: "Μπλοκαρισμένη ώρα",
      };
    }

    // Check if slot overlaps with existing appointments
    const hasConflict = (appointments || []).some((apt: Appointment) => {
      const aptTime = parse(apt.appointment_time, "HH:mm:ss", selectedDate);
      const aptEndTime = addMinutes(aptTime, apt.total_duration_minutes || 60);

      return (
        (isAfter(slotTime, aptTime) || isEqual(slotTime, aptTime)) && isBefore(slotTime, aptEndTime) ||
        (isAfter(slotEndTime, aptTime) && isBefore(slotEndTime, aptEndTime)) ||
        (isBefore(slotTime, aptTime) && isAfter(slotEndTime, aptEndTime))
      );
    });

    if (hasConflict) {
      return {
        time: format(slotTime, "HH:mm"),
        available: false,
        reason: "Κρατημένο",
      };
    }

    // Check if slot + duration fits within business hours (considering special hours)
    const closingTime = BUSINESS_HOURS.specialHours[dayOfWeek] || BUSINESS_HOURS.end;
    const endsAfterClosing = isAfter(slotEndTime, parse(closingTime, "HH:mm", selectedDate));
    
    if (endsAfterClosing) {
      return {
        time: format(slotTime, "HH:mm"),
        available: false,
        reason: "Δεν χωράει στο ωράριο",
      };
    }

    return {
      time: format(slotTime, "HH:mm"),
      available: true,
    };
  });

  return availability;
};

export const findNextAvailableSlot = async (
  startDate: Date,
  durationMinutes: number,
  daysToCheck: number = 14
): Promise<{ date: Date; time: string } | null> => {
  for (let i = 0; i < daysToCheck; i++) {
    const checkDate = addMinutes(startDate, i * 24 * 60);
    const availability = await checkAvailability(checkDate, durationMinutes);
    
    const availableSlot = availability.find(slot => slot.available);
    if (availableSlot) {
      return {
        date: checkDate,
        time: availableSlot.time,
      };
    }
  }
  
  return null;
};
