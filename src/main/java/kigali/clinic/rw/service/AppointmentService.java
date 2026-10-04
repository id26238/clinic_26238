package kigali.clinic.rw.service;

import kigali.clinic.rw.domain.Appointment;
import kigali.clinic.rw.domain.AppointmentStatus;
import kigali.clinic.rw.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    public List<Appointment> getAll() { return appointmentRepo.findAll(); }

    public Optional<Appointment> getById(Long id) { return appointmentRepo.findById(id); }

    public String create(Appointment a) {
        if (a.getDoctor() != null && a.getDoctor().getId() != null
                && a.getAppointmentDate() != null
                && appointmentRepo.existsByDoctorIdAndAppointmentDateAndStatusNot(
                        a.getDoctor().getId(), a.getAppointmentDate(), AppointmentStatus.CANCELLED)) {
            return "Doctor is already booked on that date";
        }
        appointmentRepo.save(a);
        return "Appointment saved";
    }

    public Appointment update(Long id, Appointment updated) {
        return appointmentRepo.findById(id).map(a -> {
            a.setAppointmentDate(updated.getAppointmentDate());
            a.setReason(updated.getReason());
            a.setStatus(updated.getStatus());
            a.setDoctor(updated.getDoctor());
            a.setPatient(updated.getPatient());
            return appointmentRepo.save(a);
        }).orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
    }

    public void delete(Long id) { appointmentRepo.deleteById(id); }

    public List<Appointment> byStatus(AppointmentStatus status) {
        return appointmentRepo.findByStatusOrderByAppointmentDateAsc(status);
    }

    public List<Appointment> between(LocalDate start, LocalDate end) {
        return appointmentRepo.findByAppointmentDateBetweenOrderByAppointmentDateAsc(start, end);
    }

    public List<Object[]> countByStatus() {
        return appointmentRepo.countAppointmentsByStatus();
    }

    @Transactional
    public String cancelDoctorDay(Long doctorId, LocalDate date) {
        int count = appointmentRepo.cancelDoctorDay(doctorId, date);
        return count + " appointments cancelled";
    }

    public Page<Appointment> getAllPaged(Pageable pageable) {
        return appointmentRepo.findAll(pageable);
    }

    @Transactional
    public String deleteCancelledBefore(LocalDate date) {
        int count = appointmentRepo.deleteCancelledBefore(date);
        return count + " appointments deleted";
    }
}