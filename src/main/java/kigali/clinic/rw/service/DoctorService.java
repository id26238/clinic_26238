package kigali.clinic.rw.service;

import kigali.clinic.rw.domain.Doctor;
import kigali.clinic.rw.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepo;

    public List<Doctor> getAll() { return doctorRepo.findAll(); }

    public Optional<Doctor> getById(Long id) { return doctorRepo.findById(id); }

    public Doctor save(Doctor d) { return doctorRepo.save(d); }

    public void delete(Long id) { doctorRepo.deleteById(id); }

    public List<Doctor> bySpecialization(String name) {
        return doctorRepo.findBySpecializationName(name);
    }

    public List<Doctor> withoutOffice() {
        return doctorRepo.findDoctorsWithoutOffice();
    }
}