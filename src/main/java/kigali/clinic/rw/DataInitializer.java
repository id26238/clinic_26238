package kigali.clinic.rw;

import kigali.clinic.rw.domain.*;
import kigali.clinic.rw.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private DoctorRepository doctorRepo;
    @Autowired private PatientRepository patientRepo;
    @Autowired private OfficeRepository officeRepo;
    @Autowired private SpecializationRepository specRepo;
    @Autowired private AppointmentRepository apptRepo;

    @Override
    public void run(String... args) {
        if (apptRepo.count() > 0) {
            System.out.println(">>> DB has data, skipping seed.");
            return;
        }
        System.out.println(">>> Seeding test data...");

        Specialization cardiology = spec("Cardiology");
        Specialization pediatrics = spec("Pediatrics");
        Specialization dermatology = spec("Dermatology");
        Specialization neurology = spec("Neurology");

        Office o101 = office("Kigali Central", 101);
        Office o102 = office("Remera Branch", 102);
        Office o103 = office("Kimironko Branch", 103);

        Doctor alice = doctor("Alice", "Mukamana", o101);
        Doctor bob = doctor("Bob", "Habimana", o102);
        Doctor charlie = doctor("Charlie", "Uwimana", null);

        alice.getSpecializations().add(cardiology);
        alice.getSpecializations().add(pediatrics);
        doctorRepo.save(alice);
        bob.getSpecializations().add(dermatology);
        doctorRepo.save(bob);

        Patient p1 = patient("David", "Nkurunziza", "0788000001");
        Patient p2 = patient("Eva", "Uwase", "0788000002");
        Patient p3 = patient("Frank", "Mugisha", "0788000003");
        Patient p4 = patient("Grace", "Uwase", "0788000004");
        Patient p5 = patient("Henry", "Keza", "0788000005");

        appt(LocalDate.of(2026, 10, 5), "checkup", AppointmentStatus.SCHEDULED, alice, p1);
        appt(LocalDate.of(2026, 10, 5), "follow-up", AppointmentStatus.SCHEDULED, alice, p2);
        appt(LocalDate.of(2026, 10, 10), "consult", AppointmentStatus.CONFIRMED, alice, p1);
        appt(LocalDate.of(2026, 10, 20), "surgery", AppointmentStatus.COMPLETED, bob, p3);
        appt(LocalDate.of(2026, 10, 25), "consult", AppointmentStatus.CANCELLED, bob, p4);
        appt(LocalDate.of(2026, 11, 2), "checkup", AppointmentStatus.SCHEDULED, bob, p5);
        appt(LocalDate.of(2026, 11, 8), "follow-up", AppointmentStatus.CONFIRMED, charlie, p1);
        appt(LocalDate.of(2026, 11, 15), "checkup", AppointmentStatus.SCHEDULED, charlie, p2);
        appt(LocalDate.of(2026, 11, 20), "consult", AppointmentStatus.COMPLETED, alice, p3);
        appt(LocalDate.of(2026, 11, 28), "checkup", AppointmentStatus.SCHEDULED, bob, p1);

        System.out.println(">>> Done.");
    }

    private Specialization spec(String name) {
        Specialization s = new Specialization();
        s.setName(name);
        return specRepo.save(s);
    }
    private Office office(String name, int number) {
        Office o = new Office();
        o.setName(name);
        o.setOfficeNumber(number);
        return officeRepo.save(o);
    }
    private Doctor doctor(String f, String l, Office office) {
        Doctor d = new Doctor();
        d.setFirstName(f);
        d.setLastName(l);
        d.setOffice(office);
        return doctorRepo.save(d);
    }
    private Patient patient(String f, String l, String phone) {
        Patient p = new Patient();
        p.setFirstName(f);
        p.setLastName(l);
        p.setPhoneNumber(phone);
        return patientRepo.save(p);
    }
    private void appt(LocalDate date, String reason, AppointmentStatus status, Doctor d, Patient p) {
        Appointment a = new Appointment();
        a.setAppointmentDate(date);
        a.setReason(reason);
        a.setStatus(status);
        a.setDoctor(d);
        a.setPatient(p);
        apptRepo.save(a);
    }
}