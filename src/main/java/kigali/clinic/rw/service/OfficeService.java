package kigali.clinic.rw.service;

import kigali.clinic.rw.domain.Office;
import kigali.clinic.rw.repository.OfficeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfficeService {

    @Autowired
    private OfficeRepository repo;

    public List<Office> getAll() { return repo.findAll(); }

    public Optional<Office> getById(Long id) { return repo.findById(id); }

    public Office save(Office o) { return repo.save(o); }

    public void delete(Long id) { repo.deleteById(id); }

    public Object busiest() {
        List<Object[]> rows = repo.findBusiestOffice();
        if (rows.isEmpty()) return "No appointments yet";
        return rows.get(0);
    }
}