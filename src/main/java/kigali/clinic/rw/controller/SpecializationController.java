package kigali.clinic.rw.controller;

import kigali.clinic.rw.domain.Specialization;
import kigali.clinic.rw.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

    @Autowired
    private SpecializationService service;

    @GetMapping
    public List<Specialization> getAll() { return service.getAll(); }

    @PostMapping
    public Specialization save(@RequestBody Specialization s) { return service.save(s); }

    @GetMapping("/unused")
    public List<Specialization> unused() { return service.unused(); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}