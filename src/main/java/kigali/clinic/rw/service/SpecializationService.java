package kigali.clinic.rw.service;

import kigali.clinic.rw.domain.Specialization;
import kigali.clinic.rw.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpecializationService {

    @Autowired
    private SpecializationRepository repo;

    public List<Specialization> getAll() { return repo.findAll(); }

    public Optional<Specialization> getById(Long id) { return repo.findById(id); }

    public Specialization save(Specialization s) { return repo.save(s); }

    public void delete(Long id) { repo.deleteById(id); }

    public List<Specialization> unused() {
        return repo.findUnusedSpecializations();
    }
}