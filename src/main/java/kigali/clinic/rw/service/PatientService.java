package kigali.clinic.rw.service;

import kigali.clinic.rw.domain.Patient;
import kigali.clinic.rw.repository.PatientRepository;
import kigali.clinic.rw.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    public List<Patient> getAll() { return patientRepo.findAll(); }

    public Optional<Patient> getById(Long id) { return patientRepo.findById(id); }

    public Patient save(Patient p) { return patientRepo.save(p); }

    public void delete(Long id) { patientRepo.deleteById(id); }

    public List<Patient> byLastName(String lastName) {
        return patientRepo.findByLastNameIgnoreCaseOrderByFirstNameAsc(lastName);
    }

    public List<Patient> ofDoctor(Long doctorId) {
        if (!doctorRepo.existsById(doctorId)) return null;
        return patientRepo.findPatientsOfDoctor(doctorId);
    }

    public List<Patient> frequent(long min) {
        return patientRepo.findFrequentPatients(min);
    }
}